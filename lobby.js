// Lobi pixel ala ZEP untuk layar proyektor.
// startLobby(canvas, getPlayers) -> setiap pemain berjalan-jalan dengan nama di atas kepala.
// getPlayers() mengembalikan [{key, nama, char, levels}]
(function () {
  const LW = 320, LH = 180; // resolusi logis peta (pixel art)
  function rng(seed) { return () => (seed = (seed * 9301 + 49297) % 233280) / 233280; }

  function drawMap() {
    const cv = document.createElement("canvas"); cv.width = LW; cv.height = LH;
    const x = cv.getContext("2d"); const r = rng(42);
    const R = (a, b, w, h, c) => { x.fillStyle = c; x.fillRect(a, b, w, h); };
    // rumput
    R(0, 0, LW, LH, "#78C46A");
    for (let i = 0; i < 700; i++) { R(Math.floor(r() * LW), Math.floor(r() * LH), 1, 2, r() < .5 ? "#6AB25D" : "#88D279"); }
    // halaman & pagar belakang
    R(0, 0, LW, 74, "#D9E7F2"); R(0, 50, LW, 24, "#E9E2D0"); R(0, 72, LW, 2, "#C9B48A");
    // gedung 3 lantai
    const gx = 66, gw = 176;
    R(gx - 4, 4, gw + 8, 5, "#5B4B5E"); R(gx - 2, 2, gw + 4, 3, "#6E5D72");           // atap
    R(gx, 9, gw, 42, "#C3C9D3"); R(gx - 3, 29, gw + 6, 2, "#AEB5C1"); R(gx - 3, 49, gw + 6, 2, "#AEB5C1"); // dinding & lis
    const win = (wx, wy) => { R(wx, wy, 22, 15, "#2A3040"); for (let i = 0; i < 4; i++) for (let j = 0; j < 3; j++) R(wx + 1 + i * 5.25, wy + 1 + j * 4.6, 4, 3.6, (i + j) % 3 ? "#3D4558" : "#56607A"); R(wx + 2, wy + 5, 4, 3.6, "#E8EEF6"); };
    [0, 1, 2].forEach(i => { win(gx + 22 + i * 52, 12); win(gx + 22 + i * 52, 32); R(gx + 47 + i * 52, 14, 5, 3, "#F4F6FB"); R(gx + 47 + i * 52, 34, 5, 3, "#F4F6FB"); });
    // kolom kotak-kotak tosca
    for (let j = 0; j < 9; j++) for (let i = 0; i < 2; i++) R(gx + gw - 12 + i * 6, 9 + j * 5, 6, 5, (i + j) % 2 ? "#2EB3A0" : "#F4F6FB");
    // lantai dasar
    R(gx, 51, gw, 21, "#2B2F3A"); R(gx, 51, gw, 5, "#22806F");
    R(gx + 50, 52, 76, 5, "#F4F6FB");                                                   // papan nama
    [gx + 2, gx + 44, gx + 132, gx + 166].forEach(c => R(c, 56, 8, 16, "#1C1F27"));     // pilar
    R(gx + 70, 58, 36, 14, "#3E4A5C"); R(gx + 87, 58, 2, 14, "#2B2F3A"); R(gx + 72, 60, 32, 2, "#5D6B80"); // pintu kaca
    R(gx + 12, 60, 28, 10, "#3E4A5C"); R(gx + 136, 60, 26, 10, "#3E4A5C");
    // tugu logo
    R(gx + gw + 6, 38, 32, 4, "#3E7BD6"); R(gx + gw + 7, 36, 30, 2, "#5A93E6"); R(gx + gw + 8, 42, 28, 26, "#22806F"); R(gx + gw + 10, 43, 24, 22, "#FFFFFF"); R(gx + gw + 6, 68, 32, 4, "#1C6B5C");
    // (logo kampus digambar di atas panel putih saat render)
    // semak bunga depan gedung
    for (let i = 0; i < 9; i++) { const bx = gx - 2 + i * 22; R(bx, 70, 10, 5, "#3E8B47"); R(bx + 2, 69, 3, 2, "#E2574C"); R(bx + 6, 70, 2, 2, "#E2574C"); }
    // jalan
    R(0, 108, LW, 14, "#E8D3A3"); R(gx + 76, 74, 24, 34, "#E8D3A3");
    for (let i = 0; i < LW; i += 6) R(i, 114, 3, 1, "#D8BF88");
    // (area bawah: rumput & pohon)
    const P = (cx, cy, rr, col) => { for (let yy = -rr; yy <= rr; yy++) { const w = Math.round(Math.sqrt(rr * rr - yy * yy)); R(cx - w, cy + yy, w * 2, 1, col); } };
    // pohon
    const tree = (a, b) => { R(a + 5, b + 12, 4, 6, "#7A4E2D"); R(a, b + 2, 14, 11, "#3E9B4F"); R(a + 2, b, 10, 14, "#3E9B4F"); R(a + 3, b + 2, 4, 3, "#58B865"); };
    const tall = (a, b) => { R(a + 6, b + 10, 3, 34, "#8A6A4A"); R(a, b, 16, 12, "#4E9E52"); R(a + 3, b - 4, 10, 6, "#5DB262"); R(a + 2, b + 2, 4, 3, "#70C673"); };
    tall(14, 22); tall(40, 34);
    [[6, 84], [292, 80], [300, 96], [24, 132], [58, 142], [110, 156], [250, 84], [262, 146], [284, 128]].forEach(t => tree(t[0], t[1]));
    // bunga
    for (let i = 0; i < 40; i++) { const a = Math.floor(r() * LW), b = 78 + Math.floor(r() * 98); if ((b > 104 && b < 124)) continue; R(a, b, 2, 2, ["#FFC94D", "#FF6B4A", "#FFFFFF", "#9B5DE5"][i % 4]); }
    return cv;
  }

  window.startLobby = function (canvas, getPlayers) {
    const C = window.LDQ_CHARS; const map = drawMap(); const ctx = canvas.getContext("2d");
    const walkers = {}; let visH = LH; const gxL = 66 + 176;
    const campusImg = new Image(); campusImg.src = "kampus.png";
    function fit() { const w = canvas.clientWidth, h = canvas.clientHeight; if (canvas.width !== w * devicePixelRatio) { canvas.width = w * devicePixelRatio; canvas.height = h * devicePixelRatio; } }
    function sync() {
      const list = getPlayers() || [];
      list.forEach(p => {
        let w = walkers[p.key];
        if (!w) { w = walkers[p.key] = { x: 148 + Math.random() * 12, y: 76, tx: 0, ty: 0, wait: 0, t: Math.random() * 100, born: performance.now(), dir: 1 }; pick(w); }
        Object.assign(w, { nama: p.nama, char: p.char, levels: p.levels });
      });
    }
    function pick(w) { w.tx = 10 + Math.random() * (LW - 30); w.ty = 82 + Math.random() * Math.max(10, visH - 90);  w.wait = 0; }
    let last = performance.now(), frameT = 0;
    function loop(now) {
      const dt = Math.min(50, now - last); last = now; frameT += dt;
      fit(); sync();
      const S = canvas.width / LW, Sy = canvas.height / LH, s = Math.max(S, Sy);
      const ox = (canvas.width - LW * s) / 2, oy = 0; visH = Math.min(LH, canvas.height / s);
      ctx.imageSmoothingEnabled = false; ctx.fillStyle = "#141B34"; ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(map, ox, oy, LW * s, LH * s);
      ctx.imageSmoothingEnabled = true;
      if (campusImg.complete && campusImg.naturalWidth) ctx.drawImage(campusImg, ox + (gxL + 11) * s, oy + 44 * s, 22 * s, 20 * s);
      ctx.imageSmoothingEnabled = false;
      // teks papan
      ctx.fillStyle = "#141B34"; ctx.font = `800 ${Math.round(3.6 * s)}px "Plus Jakarta Sans",sans-serif`; ctx.textAlign = "center";
      ctx.font = `800 ${Math.round(2.9 * s)}px "Plus Jakarta Sans",sans-serif`;
      ctx.fillText("PERGURUAN TINGGI AL-MADANI", ox + 154 * s, oy + 56.2 * s);
      ctx.font = `800 ${Math.round(2.4 * s)}px "Plus Jakarta Sans",sans-serif`;
      const arr = Object.values(walkers).sort((a, b) => a.y - b.y);
      const nP = Object.keys(walkers).length, cs = Math.max(1, Math.round(s * 0.75 * (nP > 60 ? 0.6 : nP > 30 ? 0.8 : 1))); // skala karakter mengecil bila peserta banyak
      arr.forEach(w => {
        if (w.wait > 0) w.wait -= dt;
        else {
          const dx = w.tx - w.x, dy = w.ty - w.y, d = Math.hypot(dx, dy), sp = 0.012 * dt;
          if (d < 1) { w.wait = 800 + Math.random() * 3500; pick(w); w.wait = 1200 + Math.random() * 3000; }
          else { w.x += dx / d * Math.min(sp, d); w.y += dy / d * Math.min(sp, d); w.dir = dx < 0 ? -1 : 1; }
        }
        const moving = w.wait <= 0, fr = moving ? [1, 0, 2, 0][Math.floor((frameT + w.t * 50) / 160) % 4] : (w.levels >= 6 && Math.floor(frameT / 400) % 2 ? 3 : 0);
        const sp = C.canvasFor(w.char || "m1", fr, cs);
        const px = ox + w.x * s - sp.width / 2, py = oy + w.y * s - sp.height;
        const born = Math.min(1, (now - w.born) / 600);
        ctx.globalAlpha = born;
        // bayangan
        ctx.fillStyle = "rgba(0,0,0,.18)"; ctx.beginPath(); ctx.ellipse(ox + w.x * s, oy + w.y * s, sp.width * .32, sp.width * .1, 0, 0, 7); ctx.fill();
        ctx.save(); if (w.dir < 0) { ctx.translate(px + sp.width, py); ctx.scale(-1, 1); ctx.drawImage(sp, 0, 0); } else ctx.drawImage(sp, px, py); ctx.restore();
        // label nama
        const label = w.nama, crowd = arr.length > 60 ? 0.8 : arr.length > 30 ? 0.9 : 1, fs = Math.max(10, Math.round(s * 3.1 * crowd));
        ctx.font = `700 ${fs}px "Plus Jakarta Sans",sans-serif`;
        const tw = ctx.measureText(label).width, bx = ox + w.x * s, byy = py - fs * 0.6;
        ctx.fillStyle = "rgba(20,27,52,.78)"; ctx.fillRect(bx - tw / 2 - fs * .45, byy - fs * .95, tw + fs * .9, fs * 1.35);
        ctx.fillStyle = "#FFFFFF"; ctx.textAlign = "center"; ctx.fillText(label, bx, byy);
        if (w.levels) { const t = w.levels >= 6 ? "★" : "Lv" + w.levels; const f2 = Math.round(fs * .78); ctx.font = `800 ${f2}px "Plus Jakarta Sans",sans-serif`; const t2 = ctx.measureText(t).width;
          ctx.fillStyle = w.levels >= 6 ? "#FFC94D" : "#2EC4B6"; ctx.fillRect(bx + tw / 2 + fs * .5, byy - fs * .9, t2 + f2 * .7, fs * 1.25); ctx.fillStyle = "#141B34"; ctx.fillText(t, bx + tw / 2 + fs * .5 + (t2 + f2 * .7) / 2, byy - fs * .05); }
        ctx.globalAlpha = 1;
      });
      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
  };
})();
