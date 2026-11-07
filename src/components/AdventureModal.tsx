import React, { useState } from 'react';
import { X, Swords, Skull, Zap, Gem, Sparkles, ChevronRight, Shield, Award } from 'lucide-react';
import { WorldId, StageConfig } from '../types/game';
import { WORLDS_DATA } from '../game/adventureData';
import { playSound } from '../game/audio';

interface AdventureModalProps {
  onClose: () => void;
  onSelectStage: (stage: StageConfig) => void;
  currentEnergy: number;
}

export const AdventureModal: React.FC<AdventureModalProps> = React.memo(({
  onClose,
  onSelectStage,
  currentEnergy
}) => {
  const [selectedWorld, setSelectedWorld] = useState<WorldId>('forest');
  const [selectedStageId, setSelectedStageId] = useState<string>('forest-1');

  const world = WORLDS_DATA[selectedWorld];
  const activeStage = world.stages.find((s) => s.id === selectedStageId) || world.stages[0];

  const handleWorldChange = (wId: WorldId) => {
    playSound('element_switch');
    setSelectedWorld(wId);
    setSelectedStageId(WORLDS_DATA[wId].stages[0].id);
  };

  const handleStageClick = (stage: StageConfig) => {
    playSound('click');
    setSelectedStageId(stage.id);
  };

  const handleStart = () => {
    playSound('charge');
    onSelectStage(activeStage);
  };

  const worldTabs: Array<{ id: WorldId; label: string; icon: string }> = [
    { id: 'forest', label: 'Floresta', icon: '🌲' },
    { id: 'desert', label: 'Deserto', icon: '🏜️' },
    { id: 'glacier', label: 'Geleira', icon: '❄️' },
    { id: 'volcano', label: 'Vulcão', icon: '🌋' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md select-none animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl h-[92vh] max-h-[720px] rounded-3xl bg-[#08121c] border-2 border-cyan-500/40 shadow-[0_0_60px_rgba(0,180,255,0.25)] flex flex-col overflow-hidden text-white">
        
        {/* Top Header com Seletor de Mundos & Fechar */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#0c1a28] border-b border-cyan-500/20">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-cyan-950 border border-cyan-400 flex items-center justify-center text-sm">
              🗺️
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-black tracking-wider uppercase text-cyan-200">
                MAPA DE AVENTURA
              </h2>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                4 Mundos • 20 Fases com Chefes
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              playSound('click');
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-slate-800/80 hover:bg-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition cursor-pointer border border-white/10"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Abas dos 4 Mundos */}
        <div className="flex items-center gap-1.5 p-2 bg-[#060e17] border-b border-white/5 overflow-x-auto no-scrollbar">
          {worldTabs.map((tab) => {
            const isActive = selectedWorld === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleWorldChange(tab.id)}
                className={`flex-1 min-w-[90px] py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-[0_0_16px_rgba(0,200,255,0.4)] border border-cyan-300'
                    : 'bg-[#0a1622] hover:bg-[#0f2133] text-slate-400 border border-white/5'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Corpo Principal: Lista de Fases + Detalhes da Fase */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          
          {/* Coluna Esquerda: As 5 Fases do Mundo */}
          <div className="w-full md:w-1/2 p-3 overflow-y-auto space-y-2 border-r border-white/5 bg-[#071018]/50">
            <div className="flex items-center justify-between mb-1 px-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                {world.subtitle}
              </span>
              <span className="text-[10px] font-bold text-amber-300 flex items-center gap-1">
                <Zap className="w-3 h-3 text-amber-400" /> Energia: {currentEnergy}/120
              </span>
            </div>

            {world.stages.map((stage) => {
              const isSelected = selectedStageId === stage.id;
              return (
                <div
                  key={stage.id}
                  onClick={() => handleStageClick(stage)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected
                      ? stage.isBoss
                        ? 'bg-gradient-to-r from-red-950/80 to-[#1e0a0a] border-red-500 shadow-[0_0_20px_rgba(255,50,50,0.35)]'
                        : 'bg-gradient-to-r from-cyan-950/80 to-[#0a1c2a] border-cyan-400 shadow-[0_0_16px_rgba(0,217,255,0.25)]'
                      : stage.isBoss
                      ? 'bg-red-950/25 border-red-900/40 hover:border-red-600/60'
                      : 'bg-[#0b1824] border-white/5 hover:border-cyan-500/40'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm flex-shrink-0 ${
                        stage.isBoss
                          ? 'bg-red-600 text-white shadow-[0_0_12px_rgba(255,0,0,0.6)] animate-pulse'
                          : isSelected
                          ? 'bg-cyan-500 text-black'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {stage.isBoss ? <Skull className="w-5 h-5 text-amber-200" /> : stage.stageNumber}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-black truncate text-white">
                          {stage.name}
                        </span>
                        {stage.isBoss && (
                          <span className="text-[8px] font-black uppercase px-1.5 py-0.2 rounded bg-red-600 text-white tracking-widest">
                            CHEFE
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400 block truncate">
                        Nv. Recomendado: {stage.recommendedLevel}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-[10px] font-bold text-amber-300 flex items-center gap-0.5">
                      <Zap className="w-3 h-3 text-amber-400" /> {stage.energyCost}
                    </span>
                    <ChevronRight className={`w-4 h-4 ${isSelected ? 'text-cyan-400' : 'text-slate-600'}`} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Coluna Direita: Detalhes da Fase Selecionada & Botão Iniciar */}
          <div className="w-full md:w-1/2 p-4 flex flex-col justify-between bg-gradient-to-b from-[#0a1520] to-[#050b11] overflow-y-auto">
            <div>
              {/* Header do Estágio */}
              <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                      activeStage.isBoss ? 'bg-red-600 text-white' : 'bg-cyan-900/80 text-cyan-300 border border-cyan-500/30'
                    }`}>
                      {activeStage.isBoss ? 'BATALHA DE CHEFE' : `FASE ${activeStage.stageNumber}`}
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold">
                      {world.name}
                    </span>
                  </div>
                  <h3 className="text-lg font-black tracking-wide text-white mt-1">
                    {activeStage.name}
                  </h3>
                </div>
                <div className="text-right">
                  <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold block">
                    Custo
                  </span>
                  <span className="text-xs font-black text-amber-300 flex items-center justify-end gap-1">
                    <Zap className="w-3.5 h-3.5 text-amber-400" /> {activeStage.energyCost}
                  </span>
                </div>
              </div>

              {/* Descrição */}
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                {activeStage.desc}
              </p>

              {/* Inimigos Presentes */}
              <div className="mb-4">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-2">
                  Inimigos Detectados (3v3)
                </span>
                <div className="space-y-1.5">
                  {activeStage.enemies.map((enemy) => {
                    const elemColor =
                      enemy.element === 'water' ? 'text-cyan-400 border-cyan-500/40 bg-cyan-950/40' :
                      enemy.element === 'fire' ? 'text-red-400 border-red-500/40 bg-red-950/40' :
                      'text-emerald-400 border-emerald-500/40 bg-emerald-950/40';
                    return (
                      <div
                        key={enemy.id}
                        className={`px-3 py-1.5 rounded-xl border flex items-center justify-between text-xs font-bold ${elemColor}`}
                      >
                        <div className="flex items-center gap-2">
                          <span>{enemy.element === 'water' ? '💧' : enemy.element === 'fire' ? '🔥' : '🌪️'}</span>
                          <span className={enemy.isBoss ? 'font-black uppercase tracking-wider text-amber-300' : ''}>
                            {enemy.name}
                          </span>
                        </div>
                        <span className="text-[10px] opacity-80">
                          {enemy.hp.toLocaleString()} HP
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Recompensas */}
              <div className="p-3 rounded-2xl bg-black/40 border border-white/5 space-y-1.5 mb-4">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-300 flex items-center gap-1">
                  <Award className="w-3 h-3" /> Recompensas de Vitória
                </span>
                <div className="grid grid-cols-3 gap-2 text-center pt-1">
                  <div className="bg-slate-900/60 p-1.5 rounded-xl">
                    <span className="text-[9px] text-slate-400 block">EXP</span>
                    <b className="text-xs text-emerald-400">+{activeStage.expReward}</b>
                  </div>
                  <div className="bg-slate-900/60 p-1.5 rounded-xl">
                    <span className="text-[9px] text-slate-400 block">Cristais</span>
                    <b className="text-xs text-cyan-300">+{activeStage.crystalsReward}</b>
                  </div>
                  <div className="bg-slate-900/60 p-1.5 rounded-xl">
                    <span className="text-[9px] text-slate-400 block truncate">Drop</span>
                    <b className="text-[10px] text-amber-300 truncate block">{activeStage.essenceReward.split(' ')[0]}</b>
                  </div>
                </div>
              </div>
            </div>

            {/* Botão de Iniciar Combate */}
            <button
              onClick={handleStart}
              className={`w-full py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider cursor-pointer shadow-xl transition flex items-center justify-center gap-2 active:scale-97 ${
                activeStage.isBoss
                  ? 'bg-gradient-to-r from-red-600 via-amber-500 to-red-600 hover:brightness-110 text-black shadow-[0_0_25px_rgba(255,42,85,0.5)]'
                  : 'bg-gradient-to-b from-[#ffe680] via-[#ffaa00] to-[#b36b00] hover:brightness-105 text-[#261200] shadow-[0_6px_20px_rgba(255,170,0,0.4)]'
              }`}
            >
              <Swords className="w-4 h-4" />
              <span>
                {activeStage.isBoss ? 'DESAFIAR CHEFE' : 'ENTRAR EM COMBATE'} (⚡ {activeStage.energyCost})
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});
