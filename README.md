# Secret Hitler — Table Companion (PWA)

A mobile-first, local pass-and-play web application to facilitate a game of Secret Hitler for 5–10 players using a single shared device. The app manages the game state, rules, and secret information, allowing players to focus on the social deduction.

## Features

### Core Functionality
- **5-10 Player Support**: Handles all player counts with correct role distributions
- **Full Rule Implementation**: Standard Secret Hitler ruleset with all game mechanics
- **Pass-and-Play Interface**: Privacy screens protect secret information
- **LocalStorage Persistence**: Resume interrupted games automatically
- **Game History & Undo**: Step back if mistakes are made

### Game Phases
1. **Night Phase**: Secret role reveals with team information
2. **Election Phase**: Chancellor nomination and public voting
3. **Legislative Phase**: President and Chancellor policy selection
4. **Executive Actions**: Presidential powers (Investigate, Special Election, Policy Peek, Execution)

### UI Features
- **Table View Dashboard**: Public game state always visible
  - Liberal and Fascist policy tracks
  - Election tracker
  - Current government (President/Chancellor)
  - Player list with status
  - Complete game log
- **Mobile-First Design**: Optimized for phones and tablets
- **Dark Theme**: Easy on the eyes during gameplay
- **Privacy Screens**: Prevent accidental information leaks

## Tech Stack
- **React**: UI framework
- **Vite**: Build tool and dev server
- **Tailwind CSS**: Styling
- **LocalStorage**: State persistence (no backend needed)

## Getting Started

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## How to Play

1. **Setup**: Enter player names (5-10 players)
2. **Night**: Each player views their secret role privately
3. **Gameplay Loop**:
   - President nominates a Chancellor
   - All players vote (publicly revealed)
   - If passed, President and Chancellor enact a policy
   - If a Fascist policy is enacted, President may use an executive power
   - Repeat until a team wins

### Win Conditions
- **Liberals Win**: Enact 5 Liberal policies OR kill Hitler
- **Fascists Win**: Enact 6 Fascist policies OR elect Hitler as Chancellor (after 3 Fascist policies)

## Role Distributions

| Players | Liberals | Fascists | Hitler |
|---------|----------|----------|--------|
| 5       | 3        | 1        | 1      |
| 6       | 4        | 1        | 1      |
| 7       | 4        | 2        | 1      |
| 8       | 5        | 2        | 1      |
| 9       | 5        | 3        | 1      |
| 10      | 6        | 3        | 1      |

## Board Configurations (Fascist Powers)

### 5-6 Players
1. —
2. —
3. Policy Peek
4. Execution
5. Execution + Veto Unlock

### 7-8 Players
1. —
2. Investigate Loyalty
3. Special Election
4. Execution
5. Execution + Veto Unlock

### 9-10 Players
1. Investigate Loyalty
2. Investigate Loyalty
3. Special Election
4. Execution
5. Execution + Veto Unlock

## Project Structure

```
src/
├── components/          # React components
│   ├── Button.jsx
│   ├── PrivacyScreen.jsx
│   ├── SetupScreen.jsx
│   ├── NightPhase.jsx
│   ├── ElectionPhase.jsx
│   ├── LegislativePhase.jsx
│   ├── ExecutivePhase.jsx
│   ├── TableView.jsx
│   └── GameOver.jsx
├── constants/          # Game configuration
│   └── gameConfig.js
├── hooks/             # Custom React hooks
│   └── useGameState.js
├── utils/             # Game logic utilities
│   ├── deckUtils.js
│   └── gameLogic.js
├── App.jsx           # Main app component
└── main.jsx         # Entry point
```

## Game Rules Reference

This app implements the official Secret Hitler rules. For detailed gameplay information, visit [secrethitler.com](https://www.secrethitler.com).

## Development Notes

- All game state is stored in LocalStorage
- No network calls or backend required
- Runs completely offline after initial load
- Can be installed as a PWA on mobile devices

## License

This is a fan-made companion app for Secret Hitler. The Secret Hitler game is designed by Max Temkin, Mike Boxleiter, Tommy Maranges, and illustrated by Mackenzie Schubert.
