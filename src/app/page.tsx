'use client';
import { useGameStore } from '@/lib/game/gameStore';
import { IsometricBoard } from '@/components/IsometricBoard';
import { Stone } from '@/components/Stone';
import { useState, useEffect } from 'react';
import { LandingPage } from '@/components/LandingPage'; // Splash Screen
import { SettingsPanel } from '@/components/SettingsPanel'; // Setup Page

export default function Home() {
  const { board, currentPlayer, makeMove, players, config, startGame, isGameOver, winner } = useGameStore();
  const [view, setView] = useState<'splash' | 'menu' | 'setup' | 'game'>('splash');

  // 1. Splash Screen automatique (3 secondes)
  useEffect(() => {
    const timer = setTimeout(() => setView('menu'), 3000);
    return () => clearTimeout(timer);
  }, []);

  const renderHole = (id: string) => {
    const hole = board[id];
    if (!hole) return null;

    // Calcul dynamique de la taille pour éviter le débordement
    // Si > 6 pierres, on réduit un peu leur taille
    const stoneScale = hole.stones > 6 ? 'scale-75' : 'scale-100';

    return (
      <button 
        onClick={() => makeMove(id)} 
        className="hole-sculpted group relative flex items-center justify-center p-2"
      >
        {/* On utilise flex-wrap pour qu'elles s'alignent proprement.
            Le max-w permet de forcer le retour à la ligne pour garder une forme circulaire.
        */}
        <div className={`
          flex flex-wrap gap-1 justify-center items-center 
          max-w-[80%] transition-transform duration-300 ${stoneScale}
        `}>
          {Array.from({ length: hole.stones }).map((_, i) => (
            <Stone 
              key={i} 
              color={hole.owner === 'player1' ? players.player1.color : players.player2.color} 
            />
          ))}
        </div>
        
        {/* Indicateur numérique discret pour la clarté tactique */}
        {hole.stones > 0 && (
          <span className="absolute top-1 right-2 text-[8px] font-mono opacity-20 text-white pointer-events-none">
            {hole.stones}
          </span>
        )}
      </button>
    );
  };

  // 1. Splash Screen
  if (view === 'splash') {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-slate-950">
        <h1 className="text-6xl font-black italic tracking-tighter text-white animate-pulse">
          FANGA<span className="text-cyan-500">.</span>
        </h1>
        <p className="text-cyan-500/50 font-mono text-xs mt-4 tracking-[0.5em] uppercase">Loading Experience</p>
      </div>
    );
  }

  // 2. Main Menu
  if (view === 'menu') {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-[#05070a] relative overflow-hidden">
        {/* Animation de fond */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(6,182,212,0.1),transparent_70%)]" />
        
        <div className="relative z-10 flex flex-col items-center">
          <h1 className="text-[12rem] font-black text-white/5 absolute -top-32 tracking-tighter select-none">
            FANGA
          </h1>
          
          <h2 className="text-7xl font-black text-white italic tracking-tighter mb-16 relative">
            FANGA<span className="text-cyan-500 block h-1 w-full bg-cyan-500 absolute -bottom-2 rounded-full shadow-[0_0_20px_rgba(6,182,212,1)]" />
          </h2>

          <div className="flex flex-col gap-4 w-72">
            <button 
              onClick={() => setView('setup')} 
              className="group relative px-8 py-5 bg-white text-slate-950 font-black rounded-2xl overflow-hidden transition-all hover:scale-105 active:scale-95"
            >
              <span className="relative z-10 tracking-widest">JOUER</span>
              <div className="absolute inset-0 bg-cyan-400 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </button>
            
            <button className="px-8 py-4 glass text-white/40 font-bold rounded-2xl border border-white/5 hover:bg-white/5 transition-all text-sm tracking-widest">
              PARAMÈTRES
            </button>
            
            <button className="px-8 py-4 glass text-red-500/50 font-bold rounded-2xl border border-red-500/10 hover:bg-red-500/5 transition-all text-sm tracking-widest">
              QUITTER
            </button>
          </div>
        </div>

        <div className="absolute bottom-10 text-[10px] text-white/20 font-mono tracking-[0.5em] uppercase">
          © 2026 Strategy Engine • High Poly Render
        </div>
      </div>
    );
  }
  // 3. Setup Page (SettingsPanel)
  if (view === 'setup') {
    return (
      <div className="h-screen w-screen bg-[#05070a] overflow-y-auto">
         <div className="min-h-full w-full flex items-center justify-center py-20 px-4">
            <SettingsPanel onPlay={() => setView('game')} onBack={() => setView('menu')} />
         </div>
      </div>
    );
  }

  // 4. Game Screen
  return (
    <main className="game-container relative min-h-screen w-full overflow-hidden flex items-center justify-center">
      
      {/* INDICATEUR DE TOUR GLOBAL (Barre en haut) */}
      <div className="fixed top-0 left-0 w-full h-1 z-50 overflow-hidden bg-white/5">
        <div 
          className="h-full transition-all duration-700 ease-in-out"
          style={{ 
            width: '100%', 
            backgroundColor: currentPlayer === 'player1' ? players.player1.color : players.player2.color,
            boxShadow: `0 0 20px ${currentPlayer === 'player1' ? players.player1.color : players.player2.color}`
          }} 
        />
      </div>

      {/* BOUTON RETOUR (Icône Flèche) */}
      <div className="absolute top-8 left-8 z-50">
        <button 
          onClick={() => { if(window.confirm("Abandonner ?")) setView('setup'); }} 
          className="glass p-4 rounded-full text-white hover:scale-110 transition-all border-white/10"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>

      {/* HUD Joueurs avec Éclat (Glow) quand c'est leur tour */}
      <div className={`fixed top-12 right-8 p-4 glass rounded-2xl border-r-4 transition-all duration-500 ${currentPlayer === 'player2' ? 'opacity-100 translate-x-0 scale-110' : 'opacity-30 translate-x-4 scale-90'}`} 
          style={{ borderColor: players.player2.color, boxShadow: currentPlayer === 'player2' ? `0 0 40px ${players.player2.color}33` : 'none' }}>
        <h2 className="text-xl font-black text-white">{players.player2.name}</h2>
        <div className="text-[10px] text-pink-400 font-bold tracking-widest mt-1 uppercase">Attente...</div>
      </div>

      <div className={`fixed bottom-12 left-8 p-4 glass rounded-2xl border-l-4 transition-all duration-500 ${currentPlayer === 'player1' ? 'opacity-100 translate-x-0 scale-110' : 'opacity-30 -translate-x-4 scale-90'}`} 
          style={{ borderColor: players.player1.color, boxShadow: currentPlayer === 'player1' ? `0 0 40px ${players.player1.color}33` : 'none' }}>
        <h2 className="text-xl font-black text-white">{players.player1.name}</h2>
        <div className="text-[10px] text-cyan-400 font-bold tracking-widest mt-1 uppercase animate-pulse">Votre tour</div>
      </div>

      {/* OVERLAY DE VICTOIRE */}
      {isGameOver && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-700">
          <div className="text-center space-y-6">
            <h2 className="text-7xl font-black italic text-white tracking-tighter">VICTOIRE</h2>
            <p className="text-2xl font-bold text-cyan-500 uppercase tracking-[0.5em]">{winner === 'player1' ? players.player1.name : players.player2.name}</p>
            <button onClick={() => setView('setup')} className="px-12 py-4 bg-white text-black font-black rounded-full hover:scale-105 transition-transform">RETOUR AU SETUP</button>
          </div>
        </div>
      )}

      {/* Le wrapper du plateau */}
      <div className="isometric-wrapper scale-75 md:scale-100">
        <IsometricBoard renderHole={renderHole} />
      </div>
    </main>
  );
}