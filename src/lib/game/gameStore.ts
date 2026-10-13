import { create } from 'zustand';
import { GameState, Player, Hole, GameMode, PlayerProfile, ThemeType } from './types'; 
import { initializeGame } from './boardGenerator';
import { getBestMove } from './aiEngine';
import { get } from 'https';

interface GameActions {
  startGame: (holes: number, stones: number) => void;
  makeMove: (holeId: string) => void;
  executeAiMove: () => void;
  resetGame: () => void;
  changeTheme: (theme: string) => void;
  updatePlayer: (player: Player, data: Partial<PlayerProfile>) => void;
  setGameMode: (mode: GameMode) => void;
  updatePlayerConfig: (player: Player, data: Partial<PlayerProfile>) => void;
  setGlobalConfig: (data: Partial<GameState['config']>) => void;
  setGameSetup: (data: { mode: GameMode, theme: ThemeType }) => void;
}

export const useGameStore = create<GameState & GameActions>((set, get) => ({
  ...initializeGame(4, 2),

  startGame: (holes, stones) => {
    const currentState = get();
    const newGame = initializeGame(holes, stones, currentState.config.difficulty);
    
    set({
      ...newGame,
      players: currentState.players,
      gameMode: currentState.gameMode,
      currentTheme: currentState.currentTheme,
      config: { 
        ...currentState.config, 
        holesPerRow: holes, 
        stonesPerHole: stones 
      }
    });
  },

  makeMove: async (holeId) => {
    const state = get();
    if (state.isGameOver || 
        state.board[holeId].owner !== state.currentPlayer || 
        state.board[holeId].stones === 0) return;

    let stonesInHand = 0;
    let currentHoleId = holeId;
    let continueTurn = true;

    while (continueTurn) {
      stonesInHand += get().board[currentHoleId].stones;
      set((s) => {
        const newBoard = { ...s.board };
        newBoard[currentHoleId].stones = 0;
        return { board: newBoard };
      });

      // 2. Distribuer 
      while (stonesInHand > 0) {
        await new Promise(resolve => setTimeout(resolve, 600)); 
        const nextId = get().board[currentHoleId].nextHoleId;
        currentHoleId = nextId;
        set((s) => {
          const newBoard = { ...s.board };
          newBoard[currentHoleId].stones += 1;
          return { board: newBoard };
        });
        stonesInHand--;
      }

      const lastHole = get().board[currentHoleId];
      if (lastHole.stones > 1) {
        const captureTargetId = canCaptureStrict(get(), lastHole);
        if (captureTargetId) {
          await new Promise(resolve => setTimeout(resolve, 500));
          stonesInHand += get().board[captureTargetId].stones;
          set((s) => {
            const newBoard = { ...s.board };
            newBoard[captureTargetId].stones = 0;
            return { board: newBoard };
          });
          
          const checkStatus = checkGameOver(get());
          if (checkStatus.isOver) {
            set({ isGameOver: true, winner: checkStatus.winner });
            return; 
          }
          continueTurn = true;
        } else {
          continueTurn = true; 
        }
      } else {
        continueTurn = false;
        set((s) => ({ currentPlayer: s.currentPlayer === 'player1' ? 'player2' : 'player1' }));
      }
    }

    const finalStatus = checkGameOver(get());
    if (finalStatus.isOver) {
      set({ isGameOver: true, winner: finalStatus.winner });
      return;
    }

    // IA : Si c'est au tour du Bot, on le lance
    const nextState = get();
    if (nextState.gameMode === 'PvE' && nextState.currentPlayer === 'player2') {
      setTimeout(() => get().executeAiMove(), 1000);
    }
  },

  executeAiMove: () => {
    const state = get();
    const difficulty = (state.config as any).difficulty || 'medium'; 
    
    let depth = 2; 
    if (difficulty === 'medium') depth = 4;
    if (difficulty === 'hard') depth = 6;

    const bestMove = getBestMove(state, depth);
    if (bestMove) {
      get().makeMove(bestMove);
    }
  },
  
  resetGame: () => {
    set((state) => ({ ...initializeGame(state.config.holesPerRow, state.config.stonesPerHole) }));
  },

  changeTheme: (theme) => {
    set({ currentTheme: theme as ThemeType });
  },

  updatePlayer: (player, data) => {
    set((state) => ({
      players: {
        ...state.players,
        [player]: { ...state.players[player], ...data }
      }
    }));
  },

  setGameMode: (mode) => set({ gameMode: mode }),

  updatePlayerConfig: (player, data) => {
    set((state) => ({
      players: {
        ...state.players,
        [player]: { ...state.players[player], ...data }
      }
    }));
  },

  setGlobalConfig: (data) => {
    set((state) => ({ 
      config: { ...state.config, ...data } 
    }));
  },

  setGameSetup: (data) => {
    set(() => ({ gameMode: data.mode, currentTheme: data.theme }));
  },

}));

const canCaptureStrict = (state: GameState, landingHole: Hole): string | null => {
  const opponentOwner = landingHole.owner === 'player1' ? 'player2' : 'player1';
  const myOwner = landingHole.owner;
  
  const idParts = landingHole.id.split('-');
  const currentRow = idParts[1]; // 'front' ou 'back'
  const i = parseInt(idParts[idParts.length - 1]);
  
  // Calcul de l'opposé : P1(0) face à P2(max), donc (max - i)
  const oppositeI = (state.config.holesPerRow - 1) - i;

  // ANALYSE DES RANGÉES 
  const allHoles = Object.values(state.board);
  
  const myR1Empty = allHoles
    .filter(h => h.owner === myOwner && h.id.includes('front'))
    .every(h => h.stones === 0);

  const opponentR1Empty = allHoles
    .filter(h => h.owner === opponentOwner && h.id.includes('front'))
    .every(h => h.stones === 0);

  // LOGIQUE DE CAPTURE 
  if (currentRow === 'front') {
    const targetId = `${opponentOwner}-front-${oppositeI}`;
    if (state.board[targetId] && state.board[targetId].stones > 0) {
      return targetId;
    }
  } 
  
  if (currentRow === 'back') {
    if (myR1Empty) {
      // Le R1 adverse n'est pas vide -> On capture son R1
      if (!opponentR1Empty) {
        const targetId = `${opponentOwner}-front-${oppositeI}`;
        if (state.board[targetId] && state.board[targetId].stones > 0) {
          return targetId;
        }
      } 
      // TOUT le R1 adverse est vide -> On capture son R2
      else {
        const targetId = `${opponentOwner}-back-${oppositeI}`;
        if (state.board[targetId] && state.board[targetId].stones > 0) {
          return targetId;
        }
      }
    }
  }

  return null;
};

const checkGameOver = (state: GameState): { isOver: boolean, winner: Player | null } => {
  const p1Stones = Object.values(state.board)
    .filter(h => h.owner === 'player1')
    .reduce((acc, h) => acc + h.stones, 0);
  const p2Stones = Object.values(state.board)
    .filter(h => h.owner === 'player2')
    .reduce((acc, h) => acc + h.stones, 0);

  if (p1Stones === 0) return { isOver: true, winner: 'player2' };
  if (p2Stones === 0) return { isOver: true, winner: 'player1' };
  return { isOver: false, winner: null };
};