// Karakter pixel Life Design Quest: 5 laki-laki, 5 perempuan (3 berhijab).
// Semua digambar dengan kode (tanpa file gambar), 16 x 24 pixel.
(function () {
  const W = 16, H = 24, OUT = "#1B1F33";
  const CHARS = [
    { id: "m1", g: "L", label: "Lurus",       skin: "#F1C27D", hair: "straight", hc: "#1E1A1A", shirt: "#4D7CFE", pants: "#2A3157", shoe: "#3B2A20" },
    { id: "m2", g: "L", label: "Keriting",    skin: "#B9773E", hair: "curly",    hc: "#2B1B12", shirt: "#2EC4B6", pants: "#3A2E2A", shoe: "#1E1A1A" },
    { id: "m3", g: "L", label: "Jabrik",      skin: "#E0AC69", hair: "spiky",    hc: "#4A2E1E", shirt: "#FF6B4A", pants: "#232B52", shoe: "#F4F6FB" },
    { id: "m4", g: "L", label: "Klimis",      skin: "#F3CFA0", hair: "sidepart", hc: "#141414", shirt: "#F4F6FB", pants: "#2A3157", shoe: "#1E1A1A", glasses: 1, tie: "#FF6B4A" },
    { id: "m5", g: "L", label: "Bertopi",     skin: "#8D5524", hair: "cap",      hc: "#FFC94D", shirt: "#9B5DE5", pants: "#3A2E2A", shoe: "#F4F6FB" },
    { id: "f1", g: "P", label: "Hijab pink",  skin: "#F1C27D", hair: "hijab",    hc: "#F28FAD", shirt: "#FFFFFF", pants: "#E85D75", shoe: "#3B2A20", skirt: 1 },
    { id: "f2", g: "P", label: "Hijab navy",  skin: "#E0AC69", hair: "hijab",    hc: "#2A3157", shirt: "#FFC94D", pants: "#2A3157", shoe: "#1E1A1A", skirt: 1 },
    { id: "f3", g: "P", label: "Hijab tosca", skin: "#C68642", hair: "hijab",    hc: "#2EC4B6", shirt: "#4D7CFE", pants: "#232B52", shoe: "#F4F6FB", glasses: 1 },
    { id: "f4", g: "P", label: "Rambut panjang", skin: "#F3CFA0", hair: "long",  hc: "#3B2418", shirt: "#9B5DE5", pants: "#232B52", shoe: "#1E1A1A", skirt: 1 },
    { id: "f5", g: "P", label: "Kuncir keriting", skin: "#A86B3C", hair: "pony", hc: "#1E1410", shirt: "#FF6B4A", pants: "#2A3157", shoe: "#F4F6FB" },
  ];

  function shade(hex, f) {
    const n = parseInt(hex.slice(1), 16);
    const c = [n >> 16, (n >> 8) & 255, n & 255].map(v => Math.max(0, Math.min(255, Math.round(f < 0 ? v * (1 + f) : v + (255 - v) * f))));
    return "#" + c.map(v => v.toString(16).padStart(2, "0")).join("");
  }

  // frame: 0 = diam, 1 = langkah kiri, 2 = langkah kanan, 3 = lompat/senang
  function sprite(c, frame) {
    const m = Array.from({ length: H }, () => Array(W).fill(null));
    const px = (x, y, col) => { if (x >= 0 && x < W && y >= 0 && y < H && col) m[y][x] = col; };
    const rect = (x, y, w, h, col) => { for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) px(x + i, y + j, col); };
    const hs = shade(c.hc, -0.3), hl = shade(c.hc, 0.25), sk = c.skin, skd = shade(c.skin, -0.15);
    const bob = frame === 1 || frame === 2 ? 1 : 0, up = frame === 3 ? -1 : 0, dy = bob + up;

    // rambut belakang (panjang)
    if (c.hair === "long") { rect(3, 4 + dy, 10, 11, c.hc); rect(3, 4 + dy, 1, 11, hs); rect(12, 4 + dy, 1, 11, hs); }
    if (c.hair === "pony") { rect(12, 3 + dy, 3, 3, c.hc); rect(13, 6 + dy, 2, 4, c.hc); px(14, 9 + dy, hs); }

    // kaki
    const legY = 18 + up;
    const L = frame === 1 ? -1 : 0, R = frame === 2 ? -1 : 0;
    if (c.skirt) {
      rect(6, legY + 1 + L, 2, 3 - L, sk); rect(9, legY + 1 + R, 2, 3 - R, sk);
    } else {
      rect(5, legY + L, 3, 4 - L, c.pants); rect(9, legY + R, 3, 4 - R, c.pants);
    }
    rect(5, 22 + up + L, 3, 2, c.shoe); rect(9, 22 + up + R, 3, 2, c.shoe);

    // badan
    const by = 12 + dy;
    rect(4, by, 8, 6, c.shirt); rect(4, by + 5, 8, 1, shade(c.shirt, -0.2));
    if (c.skirt) { rect(3, by + 5, 10, 3, c.pants); rect(3, by + 7, 10, 1, shade(c.pants, -0.2)); }
    else rect(5, by + 6, 6, 1, c.pants);
    if (c.tie) { rect(7, by, 2, 4, c.tie); px(7, by + 4, c.tie); }
    // lengan
    const armUp = frame === 3;
    if (armUp) { rect(2, by - 3, 2, 4, c.shirt); rect(12, by - 3, 2, 4, c.shirt); rect(2, by - 4, 2, 1, sk); rect(12, by - 4, 2, 1, sk); }
    else {
      const aL = frame === 1 ? 1 : 0, aR = frame === 2 ? 1 : 0;
      rect(2, by + aR, 2, 4, c.shirt); rect(12, by + aL, 2, 4, c.shirt);
      rect(2, by + 4 + aR, 2, 1, sk); rect(12, by + 4 + aL, 2, 1, sk);
    }

    // kepala
    const hy = 2 + dy;
    rect(4, hy + 1, 8, 8, sk); rect(5, hy, 6, 1, sk); rect(5, hy + 9, 6, 1, sk); rect(3, hy + 4, 1, 3, sk); rect(12, hy + 4, 1, 3, sk);
    rect(4, hy + 8, 8, 1, skd);
    // mata, pipi, mulut
    const eye = "#1B1F33";
    rect(6, hy + 5, 1, 2, eye); rect(9, hy + 5, 1, 2, eye);
    px(5, hy + 7, shade(sk, -0.08)); px(10, hy + 7, shade(sk, -0.08));
    if (frame === 3) { rect(7, hy + 7, 2, 1, "#8A3B2E"); } else { px(7, hy + 8, shade(sk, -0.3)); px(8, hy + 8, shade(sk, -0.3)); }
    if (c.glasses) {
      const g = "#1B1F33", lens = "#DCEBFF";
      [4, 8].forEach(x0 => { rect(x0, hy + 4, 4, 1, g); rect(x0, hy + 7, 4, 1, g); px(x0, hy + 5, g); px(x0, hy + 6, g); px(x0 + 3, hy + 5, g); px(x0 + 3, hy + 6, g); rect(x0 + 1, hy + 5, 2, 2, lens); });
      rect(6, hy + 5, 1, 2, eye); rect(9, hy + 5, 1, 2, eye);
    }

    // rambut / hijab
    switch (c.hair) {
      case "straight":
        rect(4, hy - 1, 8, 3, c.hc); rect(3, hy, 1, 5, c.hc); rect(12, hy, 1, 5, c.hc); rect(5, hy + 2, 4, 1, c.hc); px(4, hy + 3, c.hc); rect(5, hy - 1, 4, 1, hl); break;
      case "curly":
        for (let i = 0; i < 6; i++) { const x = 2 + i * 2; rect(x, hy - 2 + (i % 2), 3, 3, c.hc); px(x + 1, hy - 1 + (i % 2), hl); }
        rect(2, hy, 2, 5, c.hc); rect(12, hy, 2, 5, c.hc); rect(4, hy + 1, 8, 2, c.hc); px(3, hy + 2, hl); px(12, hy + 3, hl); break;
      case "spiky":
        rect(4, hy, 8, 2, c.hc); rect(3, hy + 1, 1, 4, c.hc); rect(12, hy + 1, 1, 4, c.hc);
        [[4, -2], [6, -3], [8, -2], [10, -3], [11, -1]].forEach(([x, y]) => { rect(x, hy + y, 2, -y, c.hc); });
        rect(5, hy + 2, 2, 1, c.hc); rect(9, hy + 2, 2, 1, c.hc); px(7, hy - 2, hl); break;
      case "sidepart":
        rect(4, hy - 1, 8, 2, c.hc); rect(3, hy, 1, 4, c.hc); rect(12, hy, 1, 4, c.hc); rect(7, hy + 1, 5, 2, c.hc); rect(4, hy + 1, 2, 1, c.hc); px(6, hy - 1, hl); px(9, hy, hl); break;
      case "cap":
        rect(4, hy - 1, 8, 3, c.hc); rect(3, hy + 1, 11, 1, c.hc); rect(11, hy + 2, 3, 1, shade(c.hc, -0.2)); rect(5, hy - 1, 3, 1, hl); px(8, hy, "#FFFFFF");
        rect(3, hy + 2, 1, 3, "#1E1A1A"); break;
      case "long":
        rect(4, hy - 1, 8, 3, c.hc); rect(3, hy, 1, 9, c.hc); rect(12, hy, 1, 9, c.hc); rect(8, hy + 2, 3, 1, c.hc); px(4, hy + 2, c.hc); rect(6, hy - 1, 3, 1, hl); break;
      case "pony":
        for (let i = 0; i < 5; i++) { rect(3 + i * 2, hy - 1 - (i % 2), 2, 2, c.hc); }
        rect(3, hy, 10, 2, c.hc); rect(3, hy + 2, 1, 4, c.hc); rect(12, hy + 2, 1, 3, c.hc); px(5, hy - 1, hl); px(9, hy - 2, hl); break;
      case "hijab": {
        const hc = c.hc;
        rect(3, hy - 1, 10, 3, hc); rect(2, hy + 1, 2, 9, hc); rect(12, hy + 1, 2, 9, hc); rect(4, hy + 2, 1, 1, hc); rect(11, hy + 2, 1, 1, hc);
        rect(3, hy + 9, 10, 2, hc); rect(2, by, 12, 3, hc); rect(4, by + 3, 8, 1, hc); rect(5, by + 4, 6, 1, shade(hc, -0.15));
        rect(4, hy - 1, 4, 1, hl); px(2, hy + 3, hs); px(13, hy + 3, hs);
        rect(4, hy + 2, 8, 1, shade(hc, 0.4));
        break;
      }
    }

    // garis luar
    const o = m.map(r => r.slice());
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      if (m[y][x]) continue;
      if ((m[y - 1] && m[y - 1][x]) || (m[y + 1] && m[y + 1][x]) || m[y][x - 1] || m[y][x + 1]) o[y][x] = OUT;
    }
    return o;
  }

  const cache = {};
  function canvasFor(id, frame, scale) {
    const key = id + frame + "_" + scale;
    if (cache[key]) return cache[key];
    const c = CHARS.find(x => x.id === id) || CHARS[0];
    const m = sprite(c, frame);
    const cv = document.createElement("canvas"); cv.width = W * scale; cv.height = H * scale;
    const x = cv.getContext("2d");
    for (let j = 0; j < H; j++) for (let i = 0; i < W; i++) if (m[j][i]) { x.fillStyle = m[j][i]; x.fillRect(i * scale, j * scale, scale, scale); }
    return (cache[key] = cv);
  }
  function dataURL(id, frame, scale) { return canvasFor(id, frame || 0, scale || 6).toDataURL("image/png"); }

  // <canvas> yang beranimasi sendiri. mode: "idle" | "walk" | "happy" | "sad"
  function animated(id, scale, mode) {
    const cv = document.createElement("canvas"); cv.width = W * scale; cv.height = (H + 2) * scale;
    cv.className = "char-cv"; const x = cv.getContext("2d"); x.imageSmoothingEnabled = false;
    let t = 0, m = mode || "idle";
    const tick = () => {
      if (!cv.isConnected && t > 2) return;
      let f = 0, dx = 0, dy = 2 * scale;
      if (m === "walk") f = [1, 0, 2, 0][t % 4];
      else if (m === "happy") { f = t % 2 ? 3 : 0; dy = t % 2 ? 0 : 2 * scale; }
      else if (m === "sad") { f = 0; dx = (t % 2 ? 1 : -1) * scale; }
      else { f = 0; dy = (t % 4 < 2 ? 2 : 1) * scale; }
      x.clearRect(0, 0, cv.width, cv.height);
      x.drawImage(canvasFor(id, f, scale), dx, dy);
      t++; setTimeout(tick, m === "idle" ? 380 : 180);
    };
    tick();
    cv.setMode = v => { m = v; };
    return cv;
  }

  window.LDQ_CHARS = { CHARS, W, H, sprite, canvasFor, dataURL, animated };
})();
