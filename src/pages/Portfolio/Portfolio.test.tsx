import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Portfolio } from "./Portfolio";
import { LanguageProvider } from "../../context/LanguageContext";
import { usePortfolioStore } from "../../store/usePortfolioStore";

function renderPortfolioPage() {
  return render(
    <LanguageProvider>
      <MemoryRouter>
        <Portfolio />
      </MemoryRouter>
    </LanguageProvider>
  );
}

describe("🖼️ Portfolio Page — Component & Interaction Suite", () => {
  beforeEach(() => {
    localStorage.clear();
    window.localStorage.setItem("climatify-lang", "ar");
    usePortfolioStore.setState({ isOpen: false, activeSlideIndex: 0 });
  });

  afterEach(() => {
    cleanup();
  });

  it("renders the hero section, title, and launch action", () => {
    renderPortfolioPage();

    expect(
      screen.getByText(/بورتفوليو كلايمتيفاي/i)
    ).toBeDefined();

    expect(
      screen.getByText(/استعراض البورتفوليو التفاعلي بملء الشاشة/i)
    ).toBeDefined();
  });

  it("renders stats ribbon with documented slides and impact metrics", () => {
    renderPortfolioPage();

    const statNumbers = Array.from(document.querySelectorAll(".stat-number")).map(
      (el) => el.textContent?.trim()
    );
    expect(statNumbers).toContain("53");
    expect(statNumbers).toContain("30,000+");
    expect(statNumbers).toContain("1,000+");
    expect(statNumbers).toContain("250+");
  });

  it("filters portfolio cards by search query", () => {
    renderPortfolioPage();

    const searchInput = screen.getByPlaceholderText(/بحث في شرائح البورتفوليو/i);
    expect(searchInput).toBeDefined();

    // Search for a specific keyword
    fireEvent.change(searchInput, { target: { value: "هاكاثون" } });

    // Verify search filtered results
    const cards = document.querySelectorAll(".portfolio-card");
    expect(cards.length).toBeGreaterThan(0);
    expect(cards.length).toBeLessThan(53);
  });

  it("opens the full-screen showcase when clicking the launch button", () => {
    renderPortfolioPage();

    const launchBtn = screen.getByText(/استعراض البورتفوليو التفاعلي بملء الشاشة/i);
    fireEvent.click(launchBtn);

    expect(usePortfolioStore.getState().isOpen).toBe(true);
    expect(usePortfolioStore.getState().activeSlideIndex).toBe(0);
  });

  it("opens the showcase at specific slide when clicking a card", () => {
    renderPortfolioPage();

    const cards = document.querySelectorAll(".portfolio-card");
    expect(cards.length).toBeGreaterThan(0);

    // Click the second card
    fireEvent.click(cards[1]!);

    expect(usePortfolioStore.getState().isOpen).toBe(true);
    expect(usePortfolioStore.getState().activeSlideIndex).toBe(1);
  });
});
