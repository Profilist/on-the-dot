// import { useGame } from '@/hooks/useGame'
// import { GameBoard } from './components/GameBoard'
// import { GameControls } from './components/GameControls'
// import { ScoreDisplay } from './components/ScoreDisplay'

// interface GamePageProps {
//   onReturnHome: () => void
// }

// export function GamePage({ onReturnHome }: GamePageProps) {
//   const { gameState, submitGuess, startNewGame, getHint } = useGame()

//   return (
//     <div className="game-page">
//       <header className="game-header">
//         <ScoreDisplay score={gameState.currentScore} />
//         <button onClick={onReturnHome}>Return to Home</button>
//       </header>

//       <main className="game-main">
//         <GameBoard
//           category={gameState.category}
//           currentScore={gameState.currentScore}
//           maxAttempts={10}
//         />
//         <GameControls
//           onNewGame={startNewGame}
//           onGetHint={getHint}
//           disabled={gameState.isGameOver}
//         />
//       </main>
//     </div>
//   )
// } 