import React from 'react';
import { Volume2, VolumeX, Shield, Swords, Sparkles, X } from 'lucide-react';
import { ElementType, HeroConfig, EnemyConfig, SkillData } from '../types/game';
import { playSound } from '../game/audio';

export interface FloatingUnitLabel {
  id: string;
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

export const BattleHud: React.FC<BattleHudProps> = ({
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
  return (
    <div className="fixed inset-0 pointer-events-none z-30 flex flex-col justify-between p-3 pt-[calc(10px+env(safe-area-inset-top))] pb-[calc(12px+env(safe-area-inset-bottom))] text-white select-none">
      {/* Top Bar */}
      <div className="w-full max-w-[540px] mx-auto flex items-center justify-between gap-2 pointer-events-auto">
        {/* Active Hero Header */}
        {activeHero && (
          <div className="flex items-center gap-2 bg-[#0a121c]/95 px-2.5 py-1.5 rounded-2xl border border-cyan-500/30 shadow-[0_6px_20px_rgba(0,0,0,0.6)] min-w-[130px] max-w-[180px]">
            <div
              className="w-9 h-9 rounded-full border-2 flex items-center justify-center text-base font-black flex-shrink-0"
              style={{
                borderColor: activeHero.color,
                boxShadow: `0 0 10px ${activeHero.color}88`,
                backgroundColor: `${activeHero.color}22`
              }}
            >
              {activeHero.element === 'water' ? '💧' : activeHero.element === 'fire' ? '🔥' : '🌪️'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[8px] font-black uppercase tracking-wider text-emerald-400">
                SEU TURNO
              </div>
              <div className="text-[11px] font-black truncate" style={{ color: activeHero.color }}>
                {activeHero.awakened ? activeHero.awakenedName.split(' ')[0] : activeHero.baseName.split(' ')[0]}
              </div>
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden mt-1">
                <div
                  className="h-full bg-gradient-to-r from-emerald-400 to-cyan-300 transition-all duration-300"
                  style={{ width: `${Math.max(0, (activeHeroHp / activeHeroMaxHp) * 100)}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Center Control */}
        <div className="flex items-center gap-1.5 bg-[#0a121c]/80 p-1 rounded-xl border border-white/10">
          <button
            onClick={() => {
              playSound('click');
              onToggleSound();
            }}
            aria-label={soundOn ? 'Desativar som' : 'Ativar som'}
            className="p-1 rounded-lg hover:bg-white/10 text-slate-300 transition cursor-pointer"
          >
            {soundOn ? <Volume2 className="w-3.5 h-3.5 text-cyan-300" /> : <VolumeX className="w-3.5 h-3.5 text-gray-400" />}
          </button>
          <button
            onClick={() => {
              playSound('click');
              onSurrender();
            }}
            className="px-2 py-0.5 rounded-lg bg-red-950/60 hover:bg-red-900 border border-red-500/30 text-[9px] font-black text-red-200 transition cursor-pointer"
          >
            SAIR
          </button>
        </div>

        {/* Selected Enemy Target Header */}
        {targetEnemy && (
          <div className="flex items-center flex-row-reverse gap-2 bg-[#0a121c]/95 px-2.5 py-1.5 rounded-2xl border border-red-500/40 shadow-[0_6px_20px_rgba(0,0,0,0.6)] min-w-[130px] max-w-[180px] text-right">
            <div className="w-9 h-9 rounded-full border-2 border-red-500 flex items-center justify-center text-base font-black flex-shrink-0 bg-red-950/60 shadow-[0_0_10px_rgba(255,42,85,0.6)]">
              ☠
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[8px] font-black uppercase tracking-wider text-red-400">
                ALVO 3D
              </div>
              <div className="text-[11px] font-black truncate text-red-200">
                {targetEnemy.name.split(' ')[0]}
              </div>
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden mt-1">
                <div
                  className="h-full bg-gradient-to-r from-red-500 to-amber-500 transition-all duration-300"
                  style={{ width: `${Math.max(0, (targetEnemyHp / targetEnemyMaxHp) * 100)}%` }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Sleek Action Ticker Notification (Directly under top bar, NOT in center!) */}
      {actionTicker && (
        <div className="w-full max-w-[380px] mx-auto mt-2 pointer-events-none transition-all duration-200 animate-in fade-in slide-in-from-top-2">
          <div className="px-3.5 py-1.5 rounded-full bg-[#07111c]/90 border border-amber-400/40 shadow-[0_4px_16px_rgba(0,0,0,0.8)] backdrop-blur-sm text-center flex items-center justify-center gap-2">
            <span className="text-xs">
              {tickerElement === 'water' ? '💧' : tickerElement === 'fire' ? '🔥' : tickerElement === 'wind' ? '🌪️' : '⚔️'}
            </span>
            <span className="text-[11px] font-black tracking-wide text-white drop-shadow-sm">
              {actionTicker}
            </span>
          </div>
        </div>
      )}

      {/* Floating 3D Combatant Labels (Anchored right above character heads) */}
      <div className="fixed inset-0 pointer-events-none z-20 overflow-hidden">
        {floatingLabels.map((label, idx) => {
          if (label.isDead) return null;
          return (
            <div
              key={label.id}
              onClick={(e) => {
                e.stopPropagation();
                if (!label.isHero && !isBusy) {
                  onSelectTarget(idx % 3);
                }
              }}
              style={{
                left: `${label.screenX}px`,
                top: `${label.screenY}px`,
                transform: 'translate(-50%, -100%)'
              }}
              className={`absolute flex flex-col items-center pointer-events-auto cursor-pointer transition-transform active:scale-105 ${
                label.isTarget ? 'z-30 scale-105' : 'z-20'
              }`}
            >
              {/* Target indicator arrow */}
              {label.isTarget && !label.isHero && (
                <div className="w-0 h-0 border-l-[7px] border-l-transparent border-r-[7px] border-r-transparent border-t-[10px] border-t-red-500 mb-0.5 filter drop-shadow-[0_0_8px_#ff2255] animate-bounce" />
              )}
              {/* Mini HP bar */}
              <div className="w-11 h-1.5 bg-[#060c12]/90 border border-white/30 rounded-full overflow-hidden shadow-md">
                <div
                  className={`h-full rounded-full transition-all duration-200 ${
                    label.isHero ? 'bg-[#2bff88]' : 'bg-[#ff3355]'
                  }`}
                  style={{ width: `${label.hpPercent}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Damage Popups */}
      <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
        {damagePopups.map((popup) => (
          <div
            key={popup.id}
            style={{
              left: `${popup.screenX}px`,
              top: `${popup.screenY}px`,
              color: popup.color
            }}
            className="absolute font-black text-lg -translate-x-1/2 -translate-y-1/2 drop-shadow-[0_2px_4px_#000] animate-[popupFloat_0.85s_ease-out_forwards]"
          >
            {popup.text}
          </div>
        ))}
      </div>

      {/* Bottom Skill Cards Bar */}
      <div className="w-full max-w-[440px] mx-auto flex items-end justify-center gap-2.5 pointer-events-auto">
        {activeHero &&
          activeHero.skills.map((skill, idx) => {
            const isUlt = skill.isUlt;
            return (
              <button
                key={idx}
                disabled={isBusy}
                onClick={() => {
                  if (!isBusy) onCastSkill(idx);
                }}
                className={`flex-1 h-16 rounded-2xl p-1.5 flex flex-col items-center justify-center gap-0.5 relative transition active:scale-95 cursor-pointer shadow-lg ${
                  isBusy ? 'opacity-50 cursor-not-allowed' : 'hover:brightness-110'
                } ${
                  isUlt
                    ? 'bg-gradient-to-b from-[#2a1c0d] to-[#140b03] border-2 border-[#ffe066] shadow-[0_0_18px_rgba(255,224,102,0.4)]'
                    : 'bg-gradient-to-b from-[#182434] to-[#081018] border border-cyan-500/30'
                }`}
              >
                <div className="text-xl leading-none">{skill.ico}</div>
                <span className="text-[10px] font-black tracking-wide truncate w-full text-center leading-tight">
                  {skill.name}
                </span>
                <span className="text-[8px] text-slate-400 font-bold">
                  {isUlt ? 'ULTIMATE' : skill.cd}
                </span>
              </button>
            );
          })}
      </div>

      {/* Victory / Defeat Modal */}
      {battleResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 pointer-events-auto">
          <div className="relative w-full max-w-sm rounded-3xl bg-[#0a1420] border-2 border-amber-400 p-6 text-center shadow-[0_0_40px_rgba(255,215,0,0.3)] animate-in zoom-in-95">
            <div className="text-4xl mb-2">
              {battleResult === 'victory' ? '🏆' : '☠️'}
            </div>
            <h2
              className={`text-2xl font-black uppercase tracking-wider mb-2 ${
                battleResult === 'victory'
                  ? 'text-amber-300 drop-shadow-[0_0_12px_rgba(255,215,0,0.6)]'
                  : 'text-red-400 drop-shadow-[0_0_12px_rgba(255,42,85,0.6)]'
              }`}
            >
              {battleResult === 'victory' ? 'VICTORY!' : 'DERROTA...'}
            </h2>
            <p className="text-xs text-slate-300 mb-6 leading-relaxed">
              {battleResult === 'victory'
                ? 'Você dominou a arena e provou o poder supremo do relicário arcano de Veromos!'
                : 'Seus monstros tombaram perante as forças inimigas. Reorganize suas runas e retorne mais forte!'}
            </p>
            <button
              onClick={() => {
                playSound('click');
                onReturnToLobby();
              }}
              className="w-full py-3 rounded-2xl bg-gradient-to-b from-[#ffe680] via-[#ffaa00] to-[#b36b00] text-[#261200] font-black text-xs uppercase tracking-wider shadow-[0_4px_14px_rgba(255,170,0,0.3)] active:scale-97 cursor-pointer transition"
            >
              VOLTAR AO LOBBY
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
