import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { ArrowLeft, Sparkles, Star, Droplets, Flame, Wind, TrendingUp, CheckCircle } from 'lucide-react';
import { ElementType, HeroConfig } from '../types/game';
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

export const HeroScreen: React.FC<HeroScreenProps> = ({
  heroes,
  rawYasImage,
  onToggleAwaken,
  onBack,
  onSelectForBattle
}) => {
  const [activeTab, setActiveTab] = useState<ElementType>('water');
  const [subTab, setSubTab] = useState<'stats' | 'skills' | 'awaken'>('stats');
  const [awakenEffect, setAwakenEffect] = useState<boolean>(false);
  const [elementFlash, setElementFlash] = useState<ElementType | null>(null);

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

  const handleAwakenToggle = () => {
    playSound('awaken');
    playSound('star_pop');
    setAwakenEffect(true);
    setTimeout(() => setAwakenEffect(false), 900);
    onToggleAwaken(hero.element);
  };

  return (
    <section className="fixed inset-0 z-40 flex flex-col justify-between p-3.5 pt-[calc(10px+env(safe-area-inset-top))] pb-[calc(14px+env(safe-area-inset-bottom))] bg-[radial-gradient(circle_at_50%_25%,rgba(16,36,54,0.96),#040a10_90%)] backdrop-blur-md overflow-hidden text-white select-none">
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
        <span className="text-xs font-black tracking-widest text-[#ffe066] uppercase drop-shadow-[0_0_8px_rgba(255,224,102,0.5)]">
          INFORMAÇÕES DO MONSTRO
        </span>
        <div className="w-16 flex justify-end">
          <span
            className="text-[10px] font-extrabold px-2 py-0.5 rounded-full border shadow-sm transition-colors duration-300"
            style={{ borderColor: hero.color, color: hero.color, backgroundColor: `${hero.color}15` }}
          >
            {hero.element.toUpperCase()}
          </span>
        </div>
      </div>

      <div className="w-full max-w-[540px] mx-auto flex flex-col gap-2.5 flex-1 overflow-hidden my-auto">
        {/* Element Selector Tabs com Efeito Visual de Flash */}
        <div className="flex gap-1.5 w-full">
          {(['water', 'fire', 'wind'] as ElementType[]).map((elem) => {
            const h = heroes[elem];
            const isActive = activeTab === elem;
            const elemColor = elem === 'water' ? '#00d9ff' : elem === 'fire' ? '#ff3b14' : '#19ff85';
            return (
              <button
                key={elem}
                onClick={() => handleTabChange(elem)}
                className={`flex-1 py-2 px-1 rounded-xl border text-xs font-black transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 ${
                  isActive
                    ? 'bg-black/60 shadow-[0_0_16px_rgba(0,217,255,0.4)] scale-[1.02]'
                    : 'bg-black/30 border-white/10 text-slate-400 hover:text-white hover:border-white/20'
                }`}
                style={{
                  borderColor: isActive ? elemColor : undefined,
                  color: isActive ? '#ffffff' : undefined
                }}
              >
                {elem === 'water' ? (
                  <Droplets className="w-3.5 h-3.5 text-cyan-400" />
                ) : elem === 'fire' ? (
                  <Flame className="w-3.5 h-3.5 text-red-400" />
                ) : (
                  <Wind className="w-3.5 h-3.5 text-emerald-400" />
                )}
                <span className="capitalize">{elem === 'water' ? 'Água' : elem === 'fire' ? 'Fogo' : 'Vento'}</span>
                {h.awakened && (
                  <span className="text-[9px] text-[#e64dff] font-extrabold animate-pulse">✦</span>
                )}
              </button>
            );
          })}
        </div>

        {/* 3D Stage Viewport (Pedestal, Veromos Totem & Orbiting Spheres) */}
        <div
          className={`relative w-full h-[180px] sm:h-[210px] rounded-2xl border transition-all duration-300 bg-[radial-gradient(circle_at_50%_65%,rgba(0,217,255,0.18),rgba(6,14,22,0.9)_70%)] shadow-[inset_0_0_40px_rgba(0,0,0,0.85)] overflow-hidden flex items-center justify-center ${
            awakenEffect ? 'ring-4 ring-[#e64dff] shadow-[0_0_35px_rgba(230,77,255,0.7)]' : 'border-amber-400/30'
          }`}
        >
          {/* Flash Visual na Mudança de Elemento */}
          {elementFlash && (
            <div
              className="absolute inset-0 pointer-events-none z-20 animate-out fade-out duration-300"
              style={{
                backgroundColor:
                  elementFlash === 'water'
                    ? 'rgba(0,217,255,0.25)'
                    : elementFlash === 'fire'
                    ? 'rgba(255,59,20,0.25)'
                    : 'rgba(25,255,133,0.25)'
              }}
            />
          )}

          {/* Efeito Especial de Cerimônia de Despertar */}
          {awakenEffect && (
            <div className="absolute inset-0 pointer-events-none z-20 flex items-center justify-center">
              <div className="w-48 h-48 rounded-full border-4 border-[#e64dff] animate-ping opacity-75" />
              <div className="absolute top-1/2 -translate-y-1/2 font-black text-sm text-[#e64dff] bg-black/80 px-4 py-1 rounded-full border border-[#e64dff] shadow-[0_0_20px_#e64dff] tracking-wider animate-bounce">
                ✦ DESPERTAR CELESTIAL! ✦
              </div>
            </div>
          )}

          {/* Estrelas Douradas ou Roxas (Awakened) */}
          <div className="absolute top-2.5 left-1/2 -translate-x-1/2 flex gap-1 z-10">
            {Array.from({ length: stats.stars }).map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 fill-current transition-transform duration-300 hover:scale-125 ${
                  stats.starColor === 'purple'
                    ? 'text-[#e64dff] drop-shadow-[0_0_8px_rgba(230,77,255,0.95)] animate-in zoom-in-75'
                    : 'text-[#ffe066] drop-shadow-[0_0_6px_rgba(255,224,102,0.85)]'
                }`}
              />
            ))}
          </div>

          {/* Canvas Three.js em Tempo Real */}
          <canvas ref={canvasRef} className="w-full h-full pointer-events-none" />

          {/* Nome e Nível do Monstro */}
          <div className="absolute bottom-2 px-3.5 py-1 rounded-full bg-black/75 border border-white/20 text-[10px] font-black tracking-wider z-10 flex items-center gap-1.5 shadow-xl backdrop-blur-sm">
            <span style={{ color: hero.color }}>{stats.displayName}</span>
            <span className="text-slate-400 font-semibold">(Nv. 40/40)</span>
            {hero.awakened && <CheckCircle className="w-3 h-3 text-[#e64dff]" />}
          </div>
        </div>

        {/* Subtabs de Navegação */}
        <div className="flex gap-1.5 w-full">
          <button
            onClick={() => {
              playSound('click');
              setSubTab('stats');
            }}
            className={`flex-1 py-1.5 rounded-lg border text-[11px] font-black tracking-wide cursor-pointer transition active:scale-95 ${
              subTab === 'stats'
                ? 'bg-amber-400/25 border-amber-400 text-amber-300 shadow-[0_0_10px_rgba(255,215,0,0.3)]'
                : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
            }`}
          >
            STATUS
          </button>
          <button
            onClick={() => {
              playSound('click');
              setSubTab('skills');
            }}
            className={`flex-1 py-1.5 rounded-lg border text-[11px] font-black tracking-wide cursor-pointer transition active:scale-95 ${
              subTab === 'skills'
                ? 'bg-amber-400/25 border-amber-400 text-amber-300 shadow-[0_0_10px_rgba(255,215,0,0.3)]'
                : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
            }`}
          >
            HABILIDADES
          </button>
          <button
            onClick={() => {
              playSound('click');
              setSubTab('awaken');
            }}
            className={`flex-1 py-1.5 rounded-lg border text-[11px] font-black tracking-wide cursor-pointer transition active:scale-95 ${
              subTab === 'awaken'
                ? 'bg-[#c338ff]/30 border-[#e64dff] text-[#e64dff] shadow-[0_0_12px_rgba(230,77,255,0.4)]'
                : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
            }`}
          >
            DESPERTAR ✦
          </button>
        </div>

        {/* Conteúdo da Subtab */}
        <div className="flex-1 bg-[#0a121c]/95 border border-cyan-500/25 rounded-2xl p-3 overflow-y-auto max-h-[175px] shadow-lg">
          {subTab === 'stats' && (
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center justify-between bg-black/40 px-2.5 py-1.5 rounded-xl border border-white/5 hover:border-cyan-500/30 transition">
                <span className="text-[10px] font-bold text-slate-400">HP MÁX</span>
                <div className="flex items-center gap-1 font-mono">
                  <b className="text-cyan-200">{stats.hp}</b>
                  {hero.awakened && <span className="text-[9px] font-bold text-emerald-400">+25%↑</span>}
                </div>
              </div>
              <div className="flex items-center justify-between bg-black/40 px-2.5 py-1.5 rounded-xl border border-white/5 hover:border-red-500/30 transition">
                <span className="text-[10px] font-bold text-slate-400">ATAQUE</span>
                <div className="flex items-center gap-1 font-mono">
                  <b className="text-red-200">{stats.atk}</b>
                  {hero.awakened && <span className="text-[9px] font-bold text-emerald-400">+25%↑</span>}
                </div>
              </div>
              <div className="flex items-center justify-between bg-black/40 px-2.5 py-1.5 rounded-xl border border-white/5 hover:border-emerald-500/30 transition">
                <span className="text-[10px] font-bold text-slate-400">DEFESA</span>
                <b className="font-mono text-emerald-200">{stats.def}</b>
              </div>
              <div className="flex items-center justify-between bg-black/40 px-2.5 py-1.5 rounded-xl border border-white/5 hover:border-amber-500/30 transition">
                <span className="text-[10px] font-bold text-slate-400">VELOCIDADE</span>
                <div className="flex items-center gap-1 font-mono">
                  <b className="text-amber-200">{stats.speed}</b>
                  {hero.awakened && <span className="text-[9px] font-bold text-emerald-400">+15↑</span>}
                </div>
              </div>
              <div className="flex items-center justify-between bg-black/40 px-2.5 py-1.5 rounded-xl border border-white/5">
                <span className="text-[10px] font-bold text-slate-400">TAXA CRÍTICA</span>
                <b className="font-mono text-slate-200">{stats.critRate}%</b>
              </div>
              <div className="flex items-center justify-between bg-black/40 px-2.5 py-1.5 rounded-xl border border-white/5">
                <span className="text-[10px] font-bold text-slate-400">DANO CRÍTICO</span>
                <b className="font-mono text-slate-200">{stats.critDmg}%</b>
              </div>
              <div className="flex items-center justify-between bg-black/40 px-2.5 py-1.5 rounded-xl border border-white/5">
                <span className="text-[10px] font-bold text-slate-400">RESISTÊNCIA</span>
                <b className="font-mono text-slate-200">{stats.res}%</b>
              </div>
              <div className="flex items-center justify-between bg-black/40 px-2.5 py-1.5 rounded-xl border border-white/5">
                <span className="text-[10px] font-bold text-slate-400">PRECISÃO</span>
                <b className="font-mono text-slate-200">{stats.acc}%</b>
              </div>
            </div>
          )}

          {subTab === 'skills' && (
            <div className="flex flex-col gap-2">
              {hero.skills.map((skill, idx) => (
                <div
                  key={idx}
                  className={`flex items-center gap-2.5 bg-black/40 p-2 rounded-xl border transition-all duration-200 hover:scale-[1.01] ${
                    skill.isUlt
                      ? 'border-amber-400/50 bg-amber-950/20 shadow-[0_0_12px_rgba(255,224,102,0.15)]'
                      : 'border-white/10 hover:border-cyan-400/30'
                  }`}
                >
                  <div className="w-9 h-9 rounded-xl bg-[#0e1f30] border border-cyan-400/40 flex items-center justify-center text-lg flex-shrink-0 shadow-inner">
                    {skill.ico}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <b className="text-[11px] text-white truncate">{skill.name}</b>
                      <span className="text-[9px] font-bold text-[#ffe066] px-1.5 py-0.5 rounded bg-black/50 border border-amber-400/30">
                        {skill.cd}
                      </span>
                    </div>
                    <p className="text-[9.5px] text-slate-300 line-clamp-2 leading-tight mt-0.5">
                      {skill.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {subTab === 'awaken' && (
            <div className="flex flex-col items-center text-center gap-2.5">
              <p className="text-[11px] text-slate-300 leading-snug">
                {hero.awakened ? (
                  <span className="text-emerald-300 font-bold flex items-center justify-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                    Monstro despertado! Relicário Arcano de Veromos nas costas e 3 esferas de energia de ataque ativos.
                  </span>
                ) : (
                  <span>
                    ✦ O despertar concede o <strong>Relicário de Veromos nas costas</strong>, <strong>3 Esferas de Ataque Ressonante</strong>, +25% de Atk/HP e +15 de Velocidade.
                  </span>
                )}
              </p>

              {/* Essências com Pulse Luminous */}
              <div className="flex items-center justify-center gap-4">
                <div className="flex flex-col items-center p-2 rounded-xl bg-black/50 border border-white/10 min-w-[90px] shadow-sm">
                  <span className="text-xl animate-bounce">✨</span>
                  <span className="text-[9px] text-slate-400 font-bold">Essência Magia</span>
                  <b className="text-xs text-emerald-400 font-mono">15 / 15</b>
                </div>
                <div className="flex flex-col items-center p-2 rounded-xl bg-black/50 border border-white/10 min-w-[90px] shadow-sm">
                  <span className="text-xl">
                    {hero.element === 'water' ? '💧' : hero.element === 'fire' ? '🔥' : '🌪️'}
                  </span>
                  <span className="text-[9px] text-slate-400 font-bold">
                    Essência {hero.element.toUpperCase()}
                  </span>
                  <b className="text-xs text-emerald-400 font-mono">10 / 10</b>
                </div>
              </div>

              {/* Botão de Despertar com Shimmer */}
              <button
                onClick={handleAwakenToggle}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#c338ff] via-[#9400d3] to-[#4b0082] text-white font-black text-xs uppercase tracking-wider shadow-[0_4px_16px_rgba(195,56,255,0.4)] hover:brightness-110 active:scale-97 cursor-pointer transition flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-4 h-4 text-amber-200 animate-spin" />
                <span>
                  {hero.awakened ? 'REVERTER FORMA ORIGINAL' : '✦ DESPERTAR RELICÁRIO & ESFERAS'}
                </span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Bottom CTA */}
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
};
