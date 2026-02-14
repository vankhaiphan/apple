import { create } from 'zustand';

export const useStore = create((set) => ({
  // App state
  introComplete: false,
  setIntroComplete: (value) => set({ introComplete: value }),

  // Letter state
  selectedLetter: null,
  setSelectedLetter: (letter) => set({ selectedLetter: letter }),
  
  // Audio state
  isPlaying: false,
  setIsPlaying: (value) => set({ isPlaying: value }),
  isMuted: false,
  setIsMuted: (value) => set({ isMuted: value }),
  
  // Interaction state
  hoveredFruit: null,
  setHoveredFruit: (id) => set({ hoveredFruit: id }),
  
  // Animation state
  fruitAnimating: null,
  setFruitAnimating: (id) => set({ fruitAnimating: id }),
}));
