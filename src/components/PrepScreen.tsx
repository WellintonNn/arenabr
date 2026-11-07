import React from 'react';
import { ArrowLeft, Swords, RefreshCw } from 'lucide-react';
import { ElementType, HeroConfig } from '../types/game';
import { playSound } from '../game/audio';

interface PrepScreenProps {
  formation: ElementType[];
  heroes: Record<ElementType, HeroConfig>;
  onCycleSlot: (slotIdx: number) => void;
  onBack: () => void;
  onStartBattle: () => void;
}

export const PrepScreen: React.FC<PrepScreenProps> = ({
  formation,
  heroes,
  onCycleSlot,
  onBack,
  onStartBattle
}) => {
  const roles = ['Vanguarda', 'Líder', 'Suporte'];

  return (
    <section className="fixed inset-0 z-40 flex flex-col justify-between p-4 pt-[calc(10px+env(safe-area-inset-top))] pb-[calc(16px+env(safe-area-inset-bottom))] bg-[radial-gradient(circle_at_50%_25%,rgba(16,36,54,0.95),#040a10_90%)] backdrop-blur-md overflow-hidden text-white">
      {/* Top Header */}
      <div className="w-full max-w-[540px] mx-auto flex items-center justify-between">
        <button
          onClick={() => {
            playSound('click');
            onBack();
          }}
          className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold text-white flex items-center gap-1.5 transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>VOLTAR</span>
        </button>
        <span className="text-xs font-black tracking-widest text-white uppercase">
          FORMAÇÃO DE COMBATE 3v3
        </span>
        <div className="w-16" />
      </div>

      {/* Info Banner */}
      <div className="w-full max-w-[440px] mx-auto p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-center text-xs text-emerald-200">
        ⚔️ <strong>FORMAÇÃO TÁTICA CLUSTER:</strong> Heróis posicionados no raio de duelo. Toque em qualquer slot para alternar o elemento do herói.
      </div>

      {/* Slots */}
      <div className="flex gap-2.5 w-full max-w-[440px] mx-auto justify-center my-auto">
        {formation.map((elem, idx) => {
          const h = heroes[elem];
          return (
            <div
              key={idx}
              onClick={() => {
                playSound('click');
                onCycleSlot(idx);
              }}
              className="flex-1 bg-[#0a121c]/95 border border-cyan-500/30 hover:border-cyan-400 rounded-2xl p-3 text-center cursor-pointer transition active:scale-97 shadow-lg flex flex-col items-center justify-between gap-1 relative group"
            >
              <span className="text-[9px] font-black uppercase tracking-wider text-slate-400">
                {roles[idx]}
              </span>
              <div
                className="w-10 h-10 rounded-full border-2 flex items-center justify-center text-xl my-1 shadow-md"
                style={{ borderColor: h.color, backgroundColor: `${h.color}22` }}
              >
                {h.element === 'water' ? '💧' : h.element === 'fire' ? '🔥' : '🌪️'}
              </div>
              <b className="text-[11px] leading-tight block truncate w-full" style={{ color: h.color }}>
                {h.awakened ? h.awakenedName.split(' ')[0] : h.baseName.split(' ')[0]}
              </b>
              <span className="text-[9px] font-bold text-slate-400 flex items-center gap-1">
                <span>{h.element.toUpperCase()}</span>
                <RefreshCw className="w-2.5 h-2.5 group-hover:rotate-180 transition-transform duration-300" />
              </span>
            </div>
          );
        })}
      </div>

      <div className="text-center text-[11px] text-slate-400">
        Toque no combatente para ciclar seu elemento da equipe.
      </div>

      {/* Action CTA */}
      <button
        onClick={() => {
          playSound('click');
          onStartBattle();
        }}
        className="w-full max-w-[440px] mx-auto py-3.5 rounded-2xl bg-gradient-to-b from-[#ffe680] via-[#ffaa00] to-[#b36b00] text-[#261200] font-black text-xs uppercase tracking-wider shadow-[0_4px_16px_rgba(255,170,0,0.35)] active:scale-97 cursor-pointer transition flex items-center justify-center gap-2"
      >
        <Swords className="w-4 h-4 text-amber-950" />
        <span>INICIAR COMBATE</span>
      </button>
    </section>
  );
};
