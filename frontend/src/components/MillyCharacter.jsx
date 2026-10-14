
import { useEffect, useState } from "react";

export default function MillyCharacter({ state = "idle" }) {
  const [blinking, setBlinking] = useState(false);

  useEffect(() => {
    let blinkTimer;
    let openTimer;
    let cancelled = false;

    function scheduleBlink() {
      blinkTimer = setTimeout(() => {
        if (cancelled) return;
        setBlinking(true);

        openTimer = setTimeout(() => {
          if (cancelled) return;
          setBlinking(false);
          scheduleBlink();
        }, 140);
      }, 2200 + Math.random() * 2600);
    }

    scheduleBlink();

    return () => {
      cancelled = true;
      clearTimeout(blinkTimer);
      clearTimeout(openTimer);
    };
  }, []);

  const colors = {
    head: "#cbb4f4",
    body: "#bca0ed",
    outline: "#f0e5ff",
    face: "#392b49",
    cheeks: "#d994b5",
  };

  return (
    <div
      className={`mfx-character mfx-${state}`}
      role="img"
      aria-label="MILLY, your friendly companion"
      style={{
        position: "relative",
        width: 180,
        height: 235,
        flex: "0 0 180px",
        margin: "0 auto",
        overflow: "visible",
        isolation: "isolate",
      }}
    >
      <style>{`
        @keyframes mfx-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }

        @keyframes mfx-dots {
          0%, 80%, 100% { opacity: .35; transform: translateY(0); }
          40% { opacity: 1; transform: translateY(-4px); }
        }

        .mfx-character.mfx-idle {
          animation: mfx-float 3s ease-in-out infinite;
        }

        .mfx-eye {
          width: 11px;
          height: 15px;
          display: block;
          position: relative;
          background: #392b49;
          border-radius: 50%;
          transition: height 100ms ease;
        }

        .mfx-eye::after {
          content: "";
          position: absolute;
          top: 3px;
          left: 3px;
          width: 3px;
          height: 4px;
          background: white;
          border-radius: 50%;
        }

        .mfx-eye-closed {
          height: 2px !important;
          margin-top: 7px;
        }

        .mfx-eye-closed::after {
          display: none;
        }
      `}</style>

      {/* Antenna stem */}
      <div
        style={{
          position: "absolute",
          zIndex: 4,
          top: 12,
          left: 88,
          width: 3,
          height: 22,
          background: colors.outline,
          borderRadius: 5,
          transform: "rotate(12deg)",
        }}
      />

      {/* Antenna tip */}
      <span
        style={{
          position: "absolute",
          zIndex: 5,
          top: 3,
          left: 84,
          width: 17,
          height: 23,
          background: colors.head,
          border: `2px solid ${colors.outline}`,
          borderRadius: "80% 30% 70% 30%",
          transform: "rotate(28deg)",
          boxSizing: "border-box",
        }}
      />

      {/* Ears: behind the head */}
      <div
        style={{
          position: "absolute",
          zIndex: 1,
          top: 66,
          left: 15,
          width: 29,
          height: 37,
          background: colors.body,
          border: `2px solid ${colors.outline}`,
          borderRadius: "50%",
          transform: "rotate(-20deg)",
          boxSizing: "border-box",
        }}
      />

      <div
        style={{
          position: "absolute",
          zIndex: 1,
          top: 66,
          right: 15,
          width: 29,
          height: 37,
          background: colors.body,
          border: `2px solid ${colors.outline}`,
          borderRadius: "50%",
          transform: "rotate(20deg)",
          boxSizing: "border-box",
        }}
      />

      {/* Body: positioned below the head */}
      <div
        style={{
          position: "absolute",
          zIndex: 1,
          top: 151,
          left: 40,
          width: 100,
          height: 62,
          background: colors.body,
          border: `3px solid ${colors.outline}`,
          borderRadius: "28px 28px 24px 24px",
          boxSizing: "border-box",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 8px 18px #120b1c22",
        }}
      >
        <span style={{ color: "#fff", fontSize: 23 }}>♡</span>
      </div>

      {/* Head */}
      <div
        style={{
          position: "absolute",
          zIndex: 2,
          top: 35,
          left: 28,
          width: 124,
          height: 112,
          background: colors.head,
          border: `3px solid ${colors.outline}`,
          borderRadius: "44% 44% 40% 40%",
          boxSizing: "border-box",
          boxShadow: "0 8px 20px #120b1c22",
        }}
      >
        {/* Eyes */}
        <div
          style={{
            position: "absolute",
            top: 34,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 27,
          }}
        >
          {[0, 1].map((eye) => (
            <span
              key={eye}
              className={`mfx-eye${blinking ? " mfx-eye-closed" : ""}`}
            />
          ))}
        </div>

        {/* Cheeks */}
        <span
          style={{
            position: "absolute",
            top: 64,
            left: 13,
            width: 15,
            height: 8,
            background: colors.cheeks,
            borderRadius: "50%",
          }}
        />

        <span
          style={{
            position: "absolute",
            top: 64,
            right: 13,
            width: 15,
            height: 8,
            background: colors.cheeks,
            borderRadius: "50%",
          }}
        />

        {/* Mouth */}
        <div
          style={{
            position: "absolute",
            top: 63,
            left: 0,
            right: 0,
            textAlign: "center",
            color: colors.face,
            fontSize: 22,
            lineHeight: 1,
          }}
        >
          {state === "thinking" ? "•" : "ᴗ"}
        </div>
      </div>

      {/* Thinking indicator */}
      {state === "thinking" && (
        <div
          style={{
            position: "absolute",
            top: 18,
            right: 3,
            zIndex: 6,
            display: "flex",
            gap: 5,
          }}
        >
          {[0, 1, 2].map((dot) => (
            <span
              key={dot}
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: colors.head,
                animation: `mfx-dots 1s ${dot * 0.18}s infinite`,
              }}
            />
          ))}
        </div>
      )}

      {/* Listening indicator */}
      {state === "listening" && (
        <span
          style={{
            position: "absolute",
            top: 23,
            right: 1,
            zIndex: 6,
            color: colors.head,
            fontSize: 25,
          }}
        >
          ✦
        </span>
      )}
    </div>
  );
}
