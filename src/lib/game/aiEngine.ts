import { GameState } from './types';

export const getBestMove = (state: GameState, depth: number): string => {
  const aiPlayer = 'player2';
  const validMoves = Object.keys(state.board).filter(
    id => state.board[id].owner === aiPlayer && state.board[id].stones > 0
  );

  if (validMoves.length === 0) return '';

  if (depth <= 2) return validMoves[Math.floor(Math.random() * validMoves.length)];
  
  // MOYEN : Le plus grand nombre de pierres 
  if (depth <= 4) {
    return validMoves.reduce((best, current) => 
      (state.board[current].stones > state.board[best].stones) ? current : best
    );
  }

  const capturingMove = validMoves.find(id => {
      const stones = state.board[id].stones;
      // On simule grossièrement où on va tomber
      return stones % 8 === 2; 
    });

    return capturingMove || validMoves.reduce((a, b) => state.board[a].stones > state.board[b].stones ? a : b
  );
};
