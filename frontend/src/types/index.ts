export interface Point {
  x: number;
  y: number;
}

export interface EmotionWord {
  word: string;
  coordinates: Point;
}

export interface ClosestEmotion {
  emotion: string;
  distance: number;
}

export interface GameState {
  userGuess: Point | null;
  currentWord: string;
  score: number;
  showResult: boolean;
  distance: number | null;
  closestEmotions: ClosestEmotion[];
  setUserGuess: (point: Point) => void;
  setCurrentWord: (word: string) => void;
  setShowResult: (show: boolean) => void;
  setDistance: (distance: number) => void;
  setClosestEmotions: (emotions: ClosestEmotion[]) => void;
  resetGame: () => void;
}