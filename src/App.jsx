import React, { useState, useEffect, useRef } from "react";
import { Analytics } from "@vercel/analytics/react";

const COMMANDS = {
  install: "npm install -g @chuks2001/interstellar-cli",
  nodes: "interstellar --listNode",
  auth: "interstellar --signin <user> <pass>",
};

const FAQS = [
  {
    q: "How secure is Interstellar?",
    a: "We use a local-first approach. Your monitoring data and sensitive keys are encrypted and never leave your machine unless you configure a secure remote webhook.",
  },
  {
    q: "Does it support automated alerts?",
    a: "Yes. Interstellar can trigger local notifications or POST requests to Slack, Discord, and more when latency spikes are detected.",
  },
  {
    q: "Can I use it in production?",
    a: "Absolutely. It's designed with a minimal footprint specifically for high-load production environments where every megabyte of RAM counts.",
  },
];

// ─── Pixel Art Server ───────────────────────────────────────────────────────
// Each row is an array of color codes: 0=empty, 1=chassis, 2=dark, 3=green LED, 4=yellow LED, 5=red LED, 6=vent, 7=port
const SERVER_SPRITE = [
  [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
  [0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0],
  [1, 2, 2, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 2, 2, 1],
  [1, 2, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 2, 1],
  [1, 2, 2, 7, 7, 7, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 4, 5, 2, 2, 1],
  [1, 2, 2, 7, 7, 7, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 4, 5, 2, 2, 1],
  [1, 2, 2, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 2, 2, 1],
  [1, 2, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 2, 1],
  [1, 2, 2, 7, 7, 7, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 4, 2, 2, 1],
  [1, 2, 2, 7, 7, 7, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 4, 2, 2, 1],
  [1, 2, 2, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 2, 2, 1],
  [1, 2, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 2, 1],
  [1, 2, 2, 7, 7, 7, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 2, 2, 1],
  [1, 2, 2, 7, 7, 7, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 2, 2, 1],
  [1, 2, 2, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 2, 2, 1],
  [1, 2, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 2, 1],
  [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
  [0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0],
  [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
];

const PIXEL_COLORS = {
  0: "transparent",
  1: "#1a1a2e",
  2: "#16213e",
  3: "#00ff85",
  4: "#ffcc00",
  5: "#ff4d4d",
  6: "#0d0d1a",
  7: "#0a2a1a",
};

const PixelServer = () => {
  const [tick, setTick] = useState(0);
  const [scanLine, setScanLine] = useState(0);
  const PX = 18;

  useEffect(() => {
    const t = setInterval(() => setTick((p) => p + 1), 600);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setInterval(
      () => setScanLine((p) => (p + 1) % SERVER_SPRITE.length),
      1200,
    );
    return () => clearInterval(t);
  }, []);

  const blinkFast = tick % 2 === 0;
  const blinkSlow = tick % 4 === 0;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 16,
      }}
    >
      <svg
        width={SERVER_SPRITE[0].length * PX}
        height={SERVER_SPRITE.length * PX}
        style={{
          imageRendering: "pixelated",
          filter: "drop-shadow(0 0 24px rgba(0,255,133,0.25))",
        }}
      >
        {SERVER_SPRITE.map((row, ri) =>
          row.map((cell, ci) => {
            if (cell === 0) return null;
            let fill = PIXEL_COLORS[cell];
            // Animate LEDs
            if (cell === 3) fill = blinkFast ? "#00ff85" : "#007a40";
            if (cell === 4) fill = blinkSlow ? "#ffcc00" : "#7a6000";
            if (cell === 5) fill = tick % 6 === 0 ? "#ff4d4d" : "#7a2020";
            // Scan line highlight
            const isScan = ri === scanLine;
            if (isScan && cell !== 0) fill = "rgba(0,255,133,0.4)";

            return (
              <rect
                key={`${ri}-${ci}`}
                x={ci * PX}
                y={ri * PX}
                width={PX - 1}
                height={PX - 1}
                fill={fill}
                rx={1}
              />
            );
          }),
        )}
      </svg>

      {/* Glow base */}
      <div
        style={{
          width: SERVER_SPRITE[0].length * PX * 0.7,
          height: 6,
          background:
            "radial-gradient(ellipse, rgba(0,255,133,0.35) 0%, transparent 70%)",
          borderRadius: "50%",
          marginTop: -8,
        }}
      />
    </div>
  );
};

// ─── Pixel Map ───────────────────────────────────────────────────────────────
const WORLD_COLS = 72;
const WORLD_ROWS = 36;

// Compact world landmass data as run-length encoded rows [col_start, col_end] pairs
const LAND = [
  [],
  [
    [28, 31],
    [52, 54],
  ],
  [
    [2, 4],
    [26, 33],
    [51, 56],
    [62, 64],
  ],
  [
    [2, 5],
    [24, 35],
    [49, 57],
    [61, 65],
  ],
  [
    [1, 6],
    [22, 37],
    [48, 58],
    [60, 65],
    [68, 70],
  ],
  [
    [1, 7],
    [20, 38],
    [47, 60],
    [59, 66],
    [67, 71],
  ],
  [
    [1, 8],
    [19, 40],
    [46, 61],
    [58, 67],
    [66, 71],
  ],
  [
    [2, 8],
    [18, 41],
    [44, 62],
    [57, 68],
  ],
  [
    [2, 9],
    [17, 43],
    [43, 63],
    [56, 68],
  ],
  [
    [3, 10],
    [16, 44],
    [42, 64],
    [55, 68],
  ],
  [
    [4, 11],
    [15, 12],
    [14, 45],
    [41, 65],
    [54, 67],
  ],
  [
    [5, 11],
    [13, 46],
    [40, 65],
    [53, 66],
  ],
  [
    [6, 11],
    [12, 46],
    [39, 64],
    [52, 65],
  ],
  [
    [7, 11],
    [11, 45],
    [38, 63],
    [51, 64],
  ],
  [
    [8, 44],
    [37, 62],
    [50, 63],
  ],
  [
    [9, 43],
    [36, 61],
    [49, 62],
  ],
  [
    [10, 42],
    [35, 60],
    [48, 61],
  ],
  [
    [11, 41],
    [34, 59],
  ],
  [
    [12, 40],
    [33, 58],
  ],
  [
    [13, 39],
    [32, 55],
  ],
  [
    [14, 38],
    [31, 53],
  ],
  [
    [15, 36],
    [30, 50],
  ],
  [
    [16, 34],
    [29, 47],
    [38, 42],
  ],
  [
    [17, 32],
    [28, 44],
    [39, 41],
  ],
  [
    [18, 30],
    [29, 42],
  ],
  [
    [19, 28],
    [30, 40],
  ],
  [
    [20, 26],
    [31, 38],
  ],
  [[21, 24]],
  [],
  [
    [44, 52],
    [54, 60],
    [62, 68],
  ],
  [
    [43, 53],
    [53, 61],
    [61, 69],
  ],
  [
    [42, 54],
    [52, 62],
    [60, 70],
  ],
  [
    [43, 53],
    [53, 61],
    [61, 69],
  ],
  [
    [44, 52],
    [54, 60],
    [62, 68],
  ],
  [],
  [],
];

const NODES = [
  { cx: 14, cy: 8, label: "New York", status: "online", ping: 12 },
  { cx: 11, cy: 9, label: "Chicago", status: "online", ping: 18 },
  { cx: 8, cy: 7, label: "Seattle", status: "online", ping: 22 },
  { cx: 30, cy: 7, label: "London", status: "online", ping: 8 },
  { cx: 32, cy: 8, label: "Paris", status: "online", ping: 11 },
  { cx: 35, cy: 6, label: "Berlin", status: "online", ping: 14 },
  { cx: 37, cy: 13, label: "Cairo", status: "warn", ping: 67 },
  { cx: 46, cy: 12, label: "Mumbai", status: "online", ping: 31 },
  { cx: 58, cy: 9, label: "Tokyo", status: "online", ping: 45 },
  { cx: 55, cy: 22, label: "Sydney", status: "online", ping: 89 },
  { cx: 52, cy: 14, label: "Singapore", status: "online", ping: 38 },
  { cx: 18, cy: 19, label: "São Paulo", status: "online", ping: 52 },
  { cx: 40, cy: 5, label: "Moscow", status: "warn", ping: 71 },
  { cx: 59, cy: 10, label: "Seoul", status: "online", ping: 41 },
];

const PixelMap = () => {
  const [activeNode, setActiveNode] = useState(null);
  const [pulse, setPulse] = useState(0);
  const PX = 11;

  useEffect(() => {
    const t = setInterval(() => setPulse((p) => (p + 1) % NODES.length), 900);
    return () => clearInterval(t);
  }, []);

  const isLand = (r, c) => {
    const row = LAND[r];
    if (!row) return false;
    return row.some(([s, e]) => c >= s && c < e);
  };

  const W = WORLD_COLS * PX;
  const H = WORLD_ROWS * PX;

  return (
    <div style={{ width: "100%", position: "relative" }}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        style={{ display: "block", maxWidth: "100%" }}
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Land pixels */}
        {Array.from({ length: WORLD_ROWS }, (_, r) =>
          Array.from({ length: WORLD_COLS }, (_, c) =>
            isLand(r, c) ? (
              <rect
                key={`${r}-${c}`}
                x={c * PX}
                y={r * PX}
                width={PX - 1}
                height={PX - 1}
                fill="rgba(0,255,133,0.12)"
                rx={1}
              />
            ) : null,
          ),
        )}

        {/* Connection lines */}
        {NODES.map((a, i) =>
          NODES.slice(i + 1, i + 3).map((b, j) => (
            <line
              key={`l${i}${j}`}
              x1={a.cx * PX + PX / 2}
              y1={a.cy * PX + PX / 2}
              x2={b.cx * PX + PX / 2}
              y2={b.cy * PX + PX / 2}
              stroke="rgba(0,255,133,0.1)"
              strokeWidth={1}
              strokeDasharray="3 4"
            />
          )),
        )}

        {/* Nodes */}
        {NODES.map((node, i) => {
          const x = node.cx * PX + PX / 2;
          const y = node.cy * PX + PX / 2;
          const color = node.status === "online" ? "#00ff85" : "#ffcc00";
          const isActive = activeNode === i;
          const isPulse = pulse === i;

          return (
            <g
              key={i}
              style={{ cursor: "pointer" }}
              onMouseEnter={() => setActiveNode(i)}
              onMouseLeave={() => setActiveNode(null)}
            >
              {isPulse && (
                <circle
                  cx={x}
                  cy={y}
                  r={10}
                  fill="none"
                  stroke={color}
                  strokeWidth={1}
                  opacity={0.6}
                >
                  <animate
                    attributeName="r"
                    from="4"
                    to="14"
                    dur="1s"
                    fill="freeze"
                  />
                  <animate
                    attributeName="opacity"
                    from="0.8"
                    to="0"
                    dur="1s"
                    fill="freeze"
                  />
                </circle>
              )}
              <circle
                cx={x}
                cy={y}
                r={isActive ? 5 : 3.5}
                fill={color}
                style={{
                  filter: `drop-shadow(0 0 4px ${color})`,
                  transition: "r 0.2s",
                }}
              />
              {isActive && (
                <g>
                  <rect
                    x={x + 8}
                    y={y - 22}
                    width={node.label.length * 6.5 + 16}
                    height={36}
                    rx={4}
                    fill="#111"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth={0.5}
                  />
                  <text
                    x={x + 16}
                    y={y - 7}
                    fill="#fff"
                    fontSize={9}
                    fontFamily="monospace"
                    fontWeight="600"
                  >
                    {node.label}
                  </text>
                  <text
                    x={x + 16}
                    y={y + 6}
                    fill={color}
                    fontSize={8}
                    fontFamily="monospace"
                  >
                    {node.status.toUpperCase()} · {node.ping}ms
                  </text>
                </g>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
};

// ─── Particle Background ─────────────────────────────────────────────────────
const ParticleBackground = () => {
  const canvasRef = useRef();
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);
    const particles = Array.from({ length: 80 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 1.5 + 0.5,
      opacity: Math.random() * 0.35 + 0.1,
    }));
    let raf;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(0,255,133,${0.055 * (1 - d / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,255,133,${p.opacity})`;
        ctx.fill();
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);
  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  );
};

// ─── ASCII Heatmap ────────────────────────────────────────────────────────────
const AsciiHeatmap = () => {
  const [grid, setGrid] = useState([]);
  useEffect(() => {
    const gen = () => {
      setGrid(
        Array.from({ length: 7 }, () =>
          Array.from({ length: 22 }, () => {
            const v = Math.random();
            return {
              char: v < 0.2 ? "░" : "█",
              color: v > 0.8 ? "#ff4d4d" : v > 0.6 ? "#ffcc00" : "#00ff85",
            };
          }),
        ),
      );
    };
    gen();
    const t = setInterval(gen, 1600);
    return () => clearInterval(t);
  }, []);
  return (
    <div
      style={{
        fontFamily: "'Courier New', monospace",
        fontSize: 9,
        lineHeight: 1.3,
        background: "rgba(0,0,0,0.5)",
        padding: 10,
        borderRadius: 8,
        border: "1px solid rgba(255,255,255,0.06)",
        marginTop: 16,
        width: "100%",
        userSelect: "none",
      }}
    >
      <div style={{ color: "#333", fontSize: 8, marginBottom: 6 }}>
        GLOBAL_LATENCY_SCAN [v0.4]
      </div>
      {grid.map((row, i) => (
        <div key={i}>
          {row.map((c, j) => (
            <span key={j} style={{ color: c.color }}>
              {c.char}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
};

// ─── Scroll Reveal ────────────────────────────────────────────────────────────
const useScrollReveal = () => {
  const [visible, setVisible] = useState(false);
  const ref = useRef();
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.08 },
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
};

const Reveal = ({ children, style }) => {
  const [ref, visible] = useScrollReveal();
  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(28px)",
        transition: "opacity 0.9s ease, transform 0.9s ease",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        ...style,
      }}
    >
      {children}
    </div>
  );
};

// ─── Icons ────────────────────────────────────────────────────────────────────
const TermIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#000"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="4 17 10 11 4 5" />
    <line x1="12" y1="19" x2="20" y2="19" />
  </svg>
);
const ArrowRight = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="9 18 15 12 9 6" />
  </svg>
);
const Chevron = ({ open }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{
      transform: open ? "rotate(180deg)" : "none",
      transition: "transform 0.3s",
      opacity: 0.45,
      flexShrink: 0,
    }}
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);
const CpuIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#00ff85"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="4" y="4" width="16" height="16" rx="2" />
    <rect x="9" y="9" width="6" height="6" />
    <line x1="9" y1="1" x2="9" y2="4" />
    <line x1="15" y1="1" x2="15" y2="4" />
    <line x1="9" y1="20" x2="9" y2="23" />
    <line x1="15" y1="20" x2="15" y2="23" />
    <line x1="20" y1="9" x2="23" y2="9" />
    <line x1="20" y1="14" x2="23" y2="14" />
    <line x1="1" y1="9" x2="4" y2="9" />
    <line x1="1" y1="14" x2="4" y2="14" />
  </svg>
);
const LockIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#00ff85"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="11" width="18" height="11" rx="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);
const GlobeIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#00ff85"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function InterstellarLanding() {
  const [tab, setTab] = useState("install");
  const [copied, setCopied] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const [logs, setLogs] = useState([
    { id: 1, text: "Fetching nodes from global registry..." },
    { id: 2, text: "main-api: ONLINE (24ms)" },
  ]);

  useEffect(() => {
    const iv = setInterval(() => {
      setLogs((prev) =>
        [
          {
            id: Date.now(),
            text: `Node check: ${Math.random() > 0.1 ? "PASSED" : "RETRY"} (${Math.floor(Math.random() * 100)}ms)`,
          },
          ...prev,
        ].slice(0, 4),
      );
    }, 3000);
    return () => clearInterval(iv);
  }, []);

  const copy = () => {
    navigator.clipboard.writeText(COMMANDS[tab]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { width: 100%; min-height: 100vh; background: #000; color: #fff; font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', sans-serif; -webkit-font-smoothing: antialiased; overflow-x: hidden; }
        #root { width: 100%; min-height: 100vh; }

        .page { width: 100%; min-height: 100vh; background: #000; display: flex; flex-direction: column; align-items: center; position: relative; overflow-x: hidden; }

        .nav { position: fixed; top: 0; left: 0; width: 100%; height: 64px; background: rgba(0,0,0,0.88); border-bottom: 1px solid rgba(255,255,255,0.07); backdrop-filter: blur(20px); z-index: 999; display: flex; justify-content: center; align-items: center; }
        .nav-inner { width: 100%; max-width: 1200px; padding: 0 32px; display: flex; align-items: center; justify-content: space-between; }

        .hero { padding: 160px 32px 100px; width: 100%; max-width: 1200px; display: flex; flex-direction: column; align-items: center; text-align: center; position: relative; z-index: 1; }
        .badge { display: inline-flex; align-items: center; gap: 8px; padding: 6px 16px; border: 1px solid rgba(255,255,255,0.12); border-radius: 999px; font-size: 12px; font-weight: 500; color: #ccc; margin-bottom: 36px; background: rgba(255,255,255,0.04); }
        .dot { width: 7px; height: 7px; border-radius: 50%; background: #00ff85; animation: pulse 2s infinite; }

        @keyframes pulse { 0%{box-shadow:0 0 0 0 rgba(0,255,133,.5)} 70%{box-shadow:0 0 0 8px rgba(0,255,133,0)} 100%{box-shadow:0 0 0 0 rgba(0,255,133,0)} }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
        @keyframes scanpulse { 0%,100%{opacity:.15} 50%{opacity:.45} }

        .h1 { font-size: clamp(2.4rem, 5.5vw, 5.2rem); font-weight: 700; line-height: 1.06; letter-spacing: -0.04em; text-align: center; margin-bottom: 28px; background: linear-gradient(175deg, #fff 30%, rgba(255,255,255,.35) 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; max-width: 900px; }
        .subtitle { color: #777; max-width: 540px; line-height: 1.7; font-size: 17px; text-align: center; margin-bottom: 44px; }
        .btn-row { display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; }
        .btn-primary { background: rgba(255,255,255,.94); color: #000; border: none; padding: 13px 26px; border-radius: 12px; font-weight: 600; font-size: 14px; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; transition: transform .2s, background .2s; white-space: nowrap; }
        .btn-primary:hover { background: #fff; transform: translateY(-2px); }
        .btn-secondary { background: transparent; color: #fff; border: 1px solid rgba(255,255,255,.14); padding: 13px 26px; border-radius: 12px; font-weight: 600; font-size: 14px; cursor: pointer; transition: background .2s, transform .2s; white-space: nowrap; }
        .btn-secondary:hover { background: rgba(255,255,255,.06); transform: translateY(-2px); }

        .terminal { width: 100%; max-width: 900px; border: 1px solid rgba(255,255,255,.08); border-radius: 18px; overflow: hidden; background: rgba(8,8,8,.92); margin: 70px 0; }
        .term-tabs { display: flex; border-bottom: 1px solid rgba(255,255,255,.07); background: rgba(255,255,255,.02); }
        .term-tab { padding: 14px 24px; background: transparent; border: none; border-right: 1px solid rgba(255,255,255,.07); cursor: pointer; font-family: 'Courier New', monospace; font-size: 12px; transition: color .2s, background .2s; }
        .term-tab.active { background: rgba(255,255,255,.05); color: #fff; }
        .term-tab:not(.active) { color: #444; }
        .term-tab:hover:not(.active) { color: #777; }
        .term-body { padding: 28px 32px; font-family: 'Courier New', monospace; position: relative; min-height: 200px; }
        .copy-btn { position: absolute; top: 22px; right: 22px; background: rgba(255,255,255,.05); border: 1px solid rgba(255,255,255,.1); color: #fff; padding: 8px; border-radius: 8px; cursor: pointer; display: flex; align-items: center; }

        .section-block { width: 100%; max-width: 1200px; padding: 80px 32px; display: flex; flex-direction: column; align-items: center; position: relative; z-index: 1; }
        .section-label { font-size: 11px; font-weight: 600; letter-spacing: .12em; color: #00ff85; text-transform: uppercase; margin-bottom: 14px; text-align: center; }
        .section-title { font-size: clamp(1.7rem, 3.5vw, 2.6rem); font-weight: 700; text-align: center; margin-bottom: 56px; letter-spacing: -.02em; }

        .map-wrap { width: 100%; background: rgba(0,0,0,.6); border: 1px solid rgba(0,255,133,.1); border-radius: 20px; overflow: hidden; padding: 24px; }
        .map-stats { display: flex; gap: 32px; justify-content: center; flex-wrap: wrap; margin-top: 28px; }
        .map-stat { display: flex; flex-direction: column; align-items: center; gap: 4px; }
        .map-stat-value { font-size: 22px; font-weight: 700; color: #00ff85; font-family: 'Courier New', monospace; }
        .map-stat-label { font-size: 11px; color: #555; letter-spacing: .08em; text-transform: uppercase; }

        /* Pixel server section */
        .server-section { width: 100%; max-width: 1200px; padding: 80px 32px; display: flex; flex-direction: column; align-items: center; position: relative; z-index: 1; }
        .server-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center; width: 100%; }
        .server-info { display: flex; flex-direction: column; gap: 28px; }
        .server-stat-row { display: flex; flex-direction: column; gap: 8px; }
        .server-stat-label { font-size: 11px; color: #444; letter-spacing: .1em; text-transform: uppercase; }
        .server-stat-bar { height: 4px; background: rgba(255,255,255,.06); border-radius: 2px; overflow: hidden; }
        .server-stat-fill { height: 100%; border-radius: 2px; background: #00ff85; transition: width .6s ease; }
        .server-terminal-line { font-family: 'Courier New', monospace; font-size: 12px; color: #444; line-height: 1.8; }
        .server-terminal-line span { color: #00ff85; }
        .server-float { display: flex; justify-content: center; animation: float 4s ease-in-out infinite; }
        .server-scan { position: absolute; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, transparent, rgba(0,255,133,.6), transparent); animation: scanpulse 2s ease-in-out infinite; pointer-events: none; }

        .card-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; width: 100%; }
        .card { background: rgba(255,255,255,.025); border: 1px solid rgba(255,255,255,.07); border-radius: 20px; padding: 36px 28px; display: flex; flex-direction: column; align-items: center; text-align: center; transition: transform .3s, border-color .3s, background .3s; }
        .card:hover { transform: translateY(-5px); border-color: rgba(255,255,255,.15); background: rgba(255,255,255,.045); }
        .card-icon { width: 52px; height: 52px; border-radius: 14px; background: rgba(0,255,133,.08); display: flex; align-items: center; justify-content: center; margin-bottom: 22px; border: 1px solid rgba(0,255,133,.12); }
        .card-title { font-size: 17px; font-weight: 600; margin-bottom: 12px; }
        .card-text { color: #666; font-size: 14px; line-height: 1.7; }

        .faq-wrap { width: 100%; max-width: 780px; }
        .faq-item { border: 1px solid rgba(255,255,255,.07); border-radius: 14px; margin-bottom: 10px; overflow: hidden; background: rgba(255,255,255,.02); transition: border-color .2s; }
        .faq-item:hover { border-color: rgba(255,255,255,.13); }
        .faq-btn { width: 100%; padding: 20px 24px; display: flex; justify-content: space-between; align-items: center; cursor: pointer; background: none; border: none; color: #fff; font-size: 15px; font-weight: 500; text-align: left; gap: 16px; }
        .faq-answer { padding: 0 24px 20px; color: #666; font-size: 14px; line-height: 1.75; }

        .divider { width: 100%; height: 1px; background: rgba(255,255,255,.06); position: relative; z-index: 1; }
        .footer { width: 100%; border-top: 1px solid rgba(255,255,255,.07); padding: 48px 32px; text-align: center; color: #444; font-size: 12px; letter-spacing: .06em; position: relative; z-index: 1; }

        @media (max-width: 900px) {
          .card-grid { grid-template-columns: repeat(2,1fr); }
          .server-layout { grid-template-columns: 1fr; gap: 48px; }
          .server-float { order: -1; }
        }
        @media (max-width: 600px) {
          .card-grid { grid-template-columns: 1fr; }
          .nav-inner, .hero, .section-block, .server-section { padding-left: 20px; padding-right: 20px; }
          .hero { padding-top: 140px; padding-bottom: 80px; }
          .term-body { padding: 20px; }
        }
      `}</style>

      <ParticleBackground />

      <div className="page">
        {/* Nav */}
        <nav className="nav">
          <div className="nav-inner">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                fontWeight: 600,
                fontSize: 15,
                letterSpacing: "0.04em",
              }}
            >
              <div
                style={{
                  width: 30,
                  height: 30,
                  background: "#fff",
                  borderRadius: 8,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <TermIcon />
              </div>
              INTERSTELLAR
            </div>
            <button
              className="btn-primary"
              style={{ padding: "9px 20px", borderRadius: 999, fontSize: 13 }}
              onClick={() =>
                window.open(
                  "https://www.npmjs.com/package/@chuks2001/interstellar-cli/v/1.0.1",
                )
              }
            >
              Documentation
            </button>
          </div>
        </nav>

        {/* Hero */}
        <section className="hero">
          <div className="badge">
            <div className="dot" /> v1.0.1 — Global Infrastructure Active
          </div>
          <h1 className="h1">
            Keep Your Distributed
            <br />
            Systems Breathing
          </h1>
          <p className="subtitle">
            The ultra-fast CLI tool for real-time API monitoring. Track
            performance, manage nodes, and ensure 99.9% uptime.
          </p>
          <div className="btn-row">
            <button
              className="btn-primary"
              onClick={() =>
                window.open(
                  "https://www.npmjs.com/package/@chuks2001/interstellar-cli",
                )
              }
            >
              Get Started <ArrowRight />
            </button>
            <button
              className="btn-secondary"
              onClick={() =>
                window.open("https://github.com/Chuks256/Interstellar")
              }
            >
              View Repository
            </button>
          </div>
        </section>

        <div className="divider" />

        {/* Terminal */}
        <Reveal style={{ padding: "0 32px", zIndex: 1 }}>
          <div className="terminal">
            <div className="term-tabs">
              {Object.keys(COMMANDS).map((t) => (
                <button
                  key={t}
                  className={`term-tab${tab === t ? " active" : ""}`}
                  onClick={() => setTab(t)}
                >
                  {t}.sh
                </button>
              ))}
            </div>
            <div className="term-body">
              <button className="copy-btn" onClick={copy}>
                {copied ? (
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#00ff85"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#888"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="9" y="9" width="13" height="13" rx="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                )}
              </button>
              <p style={{ color: "#3a3a3a", marginBottom: 10, fontSize: 13 }}>
                # {tab === "install" ? "Global installation" : "Command usage"}
              </p>
              <p style={{ fontSize: 15 }}>
                <span style={{ color: "#00ff85" }}>$ </span>
                <span style={{ color: "#e0e0e0" }}>{COMMANDS[tab]}</span>
              </p>
              <div style={{ marginTop: 28, opacity: 0.3 }}>
                {logs.map((l) => (
                  <div key={l.id} style={{ fontSize: 11, marginBottom: 5 }}>
                    [{new Date(l.id).toLocaleTimeString()}] {l.text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>

        <div className="divider" />

        {/* Pixel Map */}
        <Reveal>
          <div className="section-block">
            <div className="section-label">Live Network</div>
            <h2 className="section-title">Global Node Infrastructure</h2>
            <div className="map-wrap">
              <PixelMap />
              <div className="map-stats">
                {[
                  ["14", "Active Nodes"],
                  ["99.9%", "Uptime", true],
                  ["12ms", "Avg Latency"],
                  ["2", "Warnings", "#ffcc00"],
                ].map(([v, l, g, c]) => (
                  <div key={l} className="map-stat">
                    <div
                      className="map-stat-value"
                      style={c ? { color: c } : g ? {} : {}}
                    >
                      {v}
                    </div>
                    <div className="map-stat-label">{l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>

        <div className="divider" />

        {/* Pixel Server Section */}
        <Reveal>
          <div className="server-section">
            <div className="section-label">Infrastructure</div>
            <h2 className="section-title" style={{ marginBottom: 64 }}>
              One Node. Total Visibility.
            </h2>
            <div className="server-layout">
              {/* Left — pixel art */}
              <div className="server-float" style={{ position: "relative" }}>
                <div className="server-scan" style={{ top: "40%" }} />
                <PixelServer />
              </div>
              {/* Right — live stats */}
              <div className="server-info">
                <div>
                  <div
                    style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}
                  >
                    Live Node Diagnostics
                  </div>
                  <div style={{ color: "#555", fontSize: 14, lineHeight: 1.7 }}>
                    Every node in your fleet is continuously profiled. CPU,
                    memory, latency and uptime — all surfaced instantly in your
                    terminal.
                  </div>
                </div>
                {[
                  { label: "CPU Usage", val: 34, color: "#00ff85" },
                  { label: "Memory", val: 61, color: "#00ff85" },
                  { label: "Network I/O", val: 48, color: "#ffcc00" },
                  { label: "Disk", val: 22, color: "#00ff85" },
                ].map((s) => (
                  <div key={s.label} className="server-stat-row">
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <div className="server-stat-label">{s.label}</div>
                      <div
                        className="server-stat-label"
                        style={{ color: s.color }}
                      >
                        {s.val}%
                      </div>
                    </div>
                    <div className="server-stat-bar">
                      <div
                        className="server-stat-fill"
                        style={{ width: `${s.val}%`, background: s.color }}
                      />
                    </div>
                  </div>
                ))}
                <div
                  style={{
                    borderTop: "1px solid rgba(255,255,255,0.06)",
                    paddingTop: 20,
                  }}
                >
                  {[
                    "sys: node-03.interstellar.io",
                    "uptime: 99.97% (last 30d)",
                    "region: eu-west-1",
                    "latency: 8ms",
                  ].map((line) => (
                    <div key={line} className="server-terminal-line">
                      <span>›</span> {line}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        <div className="divider" />

        {/* Features */}
        <Reveal>
          <div className="section-block">
            <div className="section-label">Capabilities</div>
            <h2 className="section-title">Built for Scale</h2>
            <div className="card-grid">
              <div className="card">
                <div className="card-icon">
                  <CpuIcon />
                </div>
                <div className="card-title">Minimal Footprint</div>
                <div className="card-text">
                  Efficient binaries with near-zero overhead that stay
                  completely out of your way.
                </div>
              </div>
              <div className="card">
                <div className="card-icon">
                  <LockIcon />
                </div>
                <div className="card-title">Local-First</div>
                <div className="card-text">
                  Your monitoring data and sensitive keys never leave your
                  hardware.
                </div>
              </div>
              <div className="card">
                <div className="card-icon">
                  <GlobeIcon />
                </div>
                <div className="card-title">Geographic Insight</div>
                <div className="card-text">
                  Real-time terminal heatmaps showing live node latency across
                  regions.
                </div>
                <AsciiHeatmap />
              </div>
            </div>
          </div>
        </Reveal>

        <div className="divider" />

        {/* FAQ */}
        <Reveal>
          <div className="section-block">
            <div className="section-label">Support</div>
            <h2 className="section-title">Common Queries</h2>
            <div className="faq-wrap">
              {FAQS.map((faq, i) => (
                <div key={i} className="faq-item">
                  <button
                    className="faq-btn"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  >
                    <span>{faq.q}</span>
                    <Chevron open={openFaq === i} />
                  </button>
                  {openFaq === i && <div className="faq-answer">{faq.a}</div>}
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <footer className="footer">
          © {new Date().getFullYear()} INTERSTELLAR CLI — DISTRIBUTED PROTOCOLS
        </footer>
      </div>

      <Analytics />
    </>
  );
}
