import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { act } from "react";
import AccessibilityToggle from "./AccessibilityToggle";

// Mock localStorage
const localStorageMock = (() => {
    let store = {};
    return {
        getItem: jest.fn((key) => store[key] || null),
        setItem: jest.fn((key, value) => {
            store[key] = value.toString();
        }),
        clear: jest.fn(() => {
            store = {};
        }),
    };
})();

Object.defineProperty(window, "localStorage", {
    value: localStorageMock,
    writable: true,
});

describe("AccessibilityToggle", () => {
    beforeEach(() => {
        localStorageMock.clear();
        jest.clearAllMocks();
        document.documentElement.removeAttribute("data-theme");
    });

    test("renders with correct label in standard mode", async () => {
        await act(async () => {
            render(<AccessibilityToggle />);
        });
        const toggle = await screen.findByRole("switch", {
            name: /switch to high contrast/i,
        });
        expect(toggle).toBeInTheDocument();
        expect(toggle).toHaveAttribute("aria-checked", "false");
    });

    test("toggles to high contrast when clicked", async () => {
        await act(async () => {
            render(<AccessibilityToggle />);
        });
        const toggle = await screen.findByRole("switch", {
            name: /switch to high contrast/i,
        });
        await act(async () => {
            fireEvent.click(toggle);
        });
        await waitFor(() => {
            expect(document.documentElement.getAttribute("data-theme"))
                .toBe("high-contrast");
        });
        expect(toggle).toHaveAttribute("aria-checked", "true");
    });

    test("saves preference to localStorage", async () => {
        await act(async () => {
            render(<AccessibilityToggle />);
        });
        const toggle = await screen.findByRole("switch", {
            name: /switch to high contrast/i,
        });
        await act(async () => {
            fireEvent.click(toggle);
        });
        await waitFor(() => {
            expect(localStorageMock.setItem).toHaveBeenCalled();
        });
        expect(localStorageMock.setItem).toHaveBeenLastCalledWith(
            "highContrast",
            true
        );
    });
});
