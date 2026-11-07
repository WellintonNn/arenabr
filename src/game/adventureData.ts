import { WorldConfig, WorldId, StageConfig, EnemyConfig } from '../types/game';

export const WORLDS_DATA: Record<WorldId, WorldConfig> = {
  forest: {
    id: 'forest',
    name: 'Floresta do Éter',
    subtitle: 'Mundo 1 — Bosque Ancestral',
    themeColor: '#19ff85',
    bgGradient: 'from-emerald-950 via-[#071d14] to-[#030d09]',
    fogColor: 0x274959,
    groundColor: 0x2c4e28,
    stages: [
      {
        id: 'forest-1',
        worldId: 'forest',
        stageNumber: 1,
        name: 'Borda do Bosque',
        desc: 'Esqueletos batedores e espíritos rúnicos despertam na orla da floresta.',
        isBoss: false,
        energyCost: 4,
        recommendedLevel: 10,
        expReward: 450,
        crystalsReward: 10,
        essenceReward: 'Essência de Magia Baixa',
        enemies: [
          { id: 'f1_e1', name: 'Esqueleto Caçador', element: 'wind', hp: 4200, maxHp: 4200, atk: 480, speed: 95, color: 0x44ffaa, pos: [-1.45, 0.38, -2.5] },
          { id: 'f1_e2', name: 'Guarda da Floresta', element: 'water', hp: 4900, maxHp: 4900, atk: 510, speed: 100, color: 0x00d9ff, pos: [0.0, 0.38, -3.9] },
          { id: 'f1_e3', name: 'Lobo das Folhas', element: 'fire', hp: 4400, maxHp: 4400, atk: 540, speed: 102, color: 0xff4422, pos: [1.45, 0.38, -2.5] }
        ]
      },
      {
        id: 'forest-2',
        worldId: 'forest',
        stageNumber: 2,
        name: 'Clareira dos Cristais',
        desc: 'Cristais elementais ressoam atraindo criaturas corrompidas pelo Éter.',
        isBoss: false,
        energyCost: 4,
        recommendedLevel: 15,
        expReward: 620,
        crystalsReward: 15,
        essenceReward: 'Essência de Magia Média',
        enemies: [
          { id: 'f2_e1', name: 'Espírito Cristalino', element: 'water', hp: 5500, maxHp: 5500, atk: 560, speed: 98, color: 0x00d9ff, pos: [-1.45, 0.38, -2.5] },
          { id: 'f2_e2', name: 'Sentinela do Éter', element: 'fire', hp: 6100, maxHp: 6100, atk: 620, speed: 104, color: 0xff3b14, pos: [0.0, 0.38, -3.9] },
          { id: 'f2_e3', name: 'Guerreiro Musgoso', element: 'wind', hp: 5800, maxHp: 5800, atk: 590, speed: 96, color: 0x19ff85, pos: [1.45, 0.38, -2.5] }
        ]
      },
      {
        id: 'forest-3',
        worldId: 'forest',
        stageNumber: 3,
        name: 'Ruínas Druídicas',
        desc: 'Monólitos sagrados esquecidos guardados por guerreiros reanimados.',
        isBoss: false,
        energyCost: 5,
        recommendedLevel: 22,
        expReward: 850,
        crystalsReward: 20,
        essenceReward: 'Essência de Vento Média',
        enemies: [
          { id: 'f3_e1', name: 'Druida Espectral', element: 'wind', hp: 6900, maxHp: 6900, atk: 680, speed: 108, color: 0x19ff85, pos: [-1.45, 0.38, -2.5] },
          { id: 'f3_e2', name: 'Gárgula de Pedra', element: 'water', hp: 7600, maxHp: 7600, atk: 710, speed: 102, color: 0x00bfff, pos: [0.0, 0.38, -3.9] },
          { id: 'f3_e3', name: 'Feiticeiro Feral', element: 'fire', hp: 7200, maxHp: 7200, atk: 750, speed: 110, color: 0xff4d1a, pos: [1.45, 0.38, -2.5] }
        ]
      },
      {
        id: 'forest-4',
        worldId: 'forest',
        stageNumber: 4,
        name: 'Bosque Sagrado',
        desc: 'A energia da floresta se agita violentamente antes do santuário do titã.',
        isBoss: false,
        energyCost: 5,
        recommendedLevel: 30,
        expReward: 1100,
        crystalsReward: 25,
        essenceReward: 'Essência de Magia Alta',
        enemies: [
          { id: 'f4_e1', name: 'Vanguarda das Sombras', element: 'fire', hp: 8600, maxHp: 8600, atk: 840, speed: 112, color: 0xff3b14, pos: [-1.45, 0.38, -2.5] },
          { id: 'f4_e2', name: 'Campeão da Floresta', element: 'wind', hp: 9400, maxHp: 9400, atk: 890, speed: 115, color: 0x19ff85, pos: [0.0, 0.38, -3.9] },
          { id: 'f4_e3', name: 'Assassino Silencioso', element: 'water', hp: 8900, maxHp: 8900, atk: 860, speed: 118, color: 0x00e1ff, pos: [1.45, 0.38, -2.5] }
        ]
      },
      {
        id: 'forest-5',
        worldId: 'forest',
        stageNumber: 5,
        name: 'Santuário do Guardião',
        desc: 'O gigante despertar ancestral exige toda a maestria dos invocadores!',
        isBoss: true,
        energyCost: 6,
        recommendedLevel: 35,
        expReward: 2200,
        crystalsReward: 50,
        essenceReward: 'Essência de Magia Suprema',
        enemies: [
          { id: 'f5_e1', name: 'Raiz Protetora', element: 'water', hp: 7500, maxHp: 7500, atk: 680, speed: 100, color: 0x00b4d8, pos: [-1.6, 0.38, -2.2] },
          { id: 'f5_boss', name: 'GUARDIÃO ANCESTRAL', element: 'wind', hp: 24000, maxHp: 24000, atk: 1250, speed: 112, color: 0x00ff88, pos: [0.0, 0.5, -4.2], isBoss: true, scale: 2.1 },
          { id: 'f5_e3', name: 'Raiz Ígnea', element: 'fire', hp: 7500, maxHp: 7500, atk: 720, speed: 104, color: 0xff5400, pos: [1.6, 0.38, -2.2] }
        ]
      }
    ]
  },
  desert: {
    id: 'desert',
    name: 'Dunas de Shurima',
    subtitle: 'Mundo 2 — Deserto Arcano',
    themeColor: '#ffaa00',
    bgGradient: 'from-amber-950 via-[#261505] to-[#120701]',
    fogColor: 0x4a3219,
    groundColor: 0x8b6534,
    stages: [
      {
        id: 'desert-1',
        worldId: 'desert',
        stageNumber: 1,
        name: 'Oásis Esquecido',
        desc: 'Bandos de escorpiões e nômades emboscam viajantes nas areias escaldantes.',
        isBoss: false,
        energyCost: 5,
        recommendedLevel: 25,
        expReward: 900,
        crystalsReward: 15,
        essenceReward: 'Essência de Fogo Baixa',
        enemies: [
          { id: 'd1_e1', name: 'Nômade das Areias', element: 'fire', hp: 7800, maxHp: 7800, atk: 760, speed: 106, color: 0xff6600, pos: [-1.45, 0.38, -2.5] },
          { id: 'd1_e2', name: 'Escorpião Dourado', element: 'wind', hp: 8400, maxHp: 8400, atk: 790, speed: 110, color: 0x33ff88, pos: [0.0, 0.38, -3.9] },
          { id: 'd1_e3', name: 'Ladino do Oásis', element: 'water', hp: 8100, maxHp: 8100, atk: 780, speed: 104, color: 0x00b4d8, pos: [1.45, 0.38, -2.5] }
        ]
      },
      {
        id: 'desert-2',
        worldId: 'desert',
        stageNumber: 2,
        name: 'Garganta Seca',
        desc: 'Desfiladeiro rochoso onde os ecos da miragem confundem o combate.',
        isBoss: false,
        energyCost: 5,
        recommendedLevel: 28,
        expReward: 1050,
        crystalsReward: 20,
        essenceReward: 'Essência de Fogo Média',
        enemies: [
          { id: 'd2_e1', name: 'Serpente da Poeira', element: 'wind', hp: 8900, maxHp: 8900, atk: 820, speed: 112, color: 0x22ee77, pos: [-1.45, 0.38, -2.5] },
          { id: 'd2_e2', name: 'Guerreiro de Cobre', element: 'fire', hp: 9600, maxHp: 9600, atk: 860, speed: 108, color: 0xff4500, pos: [0.0, 0.38, -3.9] },
          { id: 'd2_e3', name: 'Espectro da Areia', element: 'water', hp: 9100, maxHp: 9100, atk: 840, speed: 114, color: 0x0096c7, pos: [1.45, 0.38, -2.5] }
        ]
      },
      {
        id: 'desert-3',
        worldId: 'desert',
        stageNumber: 3,
        name: 'Templo da Miragem',
        desc: 'Colunas de pedra esculpida pelo vento que escondem múmias milenares.',
        isBoss: false,
        energyCost: 6,
        recommendedLevel: 32,
        expReward: 1300,
        crystalsReward: 25,
        essenceReward: 'Essência de Magia Média',
        enemies: [
          { id: 'd3_e1', name: 'Guardião da Tumba', element: 'fire', hp: 10200, maxHp: 10200, atk: 920, speed: 110, color: 0xff3b00, pos: [-1.45, 0.38, -2.5] },
          { id: 'd3_e2', name: 'Múmia Encantada', element: 'wind', hp: 11000, maxHp: 11000, atk: 950, speed: 106, color: 0x10e870, pos: [0.0, 0.38, -3.9] },
          { id: 'd3_e3', name: 'Sacerdote Solar', element: 'water', hp: 10400, maxHp: 10400, atk: 980, speed: 116, color: 0x0077b6, pos: [1.45, 0.38, -2.5] }
        ]
      },
      {
        id: 'desert-4',
        worldId: 'desert',
        stageNumber: 4,
        name: 'Dunas do Escorpião',
        desc: 'Tempestades de areia dourada onde o próprio solo treme.',
        isBoss: false,
        energyCost: 6,
        recommendedLevel: 36,
        expReward: 1600,
        crystalsReward: 30,
        essenceReward: 'Essência de Fogo Alta',
        enemies: [
          { id: 'd4_e1', name: 'Centurião do Deserto', element: 'water', hp: 11800, maxHp: 11800, atk: 1020, speed: 112, color: 0x0096c7, pos: [-1.45, 0.38, -2.5] },
          { id: 'd4_e2', name: 'Lorde das Dunas', element: 'fire', hp: 12600, maxHp: 12600, atk: 1080, speed: 118, color: 0xff2200, pos: [0.0, 0.38, -3.9] },
          { id: 'd4_e3', name: 'Lâmina do Sol', element: 'wind', hp: 12100, maxHp: 12100, atk: 1050, speed: 120, color: 0x20df75, pos: [1.45, 0.38, -2.5] }
        ]
      },
      {
        id: 'desert-5',
        worldId: 'desert',
        stageNumber: 5,
        name: 'Túmulo do Titã',
        desc: 'O colossal Titã das Areias Negras ressurge empunhando o calor do Éter.',
        isBoss: true,
        energyCost: 7,
        recommendedLevel: 40,
        expReward: 2900,
        crystalsReward: 60,
        essenceReward: 'Essência de Fogo Suprema',
        enemies: [
          { id: 'd5_e1', name: 'Verme Solar', element: 'wind', hp: 9500, maxHp: 9500, atk: 860, speed: 105, color: 0x19ff85, pos: [-1.6, 0.38, -2.2] },
          { id: 'd5_boss', name: 'TITÃ DAS AREIAS NEGRAS', element: 'fire', hp: 32000, maxHp: 32000, atk: 1550, speed: 116, color: 0xff3b14, pos: [0.0, 0.5, -4.2], isBoss: true, scale: 2.15 },
          { id: 'd5_e3', name: 'Golpeador Férreo', element: 'water', hp: 9500, maxHp: 9500, atk: 890, speed: 108, color: 0x00d9ff, pos: [1.6, 0.38, -2.2] }
        ]
      }
    ]
  },
  glacier: {
    id: 'glacier',
    name: 'Geleira de Nilfheim',
    subtitle: 'Mundo 3 — Glaciares Eternos',
    themeColor: '#00d9ff',
    bgGradient: 'from-cyan-950 via-[#031e2b] to-[#010c12]',
    fogColor: 0x102b3c,
    groundColor: 0x48768f,
    stages: [
      {
        id: 'glacier-1',
        worldId: 'glacier',
        stageNumber: 1,
        name: 'Fenda Gélida',
        desc: 'Ventos congelantes e lobos brancos rondam os desfiladeiros de gelo.',
        isBoss: false,
        energyCost: 6,
        recommendedLevel: 35,
        expReward: 1400,
        crystalsReward: 20,
        essenceReward: 'Essência de Água Baixa',
        enemies: [
          { id: 'g1_e1', name: 'Lobo Invernal', element: 'water', hp: 11200, maxHp: 11200, atk: 990, speed: 114, color: 0x00d9ff, pos: [-1.45, 0.38, -2.5] },
          { id: 'g1_e2', name: 'Esqueleto Congelado', element: 'wind', hp: 11900, maxHp: 11900, atk: 1020, speed: 112, color: 0x19ff85, pos: [0.0, 0.38, -3.9] },
          { id: 'g1_e3', name: 'Guerreiro da Geada', element: 'fire', hp: 11500, maxHp: 11500, atk: 1040, speed: 110, color: 0xff4500, pos: [1.45, 0.38, -2.5] }
        ]
      },
      {
        id: 'glacier-2',
        worldId: 'glacier',
        stageNumber: 2,
        name: 'Caverna de Cristais Azuis',
        desc: 'Estalactites de gelo ancestral que refletem magias com ferocidade.',
        isBoss: false,
        energyCost: 6,
        recommendedLevel: 38,
        expReward: 1650,
        crystalsReward: 25,
        essenceReward: 'Essência de Água Média',
        enemies: [
          { id: 'g2_e1', name: 'Golem de Neve', element: 'water', hp: 12800, maxHp: 12800, atk: 1080, speed: 108, color: 0x00b4d8, pos: [-1.45, 0.38, -2.5] },
          { id: 'g2_e2', name: 'Valkíria Gelada', element: 'fire', hp: 13400, maxHp: 13400, atk: 1140, speed: 120, color: 0xff3b14, pos: [0.0, 0.38, -3.9] },
          { id: 'g2_e3', name: 'Arqueiro da Nevasca', element: 'wind', hp: 12900, maxHp: 12900, atk: 1110, speed: 122, color: 0x22ff88, pos: [1.45, 0.38, -2.5] }
        ]
      },
      {
        id: 'glacier-3',
        worldId: 'glacier',
        stageNumber: 3,
        name: 'Pico Nevado',
        desc: 'Altitude extrema onde o ar é rarefeito e o frio congela armaduras.',
        isBoss: false,
        energyCost: 7,
        recommendedLevel: 42,
        expReward: 1950,
        crystalsReward: 30,
        essenceReward: 'Essência de Magia Alta',
        enemies: [
          { id: 'g3_e1', name: 'Guarda do Pico', element: 'wind', hp: 14200, maxHp: 14200, atk: 1200, speed: 116, color: 0x19ff85, pos: [-1.45, 0.38, -2.5] },
          { id: 'g3_e2', name: 'Cavaleiro Glacial', element: 'water', hp: 15100, maxHp: 15100, atk: 1250, speed: 114, color: 0x0077b6, pos: [0.0, 0.38, -3.9] },
          { id: 'g3_e3', name: 'Feiticeiro do Vento Branco', element: 'fire', hp: 14600, maxHp: 14600, atk: 1290, speed: 124, color: 0xff5400, pos: [1.45, 0.38, -2.5] }
        ]
      },
      {
        id: 'glacier-4',
        worldId: 'glacier',
        stageNumber: 4,
        name: 'Penhasco Uivante',
        desc: 'A fortaleza congelada do dragão lendário protege os limites do mundo.',
        isBoss: false,
        energyCost: 7,
        recommendedLevel: 46,
        expReward: 2300,
        crystalsReward: 35,
        essenceReward: 'Essência de Água Alta',
        enemies: [
          { id: 'g4_e1', name: 'Lorde do Gelo', element: 'fire', hp: 16200, maxHp: 16200, atk: 1350, speed: 122, color: 0xff3b14, pos: [-1.45, 0.38, -2.5] },
          { id: 'g4_e2', name: 'Paladino Congelado', element: 'water', hp: 17200, maxHp: 17200, atk: 1400, speed: 118, color: 0x00d9ff, pos: [0.0, 0.38, -3.9] },
          { id: 'g4_e3', name: 'General da Nevasca', element: 'wind', hp: 16800, maxHp: 16800, atk: 1380, speed: 126, color: 0x00ff88, pos: [1.45, 0.38, -2.5] }
        ]
      },
      {
        id: 'glacier-5',
        worldId: 'glacier',
        stageNumber: 5,
        name: 'Covil do Dragão de Gelo',
        desc: 'O Dragão do Gelo Profundo exala nevasca absoluta e devora invasores.',
        isBoss: true,
        energyCost: 8,
        recommendedLevel: 50,
        expReward: 3800,
        crystalsReward: 80,
        essenceReward: 'Essência de Água Suprema',
        enemies: [
          { id: 'g5_e1', name: 'Pilar de Cristal', element: 'fire', hp: 12000, maxHp: 12000, atk: 1050, speed: 110, color: 0xff5400, pos: [-1.6, 0.38, -2.2] },
          { id: 'g5_boss', name: 'DRAGÃO DO GELO PROFUNDO', element: 'water', hp: 40000, maxHp: 40000, atk: 1850, speed: 120, color: 0x00d9ff, pos: [0.0, 0.5, -4.2], isBoss: true, scale: 2.25 },
          { id: 'g5_e3', name: 'Pilar Glacial', element: 'wind', hp: 12000, maxHp: 12000, atk: 1090, speed: 112, color: 0x19ff85, pos: [1.6, 0.38, -2.2] }
        ]
      }
    ]
  },
  volcano: {
    id: 'volcano',
    name: 'Caldeira de Tártaro',
    subtitle: 'Mundo 4 — Vulcão Infernal',
    themeColor: '#ff3b14',
    bgGradient: 'from-red-950 via-[#260500] to-[#0d0100]',
    fogColor: 0x3d0d04,
    groundColor: 0x1f1412,
    stages: [
      {
        id: 'volcano-1',
        worldId: 'volcano',
        stageNumber: 1,
        name: 'Fissura de Basalto',
        desc: 'Fendas incandescentes de onde brotam demônios de cinza e magma.',
        isBoss: false,
        energyCost: 7,
        recommendedLevel: 45,
        expReward: 2000,
        crystalsReward: 25,
        essenceReward: 'Essência de Fogo Média',
        enemies: [
          { id: 'v1_e1', name: 'Demônio de Cinza', element: 'fire', hp: 15500, maxHp: 15500, atk: 1320, speed: 118, color: 0xff3b14, pos: [-1.45, 0.38, -2.5] },
          { id: 'v1_e2', name: 'Cavaleiro Vulcânico', element: 'wind', hp: 16200, maxHp: 16200, atk: 1360, speed: 115, color: 0x19ff85, pos: [0.0, 0.38, -3.9] },
          { id: 'v1_e3', name: 'Cão de Fogo', element: 'water', hp: 15800, maxHp: 15800, atk: 1390, speed: 122, color: 0x00d9ff, pos: [1.45, 0.38, -2.5] }
        ]
      },
      {
        id: 'volcano-2',
        worldId: 'volcano',
        stageNumber: 2,
        name: 'Rio de Magma',
        desc: 'Lava fervente cortando o campo de batalha, ampliando o poder de fogo.',
        isBoss: false,
        energyCost: 7,
        recommendedLevel: 48,
        expReward: 2400,
        crystalsReward: 30,
        essenceReward: 'Essência de Fogo Alta',
        enemies: [
          { id: 'v2_e1', name: 'Salamandra de Lava', element: 'water', hp: 17200, maxHp: 17200, atk: 1450, speed: 120, color: 0x00b4d8, pos: [-1.45, 0.38, -2.5] },
          { id: 'v2_e2', name: 'Lorde da Fumaça', element: 'fire', hp: 18100, maxHp: 18100, atk: 1520, speed: 124, color: 0xff4500, pos: [0.0, 0.38, -3.9] },
          { id: 'v2_e3', name: 'Espírito Incandescente', element: 'wind', hp: 17500, maxHp: 17500, atk: 1480, speed: 128, color: 0x22ee77, pos: [1.45, 0.38, -2.5] }
        ]
      },
      {
        id: 'volcano-3',
        worldId: 'volcano',
        stageNumber: 3,
        name: 'Forja dos Condenados',
        desc: 'Antigas forjas arcanas que forjavam as armas dos reis demoníacos.',
        isBoss: false,
        energyCost: 8,
        recommendedLevel: 52,
        expReward: 2900,
        crystalsReward: 35,
        essenceReward: 'Essência de Magia Alta',
        enemies: [
          { id: 'v3_e1', name: 'Ferreiro do Inferno', element: 'wind', hp: 19500, maxHp: 19500, atk: 1600, speed: 122, color: 0x19ff85, pos: [-1.45, 0.38, -2.5] },
          { id: 'v3_e2', name: 'Colosso de Ferro', element: 'fire', hp: 21000, maxHp: 21000, atk: 1680, speed: 116, color: 0xff2200, pos: [0.0, 0.38, -3.9] },
          { id: 'v3_e3', name: 'Guarda da Forja', element: 'water', hp: 20000, maxHp: 20000, atk: 1640, speed: 126, color: 0x0096c7, pos: [1.45, 0.38, -2.5] }
        ]
      },
      {
        id: 'volcano-4',
        worldId: 'volcano',
        stageNumber: 4,
        name: 'Cratera Fumegante',
        desc: 'O ponto de maior pressão tectônica do tártaro, prenúncio da destruição.',
        isBoss: false,
        energyCost: 8,
        recommendedLevel: 56,
        expReward: 3500,
        crystalsReward: 40,
        essenceReward: 'Essência de Fogo Alta',
        enemies: [
          { id: 'v4_e1', name: 'Arquidemônio', element: 'water', hp: 22500, maxHp: 22500, atk: 1780, speed: 128, color: 0x00d9ff, pos: [-1.45, 0.38, -2.5] },
          { id: 'v4_e2', name: 'General da Caldeira', element: 'fire', hp: 24000, maxHp: 24000, atk: 1850, speed: 130, color: 0xff1100, pos: [0.0, 0.38, -3.9] },
          { id: 'v4_e3', name: 'Têmpora Ígnea', element: 'wind', hp: 23000, maxHp: 23000, atk: 1820, speed: 132, color: 0x00ff88, pos: [1.45, 0.38, -2.5] }
        ]
      },
      {
        id: 'volcano-5',
        worldId: 'volcano',
        stageNumber: 5,
        name: 'Trono do Senhor da Caldeira',
        desc: 'O ápice da fúria vulcânica! O Lorde Supremo das Chamas aguarda no trono de rocha fundida.',
        isBoss: true,
        energyCost: 9,
        recommendedLevel: 60,
        expReward: 5500,
        crystalsReward: 120,
        essenceReward: 'Essência de Fogo Suprema',
        enemies: [
          { id: 'v5_e1', name: 'Núcleo de Magma', element: 'water', hp: 16000, maxHp: 16000, atk: 1350, speed: 120, color: 0x00b4d8, pos: [-1.6, 0.38, -2.2] },
          { id: 'v5_boss', name: 'SENHOR DA CALDEIRA', element: 'fire', hp: 50000, maxHp: 50000, atk: 2200, speed: 128, color: 0xff0000, pos: [0.0, 0.6, -4.2], isBoss: true, scale: 2.35 },
          { id: 'v5_e3', name: 'Núcleo das Cinzas', element: 'wind', hp: 16000, maxHp: 16000, atk: 1380, speed: 124, color: 0x19ff85, pos: [1.6, 0.38, -2.2] }
        ]
      }
    ]
  }
};
