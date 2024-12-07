import { create } from 'zustand';
import { GameState } from '../types';

export const useGameStore = create<GameState>((set) => ({
  userGuess: null,
  currentWord: '',
  score: 0,
  showResult: false,
  distance: null,
  closestEmotions: [],
  setUserGuess: (point) => set({ userGuess: point }),
  setCurrentWord: (word) => set({ currentWord: word }),
  setShowResult: (show) => set({ showResult: show }),
  setDistance: (distance) => set({ distance, score: distance < 0.5 ? 100 - Math.round(distance * 100) : 0 }),
  setClosestEmotions: (emotions) => set({ closestEmotions: emotions }),
  resetGame: () => set({ userGuess: null, showResult: false, distance: null, closestEmotions: [] }),
}));