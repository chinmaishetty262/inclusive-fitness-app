import { useState, useEffect } from "react";
import useLargeFont from '../useLargeFont';
import '../largeFontStyles.css';

export default function AccessibilityToggle() {
    const [highContrast, setHighContrast] = useState(() => {
        return localStorage.getItem("highContrast") === "true";
    });

    const { isLargeFont, toggleLargeFont } = useLargeFont();

    useEffect(() => {
        if (highContrast) {
            document.documentElement.setAttribute("data-theme", "high-contrast");
        } else {
            document.documentElement.removeAttribute("data-theme");
        }
        localStorage.setItem("highContrast", highContrast);
    }, [highContrast]);

    const pillStyle = {
        position: "fixed",
        bottom: "24px",
        left: "24px",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",   // stacks the two rows
        gap: "10px",
        background: highContrast ? "#1a1a1a" : "#ffffff",
        border: highContrast ? "2px solid #ffffff" : "2px solid #ccc",
        borderRadius: "16px",
        padding: "12px 16px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
    };

    const rowStyle = {
        display: "flex",
        alignItems: "center",
        gap: "10px",
        cursor: "pointer",
    };

    const trackStyle = (active, activeColor) => ({
        width: "44px",
        height: "24px",
        borderRadius: "999px",
        background: active ? activeColor : "#ccc",
        position: "relative",
        transition: "background 0.2s",
        flexShrink: 0,
    });

    const thumbStyle = (active) => ({
        position: "absolute",
        top: "3px",
        left: active ? "23px" : "3px",
        width: "18px",
        height: "18px",
        borderRadius: "50%",
        background: highContrast ? (active ? "#000000" : "#ffffff") : "#ffffff",
        boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
        transition: "left 0.2s",
    });

    const labelStyle = {
        fontSize: "13px",
        fontWeight: "600",
        color: highContrast ? "#ffffff" : "#333333",
        whiteSpace: "nowrap",
    };

    return (
        <div style={pillStyle}>

            {/* ── Large font row ── */}
            <div
                style={rowStyle}
                onClick={toggleLargeFont}
                role="switch"
                aria-checked={isLargeFont}
                aria-label={isLargeFont ? "Switch to standard font size" : "Switch to large font size"}
            >
                <div style={trackStyle(isLargeFont, "#a159c0")}>
                    <div style={thumbStyle(isLargeFont)} />
                </div>
                <span style={labelStyle}>Large font</span>
            </div>

            {/* ── Divider ── */}
            <div style={{
                height: "1px",
                background: highContrast ? "#444444" : "#e0e0e0",
            }} />

            {/* ── High contrast row ── */}
            <div
                style={rowStyle}
                onClick={() => setHighContrast(prev => !prev)}
                role="switch"
                aria-checked={highContrast}
                aria-label={highContrast ? "Switch to standard contrast" : "Switch to high contrast"}
            >
                <div style={trackStyle(highContrast, "#ffff00")}>
                    <div style={thumbStyle(highContrast)} />
                </div>
                <span style={labelStyle}>High contrast</span>
            </div>

        </div>
    );
}