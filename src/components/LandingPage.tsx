'use client';

export const LandingPage = ({ onStart }: { onStart: () => void }) => {
  return (
    <div className="fixed inset-0 z-100 flex flex-col items-center justify-center bg-slate-950 overflow-hidden">
      {/* Éléments décoratifs en arrière-plan */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-pink-500/10 blur-[120px] rounded-full" />

      <div className="relative z-10 text-center space-y-8 max-w-2xl px-6">
        <h1 className="text-8xl font-black italic tracking-tighter text-white">
          FANGA<span className="text-cyan-500">.</span>
        </h1>
        <p className="text-slate-400 text-lg font-light leading-relaxed">
          Un duel de stratégie ancestral revisité pour l'ère numérique. 
          Capturez, distribuez et dominez le plateau.
        </p>
        
        <div className="flex flex-col gap-4 pt-8">
          <button 
            onClick={onStart}
            className="group relative px-12 py-5 bg-white text-black font-bold rounded-2xl overflow-hidden transition-all hover:scale-105 active:scale-95"
          >
            <span className="relative z-10">COMMENCER LE DUEL</span>
            <div className="absolute inset-0 bg-cyan-400 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </button>
          <p className="text-xs text-slate-500 font-mono tracking-widest uppercase">Version 1.0 • Web Experience</p>
        </div>
      </div>
    </div>
  );
};