import { ElementType, HeroConfig } from '../types/game';

export function getElementAdvantage(attackerElem: ElementType, defenderElem: ElementType): number {
  if (attackerElem === 'water' && defenderElem === 'fire') return 1.2;
  if (attackerElem === 'fire' && defenderElem === 'wind') return 1.2;
  if (attackerElem === 'wind' && defenderElem === 'water') return 1.2;

  if (attackerElem === 'fire' && defenderElem === 'water') return 0.85;
  if (attackerElem === 'wind' && defenderElem === 'fire') return 0.85;
  if (attackerElem === 'water' && defenderElem === 'wind') return 0.85;

  return 1.0;
}

export function calculateAwakenedStats(hero: HeroConfig) {
  const isAwakened = hero.awakened;
  return {
    hp: Math.round(hero.hp * (isAwakened ? 1.25 : 1)),
    atk: Math.round(hero.atk * (isAwakened ? 1.25 : 1)),
    def: hero.def,
    speed: hero.speed + (isAwakened ? 15 : 0),
    critRate: hero.critRate,
    critDmg: hero.critDmg,
    res: hero.res,
    acc: hero.acc,
    stars: isAwakened ? 6 : 5,
    starColor: isAwakened ? 'purple' : 'gold',
    displayName: isAwakened ? hero.awakenedName : hero.baseName
  };
}

export function calculateSkillDamage(
  attackerAtk: number,
  skillPow: number,
  attackerElem: ElementType,
  defenderElem: ElementType,
  isCrit: boolean = false,
  critDmgPercent: number = 50
): { damage: number; isCrit: boolean } {
  const elemFactor = getElementAdvantage(attackerElem, defenderElem);
  const baseDmg = (attackerAtk * 0.12) * skillPow * elemFactor;
  let finalDmg = Math.round(baseDmg);

  if (isCrit) {
    finalDmg = Math.round(finalDmg * (1 + critDmgPercent / 100));
  }

  return { damage: Math.max(1, finalDmg), isCrit };
}

export function calculateOrbDamage(heroAtk: number): number {
  return Math.max(1, Math.round(heroAtk * 0.38));
}

export function checkBattleState(
  livingHeroesCount: number,
  livingEnemiesCount: number
): 'playing' | 'victory' | 'defeat' {
  if (livingEnemiesCount <= 0) return 'victory';
  if (livingHeroesCount <= 0) return 'defeat';
  return 'playing';
}
