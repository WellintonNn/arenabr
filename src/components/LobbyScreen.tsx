import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX, Shield, Swords, Sparkles, Flame, Droplets, Wind } from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';
import { playSound, setSoundEnabled } from '../game/audio';

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
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    clearTimeout((showToast as unknown as { timer?: NodeJS.Timeout }).timer);
    (showToast as unknown as { timer?: NodeJS.Timeout }).timer = setTimeout(() => setToast(null), 1500);
  };

  // Partículas cósmicas flutuantes no fundo
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const context: CanvasRenderingContext2D = ctx;

    let animId: number;
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    const onResize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', onResize);

    const particles = Array.from({ length: 42 }).map(() => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 2 + 0.8,
      vx: (Math.random() - 0.5) * 0.4,
      vy: -Math.random() * 0.5 - 0.2,
      color: ['#00d9ff', '#ffaa00', '#19ff85', '#c338ff', '#ffffff'][Math.floor(Math.random() * 5)],
      alpha: Math.random() * 0.7 + 0.3
    }));

    function loop() {
      context.clearRect(0, 0, w, h);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < 0) {
          p.y = h + 10;
          p.x = Math.random() * w;
        }
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;

        context.save();
        context.fillStyle = p.color;
        context.globalAlpha = p.alpha;
        context.shadowColor = p.color;
        context.shadowBlur = 8;
        context.beginPath();
        context.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        context.fill();
        context.restore();
      }
      animId = requestAnimationFrame(loop);
    }
    loop();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <section className="fixed inset-0 z-40 flex flex-col justify-between p-4 pt-[calc(10px+env(safe-area-inset-top))] pb-[calc(16px+env(safe-area-inset-bottom))] bg-[radial-gradient(circle_at_50%_25%,rgba(16,36,54,0.96),#040a10_90%)] backdrop-blur-md overflow-hidden text-white select-none">
      {/* Background Starfield Particles */}
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />

      {/* Toast Feedback */}
      {toast && (
        <div className="fixed top-12 left-1/2 -translate-x-1/2 z-50 bg-[#07111c]/95 border border-amber-400/50 px-4 py-1.5 rounded-full text-xs font-bold text-amber-200 shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-top-2">
          {toast}
        </div>
      )}

      {/* Top Bar */}
      <div className="relative z-10 w-full max-w-[540px] mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#00d9ff] animate-pulse" />
          <div className="text-[10px] font-black tracking-widest text-[#ffe066] uppercase">
            BUNKER25 LOGIC
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-[10px] font-extrabold tracking-wider text-[#19ff85] bg-emerald-950/70 px-2.5 py-1 rounded-full border border-emerald-500/40 shadow-[0_0_12px_rgba(25,255,133,0.2)]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span>FLORESTA DO ÉTER</span>
          </div>
          <button
            onClick={() => {
              const next = !soundOn;
              setSoundEnabled(next);
              onToggleSound();
              if (next) playSound('click');
              showToast(next ? 'Áudio Ativado 🔊' : 'Áudio Desativado 🔇');
            }}
            aria-label={soundOn ? 'Desativar som' : 'Ativar som'}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 border border-white/20 transition cursor-pointer flex items-center gap-1"
          >
            {soundOn ? <Volume2 className="w-4 h-4 text-cyan-300" /> : <VolumeX className="w-4 h-4 text-gray-400" />}
          </button>
        </div>
      </div>

      {/* Center Hero Crest & Title */}
      <div className="relative z-10 flex flex-col items-center text-center gap-3 my-auto">
        <div className="relative w-24 h-24 filter drop-shadow-[0_0_24px_rgba(0,217,255,0.6)] group cursor-pointer transition-transform duration-300 hover:scale-105 active:scale-95">
          {/* Animated Halo */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-500/30 via-amber-400/20 to-purple-500/30 blur-xl animate-pulse" />
          <svg viewBox="0 0 512 512" className="w-full h-full relative z-10">
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

        <div>
          <div className="flex items-center justify-center gap-2 mb-1">
            <span className="flex items-center gap-1 text-[10px] font-black text-cyan-300 uppercase tracking-widest bg-cyan-950/60 px-2.5 py-0.5 rounded-full border border-cyan-500/30">
              <Droplets className="w-3 h-3 text-cyan-400" /> Água
            </span>
            <span className="flex items-center gap-1 text-[10px] font-black text-red-300 uppercase tracking-widest bg-red-950/60 px-2.5 py-0.5 rounded-full border border-red-500/30">
              <Flame className="w-3 h-3 text-red-400" /> Fogo
            </span>
            <span className="flex items-center gap-1 text-[10px] font-black text-emerald-300 uppercase tracking-widest bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
              <Wind className="w-3 h-3 text-emerald-400" /> Vento
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white drop-shadow-[0_0_24px_rgba(0,217,255,0.6)] leading-none">
            Summoners<br />
            <span className="bg-gradient-to-r from-[#ffe066] via-amber-200 to-[#ffaa00] bg-clip-text text-transparent">
              Arena 3v3
            </span>
          </h1>
        </div>

        <p className="text-xs text-slate-300 max-w-xs leading-relaxed">
          Formação tática unificada, relicário arcano de Veromos ancorado na espádua e esferas de energia de evolução.
        </p>
      </div>

      {/* Actions */}
      <div className="relative z-10 w-full max-w-[320px] mx-auto flex flex-col gap-2.5">
        <PWAInstallButton />

        <button
          onClick={() => {
            playSound('click');
            onStartBattle();
          }}
          className="relative group overflow-hidden w-full py-3.5 px-4 rounded-2xl bg-gradient-to-b from-[#ffe680] via-[#ffaa00] to-[#b36b00] text-[#261200] font-black text-sm uppercase tracking-wider shadow-[0_6px_22px_rgba(255,170,0,0.45)] active:scale-97 cursor-pointer transition flex items-center justify-center gap-2 hover:brightness-105"
        >
          {/* Shine Sweep Animation */}
          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12" />
          <Swords className="w-4 h-4 text-amber-950" />
          <span>ENTRAR NA ARENA</span>
        </button>

        <button
          onClick={() => {
            playSound('click');
            onOpenHeroes();
          }}
          className="relative group overflow-hidden w-full py-3 px-4 rounded-2xl bg-gradient-to-b from-[#1c3044] to-[#0e1824] hover:border-cyan-400/60 border border-cyan-500/30 text-cyan-100 font-bold text-xs uppercase tracking-wider shadow-[0_4px_14px_rgba(0,0,0,0.4)] active:scale-97 cursor-pointer transition flex items-center justify-center gap-2"
        >
          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent skew-x-12" />
          <Sparkles className="w-4 h-4 text-cyan-300" />
          <span>MONSTROS & DESPERTAR</span>
        </button>

        <button
          onClick={() => {
            playSound('click');
            onOpenPrep();
          }}
          className="w-full py-2.5 px-4 rounded-2xl bg-gradient-to-b from-[#152332] to-[#0a111a] hover:border-slate-500/60 border border-slate-700/40 text-slate-300 font-bold text-xs uppercase tracking-wider active:scale-97 cursor-pointer transition flex items-center justify-center gap-2"
        >
          <Shield className="w-4 h-4 text-emerald-400" />
          <span>FORMAÇÃO DE COMBATE</span>
        </button>
      </div>
    </section>
  );
};
