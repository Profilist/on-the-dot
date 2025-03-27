import { useState } from 'react'
import { LandingPage } from './pages/landing/LandingPage'
import { GamePage } from './pages/game/GamePage'
import './App.css'

function App() {
  const [currentPage, setCurrentPage] = useState<'landing' | 'game'>('landing')

  return (
    <div className="app">
      {currentPage === 'landing' ? (
        <LandingPage onStartGame={() => setCurrentPage('game')} />
      ) : (
        // <GamePage onReturnHome={() => setCurrentPage('landing')} />
        <div/>
      )}
    </div>
  )
}

export default App
