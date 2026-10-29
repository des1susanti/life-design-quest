/**
 * LIFE DESIGN QUEST – penyimpan skor & pengatur sesi (Google Sheets)
 * -----------------------------------------------------------------
 * PEMASANGAN PERTAMA
 * 1. Buat Google Sheet baru, lalu Extensions > Apps Script.
 * 2. Hapus isi bawaan, tempel seluruh file ini, simpan.
 * 3. Deploy > New deployment > tipe "Web app":
 *      Execute as : Me
 *      Who has access : Anyone
 * 4. Salin URL Web app (berakhiran /exec) ke config.js -> SCRIPT_URL.
 *
 * MEMPERBARUI SKRIP (URL tetap sama)
 *   Tempel versi baru, simpan, lalu Deploy > Manage deployments >
 *   ikon pensil > Version: "New version" > Deploy.
 *
 * SESI MAIN
 *   Narasumber membuka sesi 1–4 dari layar papan skor (PIN di bawah).
 *   Sesi 0 = semua level terkunci.
 *
 * DATA
 *   Satu baris per NIM. Skor diperbarui setiap kali peserta menyelesaikan
 *   satu sesi, dan dikunci setelah seluruh 6 level selesai.
 *   Untuk mengosongkan papan skor: hapus baris data di sheet "Skor"
 *   (baris 1 = judul, biarkan).
 */

const PIN = "111";            // PIN narasumber untuk membuka sesi
const MAX_SCORE = 2800;
const SHEET = "Skor";
const HEAD = ["Waktu", "Nama", "NIM", "Prodi", "Skor", "Durasi (detik)", "Kode", "Kompas", "Plan A", "Plan B", "Plan C", "Dashboard", "Fokus", "Level selesai", "Karakter"];
const CHAR_IDS = ["m1", "m2", "m3", "m4", "m5", "f1", "f2", "f3", "f4", "f5"];

function sheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(SHEET);
  if (!sh) { sh = ss.insertSheet(SHEET); }
  if (sh.getLastRow() === 0 || sh.getRange(1, HEAD.length).getValue() !== HEAD[HEAD.length - 1]) {
    sh.getRange(1, 1, 1, HEAD.length).setValues([HEAD]).setFontWeight("bold");
    sh.setFrozenRows(1);
  }
  return sh;
}

function rows_(sh) {
  const n = sh.getLastRow() - 1;
  if (n <= 0) return [];
  return sh.getRange(2, 1, n, HEAD.length).getValues();
}

function ranked_(rows) {
  return rows
    .map(r => ({ nama: String(r[1]), nim: String(r[2]).trim(), prodi: String(r[3]), skor: Number(r[4]) || 0, durasi: Number(r[5]) || 0, levels: Number(r[13]) || 0, char: String(r[14] || "m1") }))
    .sort((a, b) => b.skor - a.skor || b.levels - a.levels || a.durasi - b.durasi);
}

function clean_(v, max) { return String(v == null ? "" : v).replace(/^[=+\-@]/, "'$&").slice(0, max); }

function out_(obj, cb) {
  const json = JSON.stringify(obj);
  if (cb && /^[A-Za-z0-9_]+$/.test(cb)) {
    return ContentService.createTextOutput(cb + "(" + json + ")").setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  return ContentService.createTextOutput(json).setMimeType(ContentService.MimeType.JSON);
}

function getStage_() { return Number(PropertiesService.getScriptProperties().getProperty("stage")) || 0; }

function doGet(e) {
  const p = (e && e.parameter) || {};
  const cb = p.callback;
  try {
    if (p.action === "submit") return out_(submit_(JSON.parse(p.d || "{}")), cb);
    if (p.action === "stage") return out_({ ok: true, stage: getStage_() }, cb);
    if (p.action === "setStage") {
      if (String(p.pin) !== PIN) return out_({ ok: false, error: "PIN salah" }, cb);
      const s = Math.max(0, Math.min(4, Number(p.stage) || 0));
      PropertiesService.getScriptProperties().setProperty("stage", String(s));
      return out_({ ok: true, stage: s }, cb);
    }
    // default: papan skor
    const rows = rows_(sheet_());
    const players = rows.map((r, i) => ({ key: i, nama: String(r[1]).trim().split(/\s+/)[0], char: String(r[14] || "m1"), levels: Number(r[13]) || 0 }));
    const list = ranked_(rows).filter(r => r.levels > 0);
    const top = list.slice(0, 10).map(r => ({ nama: r.nama, prodi: r.prodi, skor: r.skor, durasi: r.durasi, levels: r.levels, char: r.char }));
    return out_({ ok: true, total: rows.length, finished: list.filter(r => r.levels >= 6).length, stage: getStage_(), top: top, players: players }, cb);
  } catch (err) {
    return out_({ ok: false, error: String(err) }, cb);
  }
}

function submit_(d) {
  const nim = String(d.nim || "").trim();
  if (!nim || !d.nama) return { ok: false, error: "data tidak lengkap" };
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const sh = sheet_();
    const rows = rows_(sh);
    const idx = rows.findIndex(r => String(r[2]).trim() === nim);
    const levels = Math.max(0, Math.min(6, Number(d.levels) || 0));
    const skor = Math.max(0, Math.min(MAX_SCORE, Number(d.skor) || 0));
    const rec = [new Date(), clean_(d.nama, 60), "'" + clean_(nim, 20), clean_(d.prodi, 30), skor,
      Math.max(0, Number(d.durasi) || 0), clean_(d.kode, 20), clean_(d.kompas, 300),
      clean_(d.planA, 60), clean_(d.planB, 60), clean_(d.planC, 60), clean_(d.dashboard, 200), clean_(d.fokus, 20), levels, CHAR_IDS.indexOf(d.char) >= 0 ? d.char : "m1"];
    let locked = false;
    if (idx < 0) {
      sh.appendRow(rec);
    } else {
      const old = rows[idx];
      const oldLevels = Number(old[13]) || 0;
      if (oldLevels >= 6) locked = true;               // sudah tamat: tidak bisa diubah
      else if (levels >= oldLevels && skor >= (Number(old[4]) || 0)) sh.getRange(idx + 2, 1, 1, HEAD.length).setValues([rec]);
    }
    const list = ranked_(rows_(sh));
    const rank = list.findIndex(r => r.nim === nim) + 1;
    return { ok: true, locked: locked, rank: rank || null, total: list.length };
  } finally {
    lock.releaseLock();
  }
}
