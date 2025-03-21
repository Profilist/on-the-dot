'use client';

import { useState } from 'react';
import { GameState, GuessResult } from '@/types';
import { GAME_CONFIG } from '@/lib/constants';

interface GameBoardProps {
  category: string;
  difficulty: string;
}

export function GameBoard({ category, difficulty }: GameBoardProps) {
  const [gameState, setGameState] = useState<GameState>({
    currentCategory: { id: '', name: '', description: '' },
    guessHistory: [],
    score: 0,
    gameStatus: 'playing',
  });

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-4">
      {/* Game components will be implemented here */}
    </div>
  );
} 