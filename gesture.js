// ============================================================
// gesture.js — Deteksi Gestur Tangan dengan MediaPipe Hands
// ------------------------------------------------------------
// State Machine Gestur:
//
//   STATE: 'IDLE'
//     → Tangan terbuka (OPEN) muncul → pindah ke 'READY'
//
//   STATE: 'READY'
//     → Tangan dikepal (FIST) → pindah ke 'ROLLING'
//        (dadu mulai berputar terus-menerus)
//     → Tangan hilang / tidak ada → kembali ke 'IDLE'
//
//   STATE: 'ROLLING'
//     → Selama FIST: dadu terus berputar (spinning live)
//     → Tangan dibuka kembali (OPEN) dari kepalan
//        → berhenti, baca hasil → rollDice() → pindah ke 'IDLE'
//     → Tangan hilang → otomatis berhenti seperti buka tangan
//
// Dengan state machine ini:
//   - Satu frame kepalan tidak langsung lempar dadu
//   - Dadu hanya berputar SELAMA tangan dikepal
//   - Buka kepalan = sinyal berhenti + ambil hasil
// ============================================================

const MEDIAPIPE_CDN = 'https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1646424915/';

// ── State machine ──
// 'IDLE'    = belum ada sinyal apapun
// 'READY'   = tangan terbuka terdeteksi, siap menerima kepalan
// 'ROLLING' = kepalan aktif, dadu sedang berputar
let gestureState    = 'IDLE';

// ── Variabel kamera & AI ──
let gestureCamera   = null;
let gestureHands    = null;
let gestureActive   = false;
let gestureCooldown = false;
let videoElement    = null;
let canvasElement   = null;
let canvasCtx       = null;

// ── Animasi dadu live dikelola oleh game.js (startDiceSpinAnimation/stopDiceSpinAnimation) ──

// ── Debounce: butuh N frame berturut-turut sebelum ganti state ──
// Ini mencegah flicker/glitch klasifikasi gesture
// SEBELUMNYA 4 — diturunkan ke 3 karena 4 frame di TIAP dari 3 tahap
// (OPEN→READY→FIST→ROLLING→OPEN→trigger) berarti minimal 12 frame
// bersih dibutuhkan total. Ditambah reset penuh tiap ada noise satu
// frame (lihat onHandResults), itu yang bikin gestur terasa "delay
// banget". 3 frame masih cukup untuk mencegah flicker, tapi sudah
// jauh lebih responsif.
const FRAMES_REQUIRED = 3;   // frame konsisten yang dibutuhkan
let fistFrameCount  = 0;
let openFrameCount  = 0;


// ============================================================
// initGesture() — Inisialisasi Kamera dan Model AI
// ============================================================
async function initGesture() {
  videoElement  = document.getElementById('gesture-video');
  canvasElement = document.getElementById('gesture-canvas');
  if (!videoElement || !canvasElement) return;

  canvasCtx = canvasElement.getContext('2d');
  updateGestureStatus('📷 Memuat kamera...', 'orange');

  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    updateGestureStatus('⚠️ Browser tidak support kamera.', 'orange');
    return;
  }

  try {
    let stream = null;
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 320 }, height: { ideal: 240 } }
      });
    } catch (e) {
      stream = await navigator.mediaDevices.getUserMedia({ video: true });
    }

    videoElement.srcObject = stream;
    videoElement.setAttribute('playsinline', true);
    videoElement.muted = true;

    await new Promise((resolve, reject) => {
      videoElement.onloadedmetadata = resolve;
      videoElement.onerror = reject;
      setTimeout(reject, 8000);
    });

    await videoElement.play();
    updateGestureStatus('📷 Memuat model AI...', 'orange');

  } catch (err) {
    const msg = err.name === 'NotAllowedError'
      ? '🚫 Izin kamera ditolak. Gunakan tombol dadu.'
      : '⚠️ Kamera tidak tersedia. Gunakan tombol dadu.';
    updateGestureStatus(msg, 'orange');
    return;
  }

  try {
    gestureHands = new Hands({ locateFile: f => `${MEDIAPIPE_CDN}${f}` });

    gestureHands.setOptions({
      maxNumHands: 1,
      modelComplexity: 0,
      minDetectionConfidence: 0.65,
      minTrackingConfidence: 0.5,
    });

    gestureHands.onResults(onHandResults);
    await gestureHands.initialize();

    gestureCamera = new Camera(videoElement, {
      onFrame: async () => {
        if (canvasCtx && canvasElement && videoElement.readyState >= 2) {
          // Gambar video normal — mirror dihandle di JS agar landmark juga ikut ter-flip
          canvasCtx.save();
          canvasCtx.translate(canvasElement.width, 0);
          canvasCtx.scale(-1, 1);
          canvasCtx.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);
          canvasCtx.restore();
        }
        if (gestureActive) {
          try { await gestureHands.send({ image: videoElement }); } catch(e) {}
        }
      },
      width: 320, height: 240,
    });

    gestureCamera.start();
    gestureActive = true;
    gestureState  = 'IDLE';
    updateGestureStatus('✅ Kamera aktif! Buka tangan → kepal → buka untuk lempar!', 'green');

  } catch (err) {
    console.warn('MediaPipe gagal:', err);
    updateGestureStatus('⚠️ Model AI gagal. Gunakan tombol dadu.', 'orange');
  }
}


// ============================================================
// onHandResults(results) — Callback Hasil Deteksi MediaPipe
// ------------------------------------------------------------
// State machine:
//   IDLE    + OPEN (3 frame)  → READY
//   READY   + FIST (3 frame)  → ROLLING (mulai spin live)
//   ROLLING + OPEN (3 frame)  → IDLE + triggerGestureAction (baca hasil)
//   Tidak ada tangan          → reset ke IDLE + stop spin jika ROLLING
//   Sedang cooldown (3 detik setelah lempar) → diabaikan + diberi tahu,
//     TANPA mereset progress yang sudah terkumpul
//   Gestur ambigu satu frame  → progress dikurangi pelan (leaky),
//     BUKAN direset total — supaya noise sesaat tidak memaksa
//     pemain mengulang seluruh urutan dari awal
// ============================================================
function onHandResults(results) {
  if (!canvasCtx || !canvasElement) return;

  // Gambar video ke canvas WITH mirror
  canvasCtx.save();
  canvasCtx.translate(canvasElement.width, 0);
  canvasCtx.scale(-1, 1);
  canvasCtx.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);
  canvasCtx.restore();

  // Tidak ada tangan
  if (!results.multiHandLandmarks || results.multiHandLandmarks.length === 0) {
    fistFrameCount = 0;
    openFrameCount = 0;

    if (gestureState === 'ROLLING') {
      // Tangan hilang saat rolling → stop dan ambil hasil (seperti buka tangan)
      stopLiveSpin();
      triggerGestureAction('roll');
      gestureState = 'IDLE';
      updateGestureLabel('NONE');
    } else {
      gestureState = 'IDLE';
      updateGestureLabel('NONE');
    }
    return;
  }

  const landmarks = results.multiHandLandmarks[0];

  // Gambar skeleton tangan — mirror context agar sesuai dengan video yang sudah di-flip
  try {
    canvasCtx.save();
    canvasCtx.translate(canvasElement.width, 0);
    canvasCtx.scale(-1, 1);
    drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS, { color: '#4ECDC4', lineWidth: 2 });
    drawLandmarks(canvasCtx, landmarks, { color: '#FFD93D', lineWidth: 1, radius: 3 });
    canvasCtx.restore();
  } catch(e) {}

  const gesture = classifyGesture(landmarks);
  updateGestureLabel(gesture);

  // ── CEK COOLDOWN DULU SEBELUM PROSES STATE MACHINE ──
  // BUG SEBELUMNYA: kalau user mencoba gestur lagi SEBELUM 3 detik
  // cooldown (setCooldown) habis, blok READY→ROLLING di bawah akan
  // diam-diam membuang gestureState balik ke IDLE tanpa pesan apapun
  // ke layar. User merasa gestur "tidak merespon / delay", padahal
  // sebenarnya sengaja diabaikan sistem. Sekarang dikasih tahu jelas,
  // dan progress (openFrameCount/fistFrameCount) TIDAK direset paksa
  // supaya begitu cooldown habis, user tidak perlu mengulang dari nol.
  if (gestureCooldown) {
    updateGestureStatus('⏳ Tunggu sebentar sebelum lempar lagi...', 'orange');
    return;
  }

  // ── State Machine ──
  if (gestureState === 'IDLE') {
    if (gesture === 'OPEN') {
      openFrameCount++;
      fistFrameCount = 0;
      if (openFrameCount >= FRAMES_REQUIRED) {
        gestureState   = 'READY';
        openFrameCount = 0;
        showGestureFeedback('✋ Siap! Kepal tangan untuk spin!');
        updateGestureStatus('✋ Siap! Kepalan tangan → dadu berputar', 'green');
      }
    } else {
      // SEBELUMNYA: reset penuh ke 0 di satu frame noise saja.
      // Sekarang dikurangi pelan-pelan (leaky) supaya satu frame
      // salah klasifikasi (misal motion blur) tidak menghapus
      // seluruh progress yang sudah terkumpul.
      openFrameCount = Math.max(0, openFrameCount - 1);
      fistFrameCount = 0;
    }

  } else if (gestureState === 'READY') {
    if (gesture === 'FIST') {
      fistFrameCount++;
      openFrameCount = 0;
      if (fistFrameCount >= FRAMES_REQUIRED) {
        // Cek apakah kondisi game memungkinkan lempar dadu
        const diceBtn = document.getElementById('btn-roll');
        if (diceBtn && !diceBtn.disabled && state.gameActive && !state.waitingAnswer && !state.paused && !gestureCooldown) {
          gestureState   = 'ROLLING';
          fistFrameCount = 0;
          startLiveSpin();
          showGestureFeedback('✊ Mengocok dadu... buka tangan untuk lempar!');
          updateGestureStatus('✊ Dadu berputar! Buka tangan untuk lempar!', 'green');
        } else {
          // Kondisi tidak memungkinkan, reset ke idle
          gestureState   = 'IDLE';
          fistFrameCount = 0;
        }
      }
    } else if (gesture === 'OPEN') {
      // Tetap di READY, reset fist counter
      fistFrameCount = 0;
    } else {
      // SEBELUMNYA: gesture ambigu (UNKNOWN/POINT/PEACE) langsung
      // menjatuhkan state balik ke IDLE — artinya user harus membuka
      // tangan lagi dari nol meski cuma satu frame salah baca. Ini
      // salah satu penyebab utama gestur terasa "delay banget".
      // Sekarang: tetap di READY, cuma progress FIST dikurangi
      // pelan-pelan (leaky), bukan dihapus + diturunkan paksa.
      fistFrameCount = Math.max(0, fistFrameCount - 1);
    }

  } else if (gestureState === 'ROLLING') {
    if (gesture === 'OPEN') {
      openFrameCount++;
      fistFrameCount = 0;
      if (openFrameCount >= FRAMES_REQUIRED) {
        // Buka tangan dari kepalan → stop dan lempar dadu!
        stopLiveSpin();
        openFrameCount = 0;
        gestureState   = 'IDLE';
        showGestureFeedback('🎲 Dadu dilempar!');
        triggerGestureAction('roll');
        updateGestureStatus('✅ Kamera aktif! Buka tangan → kepal → buka untuk lempar!', 'green');
      }
    } else if (gesture === 'FIST') {
      // Masih dikepal → terus spin, reset open counter
      openFrameCount = 0;
    } else {
      // Gesture aneh → berhenti aman
      openFrameCount = 0;
      fistFrameCount = 0;
    }
  }
}


// ============================================================
// startLiveSpin() — Delegasi ke game.js (3D CSS dice engine)
// ============================================================
function startLiveSpin() {
  if (typeof startDiceSpinAnimation === 'function') startDiceSpinAnimation();
}

// stopLiveSpin() — Delegasi ke game.js
function stopLiveSpin() {
  if (typeof stopDiceSpinAnimation === 'function') stopDiceSpinAnimation();
}


// ============================================================
// classifyGesture(landmarks) — Klasifikasi Gestur Tangan
// ============================================================
function classifyGesture(landmarks) {
  const tips  = [landmarks[8], landmarks[12], landmarks[16], landmarks[20]];
  const mcps  = [landmarks[5], landmarks[9],  landmarks[13], landmarks[17]];
  const folded = tips.map((tip, i) => tip.y > mcps[i].y);

  if (folded.every(f => f))   return 'FIST';
  if (folded.every(f => !f))  return 'OPEN';
  if (!folded[0] && folded[1] && folded[2] && folded[3]) return 'POINT';
  if (!folded[0] && !folded[1] && folded[2] && folded[3]) return 'PEACE';
  return 'UNKNOWN';
}


// ============================================================
// triggerGestureAction(action) — Eksekusi Aksi dari Gestur
// ============================================================
function triggerGestureAction(action) {
  if (gestureCooldown) return;

  if (action === 'roll') {
    const diceBtn = document.getElementById('btn-roll');
    if (diceBtn && !diceBtn.disabled && state.gameActive && !state.waitingAnswer && !state.paused) {
      setCooldown(3000); // Cooldown 3 detik setelah lempar
      rollDice();
    }
  }
}

function setCooldown(ms) {
  gestureCooldown = true;
  setTimeout(() => {
    gestureCooldown = false;
    // Setelah cooldown, state kembali IDLE agar bisa pakai lagi
    gestureState   = 'IDLE';
    fistFrameCount = 0;
    openFrameCount = 0;
  }, ms);
}


// ============================================================
// FUNGSI UPDATE UI GESTURE
// ============================================================

function updateGestureStatus(msg, color) {
  const el = document.getElementById('gesture-status');
  if (!el) return;
  el.textContent = msg;
  el.style.color = color === 'green' ? '#4ECDC4' : '#FFD93D';
}

function updateGestureLabel(gesture) {
  const el = document.getElementById('gesture-label');
  if (!el) return;

  // Tampilkan state machine + gesture bersamaan
  const gestureNames = {
    FIST:    '✊ Kepalan',
    OPEN:    '✋ Terbuka',
    POINT:   '☝️ Menunjuk',
    PEACE:   '✌️ Peace',
    NONE:    '🤚 Tidak ada tangan',
    UNKNOWN: '...'
  };
  const stateNames = {
    IDLE:    '💤 Idle',
    READY:   '🟢 Siap',
    ROLLING: '🎲 Rolling!',
  };
  const gestureTxt = gestureNames[gesture] || '...';
  const stateTxt   = stateNames[gestureState] || '';
  el.textContent   = `${stateTxt} | ${gestureTxt}`;

  // Warna label berdasarkan state
  if (gestureState === 'ROLLING') {
    el.style.color = '#FF6B6B';
    el.style.fontWeight = 'bold';
  } else if (gestureState === 'READY') {
    el.style.color = '#4ECDC4';
    el.style.fontWeight = 'bold';
  } else {
    el.style.color = '';
    el.style.fontWeight = '';
  }
}

function showGestureFeedback(msg) {
  const el = document.getElementById('gesture-feedback');
  if (!el) return;
  el.textContent  = msg;
  el.style.opacity = '1';
  setTimeout(() => { el.style.opacity = '0'; }, 2000);
}


// ============================================================
// stopGesture() — Hentikan Kamera dan Bersihkan Resource
// ============================================================
function stopGesture() {
  gestureActive = false;
  stopLiveSpin(); // Pastikan spin berhenti

  if (gestureCamera) {
    try { gestureCamera.stop(); } catch(e) {}
    gestureCamera = null;
  }

  if (videoElement?.srcObject) {
    videoElement.srcObject.getTracks().forEach(t => t.stop());
    videoElement.srcObject = null;
  }

  gestureState   = 'IDLE';
  fistFrameCount = 0;
  openFrameCount = 0;
}
