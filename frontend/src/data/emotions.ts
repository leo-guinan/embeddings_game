export const emotionWords = [
  { word: "joy", coordinates: { x: 1, y: 1 } },
  { word: "sadness", coordinates: { x: -1, y: -1 } },
  { word: "anger", coordinates: { x: -1, y: 1 } },
  { word: "fear", coordinates: { x: -0.5, y: -0.8 } },
  { word: "surprise", coordinates: { x: 0.8, y: 0.2 } },
  { word: "disgust", coordinates: { x: -0.8, y: 0.5 } },
  { word: "trust", coordinates: { x: 0.7, y: 0.7 } },
  { word: "anticipation", coordinates: { x: 0.5, y: 0.3 } },
];

// Simulated embedding function (in reality, this would use a proper embedding model)
export const getWordEmbedding = (word: string): { x: number; y: number } => {
  // This is a simplified version - in reality, you'd use a proper embedding model
  const hash = Array.from(word).reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return {
    x: Math.cos(hash) * Math.min(1, (hash % 100) / 100),
    y: Math.sin(hash) * Math.min(1, ((hash * 2) % 100) / 100),
  };
};