import React from 'react';
import { Volume2, VolumeX, Shield, Swords, Sparkles } from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';
import { playSound, isSoundEnabled, setSoundEnabled } from '../game/audio';

interface LobbyScreenProps {
  onStartBattle: () => void;
  onOpenHeroes: () => void;
  onOpenPrep: () => void;
  soundOn: boolean;
  onToggleSound: () => void;
}

export const LobbyScreen: React.FC<LobbyScreenProps> = ({
  onStartBattle,
  onOpenHeroes,
  onOpenPrep,
  soundOn,
  onToggleSound
}) => {
  return (
    <section className="fixed inset-0 z-40 flex flex-col justify-between p-4 pt-[calc(10px+env(safe-area-inset-top))] pb-[calc(16px+env(safe-area-inset-bottom))] bg-[radial-gradient(circle_at_50%_25%,rgba(16,36,54,0.95),#040a10_90%)] backdrop-blur-md overflow-hidden text-white">
      {/* Top Bar */}
      <div className="w-full max-w-[540px] mx-auto flex items-center justify-between">
        <div className="text-[10px] font-black tracking-widest text-[#ffe066] uppercase">
          BUNKER25 LOGIC
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold tracking-wider text-[#19ff85] bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-500/30">
            FLORESTA DO ÉTER
          </span>
          <button
            onClick={() => {
              const next = !soundOn;
              setSoundEnabled(next);
              onToggleSound();
              if (next) playSound('click');
            }}
            aria-label={soundOn ? 'Desativar som' : 'Ativar som'}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 transition cursor-pointer"
          >
            {soundOn ? <Volume2 className="w-4 h-4 text-cyan-300" /> : <VolumeX className="w-4 h-4 text-gray-400" />}
          </button>
        </div>
      </div>

      {/* Center Hero Crest & Title */}
      <div className="flex flex-col items-center text-center gap-3 my-auto">
        <div className="w-20 h-20 filter drop-shadow-[0_0_20px_rgba(0,217,255,0.5)]">
          <svg viewBox="0 0 512 512" className="w-full h-full">
            <defs>
              <radialGradient id="lobbyCrestBg" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#193754" />
                <stop offset="70%" stopColor="#081420" />
                <stop offset="100%" stopColor="#03080e" />
              </radialGradient>
              <linearGradient id="crestFire" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffa64d" />
                <stop offset="100%" stopColor="#ff2200" />
              </linearGradient>
              <linearGradient id="crestWater" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#80f2ff" />
                <stop offset="100%" stopColor="#0066ff" />
              </linearGradient>
            </defs>
            <rect width="512" height="512" rx="120" fill="url(#lobbyCrestBg)" stroke="#225380" strokeWidth="8" />
            <circle cx="256" cy="256" r="215" stroke="#00d9ff" strokeWidth="3" strokeDasharray="10 10" opacity="0.4" />
            <path d="M225,230 C155,125 50,145 35,215 C90,215 130,245 150,285 C110,285 70,305 80,345 C120,335 160,325 200,295 Z" fill="url(#crestFire)" />
            <path d="M287,230 C357,125 462,145 477,215 C422,215 382,245 362,285 C402,285 442,305 432,345 C392,335 352,325 312,295 Z" fill="url(#crestWater)" />
            <polygon points="256,120 286,215 256,260 226,215" fill="#19ff85" />
            <circle cx="256" cy="256" r="46" fill="#09141f" stroke="#ffe066" strokeWidth="4" />
            <polygon points="256,224 282,256 256,288 230,256" fill="#c338ff" />
          </svg>
        </div>

        <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-white drop-shadow-[0_0_24px_rgba(0,217,255,0.6)] leading-none">
          Summoners<br />
          <span className="bg-gradient-to-r from-[#ffe066] via-amber-200 to-[#ffaa00] bg-clip-text text-transparent">
            Arena 3v3
          </span>
        </h1>
        <p className="text-xs text-slate-300 max-w-xs leading-relaxed">
          Formação tática unificada, relicário arcano de Veromos ancorado na espádua e esferas de energia de evolução.
        </p>
      </div>

      {/* Actions */}
      <div className="w-full max-w-[320px] mx-auto flex flex-col gap-2.5">
        <PWAInstallButton />

        <button
          onClick={() => {
            playSound('click');
            onStartBattle();
          }}
          className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-b from-[#ffe680] via-[#ffaa00] to-[#b36b00] text-[#261200] font-black text-sm uppercase tracking-wider shadow-[0_6px_20px_rgba(255,170,0,0.4)] active:scale-97 cursor-pointer transition flex items-center justify-center gap-2"
        >
          <Swords className="w-4 h-4 text-amber-950" />
          <span>ENTRAR NA ARENA</span>
        </button>

        <button
          onClick={() => {
            playSound('click');
            onOpenHeroes();
          }}
          className="w-full py-3 px-4 rounded-2xl bg-gradient-to-b from-[#1c3044] to-[#0e1824] hover:border-cyan-500/50 border border-cyan-500/30 text-cyan-100 font-bold text-xs uppercase tracking-wider shadow-[0_4px_14px_rgba(0,0,0,0.4)] active:scale-97 cursor-pointer transition flex items-center justify-center gap-2"
        >
          <Sparkles className="w-4 h-4 text-cyan-300" />
          <span>MONSTROS & DESPERTAR</span>
        </button>

        <button
          onClick={() => {
            playSound('click');
            onOpenPrep();
          }}
          className="w-full py-2.5 px-4 rounded-2xl bg-gradient-to-b from-[#152332] to-[#0a111a] hover:border-slate-500/50 border border-slate-700/40 text-slate-300 font-bold text-xs uppercase tracking-wider active:scale-97 cursor-pointer transition flex items-center justify-center gap-2"
        >
          <Shield className="w-4 h-4 text-emerald-400" />
          <span>FORMAÇÃO DE COMBATE</span>
        </button>
      </div>
    </section>
  );
};
