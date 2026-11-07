import * as THREE from 'three';
import { ElementType, HeroConfig, EnemyConfig } from '../types/game';

/* =========================================================================
   TEXTURAS PROCEDURAIS ULTRA-DETALHADAS
   ========================================================================= */

// 1. Relicário Arcano de Veromos (Tamanho harmônico, alta densidade rúnica)
export function createVeromosRelicTexture(element: ElementType): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 512;
  c.height = 512;
  const ctx = c.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(c);

  const palettes: Record<ElementType, { primary: string; glow: string; core: string; dark: string; rune: string }> = {
    water: { primary: '#00d9ff', glow: '#0077ff', core: '#e0f9ff', dark: '#04182b', rune: '#80eeff' },
    fire:  { primary: '#ff3b14', glow: '#ff9900', core: '#fff5e6', dark: '#2e0700', rune: '#ffb366' },
    wind:  { primary: '#19ff85', glow: '#00b359', core: '#e6fff0', dark: '#022410', rune: '#80ffbf' }
  };
  const pal = palettes[element] || palettes.water;

  ctx.clearRect(0, 0, 512, 512);

  // Aura difusa de fundo
  const bgGrad = ctx.createRadialGradient(256, 256, 40, 256, 256, 240);
  bgGrad.addColorStop(0, pal.glow + '44');
  bgGrad.addColorStop(0.5, pal.primary + '22');
  bgGrad.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 512, 512);

  // Anel Externo Rúnico
  ctx.strokeStyle = pal.primary;
  ctx.lineWidth = 8;
  ctx.shadowColor = pal.glow;
  ctx.shadowBlur = 18;
  ctx.beginPath();
  ctx.arc(256, 256, 170, 0, Math.PI * 2);
  ctx.stroke();

  // Anel Interno Fino
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(256, 256, 145, 0, Math.PI * 2);
  ctx.stroke();

  // Glifos Rúnicos Circulares
  ctx.strokeStyle = pal.rune;
  ctx.lineWidth = 2.5;
  for (let i = 0; i < 16; i++) {
    const angle = (i / 16) * Math.PI * 2;
    const x = 256 + Math.cos(angle) * 158;
    const y = 256 + Math.sin(angle) * 158;
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fillStyle = pal.core;
    ctx.fill();
    ctx.stroke();
  }

  // Lâminas Astrais em Crescente (Spikes de Veromos)
  function drawArcaneBlade(angle: number, length: number, width: number) {
    if (!ctx) return;
    ctx.save();
    ctx.translate(256, 256);
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.moveTo(0, -145);
    ctx.quadraticCurveTo(-width, -145 - length * 0.45, 0, -145 - length);
    ctx.quadraticCurveTo(width, -145 - length * 0.45, 0, -145);
    ctx.fillStyle = pal.primary;
    ctx.shadowColor = pal.glow;
    ctx.shadowBlur = 22;
    ctx.fill();

    // Nervura central da lâmina
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(0, -148);
    ctx.lineTo(0, -145 - length * 0.9);
    ctx.stroke();
    ctx.restore();
  }

  // Coroa de 6 pontas astrais
  drawArcaneBlade(0, 85, 24);             // Topo
  drawArcaneBlade(Math.PI * 0.32, 65, 18); // Superior direito
  drawArcaneBlade(-Math.PI * 0.32, 65, 18);// Superior esquerdo
  drawArcaneBlade(Math.PI * 0.72, 50, 15); // Inferior direito
  drawArcaneBlade(-Math.PI * 0.72, 50, 15);// Inferior esquerdo
  drawArcaneBlade(Math.PI, 40, 14);        // Base inferior

  // Núcleo Arcano Central (Gema Cósmica)
  const coreGrad = ctx.createRadialGradient(256, 256, 5, 256, 256, 55);
  coreGrad.addColorStop(0, '#ffffff');
  coreGrad.addColorStop(0.3, pal.core);
  coreGrad.addColorStop(0.7, pal.primary);
  coreGrad.addColorStop(1, pal.dark);
  ctx.fillStyle = coreGrad;
  ctx.shadowColor = pal.glow;
  ctx.shadowBlur = 25;
  ctx.beginPath();
  ctx.arc(256, 256, 48, 0, Math.PI * 2);
  ctx.fill();

  // Losango Rúnico no Centro
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.moveTo(256, 226);
  ctx.lineTo(276, 256);
  ctx.lineTo(256, 286);
  ctx.lineTo(236, 256);
  ctx.closePath();
  ctx.fill();

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// 2. Esferas de Energia Ultra-Vivas e Detalhadas
export function createVibrantOrbTexture(element: ElementType): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 128;
  c.height = 128;
  const ctx = c.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(c);

  const colors: Record<ElementType, { core: string; primary: string; corona: string }> = {
    water: { core: '#ffffff', primary: '#00d9ff', corona: '#0055ff' },
    fire:  { core: '#ffffff', primary: '#ff5500', corona: '#ff1100' },
    wind:  { core: '#ffffff', primary: '#22ff88', corona: '#00aa44' }
  };
  const col = colors[element] || colors.water;

  // Gradiente Estelar Volumétrico
  const g = ctx.createRadialGradient(64, 64, 4, 64, 64, 60);
  g.addColorStop(0, '#ffffff');
  g.addColorStop(0.25, col.core);
  g.addColorStop(0.55, col.primary);
  g.addColorStop(0.85, col.corona + '88');
  g.addColorStop(1, 'rgba(0,0,0,0)');

  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);

  // Filamentos de plasma em rotação
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(64, 64, 30, 0, Math.PI * 1.5);
  ctx.stroke();

  ctx.strokeStyle = col.core;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(64, 64, 42, Math.PI * 0.4, Math.PI * 1.8);
  ctx.stroke();

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// 3. Textura de Grama Procedural da Arena
export function createGrassTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 512;
  c.height = 512;
  const ctx = c.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(c);

  ctx.fillStyle = '#2c4e28';
  ctx.fillRect(0, 0, 512, 512);

  for (let i = 0; i < 4500; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    ctx.fillStyle = ['#22401f', '#365c32', '#43703e', '#598a52'][Math.floor(Math.random() * 4)];
    ctx.fillRect(x, y, 2 + Math.random() * 3, 3 + Math.random() * 5);
  }
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(6, 6);
  return tex;
}

/* =========================================================================
   SPRITESHEET PROCESSOR (COM COLORAÇÃO ELEMENTAL)
   ========================================================================= */
export interface SpriteSheetController {
  sprite: THREE.Sprite;
  frames: THREE.CanvasTexture[];
  cols: number;
  rows: number;
  row: number;
  col: number;
  walking: boolean;
  walkFps: number;
  frameClock: number;
}

export function processSpriteSheet(
  sourceImg: CanvasImageSource,
  heroConfig: HeroConfig | null
): SpriteSheetController {
  const cols = 9;
  const rows = 4;
  const fw = 64;
  const fh = 64;
  const frames: THREE.CanvasTexture[] = [];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cv = document.createElement('canvas');
      cv.width = fw;
      cv.height = fh;
      const ctx = cv.getContext('2d', { alpha: true });
      if (!ctx) continue;
      ctx.imageSmoothingEnabled = false;

      ctx.drawImage(sourceImg, c * fw, r * fh, fw, fh, 0, 0, fw, fh);

      if (heroConfig) {
        const imgData = ctx.getImageData(0, 0, fw, fh);
        const d = imgData.data;
        const [hr, hg, hb] = heroConfig.hairColor;

        for (let y = 0; y < fh; y++) {
          for (let x = 0; x < fw; x++) {
            const idx = (y * fw + x) * 4;
            if (d[idx + 3] < 35) continue;

            const red = d[idx];
            const green = d[idx + 1];
            const blue = d[idx + 2];
            const isSilverHair =
              y >= 4 &&
              y <= 32 &&
              Math.abs(red - green) < 25 &&
              Math.abs(red - blue) < 25 &&
              red > 75 &&
              red < 240;

            if (isSilverHair) {
              const lum = (red * 0.299 + green * 0.587 + blue * 0.114) / 255;
              d[idx] = Math.min(255, hr * lum * 1.35);
              d[idx + 1] = Math.min(255, hg * lum * 1.35);
              d[idx + 2] = Math.min(255, hb * lum * 1.35);
            }
          }
        }
        ctx.putImageData(imgData, 0, 0);

        // Runas místicas nos punhos/mangas
        ctx.fillStyle = heroConfig.stripeColor;
        ctx.fillRect(21, 35, 3, 2);
        ctx.fillRect(40, 35, 3, 2);
      }

      const tex = new THREE.CanvasTexture(cv);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.magFilter = THREE.NearestFilter;
      tex.minFilter = THREE.NearestFilter;
      tex.generateMipmaps = false;
      frames.push(tex);
    }
  }

  const mat = new THREE.SpriteMaterial({
    map: frames[0],
    transparent: true,
    depthWrite: false,
    depthTest: true
  });
  const sprite = new THREE.Sprite(mat);
  sprite.scale.set(1.7, 1.7, 1);
  sprite.center.set(0.5, 0.12);
  sprite.renderOrder = 20;

  return {
    sprite,
    frames,
    cols,
    rows,
    row: 0,
    col: 0,
    walking: false,
    walkFps: 10,
    frameClock: 0
  };
}

export function setSpriteFrame(ctrl: SpriteSheetController, row: number, col: number) {
  col = ((col % ctrl.cols) + ctrl.cols) % ctrl.cols;
  const tex = ctrl.frames[row * ctrl.cols + col];
  if (tex && ctrl.sprite.material.map !== tex) {
    ctrl.sprite.material.map = tex;
    ctrl.sprite.material.needsUpdate = true;
  }
  ctrl.row = row;
  ctrl.col = col;
}

export function startWalk(ctrl: SpriteSheetController, row: number, fps = 12) {
  ctrl.walking = true;
  ctrl.walkFps = fps;
  ctrl.row = row;
}

export function setIdle(ctrl: SpriteSheetController, row: number) {
  ctrl.walking = false;
  setSpriteFrame(ctrl, row, 0);
}

/* =========================================================================
   ATTACH TOTEM VEROMOS & ORBS COM RECONHECIMENTO DE FRENTE/COSTAS
   ========================================================================= */

/**
 * Anexa o Relicário de Veromos nas costas do herói:
 * - Altura: y = 0.85 (da cintura para cima, ancorado na espádua)
 * - Escala: 1.15 (proporcional, emoldurando a silhueta sem cobrir o herói)
 * - Reconhecimento frente/costas:
 *   - isFacingCamera = true (Hero Screen): o peito está voltado para o jogador (+Z),
 *     logo as costas ficam em -Z (z: -0.15, renderOrder: 14 atrás do herói).
 *   - isFacingCamera = false (Battle Arena): o herói está de costas voltado para o inimigo (-Z),
 *     logo as costas ficam visíveis para a câmera em +Z (z: +0.08, renderOrder: 22).
 */
export function attachVeromosTotem(
  group: THREE.Group,
  element: ElementType,
  isFacingCamera: boolean = false
): THREE.Sprite {
  const tex = createVeromosRelicTexture(element);
  const mat = new THREE.SpriteMaterial({
    map: tex,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    depthTest: true
  });
  const totem = new THREE.Sprite(mat);
  totem.scale.set(1.15, 1.15, 1);

  if (isFacingCamera) {
    totem.position.set(0, 0.85, -0.15);
    totem.renderOrder = 14;
  } else {
    totem.position.set(0, 0.85, 0.08);
    totem.renderOrder = 22;
  }

  group.add(totem);
  return totem;
}

export function attachOrbTrio(group: THREE.Group, element: ElementType): THREE.Sprite[] {
  const orbs: THREE.Sprite[] = [];
  const tex = createVibrantOrbTexture(element);

  for (let i = 0; i < 3; i++) {
    const sp = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: tex,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      })
    );
    sp.scale.set(0.48, 0.48, 1);
    sp.renderOrder = 28;
    group.add(sp);
    orbs.push(sp);
  }
  return orbs;
}

export function createPedestal(pos: [number, number, number], elemColor: string | number, isHero = true) {
  const g = new THREE.Group();
  g.position.set(pos[0], 0, pos[2]);

  const stoneBase = new THREE.Mesh(
    new THREE.CylinderGeometry(0.75, 0.88, 0.28, 24),
    new THREE.MeshStandardMaterial({ color: 0x35403e, roughness: 0.72 })
  );
  stoneBase.position.y = 0.14;
  g.add(stoneBase);

  const topPlate = new THREE.Mesh(
    new THREE.CylinderGeometry(0.72, 0.75, 0.07, 24),
    new THREE.MeshStandardMaterial({ color: isHero ? 0x477038 : 0x362b40, roughness: 0.6 })
  );
  topPlate.position.y = 0.3;
  g.add(topPlate);

  const glowRing = new THREE.Mesh(
    new THREE.TorusGeometry(0.74, 0.035, 8, 32),
    new THREE.MeshBasicMaterial({ color: elemColor, transparent: true, opacity: 0.9 })
  );
  glowRing.rotation.x = Math.PI / 2;
  glowRing.position.y = 0.35;
  g.add(glowRing);

  const shadow = new THREE.Mesh(
    new THREE.CircleGeometry(0.9, 20),
    new THREE.MeshBasicMaterial({ color: 0x050d08, transparent: true, opacity: 0.5 })
  );
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = 0.01;
  g.add(shadow);

  return { group: g, ring: glowRing, stoneBase };
}
