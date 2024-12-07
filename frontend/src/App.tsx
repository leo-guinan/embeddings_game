import React from 'react';
import { EmotionPlot } from './components/EmotionPlot';
import { GameControls } from './components/GameControls';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">Emotion Space Game</h1>
            <p className="mt-2 text-gray-600">
              Guess where words appear in relation to common emotions!
            </p>
          </div>
          
          <div className="flex flex-col items-center space-y-6">
            <GameControls />
            <EmotionPlot />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;