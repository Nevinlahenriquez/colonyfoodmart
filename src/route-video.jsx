const { useComposition, animate, Easing, clamp, Shot, Captions } = window;

const C = {
  sea: "#7FD7D0", deepSea: "#3FB8B0", sand: "#F3E3BE", land: "#EFEDE2",
  road: "#0B3B39", roadIn: "#F7F7F2", ink: "#0B3B39", sun: "#FFD400", teal: "#12B3A5"
};

const MOTION = {
  enter: (a) => animate({ ...a, ease: Easing.easeOutCubic }),
  draw: (a) => animate({ ...a, ease: Easing.easeInOutCubic }),
  pop: (a) => animate({ ...a, ease: Easing.easeOutBack })
};

const CTRL = [
  [560, -80], [556, 240], [534, 520], [546, 760], [520, 980], [498, 1120],
  [470, 1200], [570, 1222], [760, 1232], [980, 1244], [1120, 1252]
];

function catmull(pts, perSeg) {
  const P = [pts[0], ...pts, pts[pts.length - 1]], out = [];
  for (let i = 1; i < P.length - 2; i++) {
    for (let j = 0; j < perSeg; j++) {
      const t = j / perSeg, t2 = t * t, t3 = t2 * t;
      const [p0, p1, p2, p3] = [P[i - 1], P[i], P[i + 1], P[i + 2]];
      out.push([
        0.5 * (2 * p1[0] + (-p0[0] + p2[0]) * t + (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2 + (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t3),
        0.5 * (2 * p1[1] + (-p0[1] + p2[1]) * t + (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 + (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3)
      ]);
    }
  }
  out.push(pts[pts.length - 1]);
  return out;
}

const ROUTE = catmull(CTRL, 16);
const CUM = (() => {
  const c = [0];
  for (let i = 1; i < ROUTE.length; i++) {
    const dx = ROUTE[i][0] - ROUTE[i - 1][0], dy = ROUTE[i][1] - ROUTE[i - 1][1];
    c.push(c[i - 1] + Math.hypot(dx, dy));
  }
  return c;
})();
const TOTAL = CUM[CUM.length - 1];

function at(u) {
  const d = clamp(u, 0, 1) * TOTAL;
  let i = 1;
  while (i < CUM.length - 1 && CUM[i] < d) i++;
  const t = (d - CUM[i - 1]) / Math.max(CUM[i] - CUM[i - 1], 0.0001);
  const [x0, y0] = ROUTE[i - 1], [x1, y1] = ROUTE[i];
  return { x: x0 + (x1 - x0) * t, y: y0 + (y1 - y0) * t, a: Math.atan2(y1 - y0, x1 - x0) * 180 / Math.PI, i };
}

function toPath(pts) {
  return pts.map((p, i) => (i ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1)).join(" ");
}
const FULL = toPath(ROUTE);

function trailPath(u) {
  const p = at(u);
  return toPath(ROUTE.slice(0, p.i)) + " L" + p.x.toFixed(1) + " " + p.y.toFixed(1);
}

function RouteVideo() {
  const { T, CUES, authoredTotal } = useComposition();

  const u = MOTION.draw({ from: 0, to: 0.545, start: CUES.Road + 0.3, end: CUES.Turn - 0.2 })(T)
    + MOTION.draw({ from: 0, to: 0.27, start: CUES.Turn + 0.5, end: CUES.Arrive - 0.3 })(T)
    + MOTION.draw({ from: 0, to: 0.185, start: CUES.Arrive + 0.2, end: CUES.Arrive + 2.2 })(T);
  const car = at(u);

  const zoom = MOTION.draw({ from: 0.62, to: 0.74, start: CUES.Road, end: CUES.Turn })(T)
    + MOTION.draw({ from: 0, to: 0.34, start: CUES.Turn + 0.2, end: CUES.Turn + 2.4 })(T)
    - MOTION.draw({ from: 0, to: 0.52, start: CUES.Arrive, end: CUES.Arrive + 2.4 })(T)
    - MOTION.draw({ from: 0, to: 0.4, start: CUES.Close - 0.8, end: CUES.Close + 1.2 })(T);
  const shiftX = MOTION.draw({ from: 0, to: 20, start: CUES.Arrive - 0.4, end: CUES.Arrive + 2.2 })(T);
  const shiftY = MOTION.draw({ from: 0, to: -250, start: CUES.Arrive - 0.4, end: CUES.Arrive + 2.2 })(T);

  const fx = MOTION.draw({ from: 540, to: car.x, start: CUES.Road, end: CUES.Road + 0.8 })(T) || car.x;
  const focusY = MOTION.draw({ from: 300, to: 1, start: CUES.Opening, end: CUES.Road + 1 })(T);
  const camX = 540 + (car.x - 540) * clamp((T - CUES.Road) / 1.2, 0, 1) + shiftX;
  const camY = car.y + 90 - focusY + shiftY;

  const mapFade = MOTION.enter({ from: 0.6, to: 1, start: CUES.Opening, end: CUES.Opening + 1.0 })(T)
    - MOTION.enter({ from: 0, to: 0.82, start: CUES.Close - 0.4, end: CUES.Close + 0.9 })(T);

  const titleIn = MOTION.enter({ from: 0.7, to: 1, start: CUES.Opening, end: CUES.Opening + 0.6 })(T)
    - MOTION.enter({ from: 0, to: 1, start: CUES.Road - 0.5, end: CUES.Road + 0.2 })(T);
  const titleY = MOTION.enter({ from: 18, to: 0, start: CUES.Opening, end: CUES.Opening + 1.0 })(T);

  const cross1 = MOTION.pop({ from: 0, to: 1, start: CUES.Road + 1.6, end: CUES.Road + 2.4 })(T)
    - MOTION.enter({ from: 0, to: 1, start: CUES.Turn + 1.2, end: CUES.Turn + 2.0 })(T);
  const bumpPop = MOTION.pop({ from: 0, to: 1, start: CUES.Turn + 0.15, end: CUES.Turn + 0.9 })(T)
    - MOTION.enter({ from: 0, to: 1, start: CUES.Arrive + 0.6, end: CUES.Arrive + 1.2 })(T);
  const straightPop = MOTION.pop({ from: 0, to: 1, start: CUES.Arrive + 0.1, end: CUES.Arrive + 0.9 })(T);
  const pinPop = MOTION.pop({ from: 0, to: 1, start: CUES.Arrive + 0.5, end: CUES.Arrive + 1.4 })(T);
  const signPop = MOTION.pop({ from: 0, to: 1, start: CUES.Arrive + 1.0, end: CUES.Arrive + 1.9 })(T);

  const closeIn = MOTION.enter({ from: 0, to: 1, start: CUES.Close + 0.1, end: CUES.Close + 1.0 })(T);
  const closeY = MOTION.enter({ from: 40, to: 0, start: CUES.Close + 0.1, end: CUES.Close + 1.1 })(T);
  const closeOut = 0;
  const drift = Math.sin(T * 0.55) * 8;

  const s = 1 + zoom;

  return (
    <div style={{ position: "absolute", inset: 0, background: "#0B3B39", overflow: "hidden", fontFamily: "Outfit, system-ui, sans-serif" }}>
      <svg viewBox="0 0 1080 1920" width="1080" height="1920" style={{ position: "absolute", inset: 0, opacity: mapFade }}>
        <g transform={`translate(540,960) scale(${s}) translate(${-camX},${-camY - drift})`}>
          <rect x="-900" y="-900" width="2900" height="3900" fill={C.sea} />
          <g transform="translate(0,300)">
            <path d="M-900,1520 Q 200,1400 1980,1560 L1980,3000 L-900,3000 Z" fill={C.deepSea} opacity="0.55" />
            <path d="M-900,-900 L1980,-900 L1980,1470 Q 900,1330 300,1470 Q -300,1600 -900,1500 Z" fill={C.land} />
            <path d="M-900,1450 Q -200,1560 320,1440 Q 900,1310 1980,1450 L1980,1620 Q 900,1470 320,1600 Q -200,1720 -900,1620 Z" fill={C.sand} />
            {[0, 1, 2, 3, 4].map((k) => (
              <path key={k}
                d={`M-900,${1700 + k * 105} Q -300,${1660 + k * 105} 300,${1710 + k * 105} T 1980,${1690 + k * 105}`}
                fill="none" stroke="#FFFFFF" strokeWidth="9" strokeLinecap="round"
                strokeDasharray="70 130"
                strokeDashoffset={(T * (26 + k * 9) + k * 55) % 200}
                opacity={0.32 - k * 0.03} />
            ))}
          </g>

          <path d={FULL} fill="none" stroke={C.road} strokeWidth="64" strokeLinecap="round" strokeLinejoin="round" />
          <path d={FULL} fill="none" stroke={C.roadIn} strokeWidth="50" strokeLinecap="round" strokeLinejoin="round" />
          <path d={FULL} fill="none" stroke="#C9D4D2" strokeWidth="3" strokeDasharray="22 26" strokeLinecap="round" />
          <path d="M470,1200 L470,1660" stroke={C.road} strokeWidth="58" strokeLinecap="round" />
          <path d="M470,1200 L470,1660" stroke={C.roadIn} strokeWidth="44" strokeLinecap="round" />
          <path d="M700,1222 L1460,1266" stroke={C.road} strokeWidth="58" strokeLinecap="round" />
          <path d="M700,1222 L1460,1266" stroke={C.roadIn} strokeWidth="44" strokeLinecap="round" />
          <path d="M880,940 L892,1560" stroke={C.road} strokeWidth="54" strokeLinecap="round" />
          <path d="M880,940 L892,1560" stroke={C.roadIn} strokeWidth="40" strokeLinecap="round" />
          <path d="M250,742 L860,776" stroke={C.road} strokeWidth="54" strokeLinecap="round" />
          <path d="M700,1222 L1460,1266" stroke={C.road} strokeWidth="58" strokeLinecap="round" />
          <path d="M700,1222 L1460,1266" stroke={C.roadIn} strokeWidth="44" strokeLinecap="round" />
          <path d="M880,940 L892,1560" stroke={C.road} strokeWidth="54" strokeLinecap="round" />
          <path d="M880,940 L892,1560" stroke={C.roadIn} strokeWidth="40" strokeLinecap="round" />
          <path d="M250,742 L860,776" stroke={C.roadIn} strokeWidth="40" strokeLinecap="round" />

          <path d={trailPath(u)} fill="none" stroke={C.sun} strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" opacity="0.95" />

          <g opacity={clamp(cross1, 0, 1)} transform={`translate(546,760) scale(${0.7 + 0.3 * clamp(cross1, 0, 1)})`}>
            <circle cx="0" cy="-130" r="44" fill="#FFFFFF" stroke={C.ink} strokeWidth="8" />
            <text x="0" y="-113" textAnchor="middle" fontFamily="Outfit, sans-serif" fontWeight="800" fontSize="50" fill={C.ink}>1</text>
          </g>
          <g opacity={clamp(bumpPop, 0, 1)} transform={`translate(470,1222) scale(${0.7 + 0.3 * clamp(bumpPop, 0, 1)})`}>
            <circle cx="-150" cy="-70" r="46" fill={C.sun} stroke={C.ink} strokeWidth="8" />
            <text x="-150" y="-52" textAnchor="middle" fontFamily="Outfit, sans-serif" fontWeight="800" fontSize="52" fill={C.ink}>2</text>
          </g>
          <g opacity={clamp(straightPop, 0, 1)} transform={`translate(886,1240) scale(${0.75 + 0.25 * clamp(straightPop, 0, 1)})`}>
            <circle cx="0" cy="-210" r="52" fill="#FFFFFF" stroke={C.ink} strokeWidth="8" />
            <path d="M-24,-210 L22,-210 M4,-230 L26,-210 L4,-190" fill="none" stroke={C.ink} strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
          </g>
          <g transform={`translate(470,1222) scale(${0.6 + 0.4 * clamp(bumpPop, 0, 1)})`} opacity={clamp(bumpPop, 0, 1)}>
            <rect x="-34" y="-30" width="68" height="60" rx="8" fill="#0B3B39" opacity="0.12" />
            <rect x="-34" y="-30" width="17" height="60" fill="#FFFFFF" />
            <rect x="-17" y="-30" width="17" height="60" fill="#E4572E" />
            <rect x="0" y="-30" width="17" height="60" fill="#FFFFFF" />
            <rect x="17" y="-30" width="17" height="60" fill="#E4572E" />
          </g>

          <g transform={`translate(1140,900) scale(${0.85 + 0.15 * clamp(pinPop, 0, 1)})`} opacity={clamp(pinPop, 0, 1)}>
            <rect x="-96" y="-8" width="200" height="132" rx="14" fill="#FFFFFF" stroke={C.ink} strokeWidth="6" />
            <rect x="-96" y="-8" width="200" height="34" rx="14" fill={C.teal} />
            <rect x="-70" y="44" width="60" height="60" rx="6" fill={C.sand} />
            <rect x="10" y="44" width="66" height="60" rx="6" fill={C.sand} />
          </g>

          <g transform={`translate(1140,1160) scale(${clamp(signPop, 0, 1)})`} style={{ transformOrigin: "1140px 1160px" }} opacity={clamp(signPop, 0, 1)}>
            <rect x="-8" y="0" width="16" height="72" fill={C.ink} />
            <rect x="-150" y="-104" width="300" height="112" rx="16" fill={C.sun} stroke={C.ink} strokeWidth="7" />
            <text x="0" y="-58" textAnchor="middle" fontFamily="Outfit, sans-serif" fontWeight="800" fontSize="40" fill={C.ink}>COLONY</text>
            <text x="0" y="-18" textAnchor="middle" fontFamily="Outfit, sans-serif" fontWeight="700" fontSize="28" fill={C.ink}>FOOD MARKET</text>
          </g>

          <text x="760" y="2010" textAnchor="middle" fontFamily="Karla, sans-serif" fontWeight="700" fontSize="42" fill="#0B3B39" opacity="0.5">Baby Beach</text>
          <text x="250" y="1970" textAnchor="middle" fontFamily="Karla, sans-serif" fontWeight="700" fontSize="38" fill="#0B3B39" opacity="0.45">Rodgers Beach</text>
          <g opacity={clamp(MOTION.enter({ from: 0, to: 1, start: CUES.Opening, end: CUES.Opening + 0.8 })(T), 0, 1)}>
            <circle cx="558" cy="140" r="22" fill="#FFFFFF" stroke={C.ink} strokeWidth="8" />
            <text x="558" y="214" textAnchor="middle" fontFamily="Outfit, sans-serif" fontWeight="800" fontSize="44" fill="#0B3B39" stroke="#F3F0E6" strokeWidth="12" strokeLinejoin="round" paintOrder="stroke" opacity="0.85">Blue Anchor</text>
          </g>

          <g transform={`translate(${car.x},${car.y}) rotate(${car.a + 90})`}>
            <ellipse cx="0" cy="14" rx="26" ry="16" fill="#0B3B39" opacity="0.18" />
            <rect x="-24" y="-40" width="48" height="80" rx="16" fill="#E4572E" stroke={C.ink} strokeWidth="5" />
            <rect x="-16" y="-28" width="32" height="24" rx="7" fill="#DDF6F3" />
            <rect x="-16" y="8" width="32" height="18" rx="6" fill="#B3352088" />
          </g>
        </g>
      </svg>

      <div style={{ position: "absolute", right: -160, top: -140, width: 620, height: 620, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,212,0,0.45) 0%, rgba(255,212,0,0.12) 45%, rgba(255,212,0,0) 72%)", opacity: 0.85 + 0.15 * Math.sin(T * 0.7), pointerEvents: "none" }} />

      <Shot from={0} to={CUES.Road + 0.3}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,rgba(11,59,57,0.82) 0%,rgba(11,59,57,0.45) 55%,rgba(11,59,57,0.1) 100%)", opacity: clamp(titleIn, 0, 1) }} />
        <div style={{ position: "absolute", left: 0, right: 0, top: 380, textAlign: "center", opacity: clamp(titleIn, 0, 1), transform: `translateY(${titleY}px)` }}>
          <div style={{ fontSize: 40, fontWeight: 800, letterSpacing: "0.22em", color: C.sun, textTransform: "uppercase" }}>Colony Food Market</div>
          <div style={{ fontSize: 112, fontWeight: 800, color: "#FFFFFF", lineHeight: 1.02, marginTop: 24 }}>How to<br />find us</div>
          <div style={{ fontSize: 44, fontWeight: 500, color: "#DDF6F3", marginTop: 28, fontFamily: "Karla, sans-serif" }}>Starting from Blue Anchor</div>
        </div>
      </Shot>

      <div style={{ position: "absolute", left: 70, right: 70, bottom: 190, opacity: clamp(1 - closeIn, 0, 1) }}>
        <Captions
          items={[
            { at: CUES.Road + 0.4, until: CUES.Turn - 0.1, text: "From Blue Anchor, follow the main road and pass the first crossing" },
            { at: CUES.Turn + 0.2, until: CUES.Arrive - 0.1, text: "At the second crossing, go left" },
            { at: CUES.Arrive + 0.3, until: CUES.Close - 0.4, text: "Keep going straight — at the first crossing, go straight, and Colony Food Market is on your left hand side" }
          ]}
          style={{
            background: "rgba(11,59,57,0.92)", color: "#FFFFFF", borderRadius: 26, padding: "30px 34px",
            fontFamily: "Karla, sans-serif", fontWeight: 700, fontSize: 46, lineHeight: 1.28, textAlign: "center",
            boxShadow: "0 24px 60px -24px rgba(0,0,0,0.6)"
          }}
        />
      </div>

      <Shot from={CUES.Close - 1} to={99}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,#0B3B39 0%,#0E6C66 60%,#12B3A5 100%)", opacity: clamp(closeIn, 0, 1) * 0.96 }} />
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 26, opacity: clamp(closeIn - closeOut, 0, 1), transform: `translateY(${closeY}px)` }}>
          <div style={{ background: "#FFFFFF", borderRadius: 28, padding: "26px 34px" }}>
            <img src="assets/colony-logo.png" alt="Colony Food Market" style={{ width: 460, display: "block" }} />
          </div>
          <div style={{ fontSize: 52, fontWeight: 800, color: "#FFD400", letterSpacing: "0.06em", marginTop: 10 }}>C49C+67J · SAN NICOLAS</div>
          <div style={{ fontFamily: "Karla, sans-serif", fontSize: 46, color: "#DDF6F3" }}>Open every day · 11:00 – 20:00</div>
          <div style={{ fontFamily: "Karla, sans-serif", fontSize: 46, color: "#DDF6F3" }}>WhatsApp +297 748 3926</div>
          <div style={{ display: "flex", gap: 16, marginTop: 8, flexWrap: "wrap", justifyContent: "center", maxWidth: 900 }}>
            {["Cold beer", "Ice", "Snacks", "Sunscreen"].map((w, k) => (
              <div key={w} style={{
                opacity: clamp(MOTION.pop({ from: 0, to: 1, start: CUES.Close + 1.1 + k * 0.18, end: CUES.Close + 1.7 + k * 0.18 })(T), 0, 1),
                transform: `translateY(${(1 - clamp(MOTION.pop({ from: 0, to: 1, start: CUES.Close + 1.1 + k * 0.18, end: CUES.Close + 1.7 + k * 0.18 })(T), 0, 1)) * 24}px)`,
                background: "rgba(255,255,255,0.14)", border: "2px solid rgba(255,255,255,0.4)", borderRadius: 999,
                padding: "16px 30px", fontFamily: "Karla, sans-serif", fontWeight: 700, fontSize: 38, color: "#FFFFFF"
              }}>{w}</div>
            ))}
          </div>
          <div style={{ marginTop: 30, background: "#FFD400", color: "#0B3B39", fontWeight: 800, fontSize: 48, padding: "26px 48px", borderRadius: 22 }}>
            Search “Colony Food Market” in Maps
          </div>
        </div>
      </Shot>
    </div>
  );
}

window.RouteVideo = RouteVideo;
