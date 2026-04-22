// src/components/AccessibilityToggle.test.jsx
import { render, screen, fireEvent } from "@testing-library/react";
import AccessibilityToggle from "./AccessibilityToggle";

// Mock localStorage
const localStorageMock = (() => {
    let store = {};
    return {
        getItem: (key) => store[key] || null,
        setItem: (key, value) => { store[key] = value.toString(); },
        clear: () => { store = {}; },
    };
})();
Object.defineProperty(window, "localStorage", { value: localStorageMock });

describe("AccessibilityToggle", () => {
    beforeEach(() => localStorageMock.clear());

    test("renders with correct label in standard mode", () => {
        render(<AccessibilityToggle />);
        expect(screen.getByRole("button", { name: /high contrast/i })).toBeInTheDocument();
    });

    test("toggles to high contrast when clicked", () => {
        render(<AccessibilityToggle />);
        const btn = screen.getByRole("button");
        fireEvent.click(btn);
        expect(document.documentElement.getAttribute("data-theme")).toBe("high-contrast");
        expect(btn).toHaveAttribute("aria-pressed", "true");
    });

    test("saves preference to localStorage", () => {
        render(<AccessibilityToggle />);
        fireEvent.click(screen.getByRole("button"));
        expect(localStorageMock.getItem("highContrast")).toBe("true");
    });
});