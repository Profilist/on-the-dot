What started as a fun game between roommates blossomed into

# ON THE DOT 🔴

Here's how to play →

- Guess the item in the top 100 category closest to the 100th spot. (4 total guesses)
- After submitting a guess, you will see its position in the top 100.
- Try to get #100, #99, #98, and #97 for the max score!
- Scores of 90 and above are ON THE DOT 

We have categories such as top athletes, highest grossing movies, most common words, and many more to come! We iteratively improve our game based on user analytics and feedback!

Try it out here: https://www.playonthedot.com

Please message us with any feedback!

![Landing](https://i.imgur.com/8LYTWgw.png)
![Game Screen](https://i.imgur.com/7abTXdC.png)
![Results](https://imgur.com/FjWiOOT.png)

## How We Built It 🛠️
### Frontend Framework
- React 19.0.0 with TypeScript
- Vite as the build tool and development server
- Framer Motion for animations
- Tailwind CSS for styling

### Backend & Data
- Supabase for backend services and data storage
- Anonymous user identification system
- Persistent game state management

## Architecture ✏️
1. Game Logic (`src/pages/game/GamePage.tsx`)
   - Central game state management
   - Score calculation
   - Turn management
   - Category handling

2. User Interface Components (`src/pages/game/components`)
   - GuessInput: Player input handling
   - GuessHistory: Track previous guesses
   - ProgressBar: Game progress visualization
   - Instructions: Game rules display
   - Finished: End-game state handling

3. Custom Hooks (`src/hooks`)
   - useGame: Game state management
   - useUserStats: Player statistics tracking
   - useGuessStats: Guess tracking
   - useSupabase: Database interaction
   - useAnonymousId: User identification

## License 📜

MIT License
