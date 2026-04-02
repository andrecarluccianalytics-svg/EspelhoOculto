// S = Sanguíneo, C = Colérico, M = Melancólico, F = Fleumático
// Weights: positive = score given when user agrees, negative = score deducted

export const TEMPERAMENTS = {
  S: { name: 'Sanguíneo', color: '#FFD54F', darkColor: '#F9A825', lightColor: '#FFF8E1', bgClass: 'sang', label: 'Amarelo' },
  C: { name: 'Colérico',  color: '#E53935', darkColor: '#B71C1C', lightColor: '#FFEBEE', bgClass: 'col',  label: 'Vermelho' },
  M: { name: 'Melancólico', color: '#1E88E5', darkColor: '#0D47A1', lightColor: '#E3F2FD', bgClass: 'mel', label: 'Azul' },
  F: { name: 'Fleumático', color: '#43A047', darkColor: '#1B5E20', lightColor: '#E8F5E9', bgClass: 'fleu', label: 'Verde' },
};

// Score map: answer index (0-3) → raw value
export const SCORE_MAP = [-2, -1, 1, 2];

// Type: 'scale' = 4-option Likert, 'forced' = binary A/B choice
export const QUESTIONS = [
  // --- BLOCO 1: DECISÃO ---
  {
    id: 1,
    type: 'scale',
    text: 'Tomo decisões com rapidez, mesmo com informações incompletas.',
    category: 'decisão',
    weights: { S: 1, C: 2, M: -2, F: -1 },
  },
  {
    id: 2,
    type: 'scale',
    text: 'Antes de agir, preciso entender todos os riscos envolvidos.',
    category: 'decisão',
    weights: { S: -1, C: -2, M: 2, F: 1 },
  },
  {
    id: 3,
    type: 'scale',
    text: 'Quando estou convicto de algo, dificilmente mudo de posição por pressão externa.',
    category: 'decisão',
    weights: { S: -1, C: 2, M: 1, F: -1 },
  },
  {
    id: 4,
    type: 'scale',
    text: 'Prefiro esperar um consenso do grupo antes de seguir em frente.',
    category: 'decisão',
    weights: { S: 1, C: -2, M: -1, F: 2 },
  },

  // --- BLOCO 2: SOCIAL ---
  {
    id: 5,
    type: 'scale',
    text: 'Ambientes sociais me energizam — quanto mais gente, melhor me sinto.',
    category: 'social',
    weights: { S: 2, C: 1, M: -2, F: -1 },
  },
  {
    id: 6,
    type: 'scale',
    text: 'Converso facilmente com desconhecidos e raramente me sinto desconfortável socialmente.',
    category: 'social',
    weights: { S: 2, C: 1, M: -2, F: -1 },
  },
  {
    id: 7,
    type: 'scale',
    text: 'Prefiro conversas profundas com uma pessoa do que bate-papo superficial com muitas.',
    category: 'social',
    weights: { S: -2, C: -1, M: 2, F: 1 },
  },
  {
    id: 8,
    type: 'scale',
    text: 'Costumo ser o centro das atenções e isso não me incomoda.',
    category: 'social',
    weights: { S: 2, C: 1, M: -2, F: -2 },
  },

  // --- BLOCO 3: EMOÇÃO ---
  {
    id: 9,
    type: 'scale',
    text: 'Minha expressão emocional é intensa — as pessoas percebem claramente o que estou sentindo.',
    category: 'emoção',
    weights: { S: 2, C: 1, M: 1, F: -2 },
  },
  {
    id: 10,
    type: 'scale',
    text: 'Tenho dificuldade de lidar com críticas — elas me afetam por mais tempo do que gostaria.',
    category: 'emoção',
    weights: { S: 1, C: -1, M: 2, F: -1 },
  },
  {
    id: 11,
    type: 'scale',
    text: 'Consigo manter a calma em situações de alta pressão que desestabilizam outros.',
    category: 'emoção',
    weights: { S: -1, C: 1, M: -1, F: 2 },
  },
  {
    id: 12,
    type: 'scale',
    text: 'Meu humor muda com frequência ao longo do dia, dependendo do contexto.',
    category: 'emoção',
    weights: { S: 2, C: 0, M: 1, F: -2 },
  },

  // --- BLOCO 4: TRABALHO ---
  {
    id: 13,
    type: 'scale',
    text: 'Prefiro liderar um projeto a ser apenas executor de tarefas definidas por outros.',
    category: 'trabalho',
    weights: { S: 1, C: 2, M: 0, F: -2 },
  },
  {
    id: 14,
    type: 'scale',
    text: 'Trabalho melhor com prazos rígidos — a pressão aumenta meu foco.',
    category: 'trabalho',
    weights: { S: 1, C: 2, M: 0, F: -1 },
  },
  {
    id: 15,
    type: 'scale',
    text: 'Sou perfeccionista: entrego tarde a um trabalho medíocre.',
    category: 'trabalho',
    weights: { S: -1, C: -1, M: 2, F: 1 },
  },
  {
    id: 16,
    type: 'scale',
    text: 'Consigo manter alta produtividade mesmo em rotinas repetitivas e previsíveis.',
    category: 'trabalho',
    weights: { S: -2, C: -1, M: 1, F: 2 },
  },

  // --- BLOCO 5: RELACIONAMENTOS ---
  {
    id: 17,
    type: 'scale',
    text: 'Faço amizades rapidamente, mas tenho poucos amigos verdadeiramente próximos.',
    category: 'relacionamentos',
    weights: { S: 2, C: 0, M: -1, F: -1 },
  },
  {
    id: 18,
    type: 'scale',
    text: 'Tenho expectativas altas sobre as pessoas — e me decepciono quando não são correspondidas.',
    category: 'relacionamentos',
    weights: { S: 0, C: 1, M: 2, F: -1 },
  },
  {
    id: 19,
    type: 'scale',
    text: 'Prefiro evitar conflitos a enfrentá-los diretamente, mesmo quando tenho razão.',
    category: 'relacionamentos',
    weights: { S: 1, C: -2, M: 0, F: 2 },
  },
  {
    id: 20,
    type: 'scale',
    text: 'Sou leal e consistente nos meus relacionamentos — as pessoas sabem com o que podem contar comigo.',
    category: 'relacionamentos',
    weights: { S: -1, C: 0, M: 1, F: 2 },
  },

  // --- BLOCO 6: MUDANÇA E ROTINA ---
  {
    id: 21,
    type: 'scale',
    text: 'Mudanças repentinas de planos me estressam significativamente.',
    category: 'mudança',
    weights: { S: -2, C: -1, M: 2, F: 1 },
  },
  {
    id: 22,
    type: 'scale',
    text: 'Me adapto rapidamente a ambientes novos e situações inesperadas.',
    category: 'mudança',
    weights: { S: 2, C: 1, M: -1, F: -1 },
  },
  {
    id: 23,
    type: 'scale',
    text: 'Rotina me dá segurança — gosto de saber o que esperar de cada dia.',
    category: 'mudança',
    weights: { S: -1, C: -1, M: 1, F: 2 },
  },
  {
    id: 24,
    type: 'scale',
    text: 'Busco ativamente novas experiências — a monotonia me incomoda profundamente.',
    category: 'mudança',
    weights: { S: 2, C: 1, M: -1, F: -2 },
  },

  // --- BLOCO 7: ESCOLHA FORÇADA (25–30) ---
  {
    id: 25,
    type: 'forced',
    text: 'Quando surge um problema urgente, você prefere:',
    optionA: { text: 'Agir imediatamente e corrigir no caminho', weights: { C: 2, S: 1 } },
    optionB: { text: 'Pensar com cuidado antes de dar qualquer passo', weights: { M: 2, F: 1 } },
    category: 'decisão',
  },
  {
    id: 26,
    type: 'forced',
    text: 'Em um grupo sem liderança definida, você tende a:',
    optionA: { text: 'Naturalmente assumir o controle e dar direção', weights: { C: 2, S: 1 } },
    optionB: { text: 'Adaptar-se ao que o grupo decide coletivamente', weights: { F: 2, M: 1 } },
    category: 'social',
  },
  {
    id: 27,
    type: 'forced',
    text: 'O que te motiva mais no dia a dia:',
    optionA: { text: 'Novidade, variedade e estímulos diferentes', weights: { S: 2, C: 1 } },
    optionB: { text: 'Estabilidade, previsibilidade e profundidade', weights: { F: 2, M: 1 } },
    category: 'mudança',
  },
  {
    id: 28,
    type: 'forced',
    text: 'O que te incomoda mais em um colega:',
    optionA: { text: 'Lentidão excessiva e falta de iniciativa', weights: { C: 2, S: 1 } },
    optionB: { text: 'Erros por pressa e descuido com detalhes', weights: { M: 2, F: 1 } },
    category: 'trabalho',
  },
  {
    id: 29,
    type: 'forced',
    text: 'Quando tem algo importante para comunicar:',
    optionA: { text: 'Prefere se expressar em voz alta — falar ajuda a organizar', weights: { S: 2, C: 1 } },
    optionB: { text: 'Prefere escrever ou refletir em silêncio antes de compartilhar', weights: { M: 2, F: 1 } },
    category: 'social',
  },
  {
    id: 30,
    type: 'forced',
    text: 'Sua maior inclinação natural é:',
    optionA: { text: 'Agir — momentum e resultados concretos', weights: { C: 2, S: 1 } },
    optionB: { text: 'Analisar — compreender fundo antes de mover', weights: { M: 2, F: 1 } },
    category: 'decisão',
  },
];

export const SCALE_OPTIONS = [
  { label: 'Discordo', value: 0 },
  { label: 'Discordo parcialmente', value: 1 },
  { label: 'Concordo parcialmente', value: 2 },
  { label: 'Concordo', value: 3 },
];
