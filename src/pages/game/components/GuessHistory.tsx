import type { Guess } from '../../../types/game'

interface GuessHistoryProps {
  guesses: Guess[]
}

export function GuessHistory({ guesses }: GuessHistoryProps) {
  const isTopRank = (rank: number) => rank >= 90 && rank <= 100

  return (
    <div className="space-y-4">
      {guesses.map((guess, index) => (
        <div
          key={index}
          className={`w-full h-16 rounded-full flex items-center
            ${guess.isInTop100 
              ? 'bg-black text-white' 
              : 'bg-white border-2 border-black'
            }`}
        >
          {/* Container for red circle indicator with fixed width */}
          <div className="w-10 ml-6 flex items-center">
            {guess.rank && isTopRank(guess.rank) && (
              <div className="w-4 h-4 bg-[#FF2C2C] rounded-full" />
            )}
          </div>
          
          <span className="text-2xl">{guess.originalTitle}</span>
          
          <span className={`ml-auto mr-8 text-2xl font-mono text-[#FF2C2C]`}>
            {guess.isInTop100 ? `#${guess.rank}` : 'Close one!'}
          </span>
        </div>
      ))}
    </div>
  )
} 