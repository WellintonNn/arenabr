import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { playSound } from '../game/audio';
import celestialIcon from '../assets/images/app_icon_celestial_1794068543987.jpg';

interface TitleScreenProps {
  onStart: () => void;
}

export const TitleScreen: React.FC<TitleScreenProps> = React.memo(({ onStart }) => {
  const [fading, setFading] = useState<boolean>(false);

  const handleClick = () => {
    if (fading) return;
    playSound('star_pop');
    setFading(true);
    setTimeout(() => {
      onStart();
    }, 450);
  };

  return (
    <div
      onClick={handleClick}
      className={`fixed inset-0 z-50 flex flex-col items-center justify-between p-6 bg-[#04080e] select-none cursor-pointer transition-opacity duration-500 overflow-hidden ${
        fading ? 'opacity-0 scale-105' : 'opacity-100 scale-100'
      }`}
    >
      {/* Luz ambiente e aura mística */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(16,48,72,0.65),#04080e_85%)] pointer-events-none" />

      {/* Top Header Branding */}
      <div className="relative z-10 pt-[calc(16px+env(safe-area-inset-top))] text-center">
        <span className="text-[10px] font-black tracking-[0.3em] uppercase text-cyan-400/80 bg-cyan-950/60 border border-cyan-500/30 px-3 py-1 rounded-full backdrop-blur-sm">
          BUNKER25 LOGIC • SUMMONERS ARENA
        </span>
      </div>

      {/* Centro: Selo Celestial Rúnico com Pulso Dourado */}
      <div className="relative z-10 flex flex-col items-center justify-center my-auto">
        <div className="relative w-44 h-44 sm:w-56 sm:h-56 flex items-center justify-center mb-6">
          {/* Anéis de pulso rúnico */}
          <div className="absolute inset-0 rounded-full border border-amber-400/30 animate-ping opacity-25" />
          <div className="absolute -inset-4 rounded-full border border-cyan-400/20 animate-pulse" />

          {/* Imagem do Selo Celestial da Aplicação */}
          <img
            src={celestialIcon}
            alt="Selo Celestial"
            className="w-36 h-36 sm:w-44 sm:h-44 rounded-3xl object-cover shadow-[0_0_50px_rgba(255,200,50,0.45)] border-2 border-amber-400/70"
          />
        </div>

        <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-cyan-300 drop-shadow-[0_0_24px_rgba(255,215,0,0.6)] text-center">
          Summoners Arena
        </h1>
        <p className="text-xs text-slate-400 mt-1.5 tracking-widest uppercase font-semibold">
          Edição Ilha Flutuante & 4 Mundos
        </p>
      </div>

      {/* Rodapé: TOQUE PARA INICIAR com Pulso Contínuo */}
      <div className="relative z-10 pb-[calc(20px+env(safe-area-inset-bottom))] flex flex-col items-center gap-2">
        <div className="flex items-center gap-2 text-sm sm:text-base font-black tracking-[0.25em] uppercase text-amber-300 animate-pulse drop-shadow-[0_0_12px_rgba(255,215,0,0.8)]">
          <Sparkles className="w-4 h-4 text-cyan-300 animate-spin" />
          <span>TOQUE PARA INICIAR</span>
          <Sparkles className="w-4 h-4 text-cyan-300 animate-spin" />
        </div>
        <span className="text-[10px] text-slate-500 font-medium tracking-wider">
          Toque em qualquer lugar da tela
        </span>
      </div>
    </div>
  );
});
