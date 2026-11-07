import React, { useState } from 'react';
import { ArrowLeft, Swords, RefreshCw, Crown, Shield, Zap } from 'lucide-react';
import { ElementType, HeroConfig } from '../types/game';
import { playSound } from '../game/audio';

interface PrepScreenProps {
  formation: ElementType[];
  heroes: Record<ElementType, HeroConfig>;
  onCycleSlot: (slotIdx: number) => void;
  onBack: () => void;
  onStartBattle: () => void;
}

export const PrepScreen: React.FC<PrepScreenProps> = React.memo(({
  formation,
  heroes,
  onCycleSlot,
  onBack,
  onStartBattle
}) => {
  const [clickedSlot, setClickedSlot] = useState<number | null>(null);

  const roles = [
    { title: 'Vanguarda', icon: <Swords className="w-3 h-3 text-cyan-300" /> },
    { title: 'Líder', icon: <Crown className="w-3.5 h-3.5 text-amber-300" /> },
    { title: 'Suporte', icon: <Shield className="w-3 h-3 text-emerald-300" /> }
  ];

  const handleSlotClick = (idx: number) => {
    playSound('element_switch');
    setClickedSlot(idx);
    setTimeout(() => setClickedSlot(null), 300);
    onCycleSlot(idx);
  };

  // Calcula se há sinergia da tríade (Água + Fogo + Vento)
  const hasTriadSynergy =
    formation.includes('water') && formation.includes('fire') && formation.includes('wind');

  return (
    <section className="fixed inset-0 z-40 flex flex-col justify-between p-4 pt-[calc(10px+env(safe-area-inset-top))] pb-[calc(16px+env(safe-area-inset-bottom))] bg-[radial-gradient(circle_at_50%_25%,rgba(16,36,54,0.96),#040a10_90%)] backdrop-blur-md overflow-hidden text-white select-none">
      {/* Top Header */}
      <div className="w-full max-w-[540px] mx-auto flex items-center justify-between">
        <button
          onClick={() => {
            playSound('click');
            onBack();
          }}
          className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold text-white flex items-center gap-1.5 transition active:scale-95 cursor-pointer shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>VOLTAR</span>
        </button>
        <span className="text-xs font-black tracking-widest text-white uppercase drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]">
          FORMAÇÃO DE COMBATE 3v3
        </span>
        <div className="w-16" />
      </div>

      {/* Sinergia Tática Banner */}
      <div className="w-full max-w-[440px] mx-auto p-3 rounded-2xl bg-[#071926]/90 border border-cyan-400/40 text-center shadow-lg backdrop-blur-sm">
        <div className="flex items-center justify-center gap-2 mb-1">
          <Zap className="w-4 h-4 text-amber-300 animate-pulse" />
          <span className="text-xs font-black text-amber-200 uppercase tracking-wide">
            {hasTriadSynergy ? 'SINERGIA ATIVA: TRÍADE DO ÉTER' : 'FORMAÇÃO CUSTOMIZADA'}
          </span>
        </div>
        <p className="text-[11px] text-slate-300 leading-snug">
          {hasTriadSynergy
            ? '✦ Bônus de Ressonância: +15% de Dano Elemental em todos os combatentes da tríade!'
            : 'Toque nos combatentes para alternar o elemento até completar os 3 elementos sagrados.'}
        </p>
      </div>

      {/* Slots com feedback visual animado */}
      <div className="flex gap-2.5 w-full max-w-[440px] mx-auto justify-center my-auto">
        {formation.map((elem, idx) => {
          const h = heroes[elem];
          const isAnimating = clickedSlot === idx;
          return (
            <div
              key={idx}
              onClick={() => handleSlotClick(idx)}
              className={`flex-1 bg-[#0a121c]/95 border rounded-2xl p-3 text-center cursor-pointer transition-all duration-200 active:scale-95 shadow-xl flex flex-col items-center justify-between gap-1.5 relative group ${
                isAnimating ? 'scale-105 border-amber-400 shadow-[0_0_20px_rgba(255,215,0,0.5)]' : 'border-cyan-500/30 hover:border-cyan-400/70'
              }`}
            >
              <div className="flex items-center gap-1 text-[9px] font-black uppercase tracking-wider text-slate-300 bg-white/5 px-2 py-0.5 rounded-full border border-white/10">
                {roles[idx].icon}
                <span>{roles[idx].title}</span>
              </div>

              <div
                className="w-12 h-12 rounded-full border-2 flex items-center justify-center text-2xl my-1 shadow-lg transition-transform duration-300 group-hover:scale-110"
                style={{
                  borderColor: h.color,
                  backgroundColor: `${h.color}25`,
                  boxShadow: `0 0 14px ${h.color}66`
                }}
              >
                {h.element === 'water' ? '💧' : h.element === 'fire' ? '🔥' : '🌪️'}
              </div>

              <div className="w-full">
                <b className="text-[11px] leading-tight block truncate w-full" style={{ color: h.color }}>
                  {h.awakened ? h.awakenedName.split(' ')[0] : h.baseName.split(' ')[0]}
                </b>
                <div className="flex items-center justify-center gap-1 text-[9px] font-bold text-slate-400 mt-0.5">
                  <span>{h.element.toUpperCase()}</span>
                  <RefreshCw className="w-2.5 h-2.5 group-hover:rotate-180 transition-transform duration-500" />
                </div>
              </div>

              {h.awakened && (
                <span className="absolute -top-1.5 -right-1.5 text-[10px] bg-[#c338ff] text-white font-black px-1.5 py-0.2 rounded-full shadow-md animate-pulse">
                  6★
                </span>
              )}
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
        className="w-full max-w-[440px] mx-auto py-3.5 rounded-2xl bg-gradient-to-b from-[#ffe680] via-[#ffaa00] to-[#b36b00] text-[#261200] font-black text-xs uppercase tracking-wider shadow-[0_6px_20px_rgba(255,170,0,0.4)] active:scale-97 cursor-pointer transition flex items-center justify-center gap-2 hover:brightness-105"
      >
        <Swords className="w-4 h-4 text-amber-950" />
        <span>INICIAR COMBATE</span>
      </button>
    </section>
  );
});
