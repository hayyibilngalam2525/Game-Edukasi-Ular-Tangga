// ============================================================
// game.js — Engine Utama MathSnake Adventure
// ------------------------------------------------------------
// File ini mengatur SEMUA logika permainan:
//   - Data papan (SPECIAL_CELLS): letak tangga, ular, bonus, jebakan
//   - State/kondisi game saat ini (state)
//   - Navigasi antar layar (showScreen)
//   - Setup pemain sebelum mulai
//   - Membangun papan 10x10 (buildBoard)
//   - Menggerakkan pion pemain (movePion, animateMove)
//   - Sistem soal: menampilkan dan memeriksa jawaban
//   - Timer mundur 30 detik
//   - Efek khusus (naik tangga, kena ular, bonus, jebakan)
//   - Giliran pemain berikutnya
//   - Pause / Quit
//   - Game over dan tampilan pemenang
//   - Fungsi pembantu: suara, konfeti, toast, sleep
// ============================================================


// ============================================================
// SPECIAL_CELLS — Peta Kotak Khusus di Papan
// ------------------------------------------------------------
// Key   = nomor kotak
// Value = { type, to }
//   type : 'ladder' (tangga naik), 'snake' (ular turun),
//          'bonus' (langkah ekstra), 'trap' (giliran skip)
//   to   : kotak tujuan jika terkena efek tangga / ular
// ============================================================
const SPECIAL_CELLS = {
  4:  { type: 'ladder', to: 22 },  // Kotak 4  → naik tangga ke 22
  9:  { type: 'snake',  to: 2  },  // Kotak 9  → kena ular turun ke 2
  17: { type: 'ladder', to: 36 },  // Kotak 17 → naik tangga ke 36
  20: { type: 'bonus',  to: 23 },  // Kotak 20 → bonus maju ke 23
  28: { type: 'snake',  to: 10 },  // Kotak 28 → kena ular turun ke 10
  32: { type: 'trap',   to: 32 },  // Kotak 32 → jebakan (giliran di-skip)
  38: { type: 'ladder', to: 58 },  // Kotak 38 → naik tangga ke 58
  44: { type: 'snake',  to: 25 },  // Kotak 44 → kena ular turun ke 25
  50: { type: 'bonus',  to: 53 },  // Kotak 50 → bonus maju ke 53
  54: { type: 'ladder', to: 72 },  // Kotak 54 → naik tangga ke 72
  62: { type: 'snake',  to: 43 },  // Kotak 62 → kena ular turun ke 43
  68: { type: 'ladder', to: 87 },  // Kotak 68 → naik tangga ke 87
  76: { type: 'trap',   to: 76 },  // Kotak 76 → jebakan (giliran di-skip)
  80: { type: 'snake',  to: 60 },  // Kotak 80 → kena ular turun ke 60
  88: { type: 'bonus',  to: 91 },  // Kotak 88 → bonus maju ke 91
  94: { type: 'snake',  to: 74 },  // Kotak 94 → kena ular turun ke 74
  99: { type: 'ladder', to: 100 }, // Kotak 99 → naik tangga ke 100 (finish!)
};

// Warna dan avatar (emoji) untuk masing-masing pemain (maks 4 pemain)
const PLAYER_COLORS  = ['#FF6B6B','#4ECDC4','#FFD93D','#A29BFE'];
const PLAYER_AVATARS = ['🔴','🔵','🟡','🟣'];

// ============================================================
// STATE — Kondisi / Status Game Saat Ini
// ------------------------------------------------------------
// Semua data yang berubah selama permainan disimpan di sini.
// ============================================================
let state = {
  players:         [],    // Array objek pemain: { name, avatar, color, pos, score, skipTurn }
  currentPlayer:   0,     // Index pemain yang sedang giliran (0–3)
  numPlayers:      2,     // Jumlah total pemain dalam sesi ini
  gameActive:      false, // true = sedang bermain, false = belum/sudah selesai
  diceValue:       0,     // Hasil lemparan dadu terakhir (1–6)
  waitingAnswer:   false, // true = menunggu pemain menjawab soal
  currentQuestion: null,  // Objek soal yang sedang ditampilkan
  currentSpecial:  null,  // Objek kotak khusus yang diinjak pemain (null = kotak biasa)
  currentCell:     0,     // Nomor kotak di mana pemain berhenti
  timerInterval:   null,  // ID interval untuk timer countdown
  timerSeconds:    30,    // Sisa waktu menjawab soal (dalam detik)
  paused:          false, // true = game sedang dijeda
};


// ============================================================
// showScreen(id)
// ------------------------------------------------------------
// Fungsi navigasi antar layar (screen).
// Cara kerja:
//   1. Sembunyikan semua elemen dengan class 'screen'
//   2. Tampilkan hanya elemen dengan id yang diminta
//   3. Scroll layar ke atas (top = 0) agar tampilan rapi
// Parameter: id = string ID elemen HTML layar yang dituju
// ============================================================
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const t = document.getElementById(id);
  if (t) { t.classList.add('active'); t.scrollTop = 0; }
}


// ============================================================
// SETUP PEMAIN — Sebelum Game Dimulai
// ============================================================

// Jumlah pemain yang dipilih di layar setup (default 2)
let selectedPlayerCount = 2;

// setPlayerCount(n) — Ubah jumlah pemain
// Parameter: n = jumlah pemain yang dipilih (2, 3, atau 4)
// Cara kerja:
//   - Simpan pilihan ke selectedPlayerCount
//   - Tandai tombol aktif (class 'active') di UI
//   - Render ulang input nama pemain
function setPlayerCount(n) {
  selectedPlayerCount = n;
  document.querySelectorAll('.count-btn').forEach((b, i) => b.classList.toggle('active', i + 2 === n));
  renderPlayerInputs();
}

// renderPlayerInputs() — Buat input nama untuk setiap pemain
// Cara kerja: Buat elemen HTML berisi avatar + field input nama
//             sebanyak selectedPlayerCount pemain
function renderPlayerInputs() {
  const c = document.getElementById('player-inputs');
  const names = ['Andi','Budi','Cici','Desi']; // Nama default
  c.innerHTML = '';
  for (let i = 0; i < selectedPlayerCount; i++) {
    c.innerHTML += `
      <div class="player-input-row">
        <span class="player-avatar">${PLAYER_AVATARS[i]}</span>
        <input class="player-input-field" id="player-name-${i}" type="text"
          placeholder="Nama Pemain ${i+1}" value="${names[i]}" maxlength="12"/>
      </div>`;
  }
}


// ============================================================
// startGame() — Memulai Permainan
// ------------------------------------------------------------
// Dipanggil saat tombol "Mulai Game!" ditekan.
// Cara kerja:
//   1. Reset state permainan
//   2. Baca nama pemain dari input
//   3. Inisialisasi data setiap pemain (posisi 1, skor 0)
//   4. Bangun papan, aktifkan kamera gesture, render tampilan
//   5. Pindah ke layar game
// ============================================================
function startGame() {
  state.numPlayers    = selectedPlayerCount;
  state.players       = [];
  state.currentPlayer = 0;
  state.gameActive    = true;

  resetQuestionHistory(); // Kosongkan riwayat soal terpakai (questions.js) — supaya pengulangan soal dari game sebelumnya tidak terbawa

  // Buat objek data untuk setiap pemain
  for (let i = 0; i < selectedPlayerCount; i++) {
    const inp  = document.getElementById(`player-name-${i}`);
    const name = (inp && inp.value.trim()) || `Pemain ${i+1}`;
    state.players.push({
      name,
      avatar:   PLAYER_AVATARS[i],
      color:    PLAYER_COLORS[i],
      pos:      1,     // Mulai dari kotak 1
      score:    0,     // Skor awal 0
      skipTurn: false  // Belum kena jebakan
    });
  }

  buildBoard();        // Render papan 10x10
  initGesture();       // Aktifkan deteksi gestur tangan (gesture.js)
  renderScoreBar();    // Tampilkan bar skor di header
  renderScoreList();   // Tampilkan daftar skor di panel kanan
  updateTurnInfo();    // Tampilkan info giliran pemain pertama
  renderPions();       // Tampilkan pion di posisi awal
  enableDiceButton(true);  // Aktifkan tombol dadu
  resetDiceDisplay();  // Reset tampilan dadu
  showScreen('screen-game'); // Pindah ke layar permainan
}


// ============================================================
// buildBoard() — Membangun Papan Ular Tangga 10x10
// ------------------------------------------------------------
// Cara kerja:
//   Papan ular tangga memiliki pola arah zigzag:
//   - Baris terbawah (kotak 1–10): kiri → kanan
//   - Baris berikutnya (kotak 11–20): kanan → kiri
//   - Dan seterusnya bergantian
//   Loop membuat urutan kotak yang sesuai, lalu membuat
//   elemen div untuk setiap kotak dengan ikon dan class yang tepat.
// ============================================================
function buildBoard() {
  const board = document.getElementById('game-board');
  board.innerHTML = '';

  // Buat urutan kotak dengan pola zigzag papan ular tangga
  const cellOrder = [];
  for (let row = 9; row >= 0; row--) {
    const rowCells = [];
    for (let col = 0; col < 10; col++) rowCells.push(row * 10 + col + 1);
    // Baris genap dari tampilan atas: balik urutan (kanan ke kiri)
    if ((9 - row) % 2 === 0) rowCells.reverse();
    cellOrder.push(...rowCells);
  }

  // Buat elemen HTML untuk setiap kotak
  cellOrder.forEach(num => {
    const div = document.createElement('div');
    div.className = 'cell ' + getCellClass(num); // Kelas CSS sesuai jenis kotak
    div.id = `cell-${num}`;

    // Tentukan ikon kotak: start, finish, atau ikon kotak khusus
    const sp = SPECIAL_CELLS[num];
    let icon = '';
    if (num === 1)   icon = '🚀';
    else if (num === 100) icon = '🏆';
    else if (sp) icon = { ladder:'🪜', snake:'🐍', bonus:'⭐', trap:'💣' }[sp.type] || '';

    // Struktur HTML kotak: nomor + ikon + tempat pion
    div.innerHTML = `
      <span class="cell-num">${num}</span>
      ${icon ? `<span class="cell-icon">${icon}</span>` : ''}
      <div class="pion-container" id="pion-${num}"></div>`;
    board.appendChild(div);
  });
}

// getCellClass(num) — Mengembalikan class CSS sesuai jenis kotak
// Menentukan warna/style kotak berdasarkan jenisnya
function getCellClass(num) {
  if (num === 1)   return 'cell-start';     // Kotak start
  if (num === 100) return 'cell-end';       // Kotak finish
  const sp = SPECIAL_CELLS[num];
  if (!sp) return (num % 2 === 0) ? 'cell-normal-a' : 'cell-normal-b'; // Warna selang-seling
  return { ladder:'cell-ladder', snake:'cell-snake', bonus:'cell-bonus', trap:'cell-trap' }[sp.type] || 'cell-normal-a';
}


// ============================================================
// renderPions() — Menampilkan Pion Semua Pemain di Papan
// ------------------------------------------------------------
// Cara kerja:
//   1. Kosongkan semua pion-container di seluruh papan
//   2. Buat elemen pion untuk setiap pemain dan tempatkan
//      di kotak sesuai posisi (pos) mereka
//   3. Sorot (highlight) kotak pemain yang sedang giliran
// ============================================================
function renderPions() {
  // Kosongkan semua slot pion
  document.querySelectorAll('.pion-container').forEach(c => c.innerHTML = '');

  // Tempatkan pion setiap pemain di posisinya
  state.players.forEach(p => {
    const c = document.getElementById(`pion-${p.pos}`);
    if (!c) return;
    const pion = document.createElement('div');
    pion.className = 'pion';
    pion.style.background = p.color;
    pion.textContent = p.name[0].toUpperCase(); // Inisial nama sebagai label pion
    c.appendChild(pion);
  });

  // Hapus highlight sebelumnya, lalu sorot kotak pemain aktif
  document.querySelectorAll('.cell').forEach(c => c.classList.remove('highlight'));
  const pos = state.players[state.currentPlayer]?.pos;
  if (pos) document.getElementById(`cell-${pos}`)?.classList.add('highlight');
}


// ============================================================
// RENDER SKOR & INFO GILIRAN
// ============================================================

// renderScoreBar() — Update bar skor di header game
// Menampilkan chip kecil untuk setiap pemain (avatar + nama + posisi)
// Pemain yang sedang giliran diberi class 'active-player'
function renderScoreBar() {
  const bar = document.getElementById('score-bar');
  if (bar) {
    bar.innerHTML = state.players.map((p, i) => `
      <div class="score-chip ${i === state.currentPlayer ? 'active-player' : ''}">
        <span class="chip-avatar">${p.avatar}</span>
        <span>${p.name} ${p.pos}</span>
      </div>`).join('');
  }
}

// renderScoreList() — Update daftar skor detail di panel kanan
// Menampilkan baris untuk setiap pemain: avatar, nama, posisi kotak, poin
function renderScoreList() {
  const list = document.getElementById('score-list');
  if (!list) return;
  list.innerHTML = state.players.map((p, i) => `
    <div class="score-row ${i === state.currentPlayer ? 'active' : ''}">
      <span class="score-avatar">${p.avatar}</span>
      <div class="score-info">
        <div class="score-name">${p.name}</div>
        <div class="score-pos">Kotak ${p.pos}</div>
      </div>
      <span class="score-pts">${p.score}</span>
    </div>`).join('');
}

// updateTurnInfo() — Update semua tampilan info giliran pemain aktif
// Memperbarui: header avatar, header nama, nama di panel kanan,
//              score bar, dan daftar skor
function updateTurnInfo() {
  const p = state.players[state.currentPlayer];
  const av = document.getElementById('turn-avatar');
  const nm = document.getElementById('turn-name');
  if (av) av.textContent = p.avatar;
  if (nm) nm.textContent = p.name;
  const stn = document.getElementById('side-turn-name');
  if (stn) stn.textContent = `${p.avatar} ${p.name}`;
  renderScoreBar();
  renderScoreList();
}



// ============================================================
// 3D CSS DICE SYSTEM
// ------------------------------------------------------------
// Dadu berbasis CSS 3D cube — 6 sisi nyata, bisa diputar.
// Setiap sisi punya pip (titik) yang dirender sebagai HTML.
// Sisi TOP selalu = angka yang dibaca.
//
// LAYOUT PIP (grid 3x3, posisi grid 1-9 dari kiri atas):
//   1 2 3
//   4 5 6
//   7 8 9
//
// Tiap angka dadu punya pola pip standar:
//   1: [5]
//   2: [3, 7]
//   3: [3, 5, 7]
//   4: [1, 3, 7, 9]
//   5: [1, 3, 5, 7, 9]
//   6: [1, 3, 4, 6, 7, 9]
//
// Rotasi kubus menggunakan rotateX + rotateY sehingga sisi
// tertentu menghadap atas (TOP face).
// ============================================================

// Pola pip per angka — posisi dalam grid 3x3 (1-based, row-major)
const PIP_PATTERNS = {
  1: [5],
  2: [3, 7],
  3: [3, 5, 7],
  4: [1, 3, 7, 9],
  5: [1, 3, 5, 7, 9],
  6: [1, 3, 4, 6, 7, 9],
};

// PENTING: ini rotasi KUBUS (objek `.dice-cube` secara keseluruhan) agar
// sisi yang menyimpan nilai N berakhir menghadap KE ATAS (face-up).
// Posisi sisi dalam kubus (dari CSS):
//   face-top(1)    = Y+ → sudah di atas, tidak perlu rotasi
//   face-bottom(6) = Y- → putar X +180° agar naik ke atas
//   face-front(2)  = Z+ → putar X -90° agar Z+ menjadi atas
//   face-back(5)   = Z- → putar X +90° agar Z- menjadi atas
//   face-right(3)  = X+ → putar Z +90° agar X+ menjadi atas
//   face-left(4)   = X- → putar Z -90° agar X- menjadi atas
// viewTilt (-22, 28) ditambahkan di rotateDiceFaceUp() agar terlihat 3D.
const FACE_UP_ROTATION = {
  1: { x:  -22, y:    28 },
  2: { x:   62, y:    -1 },
  3: { x:   53, y:   -92 },
  4: { x:   58, y:    90 },
  5: { x:   51, y:   182 },
  6: { x:  157, y:    -1 },
};

// Nilai yang ditempel di tiap sisi (statis, sesuai dadu standar)
const FACE_VALUES = {
  'face-top':    1,
  'face-bottom': 6,
  'face-front':  2,
  'face-back':   5,
  'face-right':  3,
  'face-left':   4,
};

// Inisialisasi pip di semua 6 sisi saat game start
function initDiceFaces() {
  Object.entries(FACE_VALUES).forEach(([faceId, val]) => {
    const face = document.getElementById(faceId);
    if (!face) return;
    renderFacePips(face, val);
  });
}

// Render pip (titik) ke sebuah face element
function renderFacePips(faceEl, n) {
  const pattern = PIP_PATTERNS[n] || [];
  let html = '';
  for (let i = 1; i <= 9; i++) {
    html += pattern.includes(i)
      ? '<div class="pip"></div>'
      : '<div class="pip-empty"></div>';
  }
  faceEl.innerHTML = html;
}

// Rotasi kubus ke orientasi di mana angka N menghadap atas
// offset = tambahan rotasi (untuk efek spin berkelanjutan)
function rotateDiceFaceUp(n) {
  const cube = document.getElementById('dice-cube');
  if (!cube) return;
  const base = FACE_UP_ROTATION[n] || { x: -22, y: 28 };
  cube.style.transform = `rotateX(${base.x}deg) rotateY(${base.y}deg)`;
}

// ── State spin dadu ──
let diceSpinInterval = null;  // interval animasi live spin (saat ROLLING gesture)
let diceSpinX = 0;            // akumulasi rotasi X saat spin
let diceSpinY = 0;            // akumulasi rotasi Y saat spin

// Mulai spin dadu live (dipanggil dari gesture.js startLiveSpin)
function startDiceSpinAnimation() {
  if (diceSpinInterval) return;
  const cube = document.getElementById('dice-cube');
  /* spinning class removed — filter is on scene now, not cube */

  const num = document.getElementById('dice-number');
  if (num) { num.style.opacity = '0'; num.textContent = ''; }

  diceSpinX = -22; // mulai dari view tilt default (sesuai CSS)
  diceSpinY =  28;

  // KECEPATAN SPIN — sebelumnya delta X=7-12°, Y=11-18° per 100ms,
  // itu setara cuma ~95-150°/detik (kurang dari setengah putaran/detik),
  // makanya terasa lambat. Dinaikkan jadi delta lebih besar (X=22-36°,
  // Y=30-48°) DAN interval dipercepat 100ms→70ms, sehingga sekarang
  // setara ~400-550°/detik — terasa seperti benar-benar dikocok.
  diceSpinInterval = setInterval(() => {
    // Putar kontinyu di kedua sumbu dengan kecepatan berbeda
    // sehingga terlihat seperti dadu sungguhan dikocok
    diceSpinX += 22 + Math.random() * 14;
    diceSpinY += 30 + Math.random() * 18;
    if (cube) {
      // Durasi transition disamakan dengan interval (70ms) supaya
      // animasi tidak "mengejar" dan terlihat patah-patah
      cube.style.transition = 'transform 0.06s linear';
      cube.style.transform  = `rotateX(${diceSpinX}deg) rotateY(${diceSpinY}deg)`;
    }
  }, 70);
}

// Hentikan spin live (dipanggil dari gesture.js stopLiveSpin)
function stopDiceSpinAnimation() {
  if (diceSpinInterval) {
    clearInterval(diceSpinInterval);
    diceSpinInterval = null;
    // Pastikan diceSpinX/Y non-zero agar rollDice() tahu ini dari gesture
    if (diceSpinX === 0 && diceSpinY === 0) {
      diceSpinX = -22;
      diceSpinY =  28;
    }
  }
}

// resetDiceDisplay() — Reset dadu ke posisi awal (sisi 1 menghadap atas)
function resetDiceDisplay() {
  stopDiceSpinAnimation();
  initDiceFaces();
  const cube = document.getElementById('dice-cube');
  if (cube) {
    cube.classList.remove('landing');
    const sceneEl = document.getElementById('dice-scene');
    if (sceneEl) sceneEl.classList.remove('landing-glow');
    cube.style.transition = 'transform 0.4s ease';
  }
  rotateDiceFaceUp(1);
  const num = document.getElementById('dice-number');
  if (num) { num.textContent = ''; num.style.opacity = '0'; }
}


// ============================================================
// rollDice() — Animasi Landing dan Logika Lemparan Dadu
// ------------------------------------------------------------
// Dipanggil setelah gesture OPEN terdeteksi (dari triggerGestureAction)
// ATAU saat tombol diceBtn ditekan.
// Pada saat ini, dadu mungkin sedang spin (dari gesture) atau diam.
// Alur:
//   1. Stop live spin jika ada
//   2. Generate finalVal secara kriptografis acak
//   3. Animasi "melambat" — rotasi makin pelan mendekati posisi final
//   4. Landing: snap ke orientasi finalVal menghadap atas
//   5. Bounce + kilauan, lalu movePion()
// ============================================================
function rollDice() {
  if (!state.gameActive || state.waitingAnswer || state.paused) return;
  enableDiceButton(false);

  // Stop spin live jika sedang jalan (dari gesture)
  stopDiceSpinAnimation();

  const num = document.getElementById('dice-number');
  if (num) { num.style.opacity = '0'; num.textContent = ''; }

  // Angka akhir — Web Crypto tanpa modulo bias
  // Buang nilai >= 252 (karena 252 = 6×42 habis dibagi 6, jadi 0–251 adil)
  let rawVal;
  const arr = new Uint8Array(1);
  do {
    crypto.getRandomValues(arr);
    rawVal = arr[0];
  } while (rawVal >= 252);
  const finalVal = (rawVal % 6) + 1;

  const cube = document.getElementById('dice-cube');
  if (!cube) { state.diceValue = finalVal; movePion(finalVal); return; }

  // Kalau dari gesture (dadu sudah spinning), langsung landing — tidak perlu decel lagi.
  // Kalau dari tombol, jalankan decel singkat (4 step) supaya terasa responsif.
  const fromGesture = diceSpinX !== 0 || diceSpinY !== 0;
  if (fromGesture) {
    diceSpinX = 0;
    diceSpinY = 0;
    setTimeout(() => landDice(finalVal), 40);
    return;
  }

  // ── FASE DECELERATE (tombol saja): 4 frame singkat ──
  const DECEL_STEPS = 4;
  let step = 0;
  let spinX = -18;
  let spinY =  25;

  function decelFrame() {
    step++;
    const progress = step / DECEL_STEPS;
    // Kecepatan makin kecil: dari cepat → lambat
    const speed   = (1 - progress) * (1 - progress) * 28;
    spinX += speed * 0.7;
    spinY += speed;

    cube.style.transition = `transform ${40 + progress * 50}ms ease-out`;
    cube.style.transform  = `rotateX(${spinX}deg) rotateY(${spinY}deg)`;

    if (step < DECEL_STEPS) {
      setTimeout(decelFrame, 40 + progress * 50);
    } else {
      landDice(finalVal);
    }
  }

  setTimeout(decelFrame, 20);
}

// landDice(n) — Snap ke orientasi final + bounce + kilauan
function landDice(n) {
  const cube = document.getElementById('dice-cube');
  const num  = document.getElementById('dice-number');
  if (!cube) return;

  const sceneForGlow = document.getElementById('dice-scene');
  if (sceneForGlow) sceneForGlow.classList.add('landing-glow');

  // Snap ke posisi yang tepat (sisi n menghadap atas)
  cube.style.transition = 'transform 0.25s cubic-bezier(0.175,0.885,0.32,1.5)';
  rotateDiceFaceUp(n);

  setTimeout(() => {
    // Bounce scale via dice-scene
    const scene = document.getElementById('dice-scene');
    if (scene) {
      scene.style.transition = 'transform 0.15s cubic-bezier(0.22,1.8,0.5,1)';
      scene.style.transform  = 'scale(1.2)';
      setTimeout(() => {
        scene.style.transition = 'transform 0.18s cubic-bezier(0.175,0.885,0.32,1.4)';
        scene.style.transform  = 'scale(1)';
      }, 150);
    }

    // Hilangkan kelas landing
    setTimeout(() => {
      cube.classList.remove('landing');
      if (sceneForGlow) sceneForGlow.classList.remove('landing-glow');
    }, 400);

    state.diceValue = n;
    if (num) { num.textContent = n; num.style.opacity = '1'; }

    setTimeout(() => movePion(n), 400);
  }, 260);
}


// ============================================================
// movePion(steps) — Gerakkan Pion Pemain Langkah demi Langkah
// ------------------------------------------------------------
// Parameter: steps = hasil dadu (1–6)
// Cara kerja:
//   1. Hitung posisi baru (tidak boleh melebihi kotak 100)
//   2. Animasikan pergerakan pion satu kotak per 180ms
//   3. Jika mencapai kotak 100 → langsung endGame()
//   4. Jika tidak → simpan kotak khusus (jika ada) dan tampilkan soal
// ============================================================
async function movePion(steps) {
  const player = state.players[state.currentPlayer];
  let newPos   = Math.min(player.pos + steps, 100); // Tidak boleh melebihi kotak 100

  // Animasi gerak pion kotak demi kotak
  for (let pos = player.pos + 1; pos <= newPos; pos++) {
    player.pos = pos;
    renderPions();
    renderScoreList();
    await sleep(180); // Jeda 180ms per kotak untuk efek animasi
  }
  await sleep(300); // Jeda singkat sebelum aksi selanjutnya

  // Cek apakah pion sudah sampai finish
  if (newPos === 100) { endGame(); return; }

  // Simpan info kotak saat ini untuk digunakan di soal
  state.currentCell    = newPos;
  state.currentSpecial = SPECIAL_CELLS[newPos] || null; // null = kotak biasa

  triggerQuestion(newPos); // Tampilkan soal
}


// ============================================================
// triggerQuestion(cellNum) — Tampilkan Soal ke Pemain
// ------------------------------------------------------------
// Parameter: cellNum = nomor kotak tempat pemain berhenti
// Cara kerja:
//   1. Tentukan badge dan warna berdasarkan jenis kotak
//   2. Ambil soal acak via getQuestion() dari questions.js
//   3. Isi HTML layar soal: badge, teks soal, pilihan A-D
//   4. Set state.waitingAnswer = true
//   5. Pindah ke layar soal dan mulai timer
// ============================================================
function triggerQuestion(cellNum) {
  const sp = state.currentSpecial;

  // Tentukan badge sesuai jenis kotak khusus
  let badge = '❓ Jawab soal!', badgeColor = '#90caf9';
  if (sp) {
    const info = {
      ladder: { badge:'🪜 Tangga! Jawab untuk naik!',  color:'#27ae60' },
      snake:  { badge:'🐍 Ular! Jawab atau turun!',    color:'#c0392b' },
      bonus:  { badge:'⭐ Bonus! Jawab untuk bonus!',  color:'#e67e22' },
      trap:   { badge:'💣 Jebakan! Hati-hati!',        color:'#8e44ad' },
    }[sp.type];
    if (info) { badge = info.badge; badgeColor = info.color; }
  }

  // Ambil soal acak sesuai level kotak
  state.currentQuestion = getQuestion(cellNum);

  // Isi elemen HTML layar soal
  document.getElementById('q-type-badge').textContent = badge;
  document.getElementById('q-type-badge').style.color = badgeColor;
  document.getElementById('q-text').textContent = state.currentQuestion.soal;
  document.getElementById('q-feedback').className = 'q-feedback hidden';

  // Buat tombol pilihan A, B, C, D
  const letters = ['A','B','C','D'];
  document.getElementById('q-choices').innerHTML = state.currentQuestion.pilihan.map((p, i) => `
    <button class="choice-btn" onclick="answerQuestion(${i})">
      <span class="choice-letter">${letters[i]}</span>${p}
    </button>`).join('');

  state.waitingAnswer = true;
  showScreen('screen-question');
  startTimer(); // Mulai hitung mundur 30 detik
}


// ============================================================
// TIMER — Hitung Mundur 30 Detik untuk Menjawab Soal
// ============================================================

// startTimer() — Mulai/reset timer ke 30 detik
// Setiap detik: kurangi timerSeconds, update tampilan
// Jika sisa ≤10 detik: tampilan berubah merah (urgent)
// Jika 0: otomatis jawab salah (answerQuestion(-1))
function startTimer() {
  clearInterval(state.timerInterval); // Reset timer lama jika ada
  state.timerSeconds = 30;
  updateTimerDisplay();
  state.timerInterval = setInterval(() => {
    state.timerSeconds--;
    updateTimerDisplay();
    if (state.timerSeconds <= 10) document.getElementById('q-timer').classList.add('urgent');
    if (state.timerSeconds <= 0)  { clearInterval(state.timerInterval); answerQuestion(-1); }
  }, 1000);
}

// updateTimerDisplay() — Perbarui tampilan angka timer di UI
function updateTimerDisplay() {
  document.getElementById('q-timer').textContent = `⏱ ${state.timerSeconds}`;
}

// stopTimer() — Hentikan timer dan hapus efek urgent
function stopTimer() {
  clearInterval(state.timerInterval);
  document.getElementById('q-timer').classList.remove('urgent');
}


// ============================================================
// answerQuestion(chosenIdx) — Proses Jawaban Pemain
// ------------------------------------------------------------
// Parameter: chosenIdx = index pilihan yang dipilih (0–3)
//            -1 jika waktu habis (timeout)
// Cara kerja:
//   1. Cek apakah masih menunggu jawaban (untuk mencegah dobel)
//   2. Hentikan timer, nonaktifkan semua tombol pilihan
//   3. Bandingkan jawaban dengan jawaban yang benar
//   4. Warnai tombol: hijau = benar, merah = salah
//   5. Hitung punishment (mundur 2–3 kotak acak) untuk jawaban salah di kotak biasa
//   6. Tampilkan feedback pesan
//   7. Setelah 2.5 detik, jalankan efek (executeEffect)
// ============================================================
function answerQuestion(chosenIdx) {
  if (!state.waitingAnswer) return; // Abaikan jika sudah dijawab
  state.waitingAnswer = false;
  stopTimer();

  // Nonaktifkan semua tombol pilihan agar tidak bisa diklik lagi
  document.querySelectorAll('.choice-btn').forEach(b => b.disabled = true);

  const correct   = state.currentQuestion.jawaban; // Index jawaban benar
  const isCorrect = chosenIdx === correct;
  const sp        = state.currentSpecial;
  const player    = state.players[state.currentPlayer];

  // Warnai tombol sesuai hasil
  const btns = document.querySelectorAll('.choice-btn');
  btns[correct].classList.add('correct'); // Selalu hijau = jawaban benar
  if (!isCorrect && chosenIdx >= 0) btns[chosenIdx].classList.add('wrong'); // Merah = pilihan salah

  // Hitung hukuman mundur (2–3 kotak acak) untuk jawaban salah
  const turun   = Math.floor(Math.random() * 2) + 2; // Acak: 2 atau 3
  const turunTo = Math.max(1, player.pos - turun);    // Tidak boleh kurang dari kotak 1

  // Buat pesan feedback sesuai kondisi
  let msg = '';
  if (isCorrect) {
    player.score += 10; // Tambah 10 poin jika benar
    playSound('correct');
    showConfetti();
    if (!sp)                     msg = `✅ Benar! +10 poin! 🎉`;
    else if (sp.type==='ladder') msg = `✅ Benar! Naik tangga ke kotak ${sp.to}! 🎉`;
    else if (sp.type==='snake')  msg = `✅ Benar! Lolos dari ular! 💪`;
    else if (sp.type==='bonus')  msg = `✅ Benar! Bonus +3 langkah! ⭐`;
    else if (sp.type==='trap')   msg = `✅ Benar! Lolos dari jebakan! 💪`;
  } else {
    playSound('wrong');
    const benar = state.currentQuestion.pilihan[correct]; // Teks jawaban yang benar
    if (!sp)                     msg = `❌ Salah! Mundur ${turun} kotak ke ${turunTo}! Jawaban: ${benar}`;
    else if (sp.type==='ladder') msg = `❌ Salah! Tidak naik + mundur ${turun} kotak! Jawaban: ${benar}`;
    else if (sp.type==='snake')  msg = `❌ Salah! Kena ular ke kotak ${sp.to}! Jawaban: ${benar}`;
    else if (sp.type==='bonus')  msg = `❌ Salah! Tidak dapat bonus + mundur ${turun} kotak! Jawaban: ${benar}`;
    else if (sp.type==='trap')   msg = `❌ Salah! Giliran dilewat! Jawaban: ${benar}`;
  }

  // Tampilkan feedback di bawah pilihan
  const fb = document.getElementById('q-feedback');
  fb.className   = `q-feedback ${isCorrect ? 'correct-fb' : 'wrong-fb'}`;
  fb.textContent = msg;

  // Tunggu 2.5 detik, lalu eksekusi efek kotak
  setTimeout(() => executeEffect(isCorrect, sp, player, turun, turunTo), 2500);
}


// ============================================================
// executeEffect(isCorrect, sp, player, turun, turunTo)
// ------------------------------------------------------------
// Menjalankan efek sesuai kombinasi BENAR/SALAH + jenis kotak
// Tabel efek:
//   Kotak biasa + Benar  → tetap di tempat
//   Kotak biasa + Salah  → mundur 2–3 kotak
//   Tangga + Benar       → naik ke kotak tujuan tangga
//   Tangga + Salah       → tidak naik + mundur 2–3 kotak
//   Ular + Benar         → selamat, tetap di tempat
//   Ular + Salah         → turun ke kotak tujuan ular
//   Bonus + Benar        → maju 3 kotak ekstra
//   Bonus + Salah        → tidak dapat bonus + mundur 2–3 kotak
//   Jebakan + Benar      → lolos, tetap di tempat (tidak ada efek khusus)
//   Jebakan + Salah      → giliran berikutnya di-skip
// ============================================================
async function executeEffect(isCorrect, sp, player, turun = 2, turunTo = 1) {
  showScreen('screen-game');

  if (!sp) {
    // Kotak biasa: mundur jika salah
    if (!isCorrect && player.pos > 1) {
      await showAnimation('😱', `Mundur ${turun} Kotak!`);
      await animateMove(player, turunTo);
    }
  } else {
    if (sp.type==='ladder' && isCorrect) {
      // Naik tangga
      await showAnimation('🪜', 'Naik Tangga!');
      await animateMove(player, sp.to);
    } else if (sp.type==='ladder' && !isCorrect) {
      // Salah di tangga: tidak naik + mundur
      await showAnimation('😱', `Tidak Naik! Mundur ${turun} Kotak!`);
      await animateMove(player, turunTo);
    } else if (sp.type==='snake' && isCorrect) {
      // Benar di ular: selamat, tetap di posisi
    } else if (sp.type==='snake' && !isCorrect) {
      // Salah di ular: turun mengikuti ular
      await showAnimation('🐍', 'Kena Ular! Turun!');
      await animateMove(player, sp.to);
    } else if (sp.type==='bonus' && isCorrect) {
      // Benar di bonus: maju 3 kotak
      await showAnimation('⭐', 'Bonus +3 Langkah!');
      await animateMove(player, Math.min(player.pos + 3, 100));
    } else if (sp.type==='bonus' && !isCorrect) {
      // Salah di bonus: tidak dapat bonus + mundur
      await showAnimation('😱', `Tidak Dapat Bonus! Mundur ${turun}!`);
      await animateMove(player, turunTo);
    } else if (sp.type==='trap' && !isCorrect) {
      // Salah di jebakan: giliran berikutnya dilewati
      player.skipTurn = true;
      await showAnimation('💣', 'Giliran Dilewat!');
    }
  }

  renderPions();
  renderScoreList();

  // Cek apakah pemain sudah mencapai finish setelah efek
  if (player.pos >= 100) { endGame(); return; }
  nextTurn(); // Lanjut ke giliran berikutnya
}

// animateMove(player, targetPos) — Animasi gerak pion ke posisi target
// Bergerak satu kotak per 120ms ke arah target (maju atau mundur)
async function animateMove(player, targetPos) {
  const dir = targetPos > player.pos ? 1 : -1; // +1 = maju, -1 = mundur
  while (player.pos !== targetPos) {
    player.pos += dir;
    renderPions();
    await sleep(120);
  }
  await sleep(300);
}

// showAnimation(emoji, text) — Tampilkan overlay animasi singkat (1.2 detik)
// Digunakan untuk memberi tahu pemain efek apa yang terjadi
function showAnimation(emoji, text) {
  return new Promise(resolve => {
    const ov = document.getElementById('overlay-anim');
    document.getElementById('anim-emoji').textContent = emoji;
    document.getElementById('anim-text').textContent  = text;
    ov.classList.remove('hidden');
    setTimeout(() => { ov.classList.add('hidden'); resolve(); }, 1200);
  });
}


// ============================================================
// nextTurn() — Pindah ke Giliran Pemain Berikutnya
// ------------------------------------------------------------
// Cara kerja:
//   1. Reset tampilan dadu
//   2. Hitung giliran berikutnya secara berurutan (cyclic)
//   3. Jika pemain berikutnya kena jebakan (skipTurn=true),
//      lewati gilirannya dan tampilkan notifikasi toast
//   4. Update tampilan giliran dan aktifkan tombol dadu
// ============================================================
function nextTurn() {
  resetDiceDisplay();
  let next    = (state.currentPlayer + 1) % state.numPlayers;
  let checked = 0;

  // Lewati pemain yang kena jebakan (skipTurn)
  while (state.players[next].skipTurn && checked < state.numPlayers) {
    state.players[next].skipTurn = false;
    showToast(`${state.players[next].name} skip giliran! 💣`);
    next = (next + 1) % state.numPlayers;
    checked++;
  }

  state.currentPlayer = next;
  updateTurnInfo();
  renderPions();
  enableDiceButton(true); // Aktifkan tombol dadu untuk pemain berikutnya
}


// ============================================================
// PAUSE & QUIT
// ============================================================

// togglePause() — Jeda atau lanjutkan permainan
// Menampilkan/menyembunyikan overlay pause, menghentikan/melanjutkan timer
function togglePause() {
  state.paused = !state.paused;
  document.getElementById('overlay-pause').classList.toggle('hidden', !state.paused);
  if (state.paused) {
    stopTimer();              // Hentikan timer soal saat dijeda
    stopDiceSpinAnimation();  // Hentikan spin dadu jika sedang berputar (gesture)
  }
}

// quitGame() — Keluar dari permainan dan kembali ke menu utama
function quitGame() {
  state.paused    = false;
  state.gameActive = false;
  document.getElementById('overlay-pause').classList.add('hidden');
  stopGesture();   // Tutup kamera dan reset semua state gesture + cooldown
  showScreen('screen-menu');
}


// ============================================================
// endGame() — Akhiri Permainan dan Tampilkan Layar Game Over
// ------------------------------------------------------------
// Cara kerja:
//   1. Set gameActive = false
//   2. Urutkan pemain berdasarkan posisi kotak (tertinggi = menang)
//      Jika posisi sama, bandingkan skor
//   3. Tampilkan nama pemenang dan peringkat semua pemain
//   4. Pindah ke layar game over
// ============================================================
function endGame() {
  state.gameActive = false;
  showConfetti(60); // Banyak konfeti untuk perayaan

  // Urutkan pemain: posisi tertinggi dulu, jika sama → skor tertinggi
  const sorted = [...state.players].sort((a, b) => b.pos - a.pos || b.score - a.score);

  document.getElementById('winner-name').textContent = `🎉 ${sorted[0].name} Menang!`;

  const ranks = ['🥇','🥈','🥉','4️⃣'];
  document.getElementById('final-scores').innerHTML = sorted.map((p, i) => `
    <div class="final-row ${i === 0 ? 'rank-1' : ''}">
      <span class="final-rank">${ranks[i]}</span>
      <span class="final-name">${p.avatar} ${p.name}</span>
      <span class="final-pos">Kotak ${p.pos} · ${p.score} poin</span>
    </div>`).join('');

  showScreen('screen-gameover');
}

// restartGame() — Kembali ke layar setup untuk main lagi
// stopGesture() dipanggil dulu agar stream kamera lama ditutup
// sebelum startGame() nanti memanggil initGesture() lagi.
// Tanpa ini, dua stream kamera bisa berjalan bersamaan.
function restartGame() {
  stopGesture();
  showScreen('screen-setup');
}


// ============================================================
// FUNGSI PEMBANTU (HELPER FUNCTIONS)
// ============================================================

// enableDiceButton(en) — Aktifkan (true) atau nonaktifkan (false) tombol dadu
function enableDiceButton(en) {
  const b = document.getElementById('btn-roll');
  if (b) b.disabled = !en;
}

// sleep(ms) — Menunda eksekusi selama ms milidetik (untuk animasi async)
// Digunakan bersama await agar kode menunggu sebelum lanjut
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// showToast(msg) — Tampilkan notifikasi singkat (2.5 detik) di bagian bawah layar
// Digunakan untuk memberi tahu pemain tentang skip giliran dll
function showToast(msg) {
  const t = document.createElement('div');
  t.style.cssText = 'position:fixed;bottom:80px;left:50%;transform:translateX(-50%);background:rgba(0,0,0,0.85);color:white;padding:10px 20px;border-radius:20px;font-size:14px;font-weight:700;z-index:150;white-space:nowrap;';
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 2500); // Hapus setelah 2.5 detik
}

// playSound(type) — Putar efek suara menggunakan Web Audio API
// type='correct' → nada naik (do-mi-sol) tanda jawaban benar
// type='wrong'   → nada turun tanda jawaban salah
// Menggunakan OscillatorNode yang dibuat secara programatik (tanpa file audio)
function playSound(type) {
  try {
    const ctx  = new (window.AudioContext || window.webkitAudioContext)();
    const osc  = ctx.createOscillator();  // Generator gelombang suara
    const gain = ctx.createGain();        // Pengatur volume
    osc.connect(gain); gain.connect(ctx.destination);

    if (type === 'correct') {
      // Nada naik: C5 (523Hz) → E5 (659Hz) → G5 (784Hz)
      osc.frequency.setValueAtTime(523, ctx.currentTime);
      osc.frequency.setValueAtTime(659, ctx.currentTime + 0.1);
      osc.frequency.setValueAtTime(784, ctx.currentTime + 0.2);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
      osc.start(); osc.stop(ctx.currentTime + 0.5);
    } else {
      // Nada turun: 200Hz → 150Hz (efek gagal)
      osc.frequency.setValueAtTime(200, ctx.currentTime);
      osc.frequency.setValueAtTime(150, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
      osc.start(); osc.stop(ctx.currentTime + 0.4);
    }
  } catch(e) {} // Abaikan error (misalnya browser memblokir audio)
}

// showConfetti(count) — Tampilkan animasi konfeti berwarna-warni
// Parameter: count = jumlah partikel konfeti (default 30)
// Cara kerja: Buat elemen div kecil berwarna acak dengan animasi CSS,
//             tempatkan di posisi horizontal acak, hapus setelah 2 detik
function showConfetti(count = 30) {
  const colors = ['#FFD93D','#FF6B6B','#4ECDC4','#A29BFE','#27ae60','#e67e22'];
  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      const c = document.createElement('div');
      c.className = 'confetti';
      c.style.cssText = `left:${Math.random()*100}vw;background:${colors[~~(Math.random()*colors.length)]};width:${Math.random()*8+6}px;height:${Math.random()*8+6}px;animation-delay:${Math.random()*0.5}s;animation-duration:${Math.random()*1+1}s;`;
      document.body.appendChild(c);
      setTimeout(() => c.remove(), 2000); // Hapus setelah animasi selesai
    }, i * 30); // Sebar waktu munculnya setiap partikel
  }
}


// ============================================================
// INISIALISASI SAAT HALAMAN DIMUAT
// ------------------------------------------------------------
// Saat DOM siap:
//   - Tampilkan layar menu utama
//   - Set default 2 pemain
//   - Render input nama pemain
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  showScreen('screen-menu');
  setPlayerCount(2);
  renderPlayerInputs();
});
