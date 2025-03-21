import { cn } from '@/lib/utils';

interface ScoreDisplayProps {
  score: number;
  highScore?: number;
  className?: string;
}

export function ScoreDisplay({ score, highScore, className }: ScoreDisplayProps) {
  return (
    <div className={cn('flex flex-col items-center space-y-2', className)}>
      {/* Score display implementation will go here */}
    </div>
  );
} 