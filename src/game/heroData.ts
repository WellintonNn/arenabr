import { HeroConfig, EnemyConfig, ElementType } from '../types/game';

export const INITIAL_HEROES: Record<ElementType, HeroConfig> = {
  water: {
    id: 'water',
    baseName: 'Yas das Marés',
    awakenedName: 'Scylla (Soberana Abissal)',
    role: 'SUPORTE TÁTICO & CONTROLE',
    element: 'water',
    grade: 5,
    level: 40,
    hp: 10450,
    atk: 720,
    def: 640,
    speed: 108,
    critRate: 15,
    critDmg: 50,
    res: 40,
    acc: 25,
    color: '#00d9ff',
    hex: 0x00d9ff,
    hairColor: [20, 210, 255],
    stripeColor: '#00ffff',
    awakened: false,
    skills: [
      { name: 'Corte Fluido', pow: 32, type: 'strike', animKey: 'strike', cd: 'PASSIVO', desc: 'Ataque veloz com lâmina d’água condensada.', ico: '⚔️' },
      { name: 'Jato de Alta Pressão', pow: 48, type: 'magic', animKey: 'water_jet', cd: '3 Turnos', desc: 'Dispara um jato contínuo de alta pressão que perfura a blindagem.', ico: '🌊' },
      { name: 'Lanças Glaciais', pow: 68, type: 'magic', animKey: 'ice_spear', cd: '4 Turnos', isUlt: true, desc: 'Conjura múltiplas estacas de gelo que colidem violentamente.', ico: '❄️' }
    ]
  },
  fire: {
    id: 'fire',
    baseName: 'Yas das Chamas',
    awakenedName: 'Ignis (Fênix Escarlate)',
    role: 'ATACANTE PURA (NUKER)',
    element: 'fire',
    grade: 5,
    level: 40,
    hp: 9150,
    atk: 860,
    def: 520,
    speed: 114,
    critRate: 30,
    critDmg: 70,
    res: 15,
    acc: 20,
    color: '#ff3b14',
    hex: 0xff3b14,
    hairColor: [255, 60, 20],
    stripeColor: '#ff7733',
    awakened: false,
    skills: [
      { name: 'Golpe de Brasa', pow: 36, type: 'strike', animKey: 'strike', cd: 'PASSIVO', desc: 'Golpe físico envolto em chamas incandescentes.', ico: '⚔️' },
      { name: 'Meteoro Ígneo', pow: 54, type: 'magic', animKey: 'fireball', cd: '3 Turnos', desc: 'Arremessa uma densa esfera de plasma solar com flares giratórios.', ico: '🔥' },
      { name: 'Onda de Devastação', pow: 66, type: 'aoe', animKey: 'flame_wave', cd: '5 Turnos', isUlt: true, desc: 'Tsunami de lava vulcânica que nasce do herói e se expande varrendo todos os oponentes.', ico: '🌋' }
    ]
  },
  wind: {
    id: 'wind',
    baseName: 'Yas do Vento',
    awakenedName: 'Zephira (Tempestade Sagrada)',
    role: 'VELOCISTA & ATACANTE RÁPIDA',
    element: 'wind',
    grade: 5,
    level: 40,
    hp: 8800,
    atk: 810,
    def: 580,
    speed: 122,
    critRate: 25,
    critDmg: 60,
    res: 20,
    acc: 35,
    color: '#19ff85',
    hex: 0x19ff85,
    hairColor: [30, 255, 130],
    stripeColor: '#44ffaa',
    awakened: false,
    skills: [
      { name: 'Lâmina Sônica', pow: 35, type: 'strike', animKey: 'strike', cd: 'PASSIVO', desc: 'Corte relâmpago que rompe a barreira do som.', ico: '⚔️' },
      { name: 'Vórtice Cortante', pow: 50, type: 'magic', animKey: 'wind_gust', cd: '3 Turnos', desc: 'Rajadas de vento em espiral que dilaceram a resistência inimiga.', ico: '🌪️' },
      { name: 'Relâmpago Esmagador', pow: 74, type: 'magic', animKey: 'purple_lightning', cd: '4 Turnos', isUlt: true, desc: 'Invoca uma descarga colossal de plasma celestial do firmamento ao solo.', ico: '⚡' }
    ]
  }
};

export const INITIAL_ENEMIES: EnemyConfig[] = [
  { id: 'e1', name: 'Guardião do Fogo', element: 'fire', hp: 8600, maxHp: 8600, atk: 480, speed: 105, color: 0xff4422, pos: [-1.45, 0.35, -2.2] },
  { id: 'e2', name: 'Lorde Esqueleto', element: 'water', hp: 11200, maxHp: 11200, atk: 560, speed: 96, color: 0x3399ff, pos: [0.00, 0.35, -3.1] },
  { id: 'e3', name: 'Guardião Tempestade', element: 'wind', hp: 8900, maxHp: 8900, atk: 510, speed: 112, color: 0x33ff99, pos: [1.45, 0.35, -2.2] }
];

export const HERO_POSITIONS: [number, number, number][] = [
  [-1.45, 0.35, 2.2], // Slot 0: Esquerda (Vanguarda)
  [0.00, 0.35, 3.1],  // Slot 1: Centro (Líder)
  [1.45, 0.35, 2.2]   // Slot 2: Direita (Suporte)
];
