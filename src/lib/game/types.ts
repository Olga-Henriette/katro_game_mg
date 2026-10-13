export type Player = 'player1' | 'player2';
export type GameMode = 'PvP' | 'PvE' | 'Online';
export type ThemeType = 'wood' | 'metal' | 'gold' | 'plastic';
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface PlayerProfile {
  name: string;
  avatar: string | null; // URL de la photo uploadée
  color: string; 
}

export interface Hole {
  id: string;
  stones: number;
  row: 'front' | 'back';
  owner: Player;
  nextHoleId: string;
  oppositeHoleId?: string;
}

export interface GameState {
  board: Record<string, Hole>;
  currentPlayer: Player;
  isGameOver: boolean;
  winner: Player | null;
  
  // Paramètres de la partie
  gameMode: GameMode;
  currentTheme: ThemeType;
  players: {
    player1: PlayerProfile;
    player2: PlayerProfile;
  };
  config: {
    holesPerRow: number;
    stonesPerHole: number;
    difficulty: Difficulty;
  };
}