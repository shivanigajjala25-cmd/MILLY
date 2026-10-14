
import React from "react";
import MillyCharacter from "../components/MillyCharacter";

const sections = [
  { title: "Breathing", icon: "◎", tab: "breathing" },
  { title: "Grounding", icon: "✧", tab: "grounding" },
  { title: "Muscle relaxation", icon: "☾", tab: "relaxation" },
  { title: "Safe place", icon: "☁", tab: "safeplace" },
  { title: "Calm Sanctuary", icon: "♡", tab: "calm" },
  { title: "Private journal", icon: "✎", tab: "journal" },
  { title: "Talk to MILLY", icon: "☏", tab: "chat" },
  { title: "Daily check-in", icon: "◷", tab: "checkin" },
  { title: "My wellness", icon: "♡", tab: "dashboard" },
];

export default function Home({ setActiveTab = () => {} }) {
  return (
    <main className="milly-final-home">
      <style>{`
        .milly-final-home {
          --milly-lilac: #cbb4f4;
          --milly-text: #f5effb;
          --milly-muted: #bcb0c9;
          max-width: 1500px;
          margin: 0 auto;
          padding: 30px clamp(20px, 5vw, 76px) 40px;
          color: var(--milly-text);
          font-family: inherit;
        }
        .mfh-header {
          display:flex; justify-content:space-between; align-items:center;
          padding-bottom:22px; border-bottom:1px solid #ffffff20;
        }
        .mfh-brand {font-size:25px;font-weight:900;letter-spacing:1px}
        .mfh-note {color:var(--milly-muted);font-size:15px}
        .mfh-hero {
          min-height:540px; display:grid; grid-template-columns:1.1fr .9fr;
          align-items:center; gap:30px; padding:48px 0 65px;
        }
        .mfh-eyebrow {
          color:var(--milly-lilac);font-weight:800;letter-spacing:3px;
          font-size:12px;margin:0 0 25px;
        }
        .mfh-copy h1 {
          font-size:clamp(42px,5.2vw,76px);line-height:1.04;
          letter-spacing:-2.8px;margin:0 0 24px;font-weight:850;
        }
        .mfh-copy h1 span {color:var(--milly-lilac)}
        .mfh-description {
          max-width:540px;color:var(--milly-muted);font-size:17px;
          line-height:1.85;margin:0 0 28px;
        }
        .mfh-primary {
          display:inline-flex;align-items:center;gap:25px;
          border:0;border-radius:40px;background:var(--milly-lilac);
          color:#29202f;padding:17px 25px;font-size:16px;font-weight:700;
          cursor:pointer;transition:transform .2s,filter .2s;
        }
        .mfh-primary:hover {transform:translateY(-2px);filter:brightness(1.06)}
        .mfh-footnote {color:var(--milly-muted);font-size:13px;margin-top:15px}
        .mfh-character {
          min-height:390px;position:relative;display:flex;
          flex-direction:column;align-items:center;justify-content:center;
          overflow:hidden;border-radius:48% 48% 42% 42%;
          background:radial-gradient(ellipse,#4c3b5d 0%,#302737 45%,transparent 75%);
        }
        .mfh-orbit {
          position:absolute;border:1px solid #cbb4f433;border-radius:50%;
          width:300px;height:300px;
        }
        .mfh-orbit-two {width:390px;height:390px}
        .mfh-character-inner {position:relative;z-index:1;text-align:center}
        .mfh-character-inner .milly-creature {
          transform:scale(1.6);margin:0 auto 50px;
        }
        .mfh-character-name {font-size:23px;letter-spacing:9px;color:var(--milly-lilac);margin:15px 0 8px}
        .mfh-character-caption {color:var(--milly-muted);font-size:14px}
        .mfh-star {position:absolute;color:var(--milly-lilac);font-size:27px}
        .mfh-star-one {top:20%;right:18%}
        .mfh-star-two {bottom:19%;left:16%}
        .mfh-sections {border-top:1px solid #ffffff20;padding-top:36px}
        .mfh-section-heading {
          display:flex;justify-content:space-between;align-items:end;
          gap:15px;margin-bottom:20px;flex-wrap:wrap;
        }
        .mfh-section-heading h2 {font-size:clamp(23px,3vw,34px);margin:0}
        .mfh-section-heading p {color:var(--milly-muted);margin:0;font-size:14px}
        .mfh-list {display:flex;flex-direction:column;gap:10px}
        .mfh-section-button {
          width:100%;display:flex;align-items:center;gap:16px;
          text-align:left;padding:17px 20px;border:1px solid #ffffff18;
          border-radius:15px;background:#ffffff05;color:var(--milly-text);
          cursor:pointer;font:inherit;transition:background .2s,border-color .2s,transform .2s;
        }
        .mfh-section-button:hover {
          background:#cbb4f414;border-color:#cbb4f477;transform:translateX(3px);
        }
        .mfh-section-icon {color:var(--milly-lilac);font-size:22px;width:28px;text-align:center}
        .mfh-section-title {font-size:16px;font-weight:650;flex:1}
        .mfh-arrow {color:var(--milly-muted);font-size:19px}
        .mfh-footer {
          text-align:center;border-top:1px solid #ffffff18;
          margin-top:42px;padding-top:24px;color:var(--milly-muted);
          font-size:12px;line-height:1.8;
        }

        /* Keep MILLY's face visible if older global styles interfere. */
        .milly-final-home .milly-creature {
          position:relative!important;display:flex!important;
          flex-direction:column!important;align-items:center!important;
          width:150px!important;height:155px!important;overflow:visible!important;
          opacity:1!important;visibility:visible!important;
        }
        .milly-final-home .milly-creature-body {
          position:relative!important;width:112px!important;height:112px!important;
          display:flex!important;align-items:center!important;justify-content:center!important;
          background:#cbb4f4!important;border:3px solid #e8dafa!important;
          border-radius:42% 42% 38% 38%!important;box-shadow:0 12px 35px #0003!important;
        }
        .milly-final-home .milly-face {
          position:relative!important;display:flex!important;flex-direction:column!important;
          align-items:center!important;justify-content:center!important;
          width:100%!important;height:100%!important;
        }
        .milly-final-home .milly-eyes {display:flex!important;gap:25px!important}
        .milly-final-home .milly-eye {
          display:block!important;width:10px!important;height:15px!important;
          border-radius:50%!important;background:#362940!important;
          animation:mfh-blink 4s infinite!important;
        }
        .milly-final-home .milly-mouth {display:block!important;color:#362940!important;font-size:22px!important}
        .milly-final-home .milly-cheek {
          position:absolute!important;top:61%!important;width:12px!important;height:7px!important;
          border-radius:50%!important;background:#d98fae!important;
        }
        .milly-final-home .milly-cheek.left {left:13%!important}
        .milly-final-home .milly-cheek.right {right:13%!important}
        .milly-final-home .milly-tuft {
          position:absolute!important;top:-8px!important;width:23px!important;height:16px!important;
          background:#cbb4f4!important;border-radius:80% 20% 70% 20%!important;
          transform:rotate(-20deg)!important;
        }
        .milly-final-home .milly-foot {
          position:absolute!important;bottom:-9px!important;width:25px!important;height:16px!important;
          background:#a88bd6!important;border-radius:0 0 10px 10px!important;
        }
        .milly-final-home .milly-foot.left {left:19px!important}
        .milly-final-home .milly-foot.right {right:19px!important}
        .milly-final-home .milly-tail {display:none!important}
        @keyframes mfh-blink {
          0%,44%,48%,100% {transform:scaleY(1)}
          46% {transform:scaleY(.12)}
        }
        @media(max-width:760px) {
          .milly-final-home {padding:20px 18px 30px}
          .mfh-hero {grid-template-columns:1fr;padding:40px 0;gap:15px}
          .mfh-copy h1 {font-size:clamp(42px,10vw,62px);letter-spacing:-1.8px}
          .mfh-character {min-height:330px}
          .mfh-section-heading {align-items:flex-start;flex-direction:column}
          .mfh-section-button {padding:16px}
        }
      `}</style>

      <header className="mfh-header">
        <span className="mfh-brand">MILLY</span>
        <span className="mfh-note">A little space to breathe</span>
      </header>

      <section className="mfh-hero">
        <div className="mfh-copy">
          <p className="mfh-eyebrow">✦ YOUR SPACE, YOUR PACE</p>
          <h1>
            You don't have to<br />
            figure it all out<br />
            <span>right now.</span>
          </h1>
          <p className="mfh-description">
            Some days are heavier than others. Take a moment, settle in,
            and start wherever you are.
          </p>
          <button className="mfh-primary" onClick={() => setActiveTab("chat")}>
            Talk to MILLY <span>↗</span>
          </button>
          <p className="mfh-footnote">No pressure to have the right words.</p>
        </div>

        <div className="mfh-character">
          <div className="mfh-orbit" />
          <div className="mfh-orbit mfh-orbit-two" />
          <div className="mfh-character-inner">
            <MillyCharacter state="idle" />
            <h2 className="mfh-character-name">MILLY</h2>
            <p className="mfh-character-caption">♡ One moment at a time</p>
          </div>
          <span className="mfh-star mfh-star-one">✧</span>
          <span className="mfh-star mfh-star-two">✳</span>
        </div>
      </section>

      <section className="mfh-sections">
        <div className="mfh-section-heading">
          <div>
            <p className="mfh-eyebrow">HERE WHEN YOU NEED IT</p>
            <h2>Your spaces</h2>
          </div>
          <p>Choose a section to open it.</p>
        </div>

        <div className="mfh-list">
          {sections.map((section) => (
            <button
              type="button"
              key={section.tab}
              className="mfh-section-button"
              onClick={() => setActiveTab(section.tab)}
            >
              <span className="mfh-section-icon">{section.icon}</span>
              <span className="mfh-section-title">{section.title}</span>
              <span className="mfh-arrow">↗</span>
            </button>
          ))}
        </div>
      </section>

      <footer className="mfh-footer">
        MILLY is an educational emotional-support companion, not a replacement
        for professional mental-health care.
      </footer>
    </main>
  );
}
