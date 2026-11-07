import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getElementAdvantage,
  calculateAwakenedStats,
  calculateSkillDamage,
  calculateOrbDamage,
  checkBattleState
} from './rules.ts';
import { HeroConfig } from '../types/game.ts';

const mockHero: HeroConfig = {
  id: 'water',
  baseName: 'Yas das Marés',
  awakenedName: 'Scylla',
  role: 'SUPORTE TÁTICO',
  element: 'water',
  grade: 5,
  level: 40,
  hp: 10000,
  atk: 1000,
  def: 600,
  speed: 100,
  critRate: 20,
  critDmg: 50,
  res: 30,
  acc: 20,
  color: '#00d9ff',
  hex: 0x00d9ff,
  hairColor: [20, 210, 255],
  stripeColor: '#00ffff',
  awakened: false,
  skills: []
};

test('Elemental advantage applies 1.2x on advantage and 0.85x on disadvantage', () => {
  assert.equal(getElementAdvantage('water', 'fire'), 1.2);
  assert.equal(getElementAdvantage('fire', 'wind'), 1.2);
  assert.equal(getElementAdvantage('wind', 'water'), 1.2);

  assert.equal(getElementAdvantage('fire', 'water'), 0.85);
  assert.equal(getElementAdvantage('wind', 'fire'), 0.85);
  assert.equal(getElementAdvantage('water', 'wind'), 0.85);

  assert.equal(getElementAdvantage('water', 'water'), 1.0);
});

test('calculateAwakenedStats increases HP/ATK by 25% and speed by 15 when awakened', () => {
  const base = calculateAwakenedStats(mockHero);
  assert.equal(base.hp, 10000);
  assert.equal(base.atk, 1000);
  assert.equal(base.speed, 100);
  assert.equal(base.stars, 5);
  assert.equal(base.starColor, 'gold');

  const awakened = calculateAwakenedStats({ ...mockHero, awakened: true });
  assert.equal(awakened.hp, 12500);
  assert.equal(awakened.atk, 1250);
  assert.equal(awakened.speed, 115);
  assert.equal(awakened.stars, 6);
  assert.equal(awakened.starColor, 'purple');
  assert.equal(awakened.displayName, 'Scylla');
});

test('calculateSkillDamage computes base and critical damage correctly', () => {
  const normal = calculateSkillDamage(1000, 30, 'water', 'fire', false);
  // 1000 * 0.12 * 30 * 1.2 = 4320
  assert.equal(normal.damage, 4320);

  const crit = calculateSkillDamage(1000, 30, 'water', 'fire', true, 50);
  // 4320 * 1.5 = 6480
  assert.equal(crit.damage, 6480);
});

test('calculateOrbDamage provides accurate bonus elemental hit', () => {
  const dmg = calculateOrbDamage(1000);
  assert.equal(dmg, 380);
});

test('checkBattleState detects victory, defeat, or ongoing combat', () => {
  assert.equal(checkBattleState(3, 3), 'playing');
  assert.equal(checkBattleState(3, 0), 'victory');
  assert.equal(checkBattleState(0, 2), 'defeat');
});
