import { GameBoard } from './components/GameBoard'
import { useGame } from './hooks/useGame'
import './App.css'

function App() {
  const { gameState, submitGuess, startNewGame, getHint } = useGame()

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Top 100 Guessing Game</h1>
        {/* TODO: Add game instructions */}
        {/* TODO: Add settings menu */}
      </header>

      <main className="game-container">
        <GameBoard
          category={gameState.category}
          currentScore={gameState.currentScore}
          maxAttempts={10}
        />
        {/* TODO: Add leaderboard component */}
        {/* TODO: Add game statistics */}
      </main>

      <footer className="app-footer">
        {/* TODO: Add game controls */}
        {/* TODO: Add social sharing */}
      </footer>
    </div>
  )
}

export default App
