import * as THREE from 'three';

export interface ScreenPoint {
  x: number;
  y: number;
}

export function project3DToScreen(pos3D: THREE.Vector3, camera: THREE.Camera): ScreenPoint {
  const v = pos3D.clone();
  v.project(camera);
  return {
    x: (v.x * 0.5 + 0.5) * window.innerWidth,
    y: (-v.y * 0.5 + 0.5) * window.innerHeight
  };
}

// 1. ONDA DE DEVASTAÇÃO (TSUNAMI DE LAVA EXPANSIVO QUE PARTE DO HERÓI ATÉ OS INIMIGOS)
export function playFlameTsunami(
  container: HTMLElement,
  fromPoint: ScreenPoint,
  targetPoint: ScreenPoint,
  onHit: () => void
) {
  const dx = targetPoint.x - fromPoint.x;
  const dy = targetPoint.y - fromPoint.y;
  const distance = Math.hypot(dx, dy);
  const angle = (Math.atan2(dy, dx) * 180) / Math.PI;

  const div = document.createElement('div');
  div.style.position = 'absolute';
  div.style.pointerEvents = 'none';
  div.style.left = `${fromPoint.x}px`;
  div.style.top = `${fromPoint.y}px`;
  div.style.transformOrigin = '0% 50%';
  div.style.transform = `translate(0, -50%) rotate(${angle}deg)`;
  div.style.zIndex = '35';

  div.innerHTML = `
    <svg width="${Math.max(300, distance + 80)}" height="260" viewBox="0 0 ${Math.max(300, distance + 80)} 260" fill="none">
      <defs>
        <linearGradient id="lavaGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#3a0400" stop-opacity="0.3"/>
          <stop offset="35%" stop-color="#ff3b00" stop-opacity="0.9"/>
          <stop offset="70%" stop-color="#ff9900"/>
          <stop offset="95%" stop-color="#fff5b3"/>
          <stop offset="100%" stop-color="#ffffff"/>
        </linearGradient>
        <filter id="lavaGlow">
          <feGaussianBlur stdDeviation="6" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      <!-- Frente de onda cônica em expansão contínua -->
      <path d="M0,130 Q${distance * 0.4},40 ${distance},10 L${distance + 60},30 Q${distance * 0.6},130 ${distance + 60},230 L${distance},250 Q${distance * 0.4},220 0,130 Z" fill="url(#lavaGrad)" filter="url(#lavaGlow)"/>
      <path d="M0,130 Q${distance * 0.4},70 ${distance * 0.95},40 L${distance * 0.95},220 Q${distance * 0.4},190 0,130 Z" fill="#ffe066" opacity="0.85"/>
      <path d="M0,130 Q${distance * 0.3},100 ${distance * 0.8},85 L${distance * 0.8},175 Q${distance * 0.3},160 0,130 Z" fill="#ffffff" opacity="0.95"/>
      <!-- Bolhas e géiseres de magma -->
      <circle cx="${distance * 0.5}" cy="90" r="9" fill="#ffff99" filter="url(#lavaGlow)"/>
      <circle cx="${distance * 0.75}" cy="170" r="12" fill="#ff7700" filter="url(#lavaGlow)"/>
      <circle cx="${distance * 0.88}" cy="120" r="15" fill="#ffffff" filter="url(#lavaGlow)"/>
    </svg>
  `;

  container.appendChild(div);

  const anim = div.animate(
    [
      {
        opacity: 0.1,
        transform: `translate(0, -50%) rotate(${angle}deg) scale(0.15, 0.2)`
      },
      {
        opacity: 1,
        transform: `translate(0, -50%) rotate(${angle}deg) scale(0.65, 0.6)`,
        offset: 0.45
      },
      {
        opacity: 1,
        transform: `translate(0, -50%) rotate(${angle}deg) scale(1.05, 1.2)`,
        offset: 0.85
      },
      {
        opacity: 0,
        transform: `translate(0, -50%) rotate(${angle}deg) scale(1.15, 1.3)`
      }
    ],
    { duration: 520, easing: 'cubic-bezier(0.2, 0.85, 0.2, 1)' }
  );

  setTimeout(onHit, 360);
  anim.onfinish = () => div.remove();
}

// 2. METEORO ÍGNEO / BOLA DE FOGO SOLAR ULTRA DETALHADA
export function playUltraFireball(
  container: HTMLElement,
  fromPoint: ScreenPoint,
  targetPoint: ScreenPoint,
  onHit: () => void
) {
  const div = document.createElement('div');
  div.style.position = 'absolute';
  div.style.pointerEvents = 'none';
  div.style.left = `${fromPoint.x}px`;
  div.style.top = `${fromPoint.y}px`;
  div.style.transform = 'translate(-50%, -50%)';
  div.style.zIndex = '36';

  div.innerHTML = `
    <svg width="140" height="140" viewBox="0 0 140 140" fill="none">
      <defs>
        <radialGradient id="sunCore" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#ffffff"/>
          <stop offset="25%" stop-color="#fffa80"/>
          <stop offset="55%" stop-color="#ff5500"/>
          <stop offset="85%" stop-color="#b31100"/>
          <stop offset="100%" stop-color="#4a0400" stop-opacity="0"/>
        </radialGradient>
        <filter id="sunBlur">
          <feGaussianBlur stdDeviation="5" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      <!-- Corona turbilhonante -->
      <circle cx="70" cy="70" r="52" fill="url(#sunCore)" filter="url(#sunBlur)"/>
      <!-- Flares Solares e línguas de fogo espiraladas -->
      <path d="M70,18 Q95,45 70,70 Q45,95 70,122" stroke="#ffeb80" stroke-width="7" stroke-linecap="round" opacity="0.9"/>
      <path d="M18,70 Q45,95 70,70 Q95,45 122,70" stroke="#ff9900" stroke-width="7" stroke-linecap="round" opacity="0.9"/>
      <circle cx="70" cy="70" r="26" fill="#ffffff" filter="url(#sunBlur)"/>
      <circle cx="64" cy="62" r="7" fill="#fff5cc"/>
      <!-- Brasas em órbita -->
      <circle cx="105" cy="45" r="4.5" fill="#ffe580"/>
      <circle cx="35" cy="98" r="4.5" fill="#ff7700"/>
    </svg>
  `;

  container.appendChild(div);

  const anim = div.animate(
    [
      {
        transform: 'translate(-50%, -50%) scale(0.4) rotate(0deg)',
        left: `${fromPoint.x}px`,
        top: `${fromPoint.y}px`,
        opacity: 0.2
      },
      {
        transform: 'translate(-50%, -50%) scale(1.2) rotate(240deg)',
        left: `${targetPoint.x}px`,
        top: `${targetPoint.y}px`,
        opacity: 1,
        offset: 0.85
      },
      {
        transform: 'translate(-50%, -50%) scale(1.85) rotate(360deg)',
        left: `${targetPoint.x}px`,
        top: `${targetPoint.y}px`,
        opacity: 0
      }
    ],
    { duration: 380, easing: 'ease-in' }
  );

  setTimeout(onHit, 320);
  anim.onfinish = () => div.remove();
}

// 3. JATO DE ALTA PRESSÃO
export function playWaterJet(
  container: HTMLElement,
  fromPoint: ScreenPoint,
  targetPoint: ScreenPoint,
  onHit: () => void
) {
  const dx = targetPoint.x - fromPoint.x;
  const dy = targetPoint.y - fromPoint.y;
  const dist = Math.hypot(dx, dy);
  const angle = (Math.atan2(dy, dx) * 180) / Math.PI;

  const div = document.createElement('div');
  div.style.position = 'absolute';
  div.style.pointerEvents = 'none';
  div.style.left = `${fromPoint.x}px`;
  div.style.top = `${fromPoint.y}px`;
  div.style.transformOrigin = '0% 50%';
  div.style.transform = `translate(0, -50%) rotate(${angle}deg)`;
  div.style.zIndex = '35';

  div.innerHTML = `
    <svg width="${dist}" height="90" viewBox="0 0 ${dist} 90" fill="none">
      <defs>
        <linearGradient id="wjGlow" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#0066ff" stop-opacity="0.1"/>
          <stop offset="30%" stop-color="#00f2ff" stop-opacity="0.95"/>
          <stop offset="80%" stop-color="#ffffff"/>
          <stop offset="100%" stop-color="#00ffff" stop-opacity="0"/>
        </linearGradient>
      </defs>
      <path d="M0,45 Q${dist * 0.3},15 ${dist * 0.6},45 T${dist},45" stroke="url(#wjGlow)" stroke-width="26" stroke-linecap="round"/>
      <path d="M0,45 Q${dist * 0.3},70 ${dist * 0.6},45 T${dist},45" stroke="#ffffff" stroke-width="8" stroke-linecap="round"/>
      <circle cx="${dist * 0.75}" cy="30" r="5" fill="#c2f7ff"/>
      <circle cx="${dist * 0.9}" cy="58" r="4.5" fill="#c2f7ff"/>
    </svg>
  `;

  container.appendChild(div);

  const anim = div.animate(
    [
      { opacity: 0, transform: `translate(0, -50%) rotate(${angle}deg) scaleX(0.1)` },
      { opacity: 1, transform: `translate(0, -50%) rotate(${angle}deg) scaleX(1)`, offset: 0.38 },
      { opacity: 0, transform: `translate(0, -50%) rotate(${angle}deg) scaleX(1.05)` }
    ],
    { duration: 420, easing: 'ease-out' }
  );

  setTimeout(onHit, 250);
  anim.onfinish = () => div.remove();
}

// 4. LANÇAS GLACIAIS
export function playIceSpears(
  container: HTMLElement,
  fromPoint: ScreenPoint,
  targetPoint: ScreenPoint,
  onHit: () => void
) {
  const dx = targetPoint.x - fromPoint.x;
  const dy = targetPoint.y - fromPoint.y;
  const angle = (Math.atan2(dy, dx) * 180) / Math.PI + 90;

  for (let i = 0; i < 3; i++) {
    const div = document.createElement('div');
    div.style.position = 'absolute';
    div.style.pointerEvents = 'none';
    div.style.left = `${fromPoint.x}px`;
    div.style.top = `${fromPoint.y - 45}px`;
    div.style.zIndex = '36';

    div.innerHTML = `
      <svg width="50" height="120" viewBox="0 0 50 120" fill="none">
        <defs>
          <linearGradient id="ig_${i}" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#ffffff"/>
            <stop offset="35%" stop-color="#90f2ff"/>
            <stop offset="100%" stop-color="#0066cc"/>
          </linearGradient>
        </defs>
        <polygon points="25,115 8,35 25,5 42,35" fill="url(#ig_${i})" stroke="#e0f9ff" stroke-width="2.5"/>
        <line x1="25" y1="5" x2="25" y2="115" stroke="#ffffff" stroke-width="2.5"/>
      </svg>
    `;
    container.appendChild(div);

    const spreadX = (i - 1) * 35;
    div.animate(
      [
        {
          opacity: 0,
          transform: `translate(-50%, -50%) rotate(${angle - 15 + i * 15}deg) scale(0.4)`,
          left: `${fromPoint.x + spreadX}px`
        },
        { opacity: 1, offset: 0.2 },
        {
          opacity: 1,
          transform: `translate(-50%, -50%) rotate(${angle}deg) scale(1.15)`,
          left: `${targetPoint.x}px`,
          top: `${targetPoint.y}px`,
          offset: 0.85
        },
        {
          opacity: 0,
          transform: `translate(-50%, -50%) rotate(${angle}deg) scale(1.4)`,
          left: `${targetPoint.x}px`,
          top: `${targetPoint.y}px`
        }
      ],
      { duration: 420, delay: i * 85, easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)' }
    ).onfinish = () => div.remove();
  }

  setTimeout(onHit, 320);
}

// 5. VÓRTICE CORTANTE DE VENTO
export function playWindGust(
  container: HTMLElement,
  fromPoint: ScreenPoint,
  targetPoint: ScreenPoint,
  onHit: () => void
) {
  for (let i = 0; i < 3; i++) {
    const div = document.createElement('div');
    div.style.position = 'absolute';
    div.style.pointerEvents = 'none';
    div.style.left = `${fromPoint.x}px`;
    div.style.top = `${fromPoint.y}px`;
    div.style.zIndex = '36';

    div.innerHTML = `
      <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
        <path d="M15,50 Q50,15 85,50 Q50,42 15,50 Z" fill="#44ffaa" opacity="0.9"/>
        <path d="M25,50 Q50,26 75,50 Q50,44 25,50 Z" fill="#ffffff"/>
      </svg>
    `;
    container.appendChild(div);

    div.animate(
      [
        {
          transform: 'translate(-50%, -50%) rotate(0deg) scale(0.5)',
          left: `${fromPoint.x}px`,
          top: `${fromPoint.y}px`
        },
        {
          transform: `translate(-50%, -50%) rotate(${25 + i * 20}deg) scale(1.3)`,
          left: `${targetPoint.x + (i - 1) * 28}px`,
          top: `${targetPoint.y}px`,
          offset: 0.8
        },
        {
          transform: 'translate(-50%, -50%) scale(1.7)',
          opacity: 0,
          left: `${targetPoint.x + (i - 1) * 28}px`,
          top: `${targetPoint.y}px`
        }
      ],
      { duration: 340, delay: i * 65, easing: 'ease-out' }
    ).onfinish = () => div.remove();
  }

  setTimeout(onHit, 280);
}

// 6. RELÂMPAGO ROXO ESMAGADOR
export function playPurpleLightning(
  container: HTMLElement,
  targetPoint: ScreenPoint,
  onHit: () => void
) {
  const heightDist = Math.max(300, targetPoint.y + 40);

  const div = document.createElement('div');
  div.style.position = 'absolute';
  div.style.pointerEvents = 'none';
  div.style.left = `${targetPoint.x}px`;
  div.style.top = `0px`;
  div.style.transformOrigin = '50% 0%';
  div.style.zIndex = '36';

  div.innerHTML = `
    <svg width="240" height="${heightDist}" viewBox="0 0 240 ${heightDist}" fill="none">
      <defs>
        <filter id="pLightningGlow">
          <feGaussianBlur stdDeviation="8" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      <polyline points="120,0 95,${heightDist * 0.25} 145,${heightDist * 0.48} 85,${heightDist * 0.7} 135,${heightDist * 0.85} 120,${heightDist}"
        stroke="#e54aff" stroke-width="14" filter="url(#pLightningGlow)"/>
      <polyline points="120,0 95,${heightDist * 0.25} 145,${heightDist * 0.48} 85,${heightDist * 0.7} 135,${heightDist * 0.85} 120,${heightDist}"
        stroke="#ffffff" stroke-width="4"/>
      <circle cx="120" cy="${heightDist}" r="38" fill="#f385ff" opacity="0.85" filter="url(#pLightningGlow)"/>
    </svg>
  `;

  container.appendChild(div);

  const anim = div.animate(
    [
      { opacity: 0, transform: 'translate(-50%, 0) scaleY(0.1)' },
      { opacity: 1, transform: 'translate(-50%, 0) scaleY(1)', offset: 0.15 },
      { opacity: 1, transform: 'translate(-50%, 0) scaleX(1.2)', offset: 0.45 },
      { opacity: 0, transform: 'translate(-50%, 0) scaleX(1.35)' }
    ],
    { duration: 480, easing: 'ease-in-out' }
  );

  setTimeout(onHit, 160);
  anim.onfinish = () => div.remove();
}
