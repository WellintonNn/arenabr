import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { ArrowLeft, Sparkles, Star, Droplets, Flame, Wind, TrendingUp, CheckCircle, Shield, Swords, Zap, Award, Plus, RotateCw } from 'lucide-react';
import { ElementType, HeroConfig, RuneSlot } from '../types/game';
import { calculateAwakenedStats } from '../game/rules';
import { playSound } from '../game/audio';
import {
  processSpriteSheet,
  setIdle,
  attachVeromosTotem,
  attachOrbTrio,
  SpriteSheetController
} from '../game/threeScene';

interface HeroScreenProps {
  heroes: Record<ElementType, HeroConfig>;
  rawYasImage: CanvasImageSource | null;
  onToggleAwaken: (element: ElementType) => void;
  onBack: () => void;
  onSelectForBattle: () => void;
}

export const HeroScreen: React.FC<HeroScreenProps> = React.memo(({
  heroes,
  rawYasImage,
  onToggleAwaken,
  onBack,
  onSelectForBattle
}) => {
  const [activeTab, setActiveTab] = useState<ElementType>('water');
  const [subTab, setSubTab] = useState<'stats' | 'skills' | 'runes' | 'awaken'>('stats');
  const [awakenEffect, setAwakenEffect] = useState<boolean>(false);
  const [elementFlash, setElementFlash] = useState<ElementType | null>(null);
  const [skillLevels, setSkillLevels] = useState<Record<ElementType, number[]>>({
    water: [1, 1, 1],
    fire: [1, 1, 1],
    wind: [1, 1, 1]
  });
  const [runeLevels, setRuneLevels] = useState<Record<number, number>>({
    1: 15,
    2: 15,
    3: 12,
    4: 15,
    5: 12,
    6: 15
  });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const heroGroupRef = useRef<THREE.Group | null>(null);
  const ringMeshRef = useRef<THREE.Mesh | null>(null);
  const auraLightRef = useRef<THREE.PointLight | null>(null);
  const spriteCtrlRef = useRef<SpriteSheetController | null>(null);
  const totemRef = useRef<THREE.Sprite | null>(null);
  const orbsRef = useRef<THREE.Sprite[]>([]);

  const hero = heroes[activeTab];
  const stats = calculateAwakenedStats(hero);

  // Inicialização do Viewport 3D da Tela de Heróis
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 50);
    camera.position.set(0, 0.95, 4.3);
    camera.lookAt(0, 0.72, 0);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    rendererRef.current = renderer;

    scene.add(new THREE.HemisphereLight(0xffffff, 0x334455, 2.8));
    const sun = new THREE.DirectionalLight(0xffffff, 2.5);
    sun.position.set(5, 10, 7);
    scene.add(sun);

    const auraLight = new THREE.PointLight(hero.hex, 2.5, 8);
    auraLight.position.set(0, 0.8, 0.5);
    scene.add(auraLight);
    auraLightRef.current = auraLight;

    // Pedestal de Invocação
    const pedestalGroup = new THREE.Group();
    const baseMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.85, 0.95, 0.22, 28),
      new THREE.MeshStandardMaterial({ color: 0x223544, roughness: 0.6 })
    );
    baseMesh.position.y = 0.11;
    pedestalGroup.add(baseMesh);

    const ringMesh = new THREE.Mesh(
      new THREE.TorusGeometry(0.88, 0.035, 8, 36),
      new THREE.MeshBasicMaterial({ color: hero.hex, transparent: true, opacity: 0.95 })
    );
    ringMesh.rotation.x = Math.PI / 2;
    ringMesh.position.y = 0.23;
    pedestalGroup.add(ringMesh);
    ringMeshRef.current = ringMesh;

    scene.add(pedestalGroup);

    // Grupo do Herói
    const heroGroup = new THREE.Group();
    heroGroup.position.set(0, 0.24, 0);
    scene.add(heroGroup);
    heroGroupRef.current = heroGroup;

    // Loop de Animação em 60fps
    let reqId: number;
    const clock = new THREE.Clock();

    function renderLoop() {
      reqId = requestAnimationFrame(renderLoop);
      if (document.hidden) return;
      const t = clock.getElapsedTime();

      // Respiração orgânica do Sprite
      if (spriteCtrlRef.current) {
        const breath = Math.sin(t * 3.2);
        spriteCtrlRef.current.sprite.scale.y = 1.7 * (1.0 + breath * 0.024);
        spriteCtrlRef.current.sprite.scale.x = 1.7 * (1.0 - breath * 0.012);
        spriteCtrlRef.current.sprite.position.y = breath * 0.015;
      }

      // Relicário Arcano de Veromos (flutuação e leve inclinação rúnica)
      if (totemRef.current) {
        totemRef.current.position.y = 0.85 + Math.sin(t * 2.2) * 0.035;
        totemRef.current.material.rotation = Math.sin(t * 1.5) * 0.06;
      }

      // 3 Esferas orbitando o herói na altura do peitoral
      if (orbsRef.current.length > 0) {
        for (let i = 0; i < orbsRef.current.length; i++) {
          const orb = orbsRef.current[i];
          const angle = t * 2.4 + (i * (Math.PI * 2)) / 3;
          const rad = 0.68 + Math.sin(t * 2.6 + i) * 0.03;
          orb.position.set(
            Math.cos(angle) * rad,
            0.85 + Math.sin(t * 2.5 + i) * 0.12,
            Math.sin(angle) * rad
          );
        }
      }

      if (ringMeshRef.current) {
        (ringMeshRef.current.material as THREE.MeshBasicMaterial).opacity = 0.72 + Math.sin(t * 2.8) * 0.22;
      }

      renderer.render(scene, camera);
    }
    renderLoop();

    const handleResize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const w = parent.clientWidth;
      const h = parent.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(reqId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, []);

  // Atualiza o Modelo 3D quando muda o herói ou estado de Despertar
  useEffect(() => {
    if (!heroGroupRef.current || !rawYasImage) return;
    const heroGroup = heroGroupRef.current;

    // Remove sprite e objetos anteriores
    if (spriteCtrlRef.current) {
      heroGroup.remove(spriteCtrlRef.current.sprite);
      spriteCtrlRef.current = null;
    }
    if (totemRef.current) {
      heroGroup.remove(totemRef.current);
      totemRef.current = null;
    }
    orbsRef.current.forEach((orb) => heroGroup.remove(orb));
    orbsRef.current = [];

    // Atualiza cor do anel e da luz do pedestal
    if (ringMeshRef.current) {
      (ringMeshRef.current.material as THREE.MeshBasicMaterial).color.setHex(hero.hex);
    }
    if (auraLightRef.current) {
      auraLightRef.current.color.setHex(hero.hex);
    }

    // Cria novo sprite olhando para o jogador (row: 2 = South)
    const ctrl = processSpriteSheet(rawYasImage, hero);
    heroGroup.add(ctrl.sprite);
    setIdle(ctrl, 2);
    spriteCtrlRef.current = ctrl;

    // SE DESPERTADO: Anexa o Relicário de Veromos nas costas e as 3 Esferas Orbitais!
    if (hero.awakened) {
      const totem = attachVeromosTotem(heroGroup, hero.element, true);
      totemRef.current = totem;

      const orbs = attachOrbTrio(heroGroup, hero.element);
      orbsRef.current = orbs;
    }
  }, [activeTab, hero.awakened, rawYasImage]);

  const handleTabChange = (elem: ElementType) => {
    playSound('element_switch');
    setActiveTab(elem);
    setElementFlash(elem);
    setTimeout(() => setElementFlash(null), 400);
  };

  const handleAwakenClick = () => {
    playSound('victory_fanfare');
    setAwakenEffect(true);
    setTimeout(() => setAwakenEffect(false), 900);
    onToggleAwaken(activeTab);
  };

  const handleUpgradeSkill = (skillIdx: number) => {
    const cur = skillLevels[activeTab][skillIdx];
    if (cur < 5) {
      playSound('star_pop');
      const updated = [...skillLevels[activeTab]];
      updated[skillIdx] = cur + 1;
      setSkillLevels((prev) => ({ ...prev, [activeTab]: updated }));
    }
  };

  const handleUpgradeRune = (slot: number) => {
    const cur = runeLevels[slot];
    if (cur < 15) {
      playSound('charge');
      setRuneLevels((prev) => ({ ...prev, [slot]: Math.min(15, cur + 3) }));
    }
  };

  const rotateHero = () => {
    if (heroGroupRef.current) {
      heroGroupRef.current.rotation.y += Math.PI / 4;
      playSound('click');
    }
  };

  return (
    <section className="fixed inset-0 z-50 flex flex-col justify-between p-3 sm:p-5 bg-[#07131e] select-none overflow-hidden text-white">
      {/* Flash de Onda Elemental */}
      {elementFlash && (
        <div
          className={`fixed inset-0 pointer-events-none z-50 animate-out fade-out duration-300 ${
            elementFlash === 'water'
              ? 'bg-cyan-500/15'
              : elementFlash === 'fire'
              ? 'bg-red-500/15'
              : 'bg-emerald-500/15'
          }`}
        />
      )}

      {/* Header com Voltar e Elemento */}
      <div className="flex items-center justify-between pb-2 border-b border-cyan-500/20 pt-[calc(8px+env(safe-area-inset-top))]">
        <button
          onClick={() => {
            playSound('click');
            onBack();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-xs font-bold text-slate-200 transition cursor-pointer border border-white/10"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>VOLTAR</span>
        </button>

        <div className="text-center">
          <span className="text-xs font-black tracking-widest text-cyan-300 uppercase">
            TEMPLO DOS MONSTROS
          </span>
          <span className="block text-[9px] text-slate-400 font-bold uppercase">
            Despertar & Sistema de Runas
          </span>
        </div>

        <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-[#0d1f30] border border-cyan-400/40 text-[10px] font-black uppercase text-cyan-300 shadow">
          <span>{hero.element === 'water' ? '💧' : hero.element === 'fire' ? '🔥' : '🌪️'}</span>
          <span>{hero.element.toUpperCase()}</span>
        </div>
      </div>

      {/* Seletor Superior dos 3 Guardiões */}
      <div className="flex gap-2 max-w-[540px] mx-auto w-full mt-2">
        {(['water', 'fire', 'wind'] as ElementType[]).map((elem) => {
          const h = heroes[elem];
          const isAct = activeTab === elem;
          const bgActive =
            elem === 'water' ? 'border-cyan-400 shadow-[0_0_15px_rgba(0,217,255,0.4)]' :
            elem === 'fire' ? 'border-red-400 shadow-[0_0_15px_rgba(255,59,20,0.4)]' :
            'border-emerald-400 shadow-[0_0_15px_rgba(25,255,133,0.4)]';
          return (
            <button
              key={elem}
              onClick={() => handleTabChange(elem)}
              className={`flex-1 py-2 px-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer border flex items-center justify-center gap-1.5 ${
                isAct
                  ? `bg-[#13283c] text-white ${bgActive}`
                  : 'bg-[#091522] border-white/10 text-slate-400 hover:text-white'
              }`}
            >
              <span>{elem === 'water' ? '💧' : elem === 'fire' ? '🔥' : '🌪️'}</span>
              <span>{elem === 'water' ? 'Água' : elem === 'fire' ? 'Fogo' : 'Vento'}</span>
              {h.awakened && <span className="text-amber-300 font-black">✦</span>}
            </button>
          );
        })}
      </div>

      {/* Viewport 3D do Pedestal do Monstro com botão de girar */}
      <div className="relative w-full max-w-[540px] h-[220px] sm:h-[250px] mx-auto rounded-3xl overflow-hidden bg-gradient-to-b from-[#091826] to-[#040b12] border border-cyan-500/30 shadow-[inset_0_0_30px_rgba(0,0,0,0.8)] mt-2">
        <canvas ref={canvasRef} className="w-full h-full block" />

        {/* Botão de Rotação 3D */}
        <button
          onClick={rotateHero}
          className="absolute bottom-2.5 right-2.5 p-2 rounded-xl bg-black/60 hover:bg-black/80 border border-white/15 text-slate-300 hover:text-white transition cursor-pointer backdrop-blur-sm"
          title="Girar Modelo 3D"
        >
          <RotateCw className="w-4 h-4" />
        </button>

        {/* 6 Estrelas (Douradas ou Roxas Despertadas) */}
        <div className="absolute top-2.5 left-1/2 -translate-x-1/2 flex gap-1 pointer-events-none">
          {Array.from({ length: 6 }).map((_, i) => (
            <Star
              key={i}
              className={`w-3.5 h-3.5 transition-all duration-300 ${
                hero.awakened
                  ? 'text-fuchsia-400 fill-fuchsia-400 drop-shadow-[0_0_8px_rgba(230,77,255,0.9)] animate-pulse'
                  : 'text-amber-400 fill-amber-400 drop-shadow-[0_0_6px_rgba(255,215,0,0.7)]'
              }`}
            />
          ))}
        </div>

        {/* Nome do Monstro e Nível */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-center pointer-events-none w-full px-4">
          <span className="text-xs font-black tracking-wide text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
            {hero.awakened ? hero.awakenedName : hero.baseName}
          </span>
          <span className="text-[10px] text-amber-300 font-bold ml-1.5 drop-shadow">
            (Nv. 40/40)
          </span>
        </div>
      </div>

      {/* Abas Secundárias de Informações (Summoners War Layout) */}
      <div className="flex gap-1.5 max-w-[540px] mx-auto w-full mt-2">
        {[
          { id: 'stats', label: 'STATUS', icon: <TrendingUp className="w-3 h-3" /> },
          { id: 'skills', label: 'HABILIDADES', icon: <Swords className="w-3 h-3" /> },
          { id: 'runes', label: 'RUNAS ✦', icon: <Zap className="w-3 h-3" /> },
          { id: 'awaken', label: 'DESPERTAR ✦', icon: <Sparkles className="w-3 h-3 text-amber-300" /> }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              playSound('click');
              setSubTab(tab.id as any);
            }}
            className={`flex-1 py-1.5 rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-wider transition-all cursor-pointer border flex items-center justify-center gap-1 ${
              subTab === tab.id
                ? 'bg-amber-500/20 text-amber-300 border-amber-400 shadow-[0_0_10px_rgba(255,200,0,0.3)]'
                : 'bg-[#091522] border-white/5 text-slate-400 hover:text-white'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Painel de Conteúdo de Acordo com a Aba */}
      <div className="w-full max-w-[540px] mx-auto flex-1 bg-[#091624] border border-cyan-500/20 rounded-2xl p-3 my-2 overflow-y-auto min-h-[160px] max-h-[220px]">
        {/* 1. ABA DE STATUS */}
        {subTab === 'stats' && (
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2 bg-[#0c1e30] rounded-xl flex justify-between items-center border border-white/5">
              <span className="text-slate-400 font-bold text-[10px]">HP MÁX</span>
              <div className="text-right">
                <b className="text-white font-mono">{stats.hp.toLocaleString()}</b>
                {hero.awakened && <span className="text-[9px] text-emerald-400 ml-1 font-bold">+25% ↑</span>}
              </div>
            </div>
            <div className="p-2 bg-[#0c1e30] rounded-xl flex justify-between items-center border border-white/5">
              <span className="text-slate-400 font-bold text-[10px]">ATAQUE</span>
              <div className="text-right">
                <b className="text-white font-mono">{stats.atk.toLocaleString()}</b>
                {hero.awakened && <span className="text-[9px] text-emerald-400 ml-1 font-bold">+25% ↑</span>}
              </div>
            </div>
            <div className="p-2 bg-[#0c1e30] rounded-xl flex justify-between items-center border border-white/5">
              <span className="text-slate-400 font-bold text-[10px]">DEFESA</span>
              <b className="text-white font-mono">{stats.def}</b>
            </div>
            <div className="p-2 bg-[#0c1e30] rounded-xl flex justify-between items-center border border-white/5">
              <span className="text-slate-400 font-bold text-[10px]">VELOCIDADE</span>
              <div className="text-right">
                <b className="text-white font-mono">{stats.speed}</b>
                {hero.awakened && <span className="text-[9px] text-emerald-400 ml-1 font-bold">+15 ↑</span>}
              </div>
            </div>
            <div className="p-2 bg-[#0c1e30] rounded-xl flex justify-between items-center border border-white/5">
              <span className="text-slate-400 font-bold text-[10px]">TAXA CRÍTICA</span>
              <b className="text-white font-mono">{stats.critRate}%</b>
            </div>
            <div className="p-2 bg-[#0c1e30] rounded-xl flex justify-between items-center border border-white/5">
              <span className="text-slate-400 font-bold text-[10px]">DANO CRÍTICO</span>
              <b className="text-white font-mono">{stats.critDmg}%</b>
            </div>
            <div className="p-2 bg-[#0c1e30] rounded-xl flex justify-between items-center border border-white/5">
              <span className="text-slate-400 font-bold text-[10px]">RESISTÊNCIA</span>
              <b className="text-white font-mono">{stats.res}%</b>
            </div>
            <div className="p-2 bg-[#0c1e30] rounded-xl flex justify-between items-center border border-white/5">
              <span className="text-slate-400 font-bold text-[10px]">PRECISÃO</span>
              <b className="text-white font-mono">{stats.acc}%</b>
            </div>
          </div>
        )}

        {/* 2. ABA DE HABILIDADES & SKILL UP */}
        {subTab === 'skills' && (
          <div className="space-y-2">
            {hero.skills.map((s, idx) => {
              const curLv = skillLevels[activeTab][idx];
              return (
                <div key={idx} className="p-2.5 bg-[#0c1e30] rounded-xl border border-white/5 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-slate-900 border border-cyan-500/40 flex items-center justify-center text-lg flex-shrink-0">
                      {s.ico}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-black text-white truncate">{s.name}</span>
                        <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-amber-950 text-amber-300 border border-amber-500/30">
                          Lv. {curLv}/5
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 block truncate">{s.desc}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleUpgradeSkill(idx)}
                    disabled={curLv >= 5}
                    className={`px-2.5 py-1.5 rounded-xl text-[10px] font-black uppercase cursor-pointer flex items-center gap-1 flex-shrink-0 ${
                      curLv >= 5
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30 cursor-default'
                        : 'bg-gradient-to-r from-amber-500 to-amber-600 text-black hover:brightness-110 active:scale-95 shadow'
                    }`}
                  >
                    {curLv >= 5 ? <CheckCircle className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                    <span>{curLv >= 5 ? 'MÁX' : 'UPGRADE'}</span>
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* 3. ABA DE RUNAS (NOVO SISTEMA ESTILO SUMMONERS WAR) */}
        {subTab === 'runes' && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-black text-amber-300 uppercase tracking-wider">
                6 Slots Rúnicos • Conjunto Fatal (4/4) + Blade (2/2)
              </span>
              <span className="text-[9px] text-emerald-400 font-bold">+35% ATK & +12% CRIT</span>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { slot: 1, type: 'Fatal', stat: 'ATK +160' },
                { slot: 2, type: 'Fatal', stat: 'SPD +42' },
                { slot: 3, type: 'Fatal', stat: 'DEF +160' },
                { slot: 4, type: 'Blade', stat: 'DANO CRIT +80%' },
                { slot: 5, type: 'Fatal', stat: 'HP +2448' },
                { slot: 6, type: 'Blade', stat: 'ATK +63%' }
              ].map((r) => {
                const lv = runeLevels[r.slot];
                return (
                  <div
                    key={r.slot}
                    onClick={() => handleUpgradeRune(r.slot)}
                    className="p-1.5 bg-[#0b1a28] rounded-xl border border-amber-400/30 flex flex-col items-center justify-center text-center cursor-pointer hover:border-amber-400 transition active:scale-95 shadow"
                  >
                    <span className="text-[9px] text-slate-400 font-bold">Slot {r.slot} • {r.type}</span>
                    <b className="text-xs text-amber-300 font-mono">+{lv}</b>
                    <span className="text-[8px] text-slate-300 block truncate">{r.stat}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 4. ABA DE DESPERTAR */}
        {subTab === 'awaken' && (
          <div className="space-y-2.5 text-center">
            <p className="text-xs text-slate-300 leading-relaxed">
              ✦ O despertar concede o <b className="text-amber-300">Relicário de Veromos nas costas</b>,{' '}
              <b className="text-cyan-300">3 Esferas de Ataque Ressonante</b> e bônus de <b>+25% Atk/HP</b> e <b>+15 Velocidade</b>!
            </p>

            <div className="flex justify-center gap-4 py-1">
              <div className="p-2 bg-[#0c1f32] rounded-xl border border-amber-400/30 text-center min-w-[100px]">
                <span className="text-base">✨</span>
                <div className="text-[9px] text-slate-400 font-bold">Essência Magia</div>
                <b className="text-xs text-amber-300">15 / 15</b>
              </div>
              <div className="p-2 bg-[#0c1f32] rounded-xl border border-cyan-400/30 text-center min-w-[100px]">
                <span className="text-base">{hero.element === 'water' ? '💧' : hero.element === 'fire' ? '🔥' : '🌪️'}</span>
                <div className="text-[9px] text-slate-400 font-bold">Essência {hero.element.toUpperCase()}</div>
                <b className="text-xs text-cyan-300">10 / 10</b>
              </div>
            </div>

            <button
              onClick={handleAwakenClick}
              className={`w-full py-2.5 rounded-xl font-black text-xs uppercase tracking-wider shadow-lg transition cursor-pointer active:scale-97 ${
                hero.awakened
                  ? 'bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white shadow-[0_0_20px_rgba(200,50,255,0.4)]'
                  : 'bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 text-black shadow-[0_0_20px_rgba(255,200,0,0.5)]'
              }`}
            >
              {hero.awakened ? '✦ FORMA DESPERTADA ATIVA' : '✦ DESPERTAR RELICÁRIO & ESFERAS'}
            </button>
          </div>
        )}
      </div>

      {/* Botão de Rodapé para Selecionar e Ir para Combate */}
      <button
        onClick={() => {
          playSound('click');
          onSelectForBattle();
        }}
        className="w-full max-w-[540px] mx-auto py-3 rounded-2xl bg-gradient-to-b from-[#ffe680] via-[#ffaa00] to-[#b36b00] text-[#261200] font-black text-xs uppercase tracking-wider shadow-[0_4px_14px_rgba(255,170,0,0.3)] active:scale-97 cursor-pointer transition hover:brightness-105"
      >
        SELECIONAR PARA COMBATE
      </button>
    </section>
  );
});
