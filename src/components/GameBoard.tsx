'use client';
import { useGameStore } from '@/lib/game/gameStore';
import { Stone } from '@/components/Stone';

export const GameBoard = () => {
  const { board, currentPlayer, makeMove, players, config } = useGameStore();

  const renderHole = (holeId: string) => {
    const hole = board[holeId];
    if (!hole) return null;

    return (
      <div key={holeId} className="flex flex-col items-center">
        <button
          onClick={() => makeMove(holeId)}
          className={`
            w-16 h-16 sm:w-20 sm:h-20 rounded-full hole-depth flex flex-wrap items-center justify-center p-2 gap-1 
            transition-all duration-300
            ${hole.owner === currentPlayer ? 'cursor-pointer hover:brightness-110 active:scale-95' : 'cursor-not-allowed'}
          `}
        >
          {Array.from({ length: hole.stones }).map((_, i) => (
            <Stone 
              key={`${holeId}-stone-${i}`} 
              color={hole.owner === 'player1' ? '#00f2ff' : '#ff007b'} 
            />
          ))}
        </button>
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center gap-8">
      {/* Infos Joueurs */}
      <div className="flex justify-between w-full max-w-2xl px-4">
        <div className={`p-4 rounded-xl border ${currentPlayer === 'player2' ? 'border-pink-500 bg-pink-500/10 shadow-[0_0_15px_rgba(236,72,153,0.3)]' : 'border-white/10 opacity-50'}`}>
          <p className="text-pink-500 font-bold">{players.player2.name}</p>
        </div>
        <div className={`p-4 rounded-xl border ${currentPlayer === 'player1' ? 'border-cyan-500 bg-cyan-500/10 shadow-[0_0_15px_rgba(6,182,212,0.3)]' : 'border-white/10 opacity-50'}`}>
          <p className="text-cyan-500 font-bold">{players.player1.name}</p>
        </div>
      </div>

      {/* PLATEAU PHYSIQUE */}
      <div className="relative p-10 rounded-[4rem] border-16 border-amber-900 shadow-[0_50px_100px_rgba(0,0,0,0.8)] theme-wood">
        <div className="flex flex-col gap-10">
          {/* ZONE P2 */}
          <div className="flex flex-col gap-6 rotate-180">
            <div className="flex gap-4">
              {Array.from({ length: config.holesPerRow }).map((_, i) => renderHole(`player2-front-${i}`))}
            </div>
            <div className="flex gap-4">
              {Array.from({ length: config.holesPerRow }).map((_, i) => renderHole(`player2-back-${i}`))}
            </div>
          </div>

          <div className="h-2 bg-black/40 rounded-full w-full"></div>

          {/* ZONE P1 */}
          <div className="flex flex-col gap-6">
            <div className="flex gap-4">
              {Array.from({ length: config.holesPerRow }).map((_, i) => renderHole(`player1-front-${i}`))}
            </div>
            <div className="flex gap-4">
              {Array.from({ length: config.holesPerRow }).map((_, i) => renderHole(`player1-back-${i}`))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};