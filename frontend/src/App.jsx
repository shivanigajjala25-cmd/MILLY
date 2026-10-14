
import { useState } from "react";

import Home from "./pages/Home";
import Chat from "./pages/Chat";
import CopingToolkit from "./pages/CopingToolkit";
import CheckIn from "./pages/CheckIn";
import Dashboard from "./pages/Dashboard";
import Journal from "./pages/Journal";

import EmergencyModal from "./components/EmergencyModal";
import AiInsightModal from "./components/AiInsightModal";

const pageTitles = {
  home: "A space for you",
  chat: "Let's talk",
  breathing: "Breathing",
  grounding: "Grounding exercises",
  relaxation: "Muscle relaxation",
  safeplace: "Safe place",
  calm: "Calm sanctuary",
  checkin: "How are you feeling?",
  dashboard: "Your wellness",
  journal: "Your private journal",
};

export default function App() {
  const [activeTab, setActiveTab] = useState("home");
  const [showEmergency, setShowEmergency] = useState(false);
  const [showAiInsight, setShowAiInsight] = useState(false);

  const copingSections = {
    breathing: "box",
    grounding: "54321",
    relaxation: "pmr",
    safeplace: "safeplace",
    calm: "calm",
  };

  function renderPage() {
    switch (activeTab) {
      case "chat":
        return <Chat setActiveTab={setActiveTab} />;

      case "breathing":
      case "grounding":
      case "relaxation":
      case "safeplace":
      case "calm":
        return (
          <CopingToolkit
            key={activeTab}
            initialSection={copingSections[activeTab]}
            setActiveTab={setActiveTab}
          />
        );

      case "coping":
        return <CopingToolkit setActiveTab={setActiveTab} />;

      case "checkin":
        return <CheckIn setActiveTab={setActiveTab} />;

      case "dashboard":
        return <Dashboard setActiveTab={setActiveTab} />;

      case "journal":
        return <Journal setActiveTab={setActiveTab} />;

      default:
        return <Home setActiveTab={setActiveTab} />;
    }
  }

  return (
    <div className="app-shell">
      {activeTab !== "home" && (
        <header className="app-topbar">
          <button
            className="brand-mark"
            onClick={() => setActiveTab("home")}
            aria-label="Go to home"
          >
            <span className="brand-symbol">m.</span>
            <span className="brand-name">milly</span>
          </button>

          <div className="topbar-page-title">
            {pageTitles[activeTab] || "Your space"}
          </div>

          <div className="topbar-actions">
            <button
              className="topbar-home-button"
              onClick={() => setActiveTab("home")}
            >
              Home
            </button>

            <button
              className="emergency-button"
              onClick={() => setShowEmergency(true)}
            >
              Need help?
            </button>
          </div>
        </header>
      )}

      <main className="app-main">{renderPage()}</main>

      {activeTab === "home" && (
        <button
          className="floating-help-button"
          onClick={() => setShowEmergency(true)}
          aria-label="Open emergency support information"
          title="Need urgent support?"
        >
          <span aria-hidden="true">♡</span>
        </button>
      )}

      <footer className="app-footer">
        <span className="footer-brand">milly</span>
        <span className="footer-note">
          A gentle companion, not a replacement for professional care.
        </span>
      </footer>

      {showEmergency && (
        <EmergencyModal onClose={() => setShowEmergency(false)} />
      )}

      {showAiInsight && (
        <AiInsightModal onClose={() => setShowAiInsight(false)} />
      )}
    </div>
  );
}
