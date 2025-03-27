import { useState, FormEvent } from 'react'

interface GuessInputProps {
  onSubmit: (guess: string) => void
  disabled?: boolean
}

export function GuessInput({ onSubmit, disabled = false }: GuessInputProps) {
  const [input, setInput] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!input.trim() || disabled) return

    onSubmit(input.trim())
    setInput('')
  }

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter a movie title..."
        disabled={disabled}
        className="w-full px-6 py-4 text-xl border-2 border-black rounded-full 
                 outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
      />
      <button
        type="submit"
        disabled={disabled || !input.trim()}
        className="absolute right-2 top-1/2 transform -translate-y-1/2
                 px-6 py-2 rounded-full bg-black text-white
                 disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        Guess
      </button>
    </form>
  )
} 