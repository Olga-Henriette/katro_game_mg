import { GameState, Difficulty, Player, Hole } from './types';

export const initializeGame = (holesPerRow: number, stonesPerHole: number, difficulty: Difficulty = 'medium'): GameState => {
  const board: any = {};

  const createPlayerHoles = (player: Player) => {
    for (let i = 0; i < holesPerRow; i++) {
      const backId = `${player}-back-${i}`;
      const frontId = `${player}-front-${i}`;

      board[backId] = { id: backId, stones: stonesPerHole, row: 'back', owner: player, nextHoleId: '' };

      const oppositeIndex = (holesPerRow - 1) - i; 
      board[frontId] = {
        id: frontId,
        stones: stonesPerHole,
        row: 'front',
        owner: player,
        nextHoleId: '',
        oppositeHoleId: player === 'player1' 
          ? `player2-front-${oppositeIndex}` 
          : `player1-front-${oppositeIndex}`
      };
    }
  };

  createPlayerHoles('player1');
  createPlayerHoles('player2');

  const linkHoles = (player: Player) => {
    for (let i = 0; i < holesPerRow - 1; i++) {
      board[`${player}-back-${i}`].nextHoleId = `${player}-back-${i + 1}`;
    }
    board[`${player}-back-${holesPerRow - 1}`].nextHoleId = `${player}-front-${holesPerRow - 1}`;

    for (let i = holesPerRow - 1; i > 0; i--) {
      board[`${player}-front-${i}`].nextHoleId = `${player}-front-${i - 1}`;
    }
    board[`${player}-front-0`].nextHoleId = `${player}-back-0`;
  };

  linkHoles('player1');
  linkHoles('player2');

  return {
    board,
    currentPlayer: 'player1',
    isGameOver: false,
    winner: null,
    gameMode: 'PvP', 
    currentTheme: 'wood',   
    players: {
      player1: { name: 'Joueur 1', avatar: null, color: '#00f2ff' }, 
      player2: { name: 'Joueur 2', avatar: null, color: '#ff007b' }  
    },
    config: { holesPerRow, stonesPerHole, difficulty }
  };
};