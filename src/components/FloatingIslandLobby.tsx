import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Volume2, VolumeX, Shield, Swords, Sparkles, Zap, Gem, MessageSquare, Mail, Users, Settings, Trophy, RefreshCw } from 'lucide-react';
import { ElementType, HeroConfig } from '../types/game';
import { playSound } from '../game/audio';
import { PWAInstallButton } from './PWAInstallButton';
import {
  processSpriteSheet,
  setSpriteFrame,
  startWalk,
  setIdle,
  attachVeromosTotem,
  attachOrbTrio,
  SpriteSheetController
} from '../game/threeScene';
import celestialIcon from '../assets/images/app_icon_celestial_1794068543987.jpg';

interface FloatingIslandLobbyProps {
  heroes: Record<ElementType, HeroConfig>;
  rawYasImage: CanvasImageSource | null;
  soundOn: boolean;
  onToggleSound: () => void;
  onOpenAdventure: () => void;
  onOpenHeroes: () => void;
  onOpenPrep: () => void;
  pwaUpdateAvailable: boolean;
  onApplyPwaUpdate: () => void;
}

interface RoamingHero {
  element: ElementType;
  group: THREE.Group;
  ctrl: SpriteSheetController;
  totem: THREE.Sprite | null;
  orbs: THREE.Sprite[];
  targetX: number;
  targetZ: number;
  idleTimer: number;
  isMoving: boolean;
}

export const FloatingIslandLobby: React.FC<FloatingIslandLobbyProps> = React.memo(({
  heroes,
  rawYasImage,
  soundOn,
  onToggleSound,
  onOpenAdventure,
  onOpenHeroes,
  onOpenPrep,
  pwaUpdateAvailable,
  onApplyPwaUpdate
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [energy, setEnergy] = useState<number>(120);
  const [mana, setMana] = useState<number>(2450000);
  const [crystals, setCrystals] = useState<number>(1250);

  const showToast = (msg: string) => {
    setToast(msg);
    clearTimeout((showToast as unknown as { timer?: NodeJS.Timeout }).timer);
    (showToast as unknown as { timer?: NodeJS.Timeout }).timer = setTimeout(() => setToast(null), 1800);
  };

  // 3D Floating Celestial Island com Heróis Andando
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0e2238);
    scene.fog = new THREE.FogExp2(0x0e2238, 0.02);

    const camera = new THREE.PerspectiveCamera(38, window.innerWidth / window.innerHeight, 0.1, 150);
    camera.position.set(0, 5.2, 8.8);
    camera.lookAt(0, 0.5, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    // Iluminação Celestial da Ilha
    scene.add(new THREE.HemisphereLight(0xd4f0ff, 0x1d3624, 2.8));
    const sun = new THREE.DirectionalLight(0xfff6d6, 3.0);
    sun.position.set(6, 12, 8);
    scene.add(sun);

    const islandGroup = new THREE.Group();
    scene.add(islandGroup);

    // 1. Platô Superior da Ilha (Grama Celestial)
    const topPlateau = new THREE.Mesh(
      new THREE.CylinderGeometry(3.6, 3.4, 0.6, 32),
      new THREE.MeshStandardMaterial({ color: 0x2d6335, roughness: 0.85 })
    );
    topPlateau.position.y = 0.3;
    islandGroup.add(topPlateau);

    // 2. Rocha Inferior Invertida (Subterrâneo flutuante no céu)
    const rockBase = new THREE.Mesh(
      new THREE.ConeGeometry(3.4, 4.5, 12),
      new THREE.MeshStandardMaterial({ color: 0x222c36, roughness: 0.95, flatShading: true })
    );
    rockBase.rotation.x = Math.PI;
    rockBase.position.y = -2.25;
    islandGroup.add(rockBase);

    // 3. Altar Místico Central
    const altar = new THREE.Mesh(
      new THREE.CylinderGeometry(1.0, 1.15, 0.18, 24),
      new THREE.MeshStandardMaterial({ color: 0x415b70, roughness: 0.6 })
    );
    altar.position.y = 0.69;
    islandGroup.add(altar);

    const altarRing = new THREE.Mesh(
      new THREE.TorusGeometry(1.05, 0.035, 8, 32),
      new THREE.MeshBasicMaterial({ color: 0x00d9ff, transparent: true, opacity: 0.9 })
    );
    altarRing.rotation.x = Math.PI / 2;
    altarRing.position.y = 0.78;
    islandGroup.add(altarRing);

    // 4. Cristais Místicos Flutuantes ao redor da Ilha
    const crystalGeo = new THREE.OctahedronGeometry(0.35, 0);
    const crystalMat = new THREE.MeshStandardMaterial({
      color: 0x00e1ff,
      emissive: 0x0077aa,
      emissiveIntensity: 0.8,
      roughness: 0.2
    });
    const crystalsArray: THREE.Mesh[] = [];
    for (let i = 0; i < 4; i++) {
      const angle = (i / 4) * Math.PI * 2;
      const cMesh = new THREE.Mesh(crystalGeo, crystalMat);
      cMesh.position.set(Math.cos(angle) * 3.8, 1.2, Math.sin(angle) * 3.8);
      islandGroup.add(cMesh);
      crystalsArray.push(cMesh);
    }

    // 5. Nuvens Flutuantes no Fundo
    const cloudGeo = new THREE.DodecahedronGeometry(0.8, 1);
    const cloudMat = new THREE.MeshStandardMaterial({ color: 0xe6f4ff, roughness: 0.9, transparent: true, opacity: 0.65 });
    const clouds: THREE.Mesh[] = [];
    for (let i = 0; i < 8; i++) {
      const c = new THREE.Mesh(cloudGeo, cloudMat);
      c.scale.set(1.8 + Math.random(), 0.7, 1.2 + Math.random());
      c.position.set((Math.random() - 0.5) * 20, -1.8 - Math.random() * 2, (Math.random() - 0.5) * 16);
      scene.add(c);
      clouds.push(c);
    }

    // 6. Spawn dos Heróis que Andam Livremente pela Ilha
    const roamingHeroes: RoamingHero[] = [];
    if (rawYasImage) {
      const elements: ElementType[] = ['water', 'fire', 'wind'];
      elements.forEach((elem, idx) => {
        const heroConf = heroes[elem];
        const ctrl = processSpriteSheet(rawYasImage, heroConf);
        const group = new THREE.Group();

        // Posição inicial no platô da ilha
        const angle = (idx / 3) * Math.PI * 2;
        group.position.set(Math.cos(angle) * 1.8, 0.6, Math.sin(angle) * 1.8);
        group.add(ctrl.sprite);

        // Se o herói está despertado, exibe seu Relicário e Esferas
        let totem: THREE.Sprite | null = null;
        let orbs: THREE.Sprite[] = [];
        if (heroConf.awakened) {
          totem = attachVeromosTotem(group, elem, false);
          orbs = attachOrbTrio(group, elem);
        }

        islandGroup.add(group);
        setIdle(ctrl, 0);

        roamingHeroes.push({
          element: elem,
          group,
          ctrl,
          totem,
          orbs,
          targetX: (Math.random() - 0.5) * 3.0,
          targetZ: (Math.random() - 0.5) * 3.0,
          idleTimer: 1 + Math.random() * 2,
          isMoving: false
        });
      });
    }

    // Loop de Animação e Simulação dos Heróis Andando
    let reqId: number;
    const clock = new THREE.Clock();

    function loop() {
      reqId = requestAnimationFrame(loop);
      if (document.hidden) return;

      const dt = Math.min(clock.getDelta(), 0.05);
      const t = clock.getElapsedTime();

      // Flutuação suave da Ilha no céu
      islandGroup.position.y = Math.sin(t * 0.9) * 0.12;
      islandGroup.rotation.y = Math.sin(t * 0.25) * 0.08;

      // Pulso do anel do altar
      (altarRing.material as THREE.MeshBasicMaterial).opacity = 0.65 + Math.sin(t * 2.5) * 0.3;

      // Cristais orbitando e girando
      crystalsArray.forEach((cMesh, idx) => {
        cMesh.rotation.y += dt * 1.2;
        cMesh.rotation.x += dt * 0.8;
        cMesh.position.y = 1.1 + Math.sin(t * 1.8 + idx) * 0.25;
      });

      // Deriva suave das nuvens
      clouds.forEach((cloud) => {
        cloud.position.x += dt * 0.35;
        if (cloud.position.x > 14) cloud.position.x = -14;
      });

      // IA dos Heróis Andando na Ilha
      for (const h of roamingHeroes) {
        if (!h.isMoving) {
          // Em estado Idle: respiração
          h.idleTimer -= dt;
          const breath = Math.sin(t * 3.2);
          h.ctrl.sprite.scale.y = 1.7 * (1.0 + breath * 0.024);
          h.ctrl.sprite.scale.x = 1.7 * (1.0 - breath * 0.012);
          h.ctrl.sprite.position.y = breath * 0.015;

          // Se despertado: oscilação do totem e orbes
          if (h.totem) {
            h.totem.position.y = 0.85 + Math.sin(t * 2.2) * 0.035;
          }
          if (h.orbs.length > 0) {
            for (let i = 0; i < h.orbs.length; i++) {
              const orb = h.orbs[i];
              const oAngle = t * 2.4 + (i * (Math.PI * 2)) / 3;
              orb.position.set(Math.cos(oAngle) * 0.68, 0.85 + Math.sin(t * 2.5 + i) * 0.12, Math.sin(oAngle) * 0.68);
            }
          }

          if (h.idleTimer <= 0) {
            // Escolhe novo destino aleatório no platô (raio até 2.5)
            const ang = Math.random() * Math.PI * 2;
            const dist = 0.8 + Math.random() * 1.7;
            h.targetX = Math.cos(ang) * dist;
            h.targetZ = Math.sin(ang) * dist;
            h.isMoving = true;

            // Determina a direção da animação de caminhada
            const dx = h.targetX - h.group.position.x;
            const dz = h.targetZ - h.group.position.z;
            let dirRow = 0; // 0 = South (para baixo), 1 = West, 2 = North, 3 = East
            if (Math.abs(dx) > Math.abs(dz)) {
              dirRow = dx > 0 ? 3 : 1;
            } else {
              dirRow = dz > 0 ? 0 : 2;
            }
            startWalk(h.ctrl, dirRow, 10);
          }
        } else {
          // Em movimento: interpola posição até o alvo
          const dx = h.targetX - h.group.position.x;
          const dz = h.targetZ - h.group.position.z;
          const dist = Math.sqrt(dx * dx + dz * dz);
          const speed = 0.75 * dt;

          if (dist < 0.08) {
            h.group.position.x = h.targetX;
            h.group.position.z = h.targetZ;
            h.isMoving = false;
            h.idleTimer = 2.5 + Math.random() * 3.5;
            setIdle(h.ctrl, h.ctrl.row);
          } else {
            h.group.position.x += (dx / dist) * speed;
            h.group.position.z += (dz / dist) * speed;

            // Anima passos do spritesheet
            h.ctrl.frameClock += dt;
            if (h.ctrl.frameClock >= 1 / h.ctrl.walkFps) {
              h.ctrl.frameClock -= 1 / h.ctrl.walkFps;
              setSpriteFrame(h.ctrl, h.ctrl.row, (h.ctrl.col + 1) % h.ctrl.cols);
            }
          }
        }
      }

      renderer.render(scene, camera);
    }
    loop();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(reqId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, [heroes, rawYasImage]);

  return (
    <section className="fixed inset-0 z-30 select-none overflow-hidden text-white">
      {/* Viewport 3D da Ilha Flutuante */}
      <div ref={mountRef} className="absolute inset-0 pointer-events-auto" />

      {/* Toast Feedback */}
      {toast && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 bg-[#07111c]/95 border border-amber-400 px-4 py-1.5 rounded-full text-xs font-bold text-amber-200 shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-top-2">
          {toast}
        </div>
      )}

      {/* =========================================================================
         CANTO SUPERIOR ESQUERDO: PERFIL DO INVOCADOR & RECURSOS
         ========================================================================= */}
      <div className="absolute top-3 left-3 z-40 flex flex-col gap-2 pt-[env(safe-area-inset-top)] pointer-events-auto">
        {/* Cartão de Perfil */}
        <div className="flex items-center gap-2.5 bg-[#091522]/90 border border-cyan-500/40 p-2 rounded-2xl shadow-xl backdrop-blur-md">
          <div className="relative w-11 h-11 rounded-full border-2 border-amber-400 overflow-hidden shadow-[0_0_12px_rgba(255,200,0,0.5)]">
            <img src={celestialIcon} alt="Avatar" className="w-full h-full object-cover" />
            <span className="absolute bottom-0 right-0 bg-amber-500 text-black text-[8px] font-black px-1 rounded-full">
              50
            </span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black tracking-wide text-cyan-200">Invocador Éter</span>
              <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-400 border border-cyan-500/40">
                VIP
              </span>
            </div>
            <div className="flex items-center gap-3 mt-1 text-[10px] font-bold text-slate-300">
              <span className="flex items-center gap-1 text-amber-300">
                <Zap className="w-3 h-3 text-amber-400 fill-amber-400" /> {energy}/120
              </span>
              <span className="flex items-center gap-1 text-cyan-300">
                <Gem className="w-3 h-3 text-cyan-400 fill-cyan-400" /> {crystals.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
         CANTO SUPERIOR DIREITO: ÁUDIO, PWA & ATUALIZAÇÕES
         ========================================================================= */}
      <div className="absolute top-3 right-3 z-40 flex items-center gap-2 pt-[env(safe-area-inset-top)] pointer-events-auto">
        {/* Notificação de PWA Update Inteligente */}
        {pwaUpdateAvailable && (
          <button
            onClick={() => {
              playSound('click');
              onApplyPwaUpdate();
            }}
            className="flex items-center gap-1.5 py-1.5 px-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-black text-xs shadow-[0_0_20px_rgba(255,200,0,0.6)] animate-bounce cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            <span>ATUALIZAR APP</span>
          </button>
        )}

        <PWAInstallButton />

        <button
          onClick={() => {
            onToggleSound();
            showToast(!soundOn ? '🔊 Som ativado' : '🔇 Som desativado');
          }}
          className="w-10 h-10 rounded-2xl bg-[#091522]/90 border border-slate-700/60 hover:border-cyan-400 flex items-center justify-center text-slate-300 hover:text-white transition shadow-lg cursor-pointer backdrop-blur-md"
        >
          {soundOn ? <Volume2 className="w-4 h-4 text-cyan-300" /> : <VolumeX className="w-4 h-4 text-red-400" />}
        </button>
      </div>

      {/* =========================================================================
         CANTO INFERIOR ESQUERDO: SOCIAL & UTILIDADES
         ========================================================================= */}
      <div className="absolute bottom-4 left-3 z-40 flex items-center gap-2 pb-[env(safe-area-inset-bottom)] pointer-events-auto">
        <button
          onClick={() => {
            playSound('click');
            showToast('💬 Chat global do Éter conectado');
          }}
          className="w-10 h-10 rounded-2xl bg-[#091522]/90 border border-slate-700/60 hover:border-cyan-400 flex items-center justify-center text-slate-300 hover:text-white transition shadow-lg cursor-pointer backdrop-blur-md"
          title="Chat"
        >
          <MessageSquare className="w-4 h-4 text-cyan-300" />
        </button>

        <button
          onClick={() => {
            playSound('click');
            showToast('🛡️ Guilda "Guardiões do Éter" ativa');
          }}
          className="w-10 h-10 rounded-2xl bg-[#091522]/90 border border-slate-700/60 hover:border-cyan-400 flex items-center justify-center text-slate-300 hover:text-white transition shadow-lg cursor-pointer backdrop-blur-md"
          title="Guilda"
        >
          <Users className="w-4 h-4 text-emerald-400" />
        </button>

        <button
          onClick={() => {
            playSound('click');
            showToast('📬 Recompensas diárias coletadas!');
          }}
          className="w-10 h-10 rounded-2xl bg-[#091522]/90 border border-slate-700/60 hover:border-cyan-400 flex items-center justify-center text-slate-300 hover:text-white transition shadow-lg cursor-pointer backdrop-blur-md"
          title="Correio"
        >
          <Mail className="w-4 h-4 text-amber-300" />
        </button>
      </div>

      {/* =========================================================================
         CANTO INFERIOR DIREITO: AVENTURA (MAPA) & HERÓIS & FORMAÇÃO
         ========================================================================= */}
      <div className="absolute bottom-4 right-3 z-40 flex items-end gap-3 pb-[env(safe-area-inset-bottom)] pointer-events-auto">
        {/* Botão de Formação */}
        <button
          onClick={() => {
            playSound('click');
            onOpenPrep();
          }}
          className="h-12 px-3.5 rounded-2xl bg-[#091522]/90 border border-cyan-500/40 hover:border-cyan-400 flex items-center gap-1.5 text-xs font-bold text-slate-200 transition shadow-xl cursor-pointer backdrop-blur-md active:scale-95"
        >
          <Shield className="w-4 h-4 text-emerald-400" />
          <span className="hidden sm:inline">FORMAÇÃO</span>
        </button>

        {/* Botão de Heróis / Monstros */}
        <button
          onClick={() => {
            playSound('click');
            onOpenHeroes();
          }}
          className="relative group h-14 px-4 rounded-2xl bg-gradient-to-b from-[#13283c] to-[#0a1520] border-2 border-cyan-400/80 hover:border-cyan-300 flex items-center gap-2 text-xs font-black tracking-wide text-cyan-200 shadow-[0_0_20px_rgba(0,217,255,0.35)] transition cursor-pointer active:scale-95"
        >
          <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
          <div className="text-left">
            <span className="block text-[8px] uppercase tracking-wider text-slate-400 font-bold">Gerenciar</span>
            <span>MONSTROS</span>
          </div>
        </button>

        {/* Botão Principal Épico de Aventura (Mundo 1 a 4) */}
        <button
          onClick={() => {
            playSound('charge');
            onOpenAdventure();
          }}
          className="relative group h-16 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 text-[#1a0e00] font-black text-sm uppercase tracking-wider flex items-center gap-2.5 shadow-[0_0_30px_rgba(255,180,0,0.5)] border-2 border-amber-200 hover:brightness-110 active:scale-95 cursor-pointer transition overflow-hidden"
        >
          {/* Shimmer sweep */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          <Swords className="w-5 h-5 text-amber-950" />
          <span>AVENTURA</span>
        </button>
      </div>
    </section>
  );
});
