import React from "react";
import {
  Heart,
  MessageSquare,
  Wind,
  ClipboardList,
  BarChart3,
  Lock,
  PhoneCall,
  Home,
  Cpu,
} from "lucide-react";

export default function Navbar({
  activeTab,
  setActiveTab,
  onOpenEmergency,
  onOpenAiInsight,
}) {
  const navItems = [
    {
      id: "home",
      label: "Home",
      icon: Home,
    },
    {
      id: "chat",
      label: "Chat",
      icon: MessageSquare,
    },
    {
      id: "coping",
      label: "Breathe",
      icon: Wind,
    },
    {
      id: "checkin",
      label: "Check In",
      icon: ClipboardList,
    },
    {
      id: "dashboard",
      label: "Wellness",
      icon: BarChart3,
    },
    {
      id: "journal",
      label: "Journal",
      icon: Lock,
    },
  ];

  return (
    <header className="milly-navbar">

      <div className="milly-navbar-inner">

        {/* =========================
            MILLY
        ========================= */}

        <button
          className="milly-logo"
          onClick={() => setActiveTab("home")}
        >
          <span className="milly-logo-icon">
            <Heart size={16} fill="currentColor" />
          </span>

          <span className="milly-logo-text">
            MILLY
          </span>
        </button>


        {/* =========================
            NAVIGATION
        ========================= */}

        <nav className="milly-nav">

          {navItems.map((item) => {
            const Icon = item.icon;

            const isActive =
              activeTab === item.id;

            return (
              <button
                key={item.id}
                className={`milly-nav-item ${
                  isActive ? "active" : ""
                }`}
                onClick={() =>
                  setActiveTab(item.id)
                }
              >
                <Icon size={16} />

                <span>
                  {item.label}
                </span>
              </button>
            );
          })}

        </nav>


        {/* =========================
            RIGHT SIDE
        ========================= */}

        <div className="milly-nav-actions">

          {/* AI INSIGHT */}

          <button
            className="milly-ai-button"
            onClick={onOpenAiInsight}
            title="AI Insight"
          >
            <Cpu size={16} />

            <span>AI</span>
          </button>


          {/* EMERGENCY HELP */}

          <button
            className="milly-help-button"
            onClick={onOpenEmergency}
          >
            <PhoneCall size={16} />

            <span>Help</span>
          </button>

        </div>

      </div>

    </header>
  );
}


/* =========================================================
   NAVBAR CSS
   ========================================================= */

const navbarStyles = `
.milly-navbar {

  position: fixed;

  top: 0;
  left: 0;
  right: 0;

  height: 68px;

  z-index: 9999;

  background:
    rgba(37, 36, 42, 0.88);

  backdrop-filter:
    blur(20px);

  -webkit-backdrop-filter:
    blur(20px);

  border-bottom:
    1px solid
    rgba(210, 190, 230, 0.10);
}


.milly-navbar-inner {

  width:
    min(1420px, calc(100% - 40px));

  height: 100%;

  margin: 0 auto;

  display: flex;

  align-items: center;

  gap: 22px;
}


/* =========================================================
   LOGO
   ========================================================= */

.milly-logo {

  display: flex;

  align-items: center;

  gap: 9px;

  flex-shrink: 0;

  border: none;

  background: transparent;

  color: #eee7f2;

  cursor: pointer;

  padding: 5px;

  font-family: inherit;
}


.milly-logo-icon {

  width: 34px;
  height: 34px;

  display: flex;

  align-items: center;
  justify-content: center;

  border-radius: 12px;

  color: #302936;

  background:
    #cdb5e8;

  box-shadow:
    0 0 22px
    rgba(205, 181, 232, 0.15);

  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}


.milly-logo:hover
.milly-logo-icon {

  transform:
    scale(1.05);

  box-shadow:
    0 0 28px
    rgba(205, 181, 232, 0.25);
}


.milly-logo-text {

  font-size: 15px;

  font-weight: 600;

  letter-spacing: 0.14em;
}


/* =========================================================
   NAVIGATION
   ========================================================= */

.milly-nav {

  display: flex;

  align-items: center;

  gap: 3px;

  flex: 1;

  justify-content: center;
}


.milly-nav-item {

  display: flex;

  align-items: center;

  gap: 7px;

  padding:
    9px
    12px;

  border: none;

  border-radius: 11px;

  background: transparent;

  color: #918996;

  font-family: inherit;

  font-size: 12px;

  font-weight: 500;

  cursor: pointer;

  transition:
    color 0.2s ease,
    background 0.2s ease,
    box-shadow 0.2s ease;
}


.milly-nav-item:hover {

  color: #d9cde3;

  background:
    rgba(205, 181, 232, 0.07);
}


.milly-nav-item.active {

  color: #e4d8ec;

  background:
    rgba(205, 181, 232, 0.12);

  box-shadow:
    inset 0 0 0 1px
    rgba(205, 181, 232, 0.08);
}


.milly-nav-item.active svg {

  color: #cdb5e8;
}


/* =========================================================
   RIGHT ACTIONS
   ========================================================= */

.milly-nav-actions {

  display: flex;

  align-items: center;

  gap: 8px;

  flex-shrink: 0;
}


/* AI */

.milly-ai-button {

  height: 35px;

  padding:
    0
    12px;

  display: flex;

  align-items: center;

  justify-content: center;

  gap: 6px;

  border-radius: 10px;

  border:
    1px solid
    rgba(205, 181, 232, 0.12);

  background:
    rgba(205, 181, 232, 0.06);

  color: #a99eaf;

  font-family: inherit;

  font-size: 11px;

  cursor: pointer;

  transition:
    all 0.2s ease;
}


.milly-ai-button:hover {

  color: #dfd0eb;

  background:
    rgba(205, 181, 232, 0.12);

  box-shadow:
    0 0 18px
    rgba(205, 181, 232, 0.08);
}


/* HELP */

.milly-help-button {

  height: 35px;

  padding:
    0
    14px;

  display: flex;

  align-items: center;

  justify-content: center;

  gap: 7px;

  border-radius: 11px;

  border:
    1px solid
    rgba(225, 139, 145, 0.18);

  background:
    rgba(225, 139, 145, 0.10);

  color: #dca2a9;

  font-family: inherit;

  font-size: 11px;

  font-weight: 500;

  cursor: pointer;

  transition:
    all 0.2s ease;
}


.milly-help-button:hover {

  color: #efc1c5;

  background:
    rgba(225, 139, 145, 0.17);

  box-shadow:
    0 0 20px
    rgba(225, 139, 145, 0.10);
}


/* =========================================================
   MOBILE
   ========================================================= */

@media (max-width: 1050px) {

  .milly-navbar-inner {

    width:
      calc(100% - 24px);

    gap: 10px;
  }


  .milly-nav-item {

    padding:
      9px;
  }


  .milly-nav-item span {

    display: none;
  }
}


@media (max-width: 700px) {

  .milly-navbar {

    height: 60px;
  }


  .milly-navbar-inner {

    width:
      calc(100% - 16px);
  }


  .milly-logo-text {

    display: none;
  }


  .milly-nav {

    gap: 1px;
  }


  .milly-nav-item {

    padding:
      8px;
  }


  .milly-ai-button span,
  .milly-help-button span {

    display: none;
  }


  .milly-ai-button,
  .milly-help-button {

    width: 34px;

    padding: 0;
  }
}
`;


/* Add CSS once */

if (
  typeof document !== "undefined" &&
  !document.getElementById("milly-navbar-styles")
) {
  const style = document.createElement("style");

  style.id = "milly-navbar-styles";

  style.textContent = navbarStyles;

  document.head.appendChild(style);
}