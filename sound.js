// Musik & efek suara Life Design Quest (layar proyektor).
// Semua suara dibangkitkan dengan Web Audio API: komposisi orisinal, tanpa file audio.
(function () {
  let ctx = null, master, music, sfx, noiseBuf, on = false;
  let track = "lobby", timer = null, nextTime = 0, step = 0;
  const MUSIC_VOL = 0.9;
  const mtof = n => 440 * Math.pow(2, (n - 69) / 12);

  function ensure() {
    if (ctx) return true;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return false;
    ctx = new AC();
    const comp = ctx.createDynamicsCompressor(); comp.threshold.value = -16; comp.knee.value = 10; comp.ratio.value = 4; comp.attack.value = 0.005; comp.release.value = 0.2; comp.connect(ctx.destination);
    master = ctx.createGain(); master.gain.value = 0; master.connect(comp);
    music = ctx.createGain(); music.gain.value = MUSIC_VOL; music.connect(master);
    sfx = ctx.createGain(); sfx.gain.value = 1.6; sfx.connect(master);
    noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    const d = noiseBuf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    return true;
  }

  function tone(t, freq, dur, type, vol, dest, glideTo) {
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type; o.frequency.setValueAtTime(freq, t);
    if (glideTo) o.frequency.exponentialRampToValueAtTime(glideTo, t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(dest || music); o.start(t); o.stop(t + dur + 0.03);
  }
  function noise(t, dur, vol, fType, fFreq, q, dest) {
    const s = ctx.createBufferSource(); s.buffer = noiseBuf;
    const f = ctx.createBiquadFilter(); f.type = fType; f.frequency.value = fFreq; f.Q.value = q || 1;
    const g = ctx.createGain(); g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    s.connect(f); f.connect(g); g.connect(dest || music); s.start(t, Math.random() * 1.5); s.stop(t + dur + 0.03);
  }
  const kick = (t, v) => tone(t, 150, 0.18, "sine", v || 0.5, music, 45);
  const snare = (t, v) => noise(t, 0.12, v || 0.18, "bandpass", 1800, 0.8);
  const hat = (t, v) => noise(t, 0.04, v || 0.05, "highpass", 7000, 1);

  // ---------------- lagu ----------------
  // setiap lagu: bpm + fungsi per not 1/16 (i = indeks langkah, t = waktu, sd = durasi 1/16)
  const TRACKS = {
    // Lobi: santai & ceria (C – Am – F – G)
    lobby: {
      bpm: 96, play(i, t, sd) {
        const C = [[60, 64, 67], [57, 60, 64], [53, 57, 60], [55, 59, 62]][Math.floor(i / 16) % 4], s = i % 16;
        if (s === 0 || s === 8) tone(t, mtof(C[0] - 12), sd * 6, "triangle", 0.22);
        if (s === 6 || s === 14) tone(t, mtof(C[0] - 5), sd * 2, "triangle", 0.14);
        if (s % 2 === 0) tone(t, mtof(C[[0, 1, 2, 1][(s / 2) % 4]] + 12), sd * 1.6, "square", 0.035);
        const MEL = { 0: [76, 4], 4: [79, 4], 8: [81, 3], 12: [79, 4], 16: [76, 4], 20: [72, 4], 24: [74, 8], 32: [72, 4], 36: [74, 4], 40: [76, 4], 44: [77, 4], 48: [79, 8], 56: [74, 4], 60: [71, 4] };
        const m = MEL[i % 64]; if (m) tone(t, mtof(m[0]), sd * m[1] * 0.95, "triangle", 0.12);
        if (s % 4 === 2) hat(t, 0.025);
      }
    },
    // Papan skor: cepat & bersemangat (Am – F – C – G)
    board: {
      bpm: 132, play(i, t, sd) {
        const C = [[57, 60, 64], [53, 57, 60], [60, 64, 67], [55, 59, 62]][Math.floor(i / 16) % 4], s = i % 16;
        if (s % 4 === 0) kick(t, 0.55);
        if (s === 4 || s === 12) snare(t, 0.16);
        if (s % 2 === 1) hat(t, 0.04);
        if (s % 2 === 0) tone(t, mtof(C[0] - 24 + (s % 4 === 2 ? 12 : 0)), sd * 1.8, "square", 0.07);
        tone(t, mtof(C[[0, 1, 2, 1, 2, 0, 1, 2][s % 8]] + 12), sd * 0.9, "square", 0.03);
        const HOOK = { 0: 76, 3: 74, 6: 72, 8: 74, 10: 76, 14: 79 };
        if (Math.floor(i / 64) % 2 === 1 && HOOK[s] !== undefined) tone(t, mtof(HOOK[s] + (Math.floor(i / 16) % 4 === 3 ? 2 : 0)), sd * 2.2, "triangle", 0.12);
      }
    },
    // Juara (sebelum diumumkan): menegangkan, detak jantung pelan
    suspense: {
      bpm: 72, play(i, t, sd) {
        const C = [[50, 53, 57], [46, 50, 53], [43, 46, 50], [45, 49, 52]][Math.floor(i / 16) % 4], s = i % 16;
        if (s === 0) C.forEach(n => tone(t, mtof(n), sd * 15, "triangle", 0.06));
        if (s === 0 || s === 3) kick(t, s === 0 ? 0.45 : 0.3);
        if (s === 8) tone(t, mtof(C[2] + 12), sd * 6, "sine", 0.05);
      }
    },
    // Juara (setelah diumumkan): mars kemenangan
    victory: {
      bpm: 120, play(i, t, sd) {
        const C = [[60, 64, 67], [65, 69, 72], [67, 71, 74], [60, 64, 67]][Math.floor(i / 16) % 4], s = i % 16;
        if (s % 4 === 0) kick(t, 0.4);
        if (s === 4 || s === 12) snare(t, 0.12);
        if (s % 4 === 0) tone(t, mtof(C[0] - 12), sd * 3, "triangle", 0.2);
        if (s % 2 === 0) tone(t, mtof(C[[0, 1, 2, 1][(s / 2) % 4]] + 12), sd * 1.4, "square", 0.04);
        const MEL = { 0: [79, 3], 3: [79, 1], 4: [84, 6], 10: [83, 2], 12: [81, 4] };
        if (Math.floor(i / 16) % 2 === 0) { const m = MEL[s]; if (m) tone(t, mtof(m[0]), sd * m[1], "triangle", 0.12); }
      }
    }
  };

  function scheduler() {
    const tr = TRACKS[track];
    if (!tr || !on) return;
    const sd = 60 / tr.bpm / 4;
    while (nextTime < ctx.currentTime + 0.15) { tr.play(step, nextTime, sd); nextTime += sd; step++; }
  }
  function startLoop() { if (timer) return; nextTime = ctx.currentTime + 0.06; step = 0; timer = setInterval(scheduler, 25); }
  function stopLoop() { clearInterval(timer); timer = null; }

  // ---------------- efek suara ----------------
  function pop() { if (!on) return; const t = ctx.currentTime; tone(t, 880, 0.09, "square", 0.12, sfx, 1320); tone(t + 0.08, 1320, 0.12, "triangle", 0.12, sfx); }
  function ding() { if (!on) return; const t = ctx.currentTime; [72, 76, 79].forEach((n, k) => tone(t + k * 0.07, mtof(n + 12), 0.25, "triangle", 0.15, sfx)); }
  function crash(t) { noise(t, 1.6, 0.35, "highpass", 4000, 0.7, sfx); }
  function drumroll(sec) {
    if (!on) return; const t0 = ctx.currentTime, n = Math.floor(sec / 0.045);
    for (let k = 0; k < n; k++) { const p = k / n; noise(t0 + k * 0.045, 0.06, 0.04 + 0.22 * p * p, "bandpass", 1600 + 600 * p, 0.9, sfx); }
    for (let k = 0; k < 6; k++) tone(t0 + k * (sec / 6), 90 + k * 8, 0.2, "sine", 0.18, sfx);
  }
  function fanfare() {
    if (!on) return; const t = ctx.currentTime;
    [[67, 0, 0.12], [72, 0.13, 0.12], [76, 0.26, 0.12], [79, 0.39, 0.3], [76, 0.72, 0.14], [79, 0.88, 0.9]].forEach(([n, d, l]) => {
      tone(t + d, mtof(n + 12), l, "square", 0.09, sfx); tone(t + d, mtof(n), l, "triangle", 0.14, sfx);
    });
    [60, 64, 67, 72].forEach(n => tone(t + 0.88, mtof(n), 1.4, "triangle", 0.07, sfx));
    crash(t);
  }
  function applause(sec) {
    if (!on) return; sec = sec || 7; const t0 = ctx.currentTime;
    // dengung riuh penonton
    const s = ctx.createBufferSource(); s.buffer = noiseBuf; s.loop = true;
    const f = ctx.createBiquadFilter(); f.type = "bandpass"; f.frequency.value = 1400; f.Q.value = 0.6;
    const g = ctx.createGain(); g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(0.12, t0 + 0.6); g.gain.setValueAtTime(0.12, t0 + sec * 0.55); g.gain.exponentialRampToValueAtTime(0.0001, t0 + sec);
    s.connect(f); f.connect(g); g.connect(sfx); s.start(t0); s.stop(t0 + sec + 0.1);
    // tepukan tangan satu per satu
    const claps = Math.floor(sec * 55);
    for (let k = 0; k < claps; k++) {
      const p = Math.pow(Math.random(), 1.3), t = t0 + p * sec, env = p < 0.1 ? p / 0.1 : 1 - Math.max(0, (p - 0.55) / 0.45);
      noise(t, 0.025 + Math.random() * 0.035, (0.12 + Math.random() * 0.22) * env, "bandpass", 900 + Math.random() * 1800, 1.2, sfx);
    }
    // siulan penonton
    [0.5, 1.4, 2.6].forEach(d => { const tt = t0 + d + Math.random() * 0.3; tone(tt, 1500, 0.35, "sine", 0.05, sfx, 2600); tone(tt + 0.4, 2600, 0.3, "sine", 0.04, sfx, 1800); });
  }

  window.LDQ_SOUND = {
    isOn: () => on,
    toggle() {
      if (!ensure()) return false;
      on = !on;
      if (on) { ctx.resume(); master.gain.setTargetAtTime(1.7, ctx.currentTime, 0.05); startLoop(); }
      else { master.gain.setTargetAtTime(0, ctx.currentTime, 0.05); stopLoop(); }
      return on;
    },
    setTrack(name) {
      if (track === name) return; track = name;
      if (ctx && on) { music.gain.setValueAtTime(0, ctx.currentTime); music.gain.setTargetAtTime(MUSIC_VOL, ctx.currentTime + 0.05, 0.15); step = 0; nextTime = ctx.currentTime + 0.06; }
    },
    pop, ding, drumroll, fanfare, applause
  };
})();
