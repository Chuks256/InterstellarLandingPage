import React, { useState, useEffect, useRef } from "react";
import styled, { createGlobalStyle, keyframes } from "styled-components";
import {
  Terminal,
  Globe,
  Zap,
  Activity,
  ChevronRight,
  Shield,
  Copy,
  Check,
  Cpu,
  Lock,
  Server,
  ChevronDown,
  Bell,
  Map as MapIcon,
  Share2,
  Code,
} from "lucide-react";

// --- Animations ---
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(0, 255, 133, 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(0, 255, 133, 0); }
  100% { box-shadow: 0 0 0 0 rgba(0, 255, 133, 0); }
`;

// --- Global Styles ---
const GlobalStyle = createGlobalStyle`
  :root {
    --bg: #000000;
    --accent: #ffffff;
    --gray: #888888;
    --border: rgba(255, 255, 255, 0.08);
    --glass: rgba(255, 255, 255, 0.03);
    --green: #00ff85;
    --yellow: #ffcc00;
    --red: #ff4d4d;
    --shadow-heavy: 0 20px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.05);
    --shadow-glass: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background-color: var(--bg);
    color: var(--accent);
    font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Inter', sans-serif;
    -webkit-font-smoothing: antialiased;
    overflow-x: hidden;
  }
`;

// --- FAQ Styled Components ---
const FAQContainer = styled.div`
  width: 100%;
  max-width: 800px;
  margin: 6rem 0;
`;

const FAQItem = styled.div`
  margin-bottom: 0.75rem;
  background: var(--glass);
  backdrop-filter: blur(20px);
  border: 1px solid var(--border);
  border-radius: 18px;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);

  &:hover {
    background: rgba(255, 255, 255, 0.06);
    border-color: rgba(255, 255, 255, 0.15);
  }
`;

const FAQHeader = styled.div`
  padding: 1.25rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  user-select: none;
`;

const FAQQuestion = styled.span`
  font-size: 1rem;
  font-weight: 500;
  letter-spacing: -0.01em;
`;

const FAQAnswer = styled.div`
  max-height: ${(props) => (props.isOpen ? "200px" : "0")};
  padding: ${(props) => (props.isOpen ? "0 1.5rem 1.5rem" : "0 1.5rem")};
  opacity: ${(props) => (props.isOpen ? "1" : "0")};
  color: var(--gray);
  font-size: 0.95rem;
  line-height: 1.6;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  overflow: hidden;
`;

// --- ASCII Heatmap Component ---
const HeatmapContainer = styled.div`
  font-family: "JetBrains Mono", "Courier New", monospace;
  font-size: 8px;
  line-height: 1;
  letter-spacing: 1px;
  color: var(--gray);
  background: rgba(0, 0, 0, 0.4);
  padding: 10px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  margin-top: 15px;
  height: 100px;
  overflow: hidden;
  user-select: none;
`;

const AsciiHeatmap = () => {
  const [grid, setGrid] = useState([]);

  useEffect(() => {
    const generateGrid = () => {
      const rows = 8;
      const cols = 24;
      const newGrid = [];
      for (let i = 0; i < rows; i++) {
        let row = [];
        for (let j = 0; j < cols; j++) {
          const val = Math.random();
          let char = "█";
          let color = "var(--green)";
          if (val > 0.8) color = "var(--red)";
          else if (val > 0.6) color = "var(--yellow)";
          else if (val < 0.2) char = "░";
          row.push({ char, color });
        }
        newGrid.push(row);
      }
      setGrid(newGrid);
    };

    generateGrid();
    const timer = setInterval(generateGrid, 1500);
    return () => clearInterval(timer);
  }, []);

  return (
    <HeatmapContainer>
      <div style={{ marginBottom: "5px", opacity: 0.5, fontSize: "7px" }}>
        GLOBAL_LATENCY_SCAN [v0.4]
      </div>
      {grid.map((row, i) => (
        <div key={i}>
          {row.map((cell, j) => (
            <span key={j} style={{ color: cell.color }}>
              {cell.char}
            </span>
          ))}
        </div>
      ))}
    </HeatmapContainer>
  );
};

// --- Scroll Animation Component ---
const ScrollReveal = styled.div`
  opacity: ${(props) => (props.isVisible ? 1 : 0)};
  transform: ${(props) =>
    props.isVisible ? "translateY(0)" : "translateY(40px)"};
  transition:
    opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1),
    transform 1.2s cubic-bezier(0.16, 1, 0.3, 1);
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const AnimatedSection = ({ children }) => {
  const [isVisible, setVisible] = useState(false);
  const domRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 },
    );

    const { current } = domRef;
    if (current) observer.observe(current);
    return () => current && observer.unobserve(current);
  }, []);

  return (
    <ScrollReveal ref={domRef} isVisible={isVisible}>
      {children}
    </ScrollReveal>
  );
};

// --- Styled Components ---
const Navbar = styled.nav`
  position: fixed;
  top: 0;
  width: 100%;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(24px) saturate(180%);
  border-bottom: 1px solid var(--border);
  z-index: 1000;
`;

const NavContent = styled.div`
  width: 100%;
  max-width: 1100px;
  padding: 0 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-weight: 600;
  font-size: 1rem;
  letter-spacing: -0.01em;
`;

const Container = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Hero = styled.section`
  padding: 160px 0 80px;
  text-align: center;
  animation: ${fadeIn} 1.2s cubic-bezier(0.16, 1, 0.3, 1);
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.35rem 1rem;
  background: var(--glass);
  backdrop-filter: blur(8px);
  border: 1px solid var(--border);
  border-radius: 100px;
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--accent);
  margin-bottom: 2rem;

  &::before {
    content: "";
    width: 6px;
    height: 6px;
    background: var(--green);
    border-radius: 50%;
    animation: ${pulse} 2s infinite;
  }
`;

const Headline = styled.h1`
  font-size: clamp(2.5rem, 8vw, 5.5rem);
  font-weight: 700;
  line-height: 1.05;
  letter-spacing: -0.04em;
  margin-bottom: 1.5rem;
  background: linear-gradient(180deg, #fff 30%, rgba(255, 255, 255, 0.5) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  width: 100%;
  text-align: center;
`;

const Button = styled.button`
  background: ${(props) =>
    props.primary ? "rgba(255, 255, 255, 0.95)" : "var(--glass)"};
  color: ${(props) => (props.primary ? "#000" : "#fff")};
  backdrop-filter: blur(12px);
  border: 1px solid
    ${(props) => (props.primary ? "transparent" : "var(--border)")};
  padding: 0.8rem 1.6rem;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

  &:hover {
    background: ${(props) =>
      props.primary ? "#fff" : "rgba(255,255,255,0.08)"};
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  }
`;

const InfoCard = styled.div`
  padding: 2.5rem;
  background: var(--glass);
  backdrop-filter: blur(20px);
  border: 1px solid var(--border);
  border-radius: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;
  overflow: hidden;
  box-shadow: var(--shadow-glass);

  &:hover {
    transform: translateY(-6px);
    border-color: rgba(255, 255, 255, 0.2);
    background: rgba(255, 255, 255, 0.05);
  }
  h3 {
    margin: 1.5rem 0 1rem;
    font-size: 1.25rem;
    font-weight: 600;
  }
  p {
    color: var(--gray);
    line-height: 1.6;
    font-size: 0.95rem;
  }
`;

const TerminalWrapper = styled.div`
  background: rgba(10, 10, 10, 0.6);
  backdrop-filter: blur(30px);
  border: 1px solid var(--border);
  border-radius: 18px;
  overflow: hidden;
  margin: 4rem 0;
  width: 100%;
  max-width: 850px;
  box-shadow: var(--shadow-heavy);
`;

const InterstellarLanding = () => {
  const [activeTab, setActiveTab] = useState("install");
  const [copied, setCopied] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const [logs, setLogs] = useState([
    { id: 1, text: "Fetching nodes from global registry...", type: "info" },
    { id: 2, text: "main-api: ONLINE (24ms)", type: "success" },
  ]);

  const faqs = [
    {
      q: "How secure is Interstellar?",
      a: "Very. We use a local-first approach. Your monitoring data and sensitive keys are encrypted and never leave your machine unless you configure a secure remote webhook.",
    },
    {
      q: "Does it support automated alerts?",
      a: "Yes. Interstellar can be configured to trigger local notifications or POST requests to your preferred communication tools (Slack, Discord, etc.) when latency spikes.",
    },
    {
      q: "Can I use it in production?",
      a: "Absolutely. It's designed with a minimal footprint specifically for high-load production environments where every megabyte of RAM counts.",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      const newLog = {
        id: Date.now(),
        text: `Node check: ${Math.random() > 0.1 ? "PASSED" : "RETRY"} (${Math.floor(Math.random() * 100)}ms)`,
        type: Math.random() > 0.1 ? "success" : "warn",
      };
      setLogs((prev) => [newLog, ...prev].slice(0, 4));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const commands = {
    install: "npm install -g @chuks2001/interstellar-cli",
    nodes: "interstellar --listNode",
    auth: "interstellar --signin <user> <pass>",
  };

  return (
    <>
      <GlobalStyle />
      <Navbar>
        <NavContent>
          <Logo>
            <div
              style={{
                background: "linear-gradient(135deg, #fff 0%, #aaa 100%)",
                padding: "5px",
                borderRadius: "8px",
                display: "flex",
                boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
              }}
            >
              <Terminal size={16} color="#000" strokeWidth={2.5} />
            </div>
            INTERSTELLAR
          </Logo>
          <Button
            primary
            style={{
              padding: "0.5rem 1.2rem",
              borderRadius: "100px",
              fontSize: "0.8rem",
            }}
            onClick={() =>
              window.open(
                "https://www.npmjs.com/package/@chuks2001/interstellar-cli/v/1.0.1",
              )
            }
          >
            Documentation
          </Button>
        </NavContent>
      </Navbar>

      <Container>
        <Hero>
          <Badge>v1.0.1 Global Infrastructure Active</Badge>
          <Headline>Keep Your Distributed Systems Breathing</Headline>
          <p
            style={{
              color: "var(--gray)",
              maxWidth: "600px",
              margin: "0 auto 2.5rem",
              lineHeight: "1.6",
              textAlign: "center",
              fontSize: "1.1rem",
            }}
          >
            The ultra-fast CLI tool for real-time API monitoring. Track
            performance, manage nodes, and ensure 99.9% uptime.
          </p>
          <div style={{ display: "flex", gap: "1.2rem" }}>
            <Button
              primary
              onClick={() =>
                window.open(
                  "https://www.npmjs.com/package/@chuks2001/interstellar-cli",
                )
              }
            >
              Get Started <ChevronRight size={18} />
            </Button>
            <Button
              onClick={() =>
                window.open("https://github.com/Chuks256/Interstellar")
              }
            >
              View Repository
            </Button>
          </div>
        </Hero>

        <AnimatedSection>
          <TerminalWrapper>
            <div
              style={{
                display: "flex",
                background: "rgba(255,255,255,0.03)",
                borderBottom: "1px solid var(--border)",
              }}
            >
              {Object.keys(commands).map((t) => (
                <button
                  key={t}
                  onClick={() => setActiveTab(t)}
                  style={{
                    padding: "14px 24px",
                    background:
                      activeTab === t
                        ? "rgba(255,255,255,0.05)"
                        : "transparent",
                    color: activeTab === t ? "#fff" : "#666",
                    border: "none",
                    borderRight: "1px solid var(--border)",
                    cursor: "pointer",
                    fontFamily: "JetBrains Mono, monospace",
                    fontSize: "0.75rem",
                    transition: "0.2s",
                  }}
                >
                  {t}.sh
                </button>
              ))}
            </div>
            <div
              style={{
                padding: "28px",
                fontFamily: "JetBrains Mono, monospace",
                position: "relative",
                minHeight: "220px",
              }}
            >
              <button
                onClick={() => handleCopy(commands[activeTab])}
                style={{
                  position: "absolute",
                  top: "20px",
                  right: "20px",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid var(--border)",
                  color: "#fff",
                  padding: "8px",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                {copied ? (
                  <Check size={14} color="var(--green)" />
                ) : (
                  <Copy size={14} opacity={0.6} />
                )}
              </button>
              <p style={{ color: "#444", marginBottom: "8px" }}>
                #{" "}
                {activeTab === "install"
                  ? "Global installation"
                  : "Command usage"}
              </p>
              <p>
                <span style={{ color: "var(--green)" }}>$</span>{" "}
                {commands[activeTab]}
              </p>
              <div style={{ marginTop: "32px", opacity: 0.4 }}>
                {logs.map((log) => (
                  <div
                    key={log.id}
                    style={{ fontSize: "0.7rem", marginBottom: "4px" }}
                  >
                    [{new Date(log.id).toLocaleTimeString()}] {log.text}
                  </div>
                ))}
              </div>
            </div>
          </TerminalWrapper>
        </AnimatedSection>

        <AnimatedSection>
          <div style={{ padding: "4rem 0", width: "100%" }}>
            <h2
              style={{
                textAlign: "center",
                fontSize: "2.5rem",
                marginBottom: "3rem",
                fontWeight: 700,
              }}
            >
              Built for Scale
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                gap: "2rem",
              }}
            >
              <InfoCard>
                <Cpu color="var(--green)" size={32} strokeWidth={1.5} />
                <h3>Minimal Footprint</h3>
                <p>Efficient binaries that stay out of your way.</p>
              </InfoCard>
              <InfoCard>
                <Lock color="var(--green)" size={32} strokeWidth={1.5} />
                <h3>Local-First</h3>
                <p>Your monitoring data never leaves your hardware.</p>
              </InfoCard>
              <InfoCard>
                <MapIcon color="var(--green)" size={32} strokeWidth={1.5} />
                <h3>Geographic Insight</h3>
                <p>Real-time terminal heatmaps of node latency.</p>
                <AsciiHeatmap />
              </InfoCard>
            </div>
          </div>
        </AnimatedSection>

        {/* New FAQ Section */}
        <AnimatedSection>
          <h2
            style={{
              textAlign: "center",
              fontSize: "2rem",
              marginBottom: "2rem",
              fontWeight: 700,
            }}
          >
            Common Queries
          </h2>
          <FAQContainer>
            {faqs.map((faq, i) => (
              <FAQItem key={i}>
                <FAQHeader onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  <FAQQuestion>{faq.q}</FAQQuestion>
                  <ChevronDown
                    size={18}
                    style={{
                      transform: openFaq === i ? "rotate(180deg)" : "none",
                      transition: "0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                      opacity: 0.5,
                    }}
                  />
                </FAQHeader>
                <FAQAnswer isOpen={openFaq === i}>{faq.a}</FAQAnswer>
              </FAQItem>
            ))}
          </FAQContainer>
        </AnimatedSection>

        <footer
          style={{
            padding: "100px 0 60px",
            textAlign: "center",
            borderTop: "1px solid var(--border)",
            width: "100%",
          }}
        >
          <p
            style={{
              color: "var(--gray)",
              fontSize: "0.8rem",
              letterSpacing: "0.05em",
            }}
          >
            &copy; {new Date().getFullYear()} INTERSTELLAR CLI // DISTRIBUTED
            PROTOCOLS
          </p>
        </footer>
      </Container>
    </>
  );
};

export default InterstellarLanding;
