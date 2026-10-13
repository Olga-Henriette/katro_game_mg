import { GameState, Hole } from './types';

/**
 * Exécute un tour de jeu complet (Sowing process).
 * Gère la distribution, les captures et le changement de joueur.
 */
export const playTurn = (state: GameState, startingHoleId: string): GameState => {
  const newState: GameState = JSON.parse(JSON.stringify(state)); 
  let currentHole = newState.board[startingHoleId];
  
  if (currentHole.stones === 0) return newState; // Action invalide

  let stonesInHand = currentHole.stones;
  currentHole.stones = 0;

  while (stonesInHand > 0) {
    // Déplacement vers le trou suivant (Graphe)
    const nextHoleId = currentHole.nextHoleId;
    currentHole = newState.board[nextHoleId];
    
    currentHole.stones += 1;
    stonesInHand -= 1;

    // Logique de fin de distribution (Dernière pierre)
    if (stonesInHand === 0) {
      // Cas 1 : Le trou était vide avant la pose -> Le tour s'arrête
      if (currentHole.stones === 1) {
        newState.currentPlayer = newState.currentPlayer === 'player1' ? 'player2' : 'player1';
      } 
      // Cas 2 : Le trou était occupé -> Vérification de capture
      else {
        const opponentHoleId = currentHole.oppositeHoleId;
        if (opponentHoleId) {
          const opponentHole = newState.board[opponentHoleId];
          
          if (canCapture(newState, opponentHole)) {
            // Capture : On récupère les pierres du joueur + celles de l'adversaire
            stonesInHand = currentHole.stones + opponentHole.stones;
            currentHole.stones = 0;
            opponentHole.stones = 0;
            // La boucle 'while' continue car stonesInHand > 0
          } else {
            // Pas de capture possible : le tour s'arrête
            newState.currentPlayer = newState.currentPlayer === 'player1' ? 'player2' : 'player1';
          }
        } else {
          // Trou arrière sans opposé direct : le tour s'arrête
          newState.currentPlayer = newState.currentPlayer === 'player1' ? 'player2' : 'player1';
        }
      }
    }
  }

  return checkVictory(newState);
};

/**
 * Vérifie si la rangée arrière de l'adversaire est vulnérable.
 */
const canCapture = (state: GameState, target: Hole): boolean => {
  if (target.stones === 0) return false;
  if (target.row === 'front') return true;

  // La rangée arrière n'est capturable que si la rangée avant est vide
  const opponentFrontRow = Object.values(state.board).filter(
    h => h.owner === target.owner && h.row === 'front'
  );
  return opponentFrontRow.every(h => h.stones === 0);
};

/**
 * Vérifie si un joueur n'a plus de pierres.
 */
const checkVictory = (state: GameState): GameState => {
  const p1Stones = Object.values(state.board).filter(h => h.owner === 'player1').reduce((a, b) => a + b.stones, 0);
  const p2Stones = Object.values(state.board).filter(h => h.owner === 'player2').reduce((a, b) => a + b.stones, 0);

  if (p1Stones === 0 || p2Stones === 0) {
    state.isGameOver = true;
    state.winner = p1Stones === 0 ? 'player2' : 'player1';
  }
  return state;
};
