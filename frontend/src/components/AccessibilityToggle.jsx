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
            background: highContrast ? "#1a1a1a" : "#ffffff",
            border: highContrast ? "2px solid #ffffff" : "2px solid #ccc",
            borderRadius: "999px",
            padding: "8px 16px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
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
                background: highContrast ? "#ffff00" : "#ccc",
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
                    background: highContrast ? "#000000" : "#ffffff",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
                    transition: "left 0.2s",
                }} />
            </div>
            {/* Label */}
            <span style={{
                fontSize: "13px",
                fontWeight: "600",
                color: highContrast ? "#ffffff" : "#333333",
                whiteSpace: "nowrap",
            }}>
                High contrast
            </span>
        </div>
    );
}