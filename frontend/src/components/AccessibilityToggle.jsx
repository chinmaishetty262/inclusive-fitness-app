import { useState, useEffect } from "react";

export default function AccessibilityToggle() {
    const [highContrast, setHighContrast] = useState(() => {
        return localStorage.getItem("highContrast") === "true";
    });

    useEffect(() => {
        if (highContrast) {
            document.documentElement.setAttribute("data-theme", "high-contrast");
        } else {
            document.documentElement.removeAttribute("data-theme");
        }
        localStorage.setItem("highContrast", highContrast);
    }, [highContrast]);

    return (
        <div style={{
            position: "fixed",
            bottom: "24px",
            left: "24px",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            gap: "10px",
            background: highContrast ? "var(--bg-secondary)" : "var(--bg)",
            border: highContrast ? "2px solid var(--border)" : "2px solid rgba(0,0,0,0.12)",
            borderRadius: "999px",
            padding: "8px 16px",
            boxShadow: "0 2px 8px rgba(18, 33, 60, 0.12)",
            cursor: "pointer",
        }}
            onClick={() => setHighContrast(prev => !prev)}
            role="button"
            aria-pressed={highContrast}
            aria-label={highContrast ? "Switch to standard contrast" : "Switch to high contrast"}
        >
            {/* The toggle track */}
            <div style={{
                width: "44px",
                height: "24px",
                borderRadius: "999px",
                background: highContrast ? "var(--accent)" : "rgba(0,0,0,0.15)",
                position: "relative",
                transition: "background 0.2s",
                flexShrink: 0,
            }}>
                {/* The toggle thumb */}
                <div style={{
                    position: "absolute",
                    top: "3px",
                    left: highContrast ? "23px" : "3px",
                    width: "18px",
                    height: "18px",
                    borderRadius: "50%",
                    background: highContrast ? "var(--bg)" : "var(--bg-secondary)",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.15)",
                    transition: "left 0.2s",
                }} />
            </div>
            {/* Label */}
            <span style={{
                fontSize: "13px",
                fontWeight: "600",
                color: "var(--text)",
                whiteSpace: "nowrap",
            }}>
                High contrast
            </span>
        </div>
    );
}