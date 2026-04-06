import React, { useState } from "react";
import styled, { createGlobalStyle, keyframes } from "styled-components";

import {
  Terminal,
  Globe,
  Zap,
  Activity,
  Menu,
  X,
  ChevronRight,
  Shield,
  Database,
  Cpu,
  Command,
} from "lucide-react";

// --- Animations ---
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
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
    --border: rgba(255, 255, 255, 0.1);
  }

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    background-color: var(--bg);
    color: var(--accent);
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    -webkit-font-smoothing: antialiased;
    overflow-x: hidden;
  }

  ::selection {
    background: rgba(255, 255, 255, 0.2);
  }
`;

// --- Styled Components ---
const Navbar = styled.nav`
  position: fixed;
  top: 0;
  width: 100%;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.5rem;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border);
  z-index: 1000;

  @media (min-width: 768px) {
    padding: 0 4rem;
  }
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-weight: 700;
  font-size: 1.1rem;
  letter-spacing: -0.02em;
  cursor: pointer;
`;

const NavButtons = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const Button = styled.button`
  background: ${(props) => (props.primary ? "#fff" : "transparent")};
  color: ${(props) => (props.primary ? "#000" : "#fff")};
  border: 1px solid ${(props) => (props.primary ? "#fff" : "var(--border)")};
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${(props) =>
      props.primary ? "#ccc" : "rgba(255,255,255,0.05)"};
    border-color: #fff;
  }

  @media (max-width: 640px) {
    display: ${(props) => (props.hideMobile ? "none" : "block")};
  }
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
`;

const Hero = styled.section`
  padding: 160px 0 80px;
  text-align: center;
  animation: ${fadeIn} 0.8s ease-out;
`;

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0.75rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border);
  border-radius: 100px;
  font-size: 0.75rem;
  color: var(--gray);
  margin-bottom: 2rem;

  &::before {
    content: "";
    width: 6px;
    height: 6px;
    background: #00ff85;
    border-radius: 50%;
    animation: ${pulse} 2s infinite;
  }
`;

const Headline = styled.h1`
  font-size: clamp(2.5rem, 8vw, 6rem);
  font-weight: 800;
  letter-spacing: -0.05em;
  line-height: 1;
  margin-bottom: 1.5rem;
  background: linear-gradient(180deg, #fff 0%, #888 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const Subline = styled.p`
  font-size: clamp(1rem, 2vw, 1.25rem);
  color: var(--gray);
  max-width: 600px;
  margin: 0 auto 2.5rem;
  line-height: 1.6;
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin: 4rem 0;
`;

const FeatureCard = styled.div`
  padding: 2rem;
  background: rgba(255, 255, 255, 0.01);
  border: 1px solid var(--border);
  border-radius: 12px;
  text-align: left;
  transition: border-color 0.3s ease;

  &:hover {
    border-color: rgba(255, 255, 255, 0.3);
  }

  h3 {
    margin: 1rem 0 0.5rem;
    font-size: 1.25rem;
  }

  p {
    color: var(--gray);
    font-size: 0.95rem;
    line-height: 1.5;
  }
`;

const TerminalSection = styled.section`
  margin: 80px 0;
  background: #050505;
  border: 1px solid var(--border);
  border-radius: 16px;
  overflow: hidden;
`;

const TerminalHeader = styled.div`
  background: #111;
  padding: 0.75rem 1.25rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border-bottom: 1px solid var(--border);

  .dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
  }
  .red {
    background: #ff5f56;
  }
  .yellow {
    background: #ffbd2e;
  }
  .green {
    background: #27c93f;
  }
`;

const TerminalBody = styled.div`
  padding: 1.5rem;
  font-family: "Fira Code", "Courier New", monospace;
  font-size: 0.9rem;
  line-height: 1.7;
  overflow-x: auto;

  .command {
    color: #00ff85;
  }
  .comment {
    color: #555;
  }
  .string {
    color: #3b82f6;
  }
  .group {
    margin-bottom: 1.5rem;
  }
  h4 {
    color: #fff;
    margin-bottom: 0.5rem;
    font-size: 0.8rem;
    text-transform: uppercase;
    opacity: 0.5;
  }
`;

// --- Main Component ---
const InterstellarLanding = () => {
  return (
    <>
      <GlobalStyle />
      <Navbar>
        <Logo>
          <div
            style={{ background: "#fff", padding: "4px", borderRadius: "4px" }}
          >
            <Terminal size={18} color="#000" />
          </div>
          Interstellar
        </Logo>
        <NavButtons>
          <Button primary>Contact</Button>
        </NavButtons>
      </Navbar>

      <Container>
        <Hero>
          <Badge>v1.0.1 Now Available</Badge>
          <Headline>Check And Keep Your API Endpoints Alive</Headline>
          <Subline>
            The world's fastest CLI tool for monitoring distributed nodes.
            Real-time pings, global health checks, and zero-config deployment.
          </Subline>

          <div
            style={{
              display: "flex",
              gap: "1rem",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Button
              primary
              style={{ padding: "0.8rem 2rem", fontSize: "1rem" }}
            >
              Get Started{" "}
              <ChevronRight
                size={16}
                style={{ verticalAlign: "middle", marginLeft: "4px" }}
              />
            </Button>
            <a
              href="https://github.com/Chuks256/Interstellar"
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: "none" }}
            >
              <Button style={{ padding: "0.8rem 2rem", fontSize: "1rem" }}>
                View GitHub
              </Button>
            </a>
          </div>
        </Hero>

        <FeatureGrid>
          <FeatureCard>
            <Activity color="#00ff85" size={32} />
            <h3>Real-time Uptime</h3>
            <p>
              Monitor your api endpoint in real time for free from your command
              line.
            </p>
          </FeatureCard>
          <FeatureCard>
            <Shield color="#3b82f6" size={32} />
            <h3>Secure Auth</h3>
            <p>
              Locally stored signing keys ensure your node management is private
              and encrypted.
            </p>
          </FeatureCard>
          <FeatureCard>
            <Globe color="#a855f7" size={32} />
            <h3>Distributed Network</h3>
            <p>
              Manage and track nodes across multiple machines with seamless
              account continuity.
            </p>
          </FeatureCard>
        </FeatureGrid>

        <h2
          style={{ textAlign: "center", fontSize: "2rem", marginTop: "4rem" }}
        >
          Command Reference
        </h2>

        <TerminalSection>
          <TerminalHeader>
            <div className="dot red" />
            <div className="dot yellow" />
            <div className="dot green" />
            <span
              style={{ fontSize: "0.7rem", opacity: 0.5, marginLeft: "10px" }}
            >
              bash — interstellar-cli
            </span>
          </TerminalHeader>
          <TerminalBody>
            <div className="group">
              <h4>Installation</h4>
              <p>
                <span className="command">npm install</span> -g
                @chuks2001/interstellar-cli
              </p>
            </div>

            <div className="group">
              <h4>Account Management</h4>
              <p>
                <span className="command">--createAccount</span>{" "}
                <span className="string">&lt;user&gt; &lt;pass&gt;</span>{" "}
                <span className="comment"># New secure account</span>
              </p>
              <p>
                <span className="command">--signin</span>{" "}
                <span className="string">&lt;user&gt; &lt;pass&gt;</span>{" "}
                <span className="comment"># Access existing nodes</span>
              </p>
              <p>
                <span className="command">--myInfo</span>{" "}
                <span className="comment"># View account and machines</span>
              </p>
            </div>

            <div className="group">
              <h4>Node Management</h4>
              <p>
                <span className="command">--createNode</span>{" "}
                <span className="string">&lt;name&gt; &lt;url&gt;</span>
              </p>
              <p>
                <span className="command">--listNode</span>{" "}
                <span className="comment"># Status of all endpoints</span>
              </p>
              <p>
                <span className="command">--deleteNode</span>{" "}
                <span className="string">&lt;name&gt;</span>
              </p>
              <p>
                <span className="command">--updateNodeUrl</span>{" "}
                <span className="string">&lt;name&gt; &lt;newUrl&gt;</span>
              </p>
            </div>

            <div className="group">
              <h4>General</h4>
              <p>
                <span className="command">--help</span>{" "}
                <span className="comment"># Comprehensive reference</span>
              </p>
              <p>
                <span className="command">--version</span>
              </p>
            </div>
          </TerminalBody>
        </TerminalSection>
      </Container>

      <footer
        style={{
          padding: "4rem 1.5rem",
          borderTop: "1px solid var(--border)",
          textAlign: "center",
        }}
      >
        <div style={{ opacity: 0.4, fontSize: "0.8rem" }}>
          &copy; 2026 Interstellar CLI. Built for the distributed web.
        </div>
      </footer>
    </>
  );
};

export default InterstellarLanding;
