import { create } from "zustand";

interface PortfolioState {
  isOpen: boolean;
  activeSlideIndex: number;
  openPortfolio: (index?: number) => void;
  closePortfolio: () => void;
  setActiveSlide: (index: number) => void;
}

export const usePortfolioStore = create<PortfolioState>((set) => ({
  isOpen: false,
  activeSlideIndex: 0,
  openPortfolio: (index = 0) =>
    set({
      isOpen: true,
      activeSlideIndex: Math.max(0, Math.min(index, 52)),
    }),
  closePortfolio: () => set({ isOpen: false }),
  setActiveSlide: (index) =>
    set({
      activeSlideIndex: Math.max(0, Math.min(index, 52)),
    }),
}));
