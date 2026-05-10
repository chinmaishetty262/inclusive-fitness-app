import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
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

        const button = await screen.findByRole("button", {
            name: /high contrast/i,
        });

        expect(button).toBeInTheDocument();
        expect(button).toHaveAttribute("aria-pressed", "false");
    });

    test("toggles to high contrast when clicked", async () => {
        await act(async () => {
            render(<AccessibilityToggle />);
        });

        const btn = await screen.findByRole("button", {
            name: /high contrast/i,
        });

        await act(async () => {
            fireEvent.click(btn);
        });

        await waitFor(() => {
            expect(document.documentElement.getAttribute("data-theme"))
                .toBe("high-contrast");
        });

        expect(btn).toHaveAttribute("aria-pressed", "true");
    });

    test("saves preference to localStorage", async () => {
        await act(async () => {
            render(<AccessibilityToggle />);
        });

        const btn = await screen.findByRole("button", {
            name: /high contrast/i,
        });

        await act(async () => {
            fireEvent.click(btn);
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
