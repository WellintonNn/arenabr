import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { ElementType, HeroConfig, EnemyConfig, ScreenState } from './types/game';
import { INITIAL_HEROES, INITIAL_ENEMIES, HERO_POSITIONS } from './game/heroData';
import { calculateSkillDamage, calculateOrbDamage, checkBattleState, calculateAwakenedStats } from './game/rules';
import { playSound, isSoundEnabled } from './game/audio';
import {
  createGrassTexture,
  processSpriteSheet,
  setSpriteFrame,
  startWalk,
  setIdle,
  attachVeromosTotem,
  attachOrbTrio,
  createPedestal,
  SpriteSheetController
} from './game/threeScene';
import {
  project3DToScreen,
  playFlameTsunami,
  playUltraFireball,
  playWaterJet,
  playIceSpears,
  playWindGust,
  playPurpleLightning
} from './game/visualEffects';
import { LobbyScreen } from './components/LobbyScreen';
import { HeroScreen } from './components/HeroScreen';
import { PrepScreen } from './components/PrepScreen';
import { BattleHud, FloatingUnitLabel, DamagePopupItem } from './components/BattleHud';

const YAS_WALK_URL = 'https://i.ibb.co/Q382vzfd/yas-walk.png';
const SKELETON_WALK_URL = 'https://i.ibb.co/4Z5FwDWG/skeleton-walk.png';

interface BattleHeroState extends HeroConfig {
  slot: number;
  currentHp: number;
  maxHp: number;
  group: THREE.Group;
  spr: SpriteSheetController;
  orbs: THREE.Sprite[];
  totem: THREE.Sprite | null;
  orbsAttacking: boolean;
  pedestal: { group: THREE.Group; ring: THREE.Mesh; stoneBase: THREE.Mesh };
  dead: boolean;
}

interface BattleEnemyState extends EnemyConfig {
  slot: number;
  currentHp: number;
  group: THREE.Group;
  spr: SpriteSheetController;
  pedestal: { group: THREE.Group; ring: THREE.Mesh; stoneBase: THREE.Mesh };
  dead: boolean;
}

export default function App() {
  const [screen, setScreen] = useState<ScreenState>('lobby');
  const [heroes, setHeroes] = useState<Record<ElementType, HeroConfig>>(INITIAL_HEROES);
  const [formation, setFormation] = useState<ElementType[]>(['water', 'fire', 'wind']);
  const [soundOn, setSoundOn] = useState<boolean>(true);

  // Estados de Combate
  const [activeHero, setActiveHero] = useState<HeroConfig | null>(null);
  const [activeHeroHp, setActiveHeroHp] = useState<number>(10000);
  const [activeHeroMaxHp, setActiveHeroMaxHp] = useState<number>(10000);
  const [targetEnemy, setTargetEnemy] = useState<EnemyConfig | null>(null);
  const [targetEnemyHp, setTargetEnemyHp] = useState<number>(10000);
  const [targetEnemyMaxHp, setTargetEnemyMaxHp] = useState<number>(10000);

  const [actionTicker, setActionTicker] = useState<string | null>(null);
  const [tickerElement, setTickerElement] = useState<ElementType | null>(null);
  const [isBusy, setIsBusy] = useState<boolean>(false);
  const [floatingLabels, setFloatingLabels] = useState<FloatingUnitLabel[]>([]);
  const [damagePopups, setDamagePopups] = useState<DamagePopupItem[]>([]);
  const [battleResult, setBattleResult] = useState<'victory' | 'defeat' | null>(null);

  // Referências Three.js
  const containerRef = useRef<HTMLDivElement | null>(null);
  const fxOverlayRef = useRef<HTMLDivElement | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const dynamicLightRef = useRef<THREE.PointLight | null>(null);
  const particlePoolRef = useRef<Array<{ mesh: THREE.Mesh; vx: number; vy: number; vz: number; life: number; maxLife: number }>>([]);

  const battleHeroesRef = useRef<BattleHeroState[]>([]);
  const battleEnemiesRef = useRef<BattleEnemyState[]>([]);
  const targetIdxRef = useRef<number>(1);
  const currentTurnIdxRef = useRef<number>(0);
  const turnOrderRef = useRef<Array<BattleHeroState | BattleEnemyState>>([]);

  const rawYasRef = useRef<CanvasImageSource | null>(null);
  const rawSkeletonRef = useRef<CanvasImageSource | null>(null);

  // Carregamento de Sprite Sheets com fallbacks seguros
  useEffect(() => {
    function loadImg(url: string, isSkeleton = false): Promise<CanvasImageSource> {
      return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => resolve(img);
        img.onerror = () => {
          // Cria canvas fallback
          const c = document.createElement('canvas');
          c.width = 64 * 9;
          c.height = 64 * 4;
          const ctx = c.getContext('2d');
          if (ctx) {
            ctx.fillStyle = isSkeleton ? '#cbd5e1' : '#f5d0a9';
            for (let r = 0; r < 4; r++) {
              for (let col = 0; col < 9; col++) {
                ctx.fillRect(col * 64 + 22, r * 64 + 16, 20, 36);
              }
            }
          }
          resolve(c);
        };
        img.src = url;
      });
    }

    Promise.all([loadImg(YAS_WALK_URL, false), loadImg(SKELETON_WALK_URL, true)]).then(
      ([yas, skeleton]) => {
        rawYasRef.current = yas;
        rawSkeletonRef.current = skeleton;
      }
    );

    // Registro do Service Worker PWA
    if ('serviceWorker' in navigator && window.location.protocol.startsWith('http')) {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    }
  }, []);

  // Inicialização da Cena 3D Principal (Arena Floresta do Éter)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x274959);
    scene.fog = new THREE.FogExp2(0x274959, 0.022);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 140);
    camera.position.set(1.4, 8.4, 15.6);
    camera.lookAt(0, 0.3, -0.2);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    rendererRef.current = renderer;
    container.appendChild(renderer.domElement);

    // Iluminação
    scene.add(new THREE.HemisphereLight(0xdcf2ff, 0x243e20, 2.5));
    const sunLight = new THREE.DirectionalLight(0xfffae6, 2.8);
    sunLight.position.set(-10, 16, 12);
    scene.add(sunLight);

    const dynamicSpellLight = new THREE.PointLight(0xffffff, 0, 25, 1.5);
    dynamicSpellLight.position.set(0, 2, 0);
    scene.add(dynamicSpellLight);
    dynamicLightRef.current = dynamicSpellLight;

    // Chão Principal
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(64, 64),
      new THREE.MeshStandardMaterial({ map: createGrassTexture(), roughness: 0.9 })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.05;
    scene.add(ground);

    // Placa Central da Arena
    const arenaPlate = new THREE.Mesh(
      new THREE.CircleGeometry(7.2, 36),
      new THREE.MeshStandardMaterial({ color: 0x485842, roughness: 0.82 })
    );
    arenaPlate.rotation.x = -Math.PI / 2;
    arenaPlate.position.set(0, -0.04, 0);
    scene.add(arenaPlate);

    // Árvores ao Redor da Arena
    for (let i = 0; i < 20; i++) {
      const a = (i / 20) * Math.PI * 2;
      const d = 9.8 + Math.random() * 6.0;
      const scale = 0.9 + Math.random() * 0.5;
      const tg = new THREE.Group();
      tg.position.set(Math.cos(a) * d, 0, Math.sin(a) * d);

      const trunk = new THREE.Mesh(
        new THREE.CylinderGeometry(0.24 * scale, 0.42 * scale, 2.4 * scale, 8),
        new THREE.MeshStandardMaterial({ color: 0x3d2918, roughness: 0.9 })
      );
      trunk.position.y = 1.2 * scale;
      tg.add(trunk);

      [
        { y: 2.1, r: 1.35, c: 0x224822 },
        { y: 2.9, r: 1.1, c: 0x2f602f },
        { y: 3.7, r: 0.8, c: 0x417c41 }
      ].forEach((tier) => {
        const leaf = new THREE.Mesh(
          new THREE.IcosahedronGeometry(tier.r * scale, 1),
          new THREE.MeshStandardMaterial({ color: tier.c, roughness: 0.8 })
        );
        leaf.position.y = tier.y * scale;
        tg.add(leaf);
      });
      scene.add(tg);
    }

    // Pool de Partículas 3D
    const pool: Array<{ mesh: THREE.Mesh; vx: number; vy: number; vz: number; life: number; maxLife: number }> = [];
    const pGeo = new THREE.SphereGeometry(0.065, 6, 6);
    for (let i = 0; i < 40; i++) {
      const pMesh = new THREE.Mesh(pGeo, new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true }));
      pMesh.visible = false;
      scene.add(pMesh);
      pool.push({ mesh: pMesh, vx: 0, vy: 0, vz: 0, life: 0, maxLife: 1 });
    }
    particlePoolRef.current = pool;

    // Loop de Animação e Renderização da Cena Principal
    let reqId: number;
    const clock = new THREE.Clock();

    function animate() {
      reqId = requestAnimationFrame(animate);
      const dt = Math.min(clock.getDelta(), 0.05);
      const t = clock.getElapsedTime();

      // Partículas
      for (const p of pool) {
        if (p.life > 0) {
          p.life -= dt / p.maxLife;
          p.mesh.position.x += p.vx * dt;
          p.mesh.position.y += p.vy * dt;
          p.mesh.position.z += p.vz * dt;
          p.vy -= 9.8 * dt;
          (p.mesh.material as THREE.MeshBasicMaterial).opacity = Math.max(0, p.life);
          if (p.life <= 0) p.mesh.visible = false;
        }
      }

      if (dynamicSpellLight.intensity > 0) {
        dynamicSpellLight.intensity = Math.max(0, dynamicSpellLight.intensity - dt * 38);
      }

      // Animação dos Combatentes (Idle Orgânico, Relicário de Veromos e Esferas)
      const allUnits = [...battleHeroesRef.current, ...battleEnemiesRef.current];
      for (const u of allUnits) {
        if (!u.spr) continue;
        const s = u.spr;
        const offset = (u.slot || 0) * 1.5;

        if (s.walking) {
          s.frameClock += dt;
          if (s.frameClock >= 1 / s.walkFps) {
            s.frameClock -= 1 / s.walkFps;
            setSpriteFrame(s, s.row, (s.col + 1) % s.cols);
          }
          s.sprite.scale.set(1.7, 1.7, 1);
        } else {
          // Respiração orgânica sutil (squash & stretch senoidal)
          const breath = Math.sin(t * 3.2 + offset);
          s.sprite.scale.y = 1.7 * (1.0 + breath * 0.024);
          s.sprite.scale.x = 1.7 * (1.0 - breath * 0.012);
          s.sprite.position.y = breath * 0.015;
        }

        // Relicário Arcano de Veromos nas costas (flutua e oscila suavemente)
        if ('totem' in u && u.totem && !u.dead) {
          u.totem.position.y = 0.85 + Math.sin(t * 2.2 + offset) * 0.035;
          u.totem.material.rotation = Math.sin(t * 1.4 + offset) * 0.06;
        }

        if (u.pedestal && !u.dead) {
          (u.pedestal.ring.material as THREE.MeshBasicMaterial).opacity = 0.72 + Math.sin(t * 2.8 + offset) * 0.22;
        }
      }

      // Órbita das 3 Esferas Elementais (somente se despertado e não estiver atacando)
      for (const h of battleHeroesRef.current) {
        if (!h.orbs || h.dead || !h.awakened || h.orbsAttacking) continue;
        for (let i = 0; i < h.orbs.length; i++) {
          const orb = h.orbs[i];
          const angle = t * 2.4 + (i * (Math.PI * 2)) / 3;
          const rad = 0.68 + Math.sin(t * 2.6 + i) * 0.03;
          orb.position.set(
            Math.cos(angle) * rad,
            0.85 + Math.sin(t * 2.5 + i) * 0.12,
            Math.sin(angle) * rad
          );
        }
      }

      // Atualização contínua das barras de vida flutuantes ancoradas na cabeça (v.y += 1.25)
      if (battleHeroesRef.current.length > 0) {
        const labels: FloatingUnitLabel[] = [];
        const units = [...battleHeroesRef.current, ...battleEnemiesRef.current];
        const targetSlot = targetIdxRef.current;

        for (const unit of units) {
          const worldPos = new THREE.Vector3();
          unit.group.getWorldPosition(worldPos);
          worldPos.y += 1.25; // Ancorado perfeitamente na cabeça do sprite

          const sp = project3DToScreen(worldPos, camera);
          const isTarget = !('skills' in unit) && unit.slot === targetSlot;
          const unitDisplayName = 'name' in unit ? unit.name : ('awakened' in unit && unit.awakened ? unit.awakenedName : unit.baseName);

          labels.push({
            id: unit.id,
            isHero: 'skills' in unit,
            name: unitDisplayName,
            hpPercent: Math.max(0, (unit.currentHp / unit.maxHp) * 100),
            screenX: sp.x,
            screenY: sp.y,
            isTarget,
            isDead: unit.dead
          });
        }
        setFloatingLabels(labels);
      }

      renderer.render(scene, camera);
    }
    animate();

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
  }, []);

  // Disparo de Explosão de Partículas 3D
  const trigger3DExplosion = (pos3D: THREE.Vector3, hexColor: number) => {
    if (dynamicLightRef.current) {
      dynamicLightRef.current.position.copy(pos3D);
      dynamicLightRef.current.color.setHex(hexColor);
      dynamicLightRef.current.intensity = 26;
    }

    let count = 0;
    for (const p of particlePoolRef.current) {
      if (count > 25) break;
      p.mesh.position.copy(pos3D);
      (p.mesh.material as THREE.MeshBasicMaterial).color.setHex(hexColor);
      p.mesh.visible = true;
      p.life = 1.0;
      p.maxLife = 0.5 + Math.random() * 0.4;
      const speed = 2.4 + Math.random() * 3.6;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      p.vx = Math.sin(phi) * Math.cos(theta) * speed;
      p.vy = Math.cos(phi) * speed + 1.2;
      p.vz = Math.sin(phi) * Math.sin(theta) * speed;
      count++;
    }
  };

  // Flash visual de acerto
  const hitFlash = async (unit: BattleHeroState | BattleEnemyState) => {
    if (!unit || !unit.spr || unit.dead) return;
    const sp = unit.spr.sprite;
    sp.material.color.setHex(0xffffff);
    unit.group.position.x += 0.14;
    await new Promise((r) => setTimeout(r, 65));
    unit.group.position.x -= 0.14;
    sp.material.color.setHex('skills' in unit ? 0xffffff : unit.color);
  };

  // Spawn de Popup de Dano
  const spawnDamagePopup = (unit: BattleHeroState | BattleEnemyState, text: string, color = '#ffffff') => {
    if (!cameraRef.current) return;
    const pos = unit.group.position.clone();
    pos.y += 1.0;
    const sp = project3DToScreen(pos, cameraRef.current);
    const id = `${Date.now()}_${Math.random()}`;

    setDamagePopups((prev) => [...prev, { id, text, color, screenX: sp.x, screenY: sp.y }]);
    setTimeout(() => {
      setDamagePopups((prev) => prev.filter((p) => p.id !== id));
    }, 850);
  };

  // Exibição do Ticker não invasivo no topo
  const postActionTicker = (text: string, elem: ElementType | null = null) => {
    setActionTicker(text);
    setTickerElement(elem);
    clearTimeout((postActionTicker as unknown as { timer?: NodeJS.Timeout }).timer);
    (postActionTicker as unknown as { timer?: NodeJS.Timeout }).timer = setTimeout(() => {
      setActionTicker(null);
    }, 1800);
  };

  // Inicialização de Nova Batalha
  const setupBattle = () => {
    const scene = sceneRef.current;
    if (!scene || !rawYasRef.current || !rawSkeletonRef.current) return;

    // Limpa combatentes antigos
    battleHeroesRef.current.forEach((h) => {
      scene.remove(h.group);
      scene.remove(h.pedestal.group);
    });
    battleEnemiesRef.current.forEach((e) => {
      scene.remove(e.group);
      scene.remove(e.pedestal.group);
    });
    battleHeroesRef.current = [];
    battleEnemiesRef.current = [];

    // 3 Heróis na Formação Agrupada
    const newHeroes: BattleHeroState[] = [];
    formation.forEach((elem, idx) => {
      const baseHero = heroes[elem];
      const stats = calculateAwakenedStats(baseHero);
      const pos = HERO_POSITIONS[idx];
      const pedestal = createPedestal(pos, baseHero.color, true);
      scene.add(pedestal.group);

      const group = new THREE.Group();
      group.position.set(pos[0], 0.35, pos[2]);
      scene.add(group);

      const spr = processSpriteSheet(rawYasRef.current!, baseHero);
      group.add(spr.sprite);
      setIdle(spr, 0); // Olha para o norte em direção aos inimigos (costas voltadas para a câmera)

      let orbs: THREE.Sprite[] = [];
      let totem: THREE.Sprite | null = null;

      // SÓ ANEXA O RELICÁRIO E AS ESFERAS SE ESTIVER DESPERTADO!
      if (baseHero.awakened) {
        // isFacingCamera = false -> O herói está de costas, o relicário fica em z: +0.08
        totem = attachVeromosTotem(group, elem, false);
        orbs = attachOrbTrio(group, elem);
      }

      newHeroes.push({
        ...baseHero,
        slot: idx,
        hp: stats.hp,
        atk: stats.atk,
        speed: stats.speed,
        currentHp: stats.hp,
        maxHp: stats.hp,
        group,
        spr,
        orbs,
        totem,
        orbsAttacking: false,
        pedestal,
        dead: false
      });
    });
    battleHeroesRef.current = newHeroes;

    // 3 Inimigos Agrupados
    const newEnemies: BattleEnemyState[] = [];
    INITIAL_ENEMIES.forEach((en, idx) => {
      const pedestal = createPedestal(en.pos, en.color, false);
      scene.add(pedestal.group);

      const group = new THREE.Group();
      group.position.set(en.pos[0], 0.35, en.pos[2]);
      scene.add(group);

      const spr = processSpriteSheet(rawSkeletonRef.current!, null);
      spr.sprite.material.color.setHex(en.color);
      group.add(spr.sprite);
      setIdle(spr, 2); // Olha para o sul em direção aos heróis

      newEnemies.push({
        ...en,
        slot: idx,
        currentHp: en.hp,
        group,
        spr,
        pedestal,
        dead: false
      });
    });
    battleEnemiesRef.current = newEnemies;

    targetIdxRef.current = 1;
    currentTurnIdxRef.current = 0;
    setBattleResult(null);

    // Ordem de Turnos
    const living = [...newHeroes, ...newEnemies];
    living.sort((a, b) => {
      const spdB = 'speed' in b ? (b.speed as number) : 100;
      const spdA = 'speed' in a ? (a.speed as number) : 100;
      return spdB - spdA;
    });
    turnOrderRef.current = living;

    updateHudState();
    postActionTicker('Batalha Iniciada! Que os arcanos decidam o destino.');
  };

  const getActiveCombatant = () => {
    return turnOrderRef.current[currentTurnIdxRef.current] || battleHeroesRef.current[0];
  };

  const getTargetEnemy = () => {
    const target = battleEnemiesRef.current[targetIdxRef.current];
    if (target && !target.dead) return target;
    const firstAlive = battleEnemiesRef.current.find((e) => !e.dead);
    if (firstAlive) {
      targetIdxRef.current = firstAlive.slot;
      return firstAlive;
    }
    return null;
  };

  const updateHudState = () => {
    const active = getActiveCombatant();
    const target = getTargetEnemy();

    if (active && 'skills' in active) {
      setActiveHero(active);
      setActiveHeroHp(active.currentHp);
      setActiveHeroMaxHp(active.maxHp);
    }

    if (target) {
      setTargetEnemy(target);
      setTargetEnemyHp(target.currentHp);
      setTargetEnemyMaxHp(target.maxHp);
    }
  };

  const advanceTurn = () => {
    const living = [...battleHeroesRef.current, ...battleEnemiesRef.current].filter((u) => !u.dead);
    const battleStatus = checkBattleState(
      battleHeroesRef.current.filter((h) => !h.dead).length,
      battleEnemiesRef.current.filter((e) => !e.dead).length
    );

    if (battleStatus === 'victory') {
      setBattleResult('victory');
      postActionTicker('VICTORY! Arena conquistada com honra celestial.');
      setIsBusy(false);
      return;
    }
    if (battleStatus === 'defeat') {
      setBattleResult('defeat');
      postActionTicker('DERROTA... Seus monstros sucumbiram.');
      setIsBusy(false);
      return;
    }

    living.sort((a, b) => {
      const spdB = 'speed' in b ? (b.speed as number) : 100;
      const spdA = 'speed' in a ? (a.speed as number) : 100;
      return spdB - spdA;
    });
    turnOrderRef.current = living;

    currentTurnIdxRef.current = (currentTurnIdxRef.current + 1) % living.length;
    const next = turnOrderRef.current[currentTurnIdxRef.current];

    updateHudState();
    setIsBusy(false);

    // Se o próximo for inimigo, executa o turno da IA
    if (next && !('skills' in next)) {
      setTimeout(() => executeEnemyTurn(next as BattleEnemyState), 450);
    }
  };

  // DISPARO DAS ESFERAS QUANDO DESPERTADO
  const launchAwakenedOrbs = async (hero: BattleHeroState, target: BattleEnemyState) => {
    const scene = sceneRef.current;
    if (!scene || !hero.orbs || hero.orbs.length === 0) return;
    hero.orbsAttacking = true;

    const targetPos = target.group.position.clone();
    targetPos.y += 0.8;

    playSound('orb_barrage');

    for (let i = 0; i < hero.orbs.length; i++) {
      const orb = hero.orbs[i];
      const initialPos = new THREE.Vector3();
      orb.getWorldPosition(initialPos);

      // Projétil temporário
      const projectile = new THREE.Sprite(orb.material.clone());
      projectile.scale.copy(orb.scale);
      projectile.position.copy(initialPos);
      scene.add(projectile);
      orb.visible = false;

      // Arco de alta velocidade
      await new Promise<void>((res) => {
        let p = 0;
        function fly() {
          p += 0.18;
          projectile.position.lerpVectors(initialPos, targetPos, p);
          projectile.position.y += Math.sin(p * Math.PI) * 0.45;
          if (p < 1.0) {
            requestAnimationFrame(fly);
          } else {
            res();
          }
        }
        fly();
      });

      scene.remove(projectile);
      trigger3DExplosion(targetPos, hero.hex);
      await hitFlash(target);

      const orbDmg = calculateOrbDamage(hero.atk);
      target.currentHp = Math.max(0, target.currentHp - orbDmg);
      spawnDamagePopup(target, `✦ ORBE +${orbDmg}`, hero.color);

      await new Promise((r) => setTimeout(r, 70));
    }

    await new Promise((r) => setTimeout(r, 120));
    // Reaparecimento suave das esferas
    for (const orb of hero.orbs) {
      orb.visible = true;
      orb.material.opacity = 0;
    }
    hero.orbsAttacking = false;

    for (let op = 0; op <= 10; op++) {
      hero.orbs.forEach((o) => (o.material.opacity = op / 10));
      await new Promise((r) => setTimeout(r, 20));
    }
  };

  // Turno do Herói: Conjuração de Habilidade
  const handleCastSkill = async (skillIdx: number) => {
    if (isBusy || !cameraRef.current || !fxOverlayRef.current) return;
    const active = getActiveCombatant();
    const target = getTargetEnemy();
    if (!active || !('skills' in active) || !target) return;

    const skill = active.skills[skillIdx];
    setIsBusy(true);

    const displayName = active.awakened ? active.awakenedName.split(' ')[0] : active.baseName.split(' ')[0];
    postActionTicker(`✦ ${displayName} usou ${skill.name}!`, active.element);

    const from3D = active.group.position.clone();
    const to3D = target.group.position.clone();
    const p1 = project3DToScreen(from3D, cameraRef.current);
    const p2 = project3DToScreen(to3D, cameraRef.current);

    const isCrit = Math.random() * 100 < active.critRate;
    const { damage: rawDamage } = calculateSkillDamage(
      active.atk,
      skill.pow,
      active.element,
      target.element,
      isCrit,
      active.critDmg
    );

    const overlay = fxOverlayRef.current;

    try {
      if (skill.animKey === 'strike') {
        playSound('strike');
        startWalk(active.spr, 0, 14);

        // Avanço físico
        await new Promise<void>((r) => {
          let t = 0;
          function s() {
            t = Math.min(1, t + 0.09);
            active.group.position.z = THREE.MathUtils.lerp(from3D.z, to3D.z + 1.1, t);
            if (t < 1) requestAnimationFrame(s);
            else r();
          }
          s();
        });

        trigger3DExplosion(to3D, 0xffffff);
        await hitFlash(target);
        target.currentHp = Math.max(0, target.currentHp - rawDamage);
        spawnDamagePopup(target, `${isCrit ? 'CRÍTICO! ' : ''}-${rawDamage}`, '#ffffff');

        // Retorno
        startWalk(active.spr, 2, 14);
        await new Promise<void>((r) => {
          let t = 0;
          function s() {
            t = Math.min(1, t + 0.09);
            active.group.position.z = THREE.MathUtils.lerp(to3D.z + 1.1, from3D.z, t);
            if (t < 1) requestAnimationFrame(s);
            else r();
          }
          s();
        });
        active.group.position.z = from3D.z;
        setIdle(active.spr, 0);

      } else if (skill.animKey === 'water_jet') {
        playSound('water_jet');
        await new Promise<void>((r) => {
          playWaterJet(overlay, p1, p2, async () => {
            trigger3DExplosion(to3D, 0x00d9ff);
            await hitFlash(target);
            target.currentHp = Math.max(0, target.currentHp - rawDamage);
            spawnDamagePopup(target, `-${rawDamage}`, '#00d9ff');
            r();
          });
        });

      } else if (skill.animKey === 'ice_spear') {
        playSound('ice_spear');
        await new Promise<void>((r) => {
          playIceSpears(overlay, p1, p2, async () => {
            trigger3DExplosion(to3D, 0x90f2ff);
            await hitFlash(target);
            target.currentHp = Math.max(0, target.currentHp - rawDamage);
            spawnDamagePopup(target, `CRÍTICO! -${rawDamage}`, '#d4f7ff');
            r();
          });
        });

      } else if (skill.animKey === 'fireball') {
        playSound('fireball');
        await new Promise<void>((r) => {
          playUltraFireball(overlay, p1, p2, async () => {
            trigger3DExplosion(to3D, 0xff5500);
            await hitFlash(target);
            target.currentHp = Math.max(0, target.currentHp - rawDamage);
            spawnDamagePopup(target, `-${rawDamage}`, '#ff7733');
            r();
          });
        });

      } else if (skill.animKey === 'flame_wave') {
        // ONDA DE DEVASTAÇÃO (TSUNAMI EXPANSIVO DE LAVA QUE NASCE DO HERÓI ATÉ TODOS OS INIMIGOS)
        playSound('flame_wave');
        await new Promise<void>((r) => {
          playFlameTsunami(overlay, p1, p2, async () => {
            // Atinge todos os inimigos vivos
            const livingEnemies = battleEnemiesRef.current.filter((e) => !e.dead);
            for (const en of livingEnemies) {
              en.currentHp = Math.max(0, en.currentHp - rawDamage);
              trigger3DExplosion(en.group.position, 0xff3b14);
              spawnDamagePopup(en, `-${rawDamage}`, '#ffaa00');
              hitFlash(en);
            }
            r();
          });
        });

      } else if (skill.animKey === 'wind_gust') {
        playSound('wind_gust');
        await new Promise<void>((r) => {
          playWindGust(overlay, p1, p2, async () => {
            trigger3DExplosion(to3D, 0x19ff85);
            await hitFlash(target);
            target.currentHp = Math.max(0, target.currentHp - rawDamage);
            spawnDamagePopup(target, `-${rawDamage}`, '#19ff85');
            r();
          });
        });

      } else if (skill.animKey === 'purple_lightning') {
        playSound('purple_lightning');
        await new Promise<void>((r) => {
          playPurpleLightning(overlay, p2, async () => {
            trigger3DExplosion(to3D, 0xc338ff);
            await hitFlash(target);
            target.currentHp = Math.max(0, target.currentHp - rawDamage);
            spawnDamagePopup(target, `CRUSHING HIT! -${rawDamage}`, '#e54aff');
            r();
          });
        });
      }

      // DISPARO DAS ESFERAS SE ESTIVER DESPERTADO
      if (active.awakened && !target.dead && target.currentHp > 0) {
        await launchAwakenedOrbs(active, target);
      }
    } finally {
      // Verifica mortes de inimigos
      for (const en of battleEnemiesRef.current) {
        if (en.currentHp <= 0 && !en.dead) {
          en.dead = true;
          trigger3DExplosion(en.group.position, 0xff2a55);
          en.spr.sprite.visible = false;
          (en.pedestal.ring.material as THREE.MeshBasicMaterial).opacity = 0.05;
          postActionTicker(`☠ ${en.name} foi derrotado!`);
        }
      }

      updateHudState();
      advanceTurn();
    }
  };

  // Turno do Inimigo
  const executeEnemyTurn = async (enemy: BattleEnemyState) => {
    if (enemy.dead) {
      advanceTurn();
      return;
    }

    const livingHeroes = battleHeroesRef.current.filter((h) => !h.dead);
    if (livingHeroes.length === 0) {
      advanceTurn();
      return;
    }

    const targetHero = livingHeroes[Math.floor(Math.random() * livingHeroes.length)];
    postActionTicker(`⚔ ${enemy.name} atacou ${targetHero.awakened ? targetHero.awakenedName.split(' ')[0] : targetHero.baseName.split(' ')[0]}!`);

    startWalk(enemy.spr, 2, 12);
    const origZ = enemy.group.position.z;
    const lungeZ = origZ + 1.2;

    await new Promise<void>((r) => {
      let t = 0;
      function s() {
        t = Math.min(1, t + 0.08);
        enemy.group.position.z = THREE.MathUtils.lerp(origZ, lungeZ, t);
        if (t < 1) requestAnimationFrame(s);
        else r();
      }
      s();
    });

    playSound('strike');
    trigger3DExplosion(targetHero.group.position, 0xff2a55);
    await hitFlash(targetHero);

    const dmg = Math.round(enemy.atk * 3.8);
    targetHero.currentHp = Math.max(0, targetHero.currentHp - dmg);
    spawnDamagePopup(targetHero, `-${dmg}`, '#ff3355');

    if (targetHero.currentHp <= 0 && !targetHero.dead) {
      targetHero.dead = true;
      trigger3DExplosion(targetHero.group.position, 0xff2a55);
      targetHero.spr.sprite.visible = false;
      (targetHero.pedestal.ring.material as THREE.MeshBasicMaterial).opacity = 0.05;
      postActionTicker(`⚠️ ${targetHero.baseName} sucumbiu em combate!`);
    }

    await new Promise<void>((r) => {
      let t = 0;
      function s() {
        t = Math.min(1, t + 0.08);
        enemy.group.position.z = THREE.MathUtils.lerp(lungeZ, origZ, t);
        if (t < 1) requestAnimationFrame(s);
        else r();
      }
      s();
    });
    enemy.group.position.z = origZ;
    setIdle(enemy.spr, 2);

    updateHudState();
    advanceTurn();
  };

  // Alternar Despertar
  const handleToggleAwaken = (elem: ElementType) => {
    setHeroes((prev) => {
      const cur = prev[elem];
      return {
        ...prev,
        [elem]: {
          ...cur,
          awakened: !cur.awakened
        }
      };
    });
  };

  // Ciclar elemento do slot na tela de preparação
  const handleCycleSlot = (slotIdx: number) => {
    const elems: ElementType[] = ['water', 'fire', 'wind'];
    setFormation((prev) => {
      const next = [...prev];
      const cur = next[slotIdx];
      next[slotIdx] = elems[(elems.indexOf(cur) + 1) % elems.length];
      return next;
    });
  };

  return (
    <main className="relative w-full h-full h-screen overflow-hidden bg-[#050c14] select-none touch-none">
      {/* Container Three.js da Arena 3D */}
      <div ref={containerRef} className="fixed inset-0 w-full h-full pointer-events-auto" />

      {/* Camada de Efeitos Visuais SVG */}
      <div ref={fxOverlayRef} className="fixed inset-0 pointer-events-none z-25 overflow-hidden" />

      {/* Tela do Lobby */}
      {screen === 'lobby' && (
        <LobbyScreen
          soundOn={soundOn}
          onToggleSound={() => setSoundOn((s) => !s)}
          onStartBattle={() => {
            setupBattle();
            setScreen('battle');
          }}
          onOpenHeroes={() => setScreen('heroes')}
          onOpenPrep={() => setScreen('prep')}
        />
      )}

      {/* Tela de Heróis (Summoners War Monster Info & Despertar) */}
      {screen === 'heroes' && (
        <HeroScreen
          heroes={heroes}
          rawYasImage={rawYasRef.current}
          onToggleAwaken={handleToggleAwaken}
          onBack={() => setScreen('lobby')}
          onSelectForBattle={() => setScreen('prep')}
        />
      )}

      {/* Tela de Preparação 3v3 */}
      {screen === 'prep' && (
        <PrepScreen
          formation={formation}
          heroes={heroes}
          onCycleSlot={handleCycleSlot}
          onBack={() => setScreen('lobby')}
          onStartBattle={() => {
            setupBattle();
            setScreen('battle');
          }}
        />
      )}

      {/* HUD de Combate */}
      {screen === 'battle' && (
        <BattleHud
          activeHero={activeHero}
          activeHeroHp={activeHeroHp}
          activeHeroMaxHp={activeHeroMaxHp}
          targetEnemy={targetEnemy}
          targetEnemyHp={targetEnemyHp}
          targetEnemyMaxHp={targetEnemyMaxHp}
          actionTicker={actionTicker}
          tickerElement={tickerElement}
          isBusy={isBusy}
          floatingLabels={floatingLabels}
          damagePopups={damagePopups}
          onCastSkill={handleCastSkill}
          onSelectTarget={(idx) => {
            targetIdxRef.current = idx;
            playSound('strike');
            updateHudState();
          }}
          onSurrender={() => setScreen('lobby')}
          soundOn={soundOn}
          onToggleSound={() => setSoundOn((s) => !s)}
          battleResult={battleResult}
          onReturnToLobby={() => setScreen('lobby')}
        />
      )}
    </main>
  );
}
