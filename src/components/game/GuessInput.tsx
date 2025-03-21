'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface GuessInputProps {
  onSubmitGuess: (guess: string) => void;
  disabled?: boolean;
}

export function GuessInput({ onSubmitGuess, disabled }: GuessInputProps) {
  const [currentGuess, setCurrentGuess] = useState('');

  return (
    <div className="flex w-full max-w-sm items-center space-x-2">
      {/* Input and submit components will be implemented here */}
    </div>
  );
} 