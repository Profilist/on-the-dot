import type { Guess } from '../../../types/game'

interface GuessHistoryProps {
  guesses: Guess[]
}

export function GuessHistory({ guesses }: GuessHistoryProps) {
  return (
    <div className="space-y-3">
      {guesses.map((guess, index) => (
        <div
          key={index}
          className={`w-full p-4 rounded-full flex justify-between items-center
            ${guess.isInTop100 
              ? 'bg-black text-white' 
              : 'bg-white border-2 border-black'
            }`}
        >
          <span className="ml-4">{guess.movie}</span>
          <span className={`mr-4 ${!guess.isInTop100 ? 'text-[#FF2C2C]' : ''}`}>
            {guess.isInTop100 ? `#${guess.rank}` : 'Close one!'}
          </span>
        </div>
      ))}
    </div>
  )
} 