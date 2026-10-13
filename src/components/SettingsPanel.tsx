'use client';
import { useGameStore } from '@/lib/game/gameStore';

interface SettingsPanelProps {
  onPlay: () => void;
  onBack: () => void;
}

export const SettingsPanel = ({ onPlay, onBack }: SettingsPanelProps) => {
  const { 
    config, 
    startGame, 
    updatePlayer, 
    players, 
    gameMode, 
    setGameMode, 
    setGlobalConfig,
    currentTheme,
    changeTheme 
  } = useGameStore();

  const handleStart = () => {
    startGame(config.holesPerRow, config.stonesPerHole);
    onPlay();
  };

  return (
    <div className="max-w-2xl w-full p-6 md:p-12 glass rounded-[40px] border border-white/10 shadow-2xl relative overflow-hidden">
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-cyan-500/10 blur-[100px] rounded-full" />
      
      <div className="flex justify-between items-center mb-12 relative z-10">
        <h2 className="text-4xl font-black text-white italic tracking-tighter">
          SETUP<span className="text-cyan-500">_</span>GAME
        </h2>
        <button onClick={onBack} className="text-slate-500 hover:text-white uppercase text-[10px] font-bold tracking-[0.3em] transition-colors">
          [ Retour ]
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
        {/* Colonne Gauche */}
        <div className="space-y-6">

          {gameMode === 'PvE' && (
            <section className="animate-in fade-in slide-in-from-left-4">
              <label className="text-[10px] font-bold text-slate-500 uppercase mb-4 block tracking-widest">Niveau de l'IA</label>
              <div className="flex gap-2">
                {['easy', 'medium', 'hard'].map((d) => (
                  <button
                    key={d}
                    onClick={() => setGlobalConfig({ difficulty: d as any })}
                    className={`flex-1 py-2 rounded-xl border text-[10px] font-bold transition-all ${config.difficulty === d ? 'bg-white text-slate-950 border-white' : 'bg-white/5 border-white/10 text-white'}`}
                  >
                    {d.toUpperCase()}
                  </button>
                ))}
              </div>
            </section>
          )}

           <section>
              <label className="text-[10px] font-bold text-slate-500 uppercase mb-4 block tracking-widest">Type de Duel</label>
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => setGameMode('PvP')}
                  className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all ${gameMode === 'PvP' ? 'bg-cyan-500 border-cyan-400 text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.3)]' : 'bg-white/5 border-white/10 text-white'}`}
                >
                  <span className="text-lg">👥</span>
                  <span className="font-bold text-xs">LOCAL (1vs1)</span>
                </button>
                <button 
                  onClick={() => setGameMode('PvE')}
                  className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all ${gameMode === 'PvE' ? 'bg-cyan-500 border-cyan-400 text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.3)]' : 'bg-white/5 border-white/10 text-white'}`}
                >
                  <span className="text-lg">🤖</span>
                  <span className="font-bold text-xs">VS BOT (IA)</span>
                </button>
              </div>
           </section>
           
           <section>
             <label className="text-[10px] font-bold text-slate-500 uppercase mb-4 block tracking-widest">Noms des Pilotes</label>
             <div className="space-y-3">
                <input 
                  type="text" 
                  value={players.player1.name} 
                  onChange={(e) => updatePlayer('player1', {name: e.target.value})} 
                  className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-white focus:border-cyan-500 outline-none transition-all" 
                  placeholder="Joueur 1" 
                />
                <input 
                  type="text" 
                  value={players.player2.name} 
                  onChange={(e) => updatePlayer('player2', {name: e.target.value})} 
                  className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-white focus:border-pink-500 outline-none transition-all" 
                  placeholder={gameMode === 'PvE' ? 'CPU (IA)' : 'Joueur 2'} 
                />
             </div>
           </section>
        </div>

        {/* Colonne Droite */}
        <div className="space-y-8">
           <section>
             <div className="flex justify-between mb-4">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Pierres par trou</label>
                <span className="text-cyan-500 font-mono font-bold">{config.stonesPerHole}</span>
             </div>
             <input 
                type="range" 
                min="2" 
                max="8" 
                step="1"
                value={config.stonesPerHole}
                onChange={(e) => setGlobalConfig({ stonesPerHole: parseInt(e.target.value) })}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-500" 
             />
           </section>

           <section>
             <div className="flex justify-between mb-4">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Nombre de trous</label>
                <span className="text-cyan-500 font-mono font-bold">{config.holesPerRow}</span>
             </div>
             <input 
                type="range" 
                min="4" 
                max="8" 
                step="1"
                value={config.holesPerRow}
                onChange={(e) => setGlobalConfig({ holesPerRow: parseInt(e.target.value) })}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-500" 
             />
           </section>

            <section>
                <label className="text-[10px] font-bold text-slate-500 uppercase mb-4 block tracking-widest">Apparence du plateau</label>
                <div className="flex gap-4">
                    {['wood', 'metal', 'gold'].map((t) => (
                    <button 
                        key={t}
                        onClick={() => changeTheme(t as any)} 
                        className={`flex-1 py-3 rounded-xl border capitalize text-xs font-bold transition-all ${currentTheme === t ? 'border-cyan-500 bg-cyan-500/10 text-white' : 'border-white/5 bg-white/5 text-slate-400 hover:bg-white/10'}`}
                    >
                        {t}
                    </button>
                    ))}
                </div>
            </section>

            <section>
                <label className="text-[10px] font-bold text-slate-500 uppercase mb-4 block tracking-widest">Couleur Néon (Joueur 1)</label>
                <div className="flex gap-3">
                    {['#06b6d4', '#8b5cf6', '#ec4899', '#f59e0b'].map((color) => (
                    <button 
                        key={color}
                        onClick={() => updatePlayer('player1', { color })}
                        className="w-8 h-8 rounded-full border-2 transition-transform hover:scale-110"
                        style={{ 
                          backgroundColor: color, 
                          borderColor: players.player1.color === color ? 'white' : 'rgba(255,255,255,0.1)',
                          boxShadow: players.player1.color === color ? `0 0 15px ${color}` : 'none' 
                        }}
                    />
                    ))}
                </div>
            </section>

           <button 
             onClick={handleStart} 
             className="w-full py-5 bg-linear-to-r from-cyan-600 to-blue-600 text-white font-black rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.4)] hover:shadow-cyan-500/20 hover:-translate-y-1 transition-all uppercase tracking-widest"
           >
             Démarrer l'expérience
           </button>
        </div>
      </div>
    </div>
  );
};