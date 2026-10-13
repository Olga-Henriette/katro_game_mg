'use client';

export const Stone = ({ color = 'cyan' }: { color?: string }) => {
  return (
    <div 
      className="w-3 h-3 sm:w-4 sm:h-4 rounded-full shadow-md shrink-0 transition-all duration-500"
      style={{
        // On ajoute une bordure légère pour bien distinguer les pierres si elles se touchent
        background: `radial-gradient(circle at 35% 35%, #fff 0%, ${color} 40%, #000 120%)`,
        boxShadow: `inset -1px -1px 2px rgba(0,0,0,0.5), 0 2px 4px rgba(0,0,0,0.3)`,
        border: `1px solid rgba(255,255,255,0.1)`
      }}
    />
  );
};