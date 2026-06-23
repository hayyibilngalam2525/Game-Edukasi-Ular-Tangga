// ============================================================
// questions.js — Bank Soal Campuran SD Kelas 1–6
// Mata Pelajaran: IPA, IPS, Matematika
// Format setiap soal:
//   { soal, pilihan:[A,B,C,D], jawaban: index(0-3), level: 1-5 }
//   jawaban = index pilihan yang benar (0=A, 1=B, 2=C, 3=D)
//   level   = tingkat kesulitan (1=paling mudah, 5=paling sulit)
// ============================================================

const QUESTIONS = [

  // =====================================================
  // LEVEL 1 — Kelas 1–2 SD
  // Materi: IPA & IPS dasar + Matematika sederhana
  // Kotak 1–20
  // =====================================================

  // --- IPA Kelas 1-2 ---
  {
    soal: "Apa yang dibutuhkan\ntumbuhan untuk membuat makanan?",
    pilihan: ["Air dan pupuk", "Cahaya matahari dan air", "Tanah dan angin", "Air dan batu"],
    jawaban: 1, // B: Cahaya matahari dan air (fotosintesis butuh keduanya)
    level: 1
  },
  {
    soal: "Bagian tubuh manusia\nyang digunakan untuk bernapas?",
    pilihan: ["Jantung", "Lambung", "Paru-paru", "Hati"],
    jawaban: 2, // C: Paru-paru
    level: 1
  },
  {
    soal: "Hewan yang bertelur\nadalah...",
    pilihan: ["Kucing", "Sapi", "Ayam", "Kambing"],
    jawaban: 2, // C: Ayam (ovipar)
    level: 1
  },
  {
    soal: "Air akan berubah menjadi\nuap jika...",
    pilihan: ["Didinginkan", "Dipanaskan", "Didiamkan", "Dibekukan"],
    jawaban: 1, // B: Dipanaskan (proses evaporasi)
    level: 1
  },
  {
    soal: "Warna daun yang sehat\npada umumnya adalah...",
    pilihan: ["Kuning", "Merah", "Hijau", "Putih"],
    jawaban: 2, // C: Hijau (mengandung klorofil)
    level: 1
  },
  {
    soal: "Hewan peliharaan yang\nmengeluarkan suara 'meong' adalah...",
    pilihan: ["Anjing", "Kucing", "Burung", "Ikan"],
    jawaban: 1, // B: Kucing
    level: 1
  },
  {
    soal: "Benda yang dapat\nmengapung di air adalah...",
    pilihan: ["Batu", "Kayu", "Besi", "Kaca"],
    jawaban: 1, // B: Kayu (densitas lebih rendah dari air)
    level: 1
  },
  {
    soal: "Bagian tumbuhan yang\nmenyerap air dari tanah adalah...",
    pilihan: ["Daun", "Batang", "Akar", "Bunga"],
    jawaban: 2, // C: Akar
    level: 1
  },

  // --- IPS Kelas 1-2 ---
  {
    soal: "Siapa yang memimpin\nsebuah desa?",
    pilihan: ["Bupati", "Camat", "Lurah/Kepala Desa", "Gubernur"],
    jawaban: 2, // C: Lurah/Kepala Desa
    level: 1
  },
  {
    soal: "Hari kemerdekaan Indonesia\ndiperingati setiap tanggal...",
    pilihan: ["1 Juni", "17 Agustus", "28 Oktober", "20 Mei"],
    jawaban: 1, // B: 17 Agustus
    level: 1
  },
  {
    soal: "Bendera Indonesia\nberwarna...",
    pilihan: ["Merah, putih, biru", "Merah dan putih", "Kuning dan hijau", "Biru dan putih"],
    jawaban: 1, // B: Merah dan putih
    level: 1
  },
  {
    soal: "Bahasa persatuan\nIndonesia adalah...",
    pilihan: ["Bahasa Jawa", "Bahasa Sunda", "Bahasa Indonesia", "Bahasa Melayu"],
    jawaban: 2, // C: Bahasa Indonesia
    level: 1
  },
  {
    soal: "Tempat ibadah\nagama Islam adalah...",
    pilihan: ["Gereja", "Pura", "Masjid", "Wihara"],
    jawaban: 2, // C: Masjid
    level: 1
  },
  {
    soal: "Kepala pemerintahan\nIndonesia disebut...",
    pilihan: ["Raja", "Presiden", "Sultan", "Perdana Menteri"],
    jawaban: 1, // B: Presiden
    level: 1
  },

  // --- Matematika Kelas 1-2 ---
  {
    soal: "Berapa hasil dari\n3 + 4?",
    pilihan: ["6", "7", "8", "9"],
    jawaban: 1, // B: 7
    level: 1
  },
  {
    soal: "Berapa hasil dari\n10 - 3?",
    pilihan: ["6", "7", "8", "9"],
    jawaban: 1, // B: 7
    level: 1
  },
  {
    soal: "Ada 5 apel, ditambah\n2 apel lagi. Jumlahnya?",
    pilihan: ["6", "7", "8", "9"],
    jawaban: 1, // B: 7
    level: 1
  },
  {
    soal: "Berapa jumlah sisi\npada persegi?",
    pilihan: ["3", "4", "5", "6"],
    jawaban: 1, // B: 4
    level: 1
  },
  {
    soal: "Angka ganjil di\nantara 4 dan 6 adalah...",
    pilihan: ["4", "5", "6", "7"],
    jawaban: 1, // B: 5
    level: 1
  },
  {
    soal: "Berapa hasil dari\n1 + 1 + 1?",
    pilihan: ["1", "2", "3", "4"],
    jawaban: 2, // C: 3
    level: 1
  },

  // =====================================================
  // LEVEL 2 — Kelas 2–3 SD
  // Materi: IPA & IPS lanjutan + Matematika perkalian
  // Kotak 21–40
  // =====================================================

  // --- IPA Kelas 2-3 ---
  {
    soal: "Proses perubahan ulat\nmenjadi kupu-kupu disebut...",
    pilihan: ["Hibernasi", "Migrasi", "Metamorfosis", "Adaptasi"],
    jawaban: 2, // C: Metamorfosis
    level: 2
  },
  {
    soal: "Sumber energi terbesar\ndi bumi adalah...",
    pilihan: ["Angin", "Matahari", "Air", "Api"],
    jawaban: 1, // B: Matahari
    level: 2
  },
  {
    soal: "Benda yang bisa menghantarkan\nlistrik disebut...",
    pilihan: ["Isolator", "Konduktor", "Magnet", "Reflektor"],
    jawaban: 1, // B: Konduktor
    level: 2
  },
  {
    soal: "Air membeku\npada suhu...",
    pilihan: ["0°C", "10°C", "100°C", "50°C"],
    jawaban: 0, // A: 0°C
    level: 2
  },
  {
    soal: "Benda yang tidak dapat\ntembus cahaya disebut...",
    pilihan: ["Transparan", "Bening", "Opak", "Jernih"],
    jawaban: 2, // C: Opak
    level: 2
  },
  {
    soal: "Hewan yang mengalami\nmetamorfosis sempurna adalah...",
    pilihan: ["Belalang", "Capung", "Kupu-kupu", "Jangkrik"],
    jawaban: 2, // C: Kupu-kupu (telur-ulat-kepompong-kupu)
    level: 2
  },
  {
    soal: "Gas yang dibutuhkan\nmanusia untuk bernapas adalah...",
    pilihan: ["Karbon dioksida", "Nitrogen", "Oksigen", "Hidrogen"],
    jawaban: 2, // C: Oksigen
    level: 2
  },

  // --- IPS Kelas 2-3 ---
  {
    soal: "Mata uang negara\nIndonesia adalah...",
    pilihan: ["Dollar", "Euro", "Rupiah", "Yen"],
    jawaban: 2, // C: Rupiah
    level: 2
  },
  {
    soal: "Ibu kota Indonesia\nadalah...",
    pilihan: ["Surabaya", "Bandung", "Jakarta", "Medan"],
    jawaban: 2, // C: Jakarta
    level: 2
  },
  {
    soal: "Tari Saman berasal\ndari provinsi...",
    pilihan: ["Jawa Tengah", "Aceh", "Kalimantan", "Sulawesi"],
    jawaban: 1, // B: Aceh
    level: 2
  },
  {
    soal: "Proklamasi kemerdekaan\nIndonesia dibacakan oleh...",
    pilihan: ["Hatta dan Sjahrir", "Soekarno dan Hatta", "Soekarno dan Sjahrir", "Hatta dan Soepomo"],
    jawaban: 1, // B: Soekarno dan Hatta
    level: 2
  },
  {
    soal: "Rumah adat Jawa Tengah\nbernama...",
    pilihan: ["Tongkonan", "Joglo", "Gadang", "Honai"],
    jawaban: 1, // B: Joglo
    level: 2
  },
  {
    soal: "Alat musik angklung\nberasal dari...",
    pilihan: ["Jawa", "Bali", "Sunda/Jawa Barat", "Sumatra"],
    jawaban: 2, // C: Sunda/Jawa Barat
    level: 2
  },

  // --- Matematika Kelas 2-3 ---
  {
    soal: "Berapa hasil dari\n15 + 27?",
    pilihan: ["40", "41", "42", "43"],
    jawaban: 2, // C: 42
    level: 2
  },
  {
    soal: "Berapa hasil dari\n6 x 4?",
    pilihan: ["20", "22", "24", "26"],
    jawaban: 2, // C: 24
    level: 2
  },
  {
    soal: "24 dibagi 4\nsama dengan...",
    pilihan: ["4", "5", "6", "7"],
    jawaban: 2, // C: 6
    level: 2
  },
  {
    soal: "Berapa hasil dari\n8 x 5?",
    pilihan: ["35", "40", "45", "50"],
    jawaban: 1, // B: 40
    level: 2
  },
  {
    soal: "Berapa hasil dari\n9 x 9?",
    pilihan: ["72", "81", "90", "99"],
    jawaban: 1, // B: 81
    level: 2
  },
  {
    soal: "Adi punya 30 kelereng,\ndibagi 5 teman. Tiap dapat?",
    pilihan: ["5", "6", "7", "8"],
    jawaban: 1, // B: 6
    level: 2
  },
  {
    soal: "Berapa hasil dari\n50 - 18?",
    pilihan: ["30", "31", "32", "33"],
    jawaban: 2, // C: 32
    level: 2
  },

  // =====================================================
  // LEVEL 3 — Kelas 3–4 SD
  // Materi: IPA sistem tubuh + IPS geografi + Matematika pecahan
  // Kotak 41–60
  // =====================================================

  // --- IPA Kelas 3-4 ---
  {
    soal: "Bagian sel yang mengatur\nseluruh kegiatan sel adalah...",
    pilihan: ["Sitoplasma", "Membran sel", "Nukleus", "Mitokondria"],
    jawaban: 2, // C: Nukleus (inti sel)
    level: 3
  },
  {
    soal: "Planet yang paling dekat\ndengan matahari adalah...",
    pilihan: ["Venus", "Bumi", "Merkurius", "Mars"],
    jawaban: 2, // C: Merkurius
    level: 3
  },
  {
    soal: "Proses fotosintesis\nmenghasilkan...",
    pilihan: ["CO2 dan air", "Oksigen dan glukosa", "Nitrogen dan glukosa", "Hidrogen dan air"],
    jawaban: 1, // B: Oksigen dan glukosa
    level: 3
  },
  {
    soal: "Gaya yang selalu menarik\nbenda ke arah pusat bumi?",
    pilihan: ["Gaya magnet", "Gaya gesek", "Gaya gravitasi", "Gaya pegas"],
    jawaban: 2, // C: Gaya gravitasi
    level: 3
  },
  {
    soal: "Alat untuk melihat\nbenda yang sangat kecil?",
    pilihan: ["Teleskop", "Mikroskop", "Periskop", "Kacamata"],
    jawaban: 1, // B: Mikroskop
    level: 3
  },
  {
    soal: "Alat untuk mengukur\nsuhu disebut...",
    pilihan: ["Barometer", "Anemometer", "Termometer", "Hygrometer"],
    jawaban: 2, // C: Termometer
    level: 3
  },
  {
    soal: "Hewan yang bisa hidup\ndi dua alam disebut...",
    pilihan: ["Reptil", "Mamalia", "Amfibi", "Aves"],
    jawaban: 2, // C: Amfibi (darat dan air)
    level: 3
  },

  // --- IPS Kelas 3-4 ---
  {
    soal: "Indonesia terdiri dari\nberapa pulau?",
    pilihan: ["Lebih dari 17.000", "5.000 pulau", "10.000 pulau", "3.000 pulau"],
    jawaban: 0, // A: Lebih dari 17.000 pulau
    level: 3
  },
  {
    soal: "Selat yang memisahkan\nPulau Jawa dan Sumatera?",
    pilihan: ["Selat Madura", "Selat Sunda", "Selat Lombok", "Selat Bali"],
    jawaban: 1, // B: Selat Sunda
    level: 3
  },
  {
    soal: "Pahlawan wanita dari Jepara\npejuang emansipasi wanita?",
    pilihan: ["Cut Nyak Dien", "Martha Christina", "R.A. Kartini", "Dewi Sartika"],
    jawaban: 2, // C: R.A. Kartini
    level: 3
  },
  {
    soal: "Sumber daya alam yang\ntidak dapat diperbarui?",
    pilihan: ["Hutan", "Air", "Minyak bumi", "Angin"],
    jawaban: 2, // C: Minyak bumi (butuh jutaan tahun terbentuk)
    level: 3
  },
  {
    soal: "Upacara Ngaben adalah\ntradisi dari...",
    pilihan: ["Jawa", "Bali", "Sunda", "Batak"],
    jawaban: 1, // B: Bali (upacara pembakaran jenazah)
    level: 3
  },
  {
    soal: "Kerajaan Hindu tertua\ndi Indonesia adalah...",
    pilihan: ["Sriwijaya", "Majapahit", "Kutai", "Tarumanegara"],
    jawaban: 2, // C: Kutai (abad ke-4 Masehi)
    level: 3
  },

  // --- Matematika Kelas 3-4 ---
  {
    soal: "Berapa hasil dari\n123 + 456?",
    pilihan: ["579", "569", "589", "599"],
    jawaban: 0, // A: 579
    level: 3
  },
  {
    soal: "Berapa hasil dari\n300 - 147?",
    pilihan: ["153", "163", "143", "173"],
    jawaban: 0, // A: 153
    level: 3
  },
  {
    soal: "7 x 8 = ...",
    pilihan: ["48", "54", "56", "64"],
    jawaban: 2, // C: 56
    level: 3
  },
  {
    soal: "72 : 9 = ...",
    pilihan: ["7", "8", "9", "6"],
    jawaban: 1, // B: 8
    level: 3
  },
  {
    soal: "Setengah dari\n84 adalah...",
    pilihan: ["40", "41", "42", "43"],
    jawaban: 2, // C: 42
    level: 3
  },
  {
    soal: "Pecahan 1/2\nsama dengan...",
    pilihan: ["2/3", "3/6", "3/4", "2/5"],
    jawaban: 1, // B: 3/6 (1/2 = 3/6)
    level: 3
  },
  {
    soal: "Bangun datar dengan\n4 sisi sama panjang?",
    pilihan: ["Persegi panjang", "Segitiga", "Persegi", "Trapesium"],
    jawaban: 2, // C: Persegi
    level: 3
  },

  // =====================================================
  // LEVEL 4 — Kelas 4–5 SD
  // Materi: IPA sains lanjut + IPS sejarah/sosial + Matematika geometri
  // Kotak 61–80
  // =====================================================

  // --- IPA Kelas 4-5 ---
  {
    soal: "Sistem tata surya kita\nberada di galaksi...",
    pilihan: ["Andromeda", "Triangulum", "Bima Sakti", "Magellan"],
    jawaban: 2, // C: Bima Sakti (Milky Way)
    level: 4
  },
  {
    soal: "Organ yang berfungsi\nmemompa darah ke seluruh tubuh?",
    pilihan: ["Paru-paru", "Ginjal", "Hati", "Jantung"],
    jawaban: 3, // D: Jantung
    level: 4
  },
  {
    soal: "Rantai makanan yang\nbenar adalah...",
    pilihan: ["Harimau→rumput→rusa", "Rumput→belalang→katak→ular", "Ikan→plankton→udang", "Ulat→daun→burung"],
    jawaban: 1, // B: Rumput→belalang→katak→ular (produsen→konsumen)
    level: 4
  },
  {
    soal: "Pemanasan global disebabkan\noleh meningkatnya gas...",
    pilihan: ["Oksigen", "Nitrogen", "Karbon dioksida", "Hidrogen"],
    jawaban: 2, // C: Karbon dioksida (CO2, efek rumah kaca)
    level: 4
  },
  {
    soal: "Bagian bunga yang\nmenghasilkan serbuk sari?",
    pilihan: ["Putik", "Kelopak", "Benang sari", "Mahkota"],
    jawaban: 2, // C: Benang sari (stamen)
    level: 4
  },
  {
    soal: "Jenis batuan yang\nterbentuk dari magma membeku?",
    pilihan: ["Batuan sedimen", "Batuan metamorf", "Batuan beku", "Batuan kapur"],
    jawaban: 2, // C: Batuan beku (igneous rock)
    level: 4
  },
  {
    soal: "Lapisan atmosfer pelindung\nbumi dari sinar UV?",
    pilihan: ["Troposfer", "Stratosfer (lapisan ozon)", "Mesosfer", "Termosfer"],
    jawaban: 1, // B: Stratosfer dengan lapisan ozon
    level: 4
  },

  // --- IPS Kelas 4-5 ---
  {
    soal: "ASEAN didirikan\npada tahun...",
    pilihan: ["1945", "1955", "1967", "1975"],
    jawaban: 2, // C: 1967
    level: 4
  },
  {
    soal: "Pahlawan 'Bapak Koperasi\nIndonesia' adalah...",
    pilihan: ["Hatta", "Soekarno", "Sjahrir", "Soepomo"],
    jawaban: 0, // A: Hatta (Mohammad Hatta)
    level: 4
  },
  {
    soal: "Zona waktu WIB\n(Waktu Indonesia Barat) adalah UTC+...",
    pilihan: ["6", "7", "8", "9"],
    jawaban: 1, // B: 7 (UTC+7)
    level: 4
  },
  {
    soal: "Batik diakui sebagai\nwarisan budaya dunia oleh...",
    pilihan: ["ASEAN", "UNESCO", "PBB", "WHO"],
    jawaban: 1, // B: UNESCO (2009)
    level: 4
  },
  {
    soal: "Konferensi Asia Afrika\npertama diadakan di...",
    pilihan: ["Jakarta", "Surabaya", "Bandung", "Yogyakarta"],
    jawaban: 2, // C: Bandung (1955)
    level: 4
  },
  {
    soal: "Sumber daya alam yang\ndapat diperbarui adalah...",
    pilihan: ["Emas", "Minyak bumi", "Gas alam", "Hutan"],
    jawaban: 3, // D: Hutan (bisa ditanam kembali)
    level: 4
  },

  // --- Matematika Kelas 4-5 ---
  {
    soal: "KPK dari 4 dan 6\nadalah...",
    pilihan: ["8", "10", "12", "14"],
    jawaban: 2, // C: 12
    level: 4
  },
  {
    soal: "FPB dari 12 dan 18\nadalah...",
    pilihan: ["3", "4", "5", "6"],
    jawaban: 3, // D: 6
    level: 4
  },
  {
    soal: "Luas persegi dengan\nsisi 7 cm adalah...",
    pilihan: ["28 cm²", "42 cm²", "49 cm²", "56 cm²"],
    jawaban: 2, // C: 49 cm² (7x7)
    level: 4
  },
  {
    soal: "Keliling persegi panjang\np=8cm, l=5cm?",
    pilihan: ["26 cm", "28 cm", "30 cm", "32 cm"],
    jawaban: 0, // A: 26 cm (2x(8+5))
    level: 4
  },
  {
    soal: "Berapa hasil dari\n25% x 200?",
    pilihan: ["25", "40", "50", "75"],
    jawaban: 2, // C: 50 (25/100 x 200)
    level: 4
  },
  {
    soal: "Diagram berbentuk lingkaran\nuntuk menunjukkan persentase?",
    pilihan: ["Diagram batang", "Diagram garis", "Diagram lingkaran", "Diagram pohon"],
    jawaban: 2, // C: Diagram lingkaran (pie chart)
    level: 4
  },
  {
    soal: "Berapa hasil dari\n125 x 8?",
    pilihan: ["800", "900", "1.000", "1.100"],
    jawaban: 2, // C: 1.000
    level: 4
  },

  // =====================================================
  // LEVEL 5 — Kelas 5–6 SD
  // Materi: IPA sains mendalam + IPS global + Matematika lanjut
  // Kotak 81–100
  // =====================================================

  // --- IPA Kelas 5-6 ---
  {
    soal: "Proses pembelahan sel\nyang menghasilkan 4 sel anak?",
    pilihan: ["Mitosis", "Meiosis", "Osmosis", "Difusi"],
    jawaban: 1, // B: Meiosis (pembelahan sel kelamin, 4 sel)
    level: 5
  },
  {
    soal: "Zat yang mengangkut\noksigen dalam darah adalah...",
    pilihan: ["Plasma darah", "Hemoglobin", "Leukosit", "Trombosit"],
    jawaban: 1, // B: Hemoglobin (dalam sel darah merah)
    level: 5
  },
  {
    soal: "Sumber energi alternatif\nyang ramah lingkungan?",
    pilihan: ["Batu bara", "Minyak bumi", "Panel surya", "Gas alam"],
    jawaban: 2, // C: Panel surya (energi terbarukan)
    level: 5
  },
  {
    soal: "Jaringan yang menghubungkan\notot dengan tulang disebut...",
    pilihan: ["Ligamen", "Tendon", "Kartilago", "Periosteum"],
    jawaban: 1, // B: Tendon
    level: 5
  },
  {
    soal: "Proses masuknya air ke\nsel tumbuhan melalui membran?",
    pilihan: ["Difusi", "Osmosis", "Transpirasi", "Respirasi"],
    jawaban: 1, // B: Osmosis (perpindahan air melalui membran semipermeabel)
    level: 5
  },
  {
    soal: "Bagian otak yang mengatur\nkeseimbangan tubuh adalah...",
    pilihan: ["Otak besar", "Otak kecil", "Batang otak", "Sumsum tulang belakang"],
    jawaban: 1, // B: Otak kecil (serebelum)
    level: 5
  },
  {
    soal: "Proses penguraian bahan\norganik oleh bakteri disebut...",
    pilihan: ["Fermentasi", "Dekomposisi", "Fotosintesis", "Respirasi"],
    jawaban: 1, // B: Dekomposisi (penguraian)
    level: 5
  },

  // --- IPS Kelas 5-6 ---
  {
    soal: "Globalisasi adalah proses...",
    pilihan: ["Pembangunan negara", "Penyebaran teknologi saja", "Keterhubungan dunia tanpa batas", "Peperangan antar bangsa"],
    jawaban: 2, // C: Keterhubungan dunia tanpa batas
    level: 5
  },
  {
    soal: "Anggota tetap Dewan\nKeamanan PBB berjumlah...",
    pilihan: ["3", "4", "5", "6"],
    jawaban: 2, // C: 5 (AS, Rusia, China, UK, Prancis)
    level: 5
  },
  {
    soal: "Kerjasama internasional\nekonomi yang melibatkan Indonesia?",
    pilihan: ["NATO", "G20", "EU", "NAFTA"],
    jawaban: 1, // B: G20
    level: 5
  },
  {
    soal: "Pembukaan UUD 1945\nterdiri dari berapa alinea?",
    pilihan: ["2", "3", "4", "5"],
    jawaban: 2, // C: 4 alinea
    level: 5
  },
  {
    soal: "Dampak positif globalisasi\nbagi Indonesia adalah...",
    pilihan: ["Masuknya budaya asing negatif", "Kemajuan teknologi dan informasi", "Hilangnya budaya lokal", "Kesenjangan sosial meningkat"],
    jawaban: 1, // B: Kemajuan teknologi dan informasi
    level: 5
  },
  {
    soal: "Tujuan dibentuknya\nASEAN adalah...",
    pilihan: ["Membentuk tentara bersama", "Mempercepat pertumbuhan ekonomi dan perdamaian", "Menyatukan negara Asia", "Melawan negara Barat"],
    jawaban: 1, // B: Mempercepat pertumbuhan ekonomi dan perdamaian
    level: 5
  },

  // --- Matematika Kelas 5-6 ---
  {
    soal: "Volume kubus dengan\nsisi 4 cm adalah...",
    pilihan: ["16 cm³", "32 cm³", "48 cm³", "64 cm³"],
    jawaban: 3, // D: 64 cm³ (4x4x4)
    level: 5
  },
  {
    soal: "Luas lingkaran dengan\njari-jari 7 cm? (π=22/7)",
    pilihan: ["44 cm²", "88 cm²", "154 cm²", "176 cm²"],
    jawaban: 2, // C: 154 cm² (22/7 x 7 x 7)
    level: 5
  },
  {
    soal: "Berapa 20% dari 500?",
    pilihan: ["80", "90", "100", "110"],
    jawaban: 2, // C: 100 (20/100 x 500)
    level: 5
  },
  {
    soal: "Nilai dari\n2 pangkat 3 adalah...",
    pilihan: ["6", "8", "12", "16"],
    jawaban: 1, // B: 8 (2x2x2)
    level: 5
  },
  {
    soal: "Akar kuadrat dari\n144 adalah...",
    pilihan: ["10", "11", "12", "13"],
    jawaban: 2, // C: 12 (12x12=144)
    level: 5
  },
  {
    soal: "Berapa hasil dari\n3 pangkat 4?",
    pilihan: ["12", "27", "64", "81"],
    jawaban: 3, // D: 81 (3x3x3x3)
    level: 5
  },
  {
    soal: "Luas segitiga dengan\nalas 12cm dan tinggi 8cm?",
    pilihan: ["48 cm²", "56 cm²", "64 cm²", "96 cm²"],
    jawaban: 0, // A: 48 cm² (1/2 x 12 x 8)
    level: 5
  },

];

// ============================================================
// FUNGSI AMBIL SOAL BERDASARKAN POSISI KOTAK
// ------------------------------------------------------------
// Parameter: cellNumber = nomor kotak tempat pion berhenti (1–100)
// Return   : objek soal { soal, pilihan, jawaban, level }
//
// Cara kerja:
//   1. Tentukan level berdasarkan posisi kotak:
//      Kotak 1–15   → Level 1 (mudah, Kelas 1-2)
//      Kotak 16–35  → Level 2 (Kelas 2-3)
//      Kotak 36–55  → Level 3 (Kelas 3-4)
//      Kotak 56–75  → Level 4 (Kelas 4-5)
//      Kotak 76–100 → Level 5 (sulit, Kelas 5-6, zona akhir dibuat lebih panjang)
//   2. Filter soal dari array QUESTIONS sesuai level
//   3. Pilih satu soal secara acak dari pool tersebut
// ============================================================
// ============================================================
// usedQuestionsByLevel — Pelacak Soal yang Sudah Dipakai
// ------------------------------------------------------------
// Dideklarasikan DI SINI (sebelum getQuestion) agar tidak ada
// risiko ReferenceError akibat const tidak di-hoist seperti var.
// ============================================================
const usedQuestionsByLevel = { 1: [], 2: [], 3: [], 4: [], 5: [] };

function getQuestion(cellNumber) {
  // Batas level (cocok dengan docstring di atas):
  let level = 1;
  if      (cellNumber <= 15) level = 1;
  else if (cellNumber <= 35) level = 2;
  else if (cellNumber <= 55) level = 3;
  else if (cellNumber <= 75) level = 4;
  else                       level = 5;

  // Semua soal yang termasuk level ini
  const allInLevel = QUESTIONS.filter(q => q.level === level);

  // Soal level ini yang BELUM keluar di "putaran" saat ini
  // (lihat usedQuestionsByLevel di bawah — ini kuncinya supaya soal
  //  tidak berulang terus seperti sebelumnya)
  let available = allInLevel.filter(q => !usedQuestionsByLevel[level].includes(q));

  // Kalau semua soal level ini sudah pernah keluar → mulai putaran baru
  // (reset daftar terpakai, baru semua soal tersedia lagi)
  if (available.length === 0) {
    usedQuestionsByLevel[level] = [];
    available = allInLevel;
  }

  const idx     = Math.floor(Math.random() * available.length);
  const chosen  = available[idx];

  usedQuestionsByLevel[level].push(chosen); // tandai sebagai sudah dipakai
  return chosen;
}

// resetQuestionHistory() — Kosongkan semua riwayat soal terpakai
// WAJIB dipanggil setiap kali game baru dimulai (lihat startGame()
// di game.js), supaya game baru tidak "mewarisi" riwayat dari game
// sebelumnya.
function resetQuestionHistory() {
  Object.keys(usedQuestionsByLevel).forEach(level => {
    usedQuestionsByLevel[level] = [];
  });
}

// ─── Injeksi soal tambahan level 4 & 5 (lebih sulit) ───
QUESTIONS.push(
  { soal:"Tulang yang berfungsi\nmelindungi otak disebut...", pilihan:["Tulang dada","Tulang tengkorak","Tulang rusuk","Tulang belakang"], jawaban:1, level:4 },
  { soal:"Proses perubahan uap air\nmenjadi air disebut...", pilihan:["Evaporasi","Kondensasi","Presipitasi","Sublimasi"], jawaban:1, level:4 },
  { soal:"Nilai tempat angka 7\npada bilangan 4.372 adalah...", pilihan:["Ribuan","Ratusan","Puluhan","Satuan"], jawaban:2, level:4 },
  { soal:"Koperasi pertama Indonesia\ndidirikan oleh...", pilihan:["Soekarno","R.A. Kartini","R. Aria Wiria Atmaja","Moh. Hatta"], jawaban:2, level:4 },
  { soal:"Candi Borobudur terletak\ndi provinsi...", pilihan:["Jawa Timur","Jawa Tengah","DI Yogyakarta","Jawa Barat"], jawaban:1, level:4 },
  { soal:"285 × 4 = ?", pilihan:["1.040","1.100","1.140","1.200"], jawaban:2, level:4 },
  { soal:"Bapak Pendidikan Nasional\nIndonesia adalah...", pilihan:["Ki Hajar Dewantara","Soekarno","Moh. Hatta","Dr. Sutomo"], jawaban:0, level:4 },
  { soal:"Persegi panjang 15×9 cm.\nBerapa kelilingnya?", pilihan:["42 cm","48 cm","54 cm","60 cm"], jawaban:1, level:5 },
  { soal:"Gas yang dihasilkan\npada fotosintesis adalah...", pilihan:["CO₂","N₂","O₂","H₂"], jawaban:2, level:5 },
  { soal:"Jika 5x − 3 = 17,\nmaka nilai x adalah...", pilihan:["3","4","5","6"], jawaban:1, level:5 },
  { soal:"Sidang BPUPKI pertama\nberlangsung pada tanggal...", pilihan:["1 Maret 1945","29 Mei–1 Juni 1945","17 Agustus 1945","18 Agustus 1945"], jawaban:1, level:5 },
  { soal:"Volume kubus dengan\nrusuk 7 cm adalah...", pilihan:["49 cm³","147 cm³","343 cm³","441 cm³"], jawaban:2, level:5 },
  { soal:"Organisme yang membuat\nmakanan sendiri disebut...", pilihan:["Konsumen","Dekomposer","Produsen","Predator"], jawaban:2, level:5 },
  { soal:"FPB dari 48 dan 72\nadalah...", pilihan:["12","18","24","36"], jawaban:2, level:5 },
  { soal:"Sistem pemerintahan Indonesia\nberdasarkan UUD 1945 adalah...", pilihan:["Presidensial","Parlementer","Monarki","Federal"], jawaban:0, level:5 }
);
