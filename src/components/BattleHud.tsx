import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { Volume2, VolumeX, Shield, Swords, Sparkles, X, Trophy, AlertTriangle, Star } from 'lucide-react';
import { ElementType, HeroConfig, EnemyConfig } from '../types/game';
import { playSound } from '../game/audio';

export interface FloatingUnitLabel {
  id: string;
  slot: number;
  isHero: boolean;
  name: string;
  hpPercent: number;
  screenX: number;
  screenY: number;
  isTarget: boolean;
  isDead: boolean;
}

export interface DamagePopupItem {
  id: string;
  text: string;
  color: string;
  screenX: number;
  screenY: number;
}

interface BattleHudProps {
  activeHero: HeroConfig | null;
  activeHeroHp: number;
  activeHeroMaxHp: number;
  targetEnemy: EnemyConfig | null;
  targetEnemyHp: number;
  targetEnemyMaxHp: number;
  actionTicker: string | null;
  tickerElement: ElementType | null;
  isBusy: boolean;
  floatingLabels: FloatingUnitLabel[];
  damagePopups: DamagePopupItem[];
  onCastSkill: (skillIdx: number) => void;
  onSelectTarget: (slotIdx: number) => void;
  onSurrender: () => void;
  soundOn: boolean;
  onToggleSound: () => void;
  battleResult: 'victory' | 'defeat' | null;
  onReturnToLobby: () => void;
}

export const BattleHud: React.FC<BattleHudProps> = React.memo(({
  activeHero,
  activeHeroHp,
  activeHeroMaxHp,
  targetEnemy,
  targetEnemyHp,
  targetEnemyMaxHp,
  actionTicker,
  tickerElement,
  isBusy,
  floatingLabels,
  damagePopups,
  onCastSkill,
  onSelectTarget,
  onSurrender,
  soundOn,
  onToggleSound,
  battleResult,
  onReturnToLobby
}) => {
  const [screenVignette, setScreenVignette] = useState<string | null>(null);

  // Gatilho de Confetti e Fanfarra na Vitória
  useEffect(() => {
    if (battleResult === 'victory') {
      playSound('victory_fanfare');
      confetti({
        particleCount: 80,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#ffe066', '#00d9ff', '#ff3b14', '#19ff85', '#e64dff']
      });
      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 70,
          origin: { x: 0.1, y: 0.7 }
        });
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 70,
          origin: { x: 0.9, y: 0.7 }
        });
      }, 350);
    } else if (battleResult === 'defeat') {
      playSound('defeat_sound');
    }
  }, [battleResult]);

  // Flash de Vinheta quando surge ação elemental
  useEffect(() => {
    if (tickerElement) {
      const colors: Record<ElementType, string> = {
        water: 'rgba(0,217,255,0.18)',
        fire: 'rgba(255,59,20,0.22)',
        wind: 'rgba(25,255,133,0.18)'
      };
      setScreenVignette(colors[tickerElement]);
      const timer = setTimeout(() => setScreenVignette(null), 380);
      return () => clearTimeout(timer);
    }
  }, [actionTicker, tickerElement]);

  const activeHeroPercent = Math.max(0, (activeHeroHp / activeHeroMaxHp) * 100);
  const targetEnemyPercent = Math.max(0, (targetEnemyHp / targetEnemyMaxHp) * 100);

  return (
    <div className="fixed inset-0 pointer-events-none z-30 flex flex-col justify-between p-3 pt-[calc(10px+env(safe-area-inset-top))] pb-[calc(12px+env(safe-area-inset-bottom))] text-white select-none">
      {/* Vinheta Dinâmica de Impacto / Dano */}
      {screenVignette && (
        <div
          className="fixed inset-0 pointer-events-none z-10 transition-opacity duration-300 animate-in fade-in"
          style={{
            boxShadow: `inset 0 0 80px 20px ${screenVignette}`
          }}
        />
      )}

      {/* Top Bar */}
      <div className="w-full max-w-[540px] mx-auto flex items-center justify-between gap-2 pointer-events-auto">
        {/* Active Hero Header */}
        {activeHero && (
          <div className="flex items-center gap-2 bg-[#0a121c]/95 px-3 py-2 rounded-2xl border border-cyan-500/40 shadow-[0_8px_24px_rgba(0,0,0,0.7)] min-w-[130px] max-w-[190px]">
            <div
              className="w-10 h-10 rounded-full border-2 flex items-center justify-center text-lg font-black flex-shrink-0 transition-transform duration-300"
              style={{
                borderColor: activeHero.color,
                boxShadow: `0 0 12px ${activeHero.color}99`,
                backgroundColor: `${activeHero.color}25`
              }}
            >
              {activeHero.element === 'water' ? '💧' : activeHero.element === 'fire' ? '🔥' : '🌪️'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-[8px] font-black uppercase tracking-wider text-emerald-400">
                  SEU TURNO
                </span>
                <span className="text-[9px] font-mono text-slate-400 font-bold">
                  {Math.round(activeHeroPercent)}%
                </span>
              </div>
              <div className="text-[11px] font-black truncate" style={{ color: activeHero.color }}>
                {activeHero.awakened ? activeHero.awakenedName.split(' ')[0] : activeHero.baseName.split(' ')[0]}
              </div>
              {/* Barra com Ghost Trail Vermelho */}
              <div className="relative h-2 w-full bg-slate-900 rounded-full overflow-hidden mt-1 border border-white/10">
                <div
                  className="absolute inset-0 bg-red-600 transition-all duration-700 ease-out"
                  style={{ width: `${activeHeroPercent}%` }}
                />
                <div
                  className="relative h-full bg-gradient-to-r from-emerald-400 to-cyan-300 transition-all duration-300"
                  style={{ width: `${activeHeroPercent}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Center Control */}
        <div className="flex items-center gap-1.5 bg-[#0a121c]/85 p-1 rounded-2xl border border-white/15 shadow-md">
          <button
            onClick={() => {
              playSound('click');
              onToggleSound();
            }}
            aria-label={soundOn ? 'Desativar som' : 'Ativar som'}
            className="p-1.5 rounded-xl hover:bg-white/10 text-slate-300 transition cursor-pointer active:scale-95"
          >
            {soundOn ? <Volume2 className="w-4 h-4 text-cyan-300" /> : <VolumeX className="w-4 h-4 text-gray-400" />}
          </button>
          <button
            onClick={() => {
              playSound('click');
              onSurrender();
            }}
            className="px-2.5 py-1 rounded-xl bg-red-950/70 hover:bg-red-900 border border-red-500/40 text-[9px] font-black text-red-200 transition active:scale-95 cursor-pointer shadow-sm"
          >
            SAIR
          </button>
        </div>

        {/* Selected Enemy Target Header */}
        {targetEnemy && (
          <div
            onClick={() => {
              if (!isBusy) {
                playSound('click');
                onSelectTarget((targetEnemy as any).slot !== undefined ? ((targetEnemy as any).slot + 1) % 3 : 0);
              }
            }}
            className="flex items-center flex-row-reverse gap-2 bg-[#0a121c]/95 px-3 py-2 rounded-2xl border border-red-500/50 hover:border-red-400 shadow-[0_8px_24px_rgba(0,0,0,0.7)] min-w-[130px] max-w-[190px] text-right cursor-pointer active:scale-95 transition"
            title="Toque para alternar o alvo inimigo"
          >
            <div className="w-10 h-10 rounded-full border-2 border-red-500 flex items-center justify-center text-lg font-black flex-shrink-0 bg-red-950/70 shadow-[0_0_12px_rgba(255,42,85,0.7)]">
              ☠
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between flex-row-reverse">
                <span className="text-[8px] font-black uppercase tracking-wider text-red-400">
                  ALVO 3D
                </span>
                <span className="text-[9px] font-mono text-slate-400 font-bold">
                  {Math.round(targetEnemyPercent)}%
                </span>
              </div>
              <div className="text-[11px] font-black truncate text-red-200">
                {targetEnemy.name.split(' ')[0]}
              </div>
              <div className="relative h-2 w-full bg-slate-900 rounded-full overflow-hidden mt-1 border border-white/10">
                <div
                  className="absolute inset-0 bg-amber-600 transition-all duration-700 ease-out"
                  style={{ width: `${targetEnemyPercent}%` }}
                />
                <div
                  className="relative h-full bg-gradient-to-r from-red-500 to-amber-500 transition-all duration-300"
                  style={{ width: `${targetEnemyPercent}%` }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Sleek Action Ticker Notification (NOVO FEEDBACK NO TOPO) */}
      {actionTicker && (
        <div className="w-full max-w-[380px] mx-auto mt-2 pointer-events-none transition-all duration-200 animate-in fade-in slide-in-from-top-3">
          <div className="px-4 py-1.5 rounded-full bg-[#07111c]/95 border border-amber-400/50 shadow-[0_6px_22px_rgba(0,0,0,0.85)] backdrop-blur-md text-center flex items-center justify-center gap-2">
            <span className="text-xs">
              {tickerElement === 'water' ? '💧' : tickerElement === 'fire' ? '🔥' : tickerElement === 'wind' ? '🌪️' : '⚔️'}
            </span>
            <span className="text-[11px] font-black tracking-wide text-white drop-shadow">
              {actionTicker}
            </span>
          </div>
        </div>
      )}

      {/* Floating 3D Combatant Labels com Ghost Trail & Indicador de Mira */}
      <div className="fixed inset-0 pointer-events-none z-20 overflow-hidden">
        {floatingLabels.map((label) => {
          if (label.isDead) return null;
          const isLow = label.hpPercent < 30;
          return (
            <div
              key={label.id}
              onClick={(e) => {
                e.stopPropagation();
                if (!label.isHero && !isBusy) {
                  playSound('click');
                  onSelectTarget(label.slot);
                }
              }}
              style={{
                left: `${label.screenX}px`,
                top: `${label.screenY}px`,
                transform: 'translate(-50%, -100%)'
              }}
              className={`absolute flex flex-col items-center pointer-events-auto cursor-pointer p-2 rounded-2xl transition-all ${
                label.isTarget ? 'z-30 scale-110' : 'z-20 hover:scale-105 opacity-90'
              }`}
            >
              {/* Retículo de Alvo / Mira nos Inimigos */}
              {!label.isHero && (
                <div
                  className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider mb-1 shadow-md transition-all ${
                    label.isTarget
                      ? 'bg-red-600 text-white border border-amber-300 shadow-[0_0_12px_#ff2255] animate-bounce'
                      : 'bg-black/70 text-slate-300 border border-white/20 hover:border-red-400'
                  }`}
                >
                  <span>{label.isTarget ? '🔻 ALVO' : 'MIRA'}</span>
                </div>
              )}

              {/* Mini HP bar com pulso de perigo se baixo */}
              <div
                className={`w-14 h-2.5 bg-[#060c12]/95 border rounded-full overflow-hidden shadow-lg ${
                  isLow ? 'border-red-400 animate-pulse' : 'border-white/30'
                }`}
              >
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    label.isHero
                      ? isLow
                        ? 'bg-amber-400'
                        : 'bg-[#2bff88]'
                      : 'bg-[#ff3355]'
                  }`}
                  style={{ width: `${label.hpPercent}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Damage Popups com Destaque Crítico */}
      <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
        {damagePopups.map((popup) => (
          <div
            key={popup.id}
            style={{
              left: `${popup.screenX}px`,
              top: `${popup.screenY}px`,
              color: popup.color
            }}
            className="absolute font-black text-lg -translate-x-1/2 -translate-y-1/2 drop-shadow-[0_2px_8px_#000] animate-[popupFloat_0.85s_ease-out_forwards]"
          >
            {popup.text}
          </div>
        ))}
      </div>

      {/* Bottom Skill Cards Bar com Iluminação de Recarga e Feedback Tátil */}
      <div className="w-full max-w-[440px] mx-auto flex items-end justify-center gap-2.5 pointer-events-auto">
        {activeHero &&
          activeHero.skills.map((skill, idx) => {
            const isUlt = skill.isUlt;
            return (
              <button
                key={idx}
                disabled={isBusy}
                onClick={() => {
                  if (!isBusy) {
                    playSound('click');
                    onCastSkill(idx);
                  }
                }}
                className={`relative group overflow-hidden flex-1 h-16 rounded-2xl p-1.5 flex flex-col items-center justify-center gap-0.5 transition-all duration-200 active:scale-95 cursor-pointer shadow-xl ${
                  isBusy ? 'opacity-40 cursor-not-allowed' : 'hover:scale-[1.03] hover:brightness-110'
                } ${
                  isUlt
                    ? 'bg-gradient-to-b from-[#2e1d08] to-[#120800] border-2 border-[#ffe066] shadow-[0_0_20px_rgba(255,224,102,0.45)]'
                    : 'bg-gradient-to-b from-[#182434] to-[#081018] border border-cyan-500/40'
                }`}
              >
                {/* Efeito Shimmer */}
                {isUlt && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-300/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                )}
                <div className="text-xl leading-none drop-shadow">{skill.ico}</div>
                <span className="text-[10px] font-black tracking-wide truncate w-full text-center leading-tight">
                  {skill.name}
                </span>
                <span
                  className={`text-[8px] font-black px-1.5 py-0.2 rounded-full ${
                    isUlt ? 'text-amber-300 bg-amber-950/80' : 'text-slate-400 bg-black/40'
                  }`}
                >
                  {isUlt ? 'ULTIMATE' : skill.cd}
                </span>
              </button>
            );
          })}
      </div>

      {/* Victory / Defeat Modal com Show de Feedbacks */}
      {battleResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 pointer-events-auto animate-in fade-in duration-300">
          <div className="relative w-full max-w-sm rounded-3xl bg-[#0a1420] border-2 border-amber-400 p-6 text-center shadow-[0_0_50px_rgba(255,215,0,0.4)] animate-in zoom-in-95">
            <div className="text-5xl mb-3 animate-bounce">
              {battleResult === 'victory' ? '🏆' : '☠️'}
            </div>
            <h2
              className={`text-2xl font-black uppercase tracking-wider mb-2 ${
                battleResult === 'victory'
                  ? 'text-amber-300 drop-shadow-[0_0_16px_rgba(255,215,0,0.7)]'
                  : 'text-red-400 drop-shadow-[0_0_16px_rgba(255,42,85,0.7)]'
              }`}
            >
              {battleResult === 'victory' ? 'VICTORY!' : 'DERROTA...'}
            </h2>
            <p className="text-xs text-slate-300 mb-5 leading-relaxed">
              {battleResult === 'victory'
                ? 'Você dominou a arena e provou o poder supremo do relicário arcano de Veromos!'
                : 'Seus monstros tombaram perante as forças inimigas. Reorganize suas runas e retorne mais forte!'}
            </p>

            {/* Recompensas da Vitória */}
            {battleResult === 'victory' && (
              <div className="bg-black/50 border border-amber-400/30 rounded-2xl p-3 mb-5 flex items-center justify-around text-center">
                <div>
                  <span className="text-lg">✨</span>
                  <div className="text-[9px] text-slate-400 font-bold">Essências</div>
                  <b className="text-xs text-amber-300">+5 Magia</b>
                </div>
                <div>
                  <span className="text-lg">💎</span>
                  <div className="text-[9px] text-slate-400 font-bold">Cristais</div>
                  <b className="text-xs text-cyan-300">+30</b>
                </div>
                <div>
                  <span className="text-lg">⭐</span>
                  <div className="text-[9px] text-slate-400 font-bold">EXP Bônus</div>
                  <b className="text-xs text-emerald-400">+1,400</b>
                </div>
              </div>
            )}

            <button
              onClick={() => {
                playSound('click');
                onReturnToLobby();
              }}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-b from-[#ffe680] via-[#ffaa00] to-[#b36b00] text-[#261200] font-black text-xs uppercase tracking-wider shadow-[0_6px_20px_rgba(255,170,0,0.4)] active:scale-97 cursor-pointer transition hover:brightness-105"
            >
              VOLTAR AO LOBBY
            </button>
          </div>
        </div>
      )}
    </div>
  );
});
