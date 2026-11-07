export type ElementType = 'water' | 'fire' | 'wind';

export interface SkillData {
  name: string;
  pow: number;
  type: 'strike' | 'magic' | 'aoe';
  animKey: 'strike' | 'water_jet' | 'ice_spear' | 'fireball' | 'flame_wave' | 'wind_gust' | 'purple_lightning';
  cd: string;
  isUlt?: boolean;
  desc: string;
  ico: string;
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
}

export type ScreenState = 'lobby' | 'heroes' | 'prep' | 'battle';
