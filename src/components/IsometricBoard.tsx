'use client';
import { useGameStore } from '@/lib/game/gameStore';

export const IsometricBoard = ({ renderHole }: { renderHole: (id: string) => React.ReactNode }) => {
  const { config, currentTheme } = useGameStore();

  // Détermine la classe de texture selon le thème choisi dans le store
  const themeClass = `theme-${currentTheme || 'wood'}`;

  return (
    <div className={`isometric-board ${themeClass} relative p-20 flex flex-col gap-16`}>
      {/* Bordure lumineuse supérieure du plateau (Style Photo) */}
      <div className="absolute inset-0 border border-white/5 rounded-[60px] pointer-events-none" />
      <div className="absolute top-4 left-4 right-4 bottom-4 border border-black/20 rounded-[50px] pointer-events-none" />

      {/* ZONE JOUEUR 2 (Haut) */}
      <div className="relative group">
        <div className="flex flex-col gap-8 rotate-180">
          <div className="flex gap-8 justify-center">
            {[...Array(config.holesPerRow)].map((_, i) => (
              <div key={`p2-f-${i}`}>{renderHole(`player2-front-${i}`)}</div>
            ))}
          </div>
          <div className="flex gap-8 justify-center">
            {[...Array(config.holesPerRow)].map((_, i) => (
              <div key={`p2-b-${i}`}>{renderHole(`player2-back-${i}`)}</div>
            ))}
          </div>
        </div>
      </div>

      {/* SILLON CENTRAL (Le trait lumineux de la photo) */}
      <div className="relative h-1.5 w-full">
        <div className="absolute inset-0 bg-cyan-500/20 blur-sm rounded-full" />
        <div className="absolute inset-0 bg-linear-to-r from-transparent via-cyan-400 to-transparent opacity-60 rounded-full" />
      </div>

      {/* ZONE JOUEUR 1 (Bas) */}
      <div className="relative group">
        <div className="flex flex-col gap-8">
          <div className="flex gap-8 justify-center">
            {[...Array(config.holesPerRow)].map((_, i) => (
              <div key={`p1-f-${i}`}>{renderHole(`player1-front-${i}`)}</div>
            ))}
          </div>
          <div className="flex gap-8 justify-center">
            {[...Array(config.holesPerRow)].map((_, i) => (
              <div key={`p1-b-${i}`}>{renderHole(`player1-back-${i}`)}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};