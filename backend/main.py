from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sentence_transformers import SentenceTransformer
from pydantic import BaseModel
from sklearn.decomposition import PCA
import numpy as np
from typing import List, Dict

app = FastAPI()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Emotion definitions with colors
EMOTIONS = {
    'joy': '#FFD700',        # Gold
    'sadness': '#4169E1',    # Royal Blue
    'anger': '#FF0000',      # Red
    'fear': '#800080',       # Purple
    'surprise': '#FFA500',   # Orange
    'disgust': '#006400',    # Dark Green
    'love': '#FF69B4',       # Hot Pink
    'excitement': '#FF4500', # Orange Red
    'calm': '#87CEEB',       # Sky Blue
    'anxiety': '#8B0000'     # Dark Red
}

class WordInput(BaseModel):
    word: str

class EmotionSpace:
    def __init__(self):
        self.model = SentenceTransformer('all-MiniLM-L6-v2')
        self.pca = PCA(n_components=2)
        self.emotions = list(EMOTIONS.keys())
        self._initialize_emotion_space()

    def _initialize_emotion_space(self):
        """Initialize the static emotion embedding space"""
        self.emotion_embeddings = self.model.encode(self.emotions)
        self.reduced_emotion_embeddings = self.pca.fit_transform(self.emotion_embeddings)

    def get_coordinates(self, word: str) -> Dict[str, float]:
        embedding = self.model.encode([word])
        reduced = self.pca.transform(embedding)
        return {"x": float(reduced[0, 0]), "y": float(reduced[0, 1])}

    def get_emotion_coordinates(self):
        return [
            {
                "word": emotion,
                "color": color,
                "coordinates": {
                    "x": float(self.reduced_emotion_embeddings[i, 0]),
                    "y": float(self.reduced_emotion_embeddings[i, 1])
                }
            }
            for i, (emotion, color) in enumerate(EMOTIONS.items())
        ]

# Initialize the emotion space
emotion_space = EmotionSpace()

@app.post("/embed")
async def get_embedding(word_input: WordInput):
    try:
        coords = emotion_space.get_coordinates(word_input.word.lower())
        return {"coordinates": coords}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/emotions")
async def get_emotions():
    try:
        return emotion_space.get_emotion_coordinates()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8005)