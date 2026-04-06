import React from "react";
import styled, { createGlobalStyle, keyframes } from "styled-components";
import { Terminal, Globe, Activity, ChevronRight, Shield } from "lucide-react";

// --- Animations ---
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

// --- Global Styles ---
const GlobalStyle = createGlobalStyle`
  :root {
    --bg: #050505;
    --accent: #ffffff;
    --gray: #888888;
    --border: rgba(255, 255, 255, 0.08);
  }

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    background-color: var(--bg);
    /* Subtle Grid Pattern from your reference image */
    background-image: 
      linear-gradient(var(--border) 1px, transparent 1px),
      linear-gradient(90deg, var(--border) 1px, transparent 1px);
    background-size: 40px 40px;
    color: var(--accent);
    font-family: 'Inter', -apple-system, sans-serif;
    -webkit-font-smoothing: antialiased;
    display: flex;
    justify-content: center;
  }
`;

// --- Styled Components ---
const Navbar = styled.nav`
  position: fixed;
  top: 0;
  width: 100%;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 5%;
  background: rgba(5, 5, 5, 0.8);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--border);
  z-index: 1000;
`;

const LogoWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;

  img {
    width: 24px;
    height: 24px;
    border-radius: 4px;
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: 30px;
  font-size: 0.85rem;
  color: var(--gray);

  span {
    cursor: pointer;
    transition: color 0.2s;
    &:hover {
      color: #fff;
    }
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

const MainContainer = styled.div`
  width: 100%;
  max-width: 1100px;
  margin-top: 150px;
  padding: 0 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Hero = styled.section`
  text-align: center;
  max-width: 800px;
  animation: ${fadeIn} 1s ease-out;
`;

const Headline = styled.h1`
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 800;
  line-height: 1.2;
  margin-bottom: 24px;
  /* Pixel font feel */
  font-family: "Courier New", Courier, monospace;
  letter-spacing: -1px;
`;

const Subline = styled.p`
  font-size: 1.1rem;
  color: var(--gray);
  margin-bottom: 40px;
  line-height: 1.6;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-bottom: 100px;
`;

const PrimaryButton = styled.button`
  background: #fff;
  color: #000;
  border: none;
  padding: 12px 28px;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: opacity 0.2s;
  &:hover {
    opacity: 0.9;
  }
`;

const GhostButton = styled.button`
  background: transparent;
  color: #fff;
  border: 1px solid var(--border);
  padding: 12px 28px;
  border-radius: 6px;
  cursor: pointer;
  &:hover {
    background: rgba(255, 255, 255, 0.05);
  }
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  width: 100%;
  margin-bottom: 100px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--border);
  padding: 30px;
  border-radius: 12px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;

  h3 {
    font-size: 1rem;
    font-family: monospace;
  }
  p {
    font-size: 0.9rem;
    color: var(--gray);
  }
`;

const TerminalContainer = styled.div`
  width: 100%;
  background: #000;
  border: 1px solid var(--border);
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 100px;
`;

const TerminalHeader = styled.div`
  background: #111;
  padding: 12px 20px;
  display: flex;
  gap: 8px;
  border-bottom: 1px solid var(--border);
  .dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
  }
`;

const InterstellarLanding = () => {
  return (
    <>
      <GlobalStyle />
      <Navbar>
        <LogoWrapper>
          <img src="Rectangle 5.png" alt="Logo" />
          Interstellar
        </LogoWrapper>
        <NavLinks>
          <span>About</span>
          <span>Blog</span>
          <span>Documentation</span>
        </NavLinks>
        <NavButtons>
          <PrimaryButton style={{ padding: "8px 16px", fontSize: "0.8rem" }}>
            Contact
          </PrimaryButton>
        </NavButtons>
      </Navbar>

      <MainContainer>
        <Hero>
          <Headline>Check And Keep Your API Endpoints Alive</Headline>
          <Subline>
            Monitor your api endpoint in real time
            <br />
            For free from your command line
          </Subline>

          <ButtonGroup>
            <PrimaryButton>Get Started</PrimaryButton>
            <a
              href="https://github.com/Chuks256/Interstellar"
              target="_blank"
              rel="noreferrer"
              style={{ textDecoration: "none" }}
            >
              <GhostButton>Learn more</GhostButton>
            </a>
          </ButtonGroup>
        </Hero>

        <FeatureGrid>
          <Card>
            <Activity color="#00ff85" />
            <h3>Real-time Uptime</h3>
            <p>Instant status checks for your services.</p>
          </Card>
          <Card>
            <Shield color="#3b82f6" />
            <h3>Secure Auth</h3>
            <p>Private keys stored safely on your machine.</p>
          </Card>
          <Card>
            <Globe color="#a855f7" />
            <h3>Global Network</h3>
            <p>Monitor from multiple regions effortlessly.</p>
          </Card>
        </FeatureGrid>

        <TerminalContainer>
          <TerminalHeader>
            <div className="dot" style={{ background: "#ff5f56" }} />
            <div className="dot" style={{ background: "#ffbd2e" }} />
            <div className="dot" style={{ background: "#27c93f" }} />
            <span
              style={{ color: "#555", fontSize: "0.7rem", marginLeft: "10px" }}
            >
              bash — interstellar-cli
            </span>
          </TerminalHeader>
          <div
            style={{
              padding: "20px",
              fontFamily: "monospace",
              fontSize: "0.9rem",
              lineHeight: "1.6",
            }}
          >
            <p>
              <span style={{ color: "#00ff85" }}>$ npm install</span> -g
              @chuks2001/interstellar-cli
            </p>
            <p style={{ color: "#555" }}># Create your first node</p>
            <p>
              <span style={{ color: "#00ff85" }}>$ interstellar</span>{" "}
              --createNode main-api https://api.yoursite.com
            </p>
          </div>
        </TerminalContainer>

        <footer
          style={{
            padding: "40px",
            borderTop: "1px solid var(--border)",
            width: "100%",
            textAlign: "center",
          }}
        >
          <p style={{ opacity: 0.3, fontSize: "0.7rem" }}>
            &copy; 2026 INTERSTELLAR CLI // DISTRIBUTED SYSTEMS
          </p>
        </footer>
      </MainContainer>
    </>
  );
};

export default InterstellarLanding;
