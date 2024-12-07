import React, { useCallback, useEffect, useState } from 'react';
import Plot from 'react-plotly.js';
import { useGameStore } from '../store/gameStore';
import { Point, ClosestEmotion } from '../types';

interface EmotionCoordinate {
  word: string;
  coordinates: Point;
  color: string;
}

const API_URL = 'http://localhost:8005';

export const EmotionPlot: React.FC = () => {
  const { 
    userGuess, 
    currentWord, 
    showResult, 
    setUserGuess, 
    setDistance,
    setClosestEmotions,
    closestEmotions 
  } = useGameStore();
  const [emotions, setEmotions] = useState<EmotionCoordinate[]>([]);
  const [actualPosition, setActualPosition] = useState<Point | null>(null);

  useEffect(() => {
    fetch(`${API_URL}/emotions`)
      .then(res => res.json())
      .then(data => setEmotions(data))
      .catch(console.error);
  }, []);

  const handlePlotClick = useCallback((event: any) => {
    if (showResult || !currentWord) return;

    const point = {
      x: event.points?.[0]?.x ?? event.xaxis.range[0] + (event.xaxis.range[1] - event.xaxis.range[0]) * event.xvals[0],
      y: event.points?.[0]?.y ?? event.yaxis.range[0] + (event.yaxis.range[1] - event.yaxis.range[0]) * event.yvals[0],
    };
    
    setUserGuess(point);
    
    fetch(`${API_URL}/embed`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ word: currentWord })
    })
      .then(res => res.json())
      .then(data => {
        const actualPoint = data.coordinates;
        setActualPosition(actualPoint);
        
        // Calculate distances to all emotions from actual word position
        const emotionDistances = emotions.map(emotion => ({
          emotion: emotion.word,
          distance: Math.sqrt(
            Math.pow(emotion.coordinates.x - actualPoint.x, 2) + 
            Math.pow(emotion.coordinates.y - actualPoint.y, 2)
          )
        }));

        // Sort by distance and take top 3
        const closest = emotionDistances
          .sort((a, b) => a.distance - b.distance)
          .slice(0, 3);

        setClosestEmotions(closest);
        
        const distance = Math.sqrt(
          Math.pow(actualPoint.x - point.x, 2) + 
          Math.pow(actualPoint.y - point.y, 2)
        );
        setDistance(distance);
      })
      .catch(console.error);
  }, [showResult, currentWord, setUserGuess, setDistance, emotions, setClosestEmotions]);

  return (
    <div className="space-y-4">
      <Plot
        data={[
          // Background layer to capture clicks
          {
            x: [[-1.2, 1.2, 1.2, -1.2, -1.2]],  // Create a rectangle
            y: [[-1.2, -1.2, 1.2, 1.2, -1.2]],
            type: 'scatter' as const,
            fill: 'toself',
            fillcolor: 'rgba(255,255,255,0)',
            line: { width: 0 },
            hoverinfo: 'skip' as const,
            showlegend: false,
          },
          {
            x: emotions.map((e) => e.coordinates.x),
            y: emotions.map((e) => e.coordinates.y),
            text: emotions.map((e) => e.word),
            mode: 'markers+text' as any,
            type: 'scatter' as const,
            name: 'Emotions',
            textposition: 'top center' as const,
            marker: { 
              size: 12, 
              color: emotions.map((e) => e.color) 
            },
          },
          ...(userGuess ? [{
            x: [userGuess.x],
            y: [userGuess.y],
            mode: 'markers' as any,
            type: 'scatter' as const,
            name: 'Your Guess',
            marker: { size: 12, color: '#ef4444' },
          }] : []),
          ...(showResult && actualPosition ? [{
            x: [actualPosition.x],
            y: [actualPosition.y],
            text: [currentWord],
            mode: 'markers+text' as any,
            type: 'scatter' as const,
            name: 'Actual Position',
            textposition: 'top center' as const,
            marker: { size: 12, color: '#22c55e' },
          }] : []),
        ]}
        layout={{
          width: 800,
          height: 600,
          title: 'Emotion Space',
          hovermode: 'closest',
          xaxis: { 
            range: [-1.2, 1.2],
            fixedrange: true
          },
          yaxis: { 
            range: [-1.2, 1.2],
            fixedrange: true
          },
          dragmode: false,
          clickmode: 'event+select',
        }}
        onClick={handlePlotClick}
        config={{ 
          displayModeBar: false,
          scrollZoom: false,
        }}
        useResizeHandler
        style={{ width: "100%", height: "100%" }}
      />
      {currentWord && !showResult && closestEmotions.length > 0 && (
        <div className="text-center space-y-2">
          <p className="text-lg font-medium">Closest emotions to your guess:</p>
          <div className="space-y-1">
            {closestEmotions.map((e: ClosestEmotion, i: number) => (
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
    </div>
  );
};