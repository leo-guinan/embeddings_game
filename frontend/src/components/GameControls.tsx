import React, { useState, useEffect } from 'react';
import { Share2 } from 'lucide-react';
import { useGameStore } from '../store/gameStore';

export const GameControls: React.FC = () => {
  const [inputWord, setInputWord] = useState('');
  const { 
    currentWord, 
    showResult, 
    score, 
    setCurrentWord, 
    setShowResult, 
    resetGame,
    userGuess,
    distance,
    closestEmotions
  } = useGameStore();

  useEffect(() => {
    if (userGuess && distance !== null && !showResult) {
      setShowResult(true);
    }
  }, [userGuess, distance, showResult, setShowResult]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputWord.trim()) return;
    
    resetGame();
    setCurrentWord(inputWord.trim().toLowerCase());
    setInputWord('');
  };

  const handleShare = () => {
    const text = `I scored ${score} points guessing where "${currentWord}" appears in the emotion space! Can you beat my score? Try it at [URL]`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`);
  };

  return (
    <div className="w-full max-w-md space-y-4">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={inputWord}
          onChange={(e) => setInputWord(e.target.value)}
          placeholder="Enter a word or phrase"
          className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          disabled={!showResult && currentWord !== ''}
        />
        <button
          type="submit"
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          disabled={!showResult && currentWord !== ''}
        >
          Submit
        </button>
      </form>

      {currentWord && !showResult && (
        <p className="text-lg text-center">
          Click on the emotion that you think "{currentWord}" is closest to!<br/>          
        </p>
      )}

      {showResult && (
        <div className="text-center space-y-2">
          <p className="text-xl font-semibold">Your score: {score}</p>
          {closestEmotions && closestEmotions.length > 0 && (
            <div className="mt-4 mb-4">
              <p className="text-lg font-medium">Closest emotions to "{currentWord}":</p>
              <div className="space-y-1">
                {closestEmotions.slice(0, 3).map((e, i) => (
                  <p key={e.emotion} className={`
                    ${i === 0 ? 'text-lg font-bold' : 'text-md'} 
                    ${i === 0 ? 'text-green-600' : 'text-gray-600'}
                  `}>
                    {e.emotion}
                  </p>
                ))}
              </div>
            </div>
          )}
          <button
            onClick={handleShare}
            className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share on Twitter
          </button>
          <button
            onClick={() => {
              resetGame();
              setCurrentWord('');
            }}
            className="block w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
};