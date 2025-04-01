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
        disabled={disabled}
        className="w-full h-24 px-8 text-2xl font-medium border-3 border-black rounded-2xl 
                 outline-none disabled:bg-gray-100
                 placeholder:text-gray-400 placeholder:italic"
        style={{ fontFamily: 'system-ui' }}
      />
    </form>
  )
} 