import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { FullScreenShowcase } from "./FullScreenShowcase";
import { LanguageProvider } from "../../context/LanguageContext";
import { ThemeProvider } from "../../context/ThemeContext";

function renderShowcase(props: {
  isOpen: boolean;
  initialIndex?: number;
  onClose?: () => void;
}) {
  return render(
    <ThemeProvider>
      <LanguageProvider>
        <MemoryRouter>
          <FullScreenShowcase
            isOpen={props.isOpen}
            initialIndex={props.initialIndex ?? 0}
            onClose={props.onClose ?? vi.fn()}
          />
        </MemoryRouter>
      </LanguageProvider>
    </ThemeProvider>
  );
}

describe("📱 FullScreenShowcase — Mobile & Desktop Suite", () => {
  beforeEach(() => {
    localStorage.clear();
    window.localStorage.setItem("climatify-lang", "ar");
  });

  afterEach(() => {
    cleanup();
  });

  it("does not render when isOpen is false", () => {
    const { container } = renderShowcase({ isOpen: false });
    expect(container.firstChild).toBeNull();
  });

  it("renders slide dialog, counter and initial slide when isOpen is true", () => {
    renderShowcase({ isOpen: true, initialIndex: 0 });
    const dialog = screen.getByRole("dialog");
    expect(dialog).toBeDefined();

    // Check header counter shows 01
    const currentNum = document.querySelector(".current-num");
    expect(currentNum?.textContent).toBe("01");

    // Check progress track is rendered
    expect(document.querySelector(".showcase-progress-bar")).toBeDefined();
  });

  it("allows switching categories and updates filtered slides", () => {
    renderShowcase({ isOpen: true, initialIndex: 0 });
    // Find category buttons in desktop and mobile strips
    const digitizationBtns = screen.getAllByRole("tab", { name: /الرقمنة المناخية/i });
    expect(digitizationBtns.length).toBeGreaterThan(0);

    // Click the first one
    fireEvent.click(digitizationBtns[0]!);

    // Should still display a slide from that category
    const activeSlideImage = document.querySelector(".showcase-slide-image") as HTMLImageElement;
    expect(activeSlideImage).toBeDefined();
    expect(activeSlideImage.src).toContain("/portfolio/");
  });

  it("toggles zoom in and reset zoom with the zoom button", () => {
    renderShowcase({ isOpen: true, initialIndex: 0 });

    const zoomBtn = screen.getByLabelText(/Zoom In/i);
    expect(zoomBtn).toBeDefined();

    // Click to zoom in (2.2x)
    fireEvent.click(zoomBtn);

    // Floating badge should appear
    expect(screen.getByText(/تكبير 2.2x/i)).toBeDefined();

    // Click zoom out / reset
    const zoomOutBtn = screen.getByLabelText(/Reset Zoom/i);
    fireEvent.click(zoomOutBtn);

    // Floating badge should be gone
    expect(screen.queryByText(/تكبير 2.2x/i)).toBeNull();
  });

  it("toggles the thumbnails strip expanded/collapsed state", () => {
    renderShowcase({ isOpen: true, initialIndex: 0 });

    const toggleBtn = screen.getByLabelText(/Toggle Thumbnails Strip/i);
    expect(toggleBtn).toBeDefined();

    // Initial state: expanded with thumbnails
    expect(document.querySelector(".showcase-cards-strip")).toBeDefined();

    // Click toggle to collapse
    fireEvent.click(toggleBtn);
    expect(document.querySelector(".showcase-cards-strip")).toBeNull();

    // Click again to re-expand
    fireEvent.click(toggleBtn);
    expect(document.querySelector(".showcase-cards-strip")).toBeDefined();
  });

  it("navigates next and prev via side navigation buttons", () => {
    renderShowcase({ isOpen: true, initialIndex: 0 });

    const nextBtn = screen.getByLabelText(/الشريحة التالية/i);
    fireEvent.click(nextBtn);

    // Slide counter should now show 02
    expect(document.querySelector(".current-num")?.textContent).toBe("02");

    const prevBtn = screen.getByLabelText(/الشريحة السابقة/i);
    fireEvent.click(prevBtn);

    // Should return to 01
    expect(document.querySelector(".current-num")?.textContent).toBe("01");
  });

  it("supports touch swipe gestures to navigate slides", () => {
    renderShowcase({ isOpen: true, initialIndex: 0 });

    const canvas = document.querySelector(".showcase-canvas-area");
    expect(canvas).toBeDefined();

    // Simulate horizontal swipe to the left (dx = -60) -> Next slide
    fireEvent.touchStart(canvas!, {
      touches: [{ clientX: 200, clientY: 200 }],
    });
    fireEvent.touchMove(canvas!, {
      touches: [{ clientX: 140, clientY: 200 }],
    });
    fireEvent.touchEnd(canvas!, {
      changedTouches: [{ clientX: 140, clientY: 200 }],
    });

    // Advanced to slide 02
    expect(document.querySelector(".current-num")?.textContent).toBe("02");

    // Simulate horizontal swipe to the right (dx = +60) -> Prev slide
    fireEvent.touchStart(canvas!, {
      touches: [{ clientX: 100, clientY: 200 }],
    });
    fireEvent.touchMove(canvas!, {
      touches: [{ clientX: 160, clientY: 200 }],
    });
    fireEvent.touchEnd(canvas!, {
      changedTouches: [{ clientX: 160, clientY: 200 }],
    });

    // Returned to slide 01
    expect(document.querySelector(".current-num")?.textContent).toBe("01");
  });

  it("calls onClose when Escape key is pressed", () => {
    const handleClose = vi.fn();
    renderShowcase({ isOpen: true, initialIndex: 0, onClose: handleClose });

    fireEvent.keyDown(window, { key: "Escape" });
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
