export type ElementType = 'water' | 'fire' | 'wind';

export type WorldId = 'forest' | 'desert' | 'glacier' | 'volcano';

export interface SkillData {
  name: string;
  pow: number;
  type: 'strike' | 'magic' | 'aoe';
  animKey: 'strike' | 'water_jet' | 'ice_spear' | 'fireball' | 'flame_wave' | 'wind_gust' | 'purple_lightning';
  cd: string;
  isUlt?: boolean;
  desc: string;
  ico: string;
  level?: number;
  maxLevel?: number;
}

export interface RuneSlot {
  slot: number; // 1 a 6
  type: 'fatal' | 'blade' | 'swift' | 'energy';
  grade: number; // 1 a 6 estrelas
  plusLevel: number; // +0 a +15
  statMain: string;
  statVal: string;
  subStat?: string;
}

export interface HeroConfig {
  id: ElementType;
  baseName: string;
  awakenedName: string;
  role: string;
  element: ElementType;
  grade: number;
  level: number;
  hp: number;
  atk: number;
  def: number;
  speed: number;
  critRate: number;
  critDmg: number;
  res: number;
  acc: number;
  color: string;
  hex: number;
  hairColor: [number, number, number];
  stripeColor: string;
  awakened: boolean;
  skills: SkillData[];
  skillLevels?: number[]; // [lv1, lv2, lv3]
  equippedRunes?: Record<number, RuneSlot>;
}

export interface EnemyConfig {
  id: string;
  name: string;
  element: ElementType;
  hp: number;
  maxHp: number;
  atk: number;
  speed: number;
  color: number;
  pos: [number, number, number];
  isBoss?: boolean;
  scale?: number;
}

export interface StageConfig {
  id: string;
  worldId: WorldId;
  stageNumber: number; // 1 a 5
  name: string;
  desc: string;
  isBoss: boolean;
  energyCost: number;
  recommendedLevel: number;
  expReward: number;
  crystalsReward: number;
  essenceReward: string;
  enemies: EnemyConfig[];
}

export interface WorldConfig {
  id: WorldId;
  name: string;
  subtitle: string;
  themeColor: string;
  bgGradient: string;
  fogColor: number;
  groundColor: number;
  stages: StageConfig[];
}

export type ScreenState = 'title' | 'lobby' | 'heroes' | 'prep' | 'battle';
