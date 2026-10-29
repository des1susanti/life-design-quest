// Logo Life Design Quest: jaringan neuron yang membentuk kompas.
// nnLogo(true)  -> versi beranimasi (pembuka game, ±5 detik)
// nnLogo(false) -> versi statis dengan node yang berdenyut pelan
(function () {
  const COLORS = ["#FF6B4A", "#FFC94D", "#2EC4B6", "#4D7CFE", "#9B5DE5"];
  const C = 150;
  function points() {
    const p = [[C, C]];
    for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2 - Math.PI / 2; p.push([C + Math.cos(a) * 62, C + Math.sin(a) * 62]); }
    for (let i = 0; i < 16; i++) { const a = i / 16 * Math.PI * 2 - Math.PI / 2 - Math.PI / 16; p.push([C + Math.cos(a) * 118, C + Math.sin(a) * 118]); }
    return p;
  }
  function edges() {
    const e = [];
    for (let i = 1; i <= 8; i++) {
      e.push([0, i, 0]);
      const o = 9 + 2 * (i - 1);
      e.push([i, o, 1]); e.push([i, 9 + ((o - 9 + 1) % 16), 1]); e.push([i, 9 + ((o - 9 + 15) % 16), 1]);
    }
    return e;
  }
  const f = n => Math.round(n * 10) / 10;
  window.nnLogo = function (anim, size) {
    const P = points(), E = edges();
    let lines = "", nodes = "";
    E.forEach(([a, b, layer], k) => {
      const len = Math.hypot(P[a][0] - P[b][0], P[a][1] - P[b][1]);
      const d = anim ? (layer === 0 ? 0.25 + k * 0.02 : 1.0 + k * 0.025) : 0;
      lines += `<line x1="${f(P[a][0])}" y1="${f(P[a][1])}" x2="${f(P[b][0])}" y2="${f(P[b][1])}" style="--len:${f(len)};--d:${d.toFixed(2)}s"/>`;
    });
    P.forEach((p, i) => {
      const r = i === 0 ? 0 : i < 9 ? 9 : 7;
      if (i === 0) return;
      const d = anim ? (i < 9 ? 0.3 + i * 0.07 : 1.05 + (i - 9) * 0.045) : 0;
      const pulse = ((i * 0.37) % 2.4).toFixed(2);
      nodes += `<g class="nd" style="--d:${d.toFixed(2)}s"><circle cx="${f(p[0])}" cy="${f(p[1])}" r="${r}" fill="${COLORS[i % 5]}" style="--p:${pulse}s"/></g>`;
    });
    const needle = `<g class="needle"><polygon points="${C},${C - 98} ${C + 17},${C} ${C - 17},${C}" fill="#FF6B4A"/><polygon points="${C},${C + 98} ${C + 17},${C} ${C - 17},${C}" fill="#E6E8F2"/></g>`;
    const hub = `<g class="nd hub" style="--d:${anim ? "0.05" : "0"}s"><circle cx="${C}" cy="${C}" r="13" fill="#141B34" stroke="#FFC94D" stroke-width="5"/></g>`;
    return `<svg class="nn${anim ? " anim" : ""}" viewBox="0 0 300 300" width="${size || 300}" height="${size || 300}" role="img" aria-label="Logo Life Design Quest: kompas dari jaringan neuron"><g class="ln">${lines}</g>${needle}${nodes}${hub}</svg>`;
  };
  window.NN_CSS = `
.nn line{stroke:#4A5280;stroke-width:1.6}
.nn .nd circle{animation:nnPulse 2.4s ease-in-out infinite;animation-delay:var(--p)}
.nn .hub circle{animation:none}
@keyframes nnPulse{0%,100%{opacity:1}50%{opacity:.45}}
.nn.anim line{stroke-dasharray:var(--len);stroke-dashoffset:var(--len);animation:nnDraw .5s ease-out forwards;animation-delay:var(--d)}
.nn.anim .nd{transform-box:fill-box;transform-origin:center;transform:scale(0);animation:nnPop .45s cubic-bezier(.3,1.6,.5,1) forwards;animation-delay:var(--d)}
.nn.anim .needle{transform-origin:150px 150px;opacity:0;animation:nnSwing 2.6s cubic-bezier(.25,.9,.3,1) 1.7s forwards}
@keyframes nnDraw{to{stroke-dashoffset:0}}
@keyframes nnPop{to{transform:scale(1)}}
@keyframes nnSwing{0%{opacity:0;transform:rotate(-160deg)}12%{opacity:1}35%{transform:rotate(55deg)}55%{transform:rotate(-28deg)}72%{transform:rotate(14deg)}86%{transform:rotate(-6deg)}100%{opacity:1;transform:rotate(0)}}
@media (prefers-reduced-motion:reduce){.nn.anim line,.nn.anim .nd,.nn.anim .needle{animation-duration:.01s!important;animation-delay:0s!important}}
`;
  const st = document.createElement("style"); st.textContent = window.NN_CSS; document.head.appendChild(st);
})();
