/**
 * interpretation.js
 * Motor de interpretação dinâmico baseado em scores reais.
 * Gera perfil, insights de threshold e descrições de intensidade.
 */

// ---------------------------------------------------------------------------
// generateProfile
// ---------------------------------------------------------------------------

/**
 * Processa scores brutos e retorna metadados de perfil estruturados.
 * Não depende de dados estáticos — tudo calculado dos scores reais.
 *
 * @param {{ S: number, C: number, M: number, F: number }} scores - scores brutos (pré-normalização)
 * @returns {Object} profileMeta
 */
export function generateProfile(scores) {
  // 1. Normalizar para percentuais (apenas valores positivos contam)
  const raw = {};
  Object.keys(scores).forEach(k => { raw[k] = Math.max(0, scores[k]); });
  const positiveTotal = Object.values(raw).reduce((a, b) => a + b, 0) || 1;

  const pct = {};
  Object.keys(raw).forEach(k => { pct[k] = Math.round((raw[k] / positiveTotal) * 100); });

  // Ajuste para garantir soma = 100
  const diff = 100 - Object.values(pct).reduce((a, b) => a + b, 0);
  if (diff !== 0) {
    const largest = Object.keys(pct).reduce((a, b) => pct[a] > pct[b] ? a : b);
    pct[largest] += diff;
  }

  // 2. Ordenar por percentual decrescente
  const sorted = Object.keys(pct).sort((a, b) => pct[b] - pct[a]);
  const [dominant, secondary, third, fourth] = sorted;

  // 3. Calcular métricas de intensidade
  const intensity = pct[dominant];
  const gap = pct[dominant] - pct[secondary];

  // 4. profileKey canônico (sempre maior primeiro para lookup)
  const profileKey = `${dominant}${secondary}`;

  // 5. Classificação do gap (quão isolado está o dominante)
  let gapType;
  if (gap >= 20) gapType = 'isolado';       // dominante muito claro
  else if (gap >= 10) gapType = 'definido'; // combinação clara
  else gapType = 'misto';                   // perfil híbrido equilibrado

  return { pct, sorted, dominant, secondary, third, fourth, intensity, gap, gapType, profileKey };
}

// ---------------------------------------------------------------------------
// generateInsights
// ---------------------------------------------------------------------------

/**
 * Gera insights comportamentais específicos baseados em thresholds percentuais.
 * Retorna array de strings prontas para exibição.
 * NÃO são genéricos — cada insight é condicional e específico.
 *
 * @param {{ S: number, C: number, M: number, F: number }} pct - percentuais normalizados
 * @returns {string[]} lista de insights ativos para este perfil
 */
export function generateInsights(pct) {
  const insights = [];

  // --- COLÉRICO ---
  if (pct.C >= 60) {
    insights.push('Colérico acima de 60%: tendência a assumir controle antes de validar alinhamento com o grupo — decisões rápidas com custo relacional frequentemente ignorado.');
  } else if (pct.C >= 45) {
    insights.push('Colérico relevante: presença de orientação a resultado que pode gerar impaciência visível quando o ritmo do grupo não acompanha.');
  }

  if (pct.C >= 50 && pct.F < 20) {
    insights.push('Alta energia diretiva combinada com baixa tolerância à passividade: ambientes lentos ou indecisivos provavelmente geram reação de controle ou abandono.');
  }

  // --- MELANCÓLICO ---
  if (pct.M >= 55) {
    insights.push('Melancólico acima de 55%: autocrítica elevada e padrão de exigência que se aplica tanto ao trabalho próprio quanto ao dos outros — perfeccionismo com custo energético real.');
  } else if (pct.M >= 40) {
    insights.push('Traço melancólico relevante: análise detalhada como modo padrão de processamento, com tendência a prolongar decisões quando as variáveis não estão totalmente mapeadas.');
  }

  if (pct.M >= 50 && pct.S < 20) {
    insights.push('Introspecção alta com baixa expressividade espontânea: necessidades emocionais raramente verbalizadas — o que pode criar expectativas implícitas nas relações.');
  }

  // --- SANGUÍNEO ---
  if (pct.S >= 55) {
    insights.push('Sanguíneo acima de 55%: busca ativa por novidade e estímulo — ambientes repetitivos geram desengajamento progressivo, mesmo quando o trabalho é relevante.');
  } else if (pct.S >= 40) {
    insights.push('Traço sanguíneo presente: facilidade de conexão social e adaptação a contextos novos, com risco de dispersão em projetos que exigem foco sustentado.');
  }

  if (pct.S >= 50 && pct.M < 20) {
    insights.push('Alta expressividade combinada com baixa introspecção: reações emocionais rápidas e visíveis, com tendência a processar sentimentos em voz alta mais do que internamente.');
  }

  // --- FLEUMÁTICO ---
  if (pct.F >= 55) {
    insights.push('Fleumático acima de 55%: evitação estrutural de conflito — não apenas por preferência, mas como mecanismo de preservação de harmonia que pode adiar problemas reais.');
  } else if (pct.F >= 40) {
    insights.push('Traço fleumático relevante: consistência e confiabilidade como pontos fortes, mas com risco de inércia diante de mudanças que exigem iniciativa sem garantias.');
  }

  if (pct.F >= 50 && pct.C < 20) {
    insights.push('Alta tolerância à passividade combinada com baixa orientação a resultado: pode aceitar situações insatisfatórias por tempo prolongado antes de agir ou comunicar desconforto.');
  }

  // --- COMBINAÇÕES ESPECÍFICAS ---
  if (pct.C >= 40 && pct.M >= 35) {
    insights.push('Combinação Colérico–Melancólico ativa: expectativas altas aplicadas tanto a si mesmo quanto aos outros — padrão de exigência que pode isolar mesmo pessoas competentes.');
  }

  if (pct.S >= 40 && pct.F >= 35) {
    insights.push('Combinação Sanguíneo–Fleumático: orientação social alta com baixa confrontação — boa em criar conexões, mas pode sacrificar honestidade para preservar o relacionamento.');
  }

  if (pct.M >= 40 && pct.F >= 35) {
    insights.push('Combinação Melancólico–Fleumático: análise prolongada somada à evitação de conflito cria risco real de paralisia decisória em situações de pressão interpessoal.');
  }

  // --- THRESHOLDS BAIXOS (reverso) ---
  if (pct.F < 15) {
    insights.push('Fleumático muito baixo (abaixo de 15%): baixa tolerância a lentidão e indecisão — ambientes sem ritmo definido geram frustração desproporcional.');
  }

  if (pct.S < 15) {
    insights.push('Sanguíneo muito baixo: ambientes sociais de alta demanda são provavelmente desgastantes — introversão funcional que pode ser mal interpretada como frieza ou distância.');
  }

  if (pct.C < 15) {
    insights.push('Colérico muito baixo: tendência a evitar posições de liderança mesmo quando competência está presente — dificuldade de sustentar assertividade sob pressão externa.');
  }

  if (pct.M < 15) {
    insights.push('Melancólico muito baixo: pouca tendência à análise detalhada e autocrítica — pode tomar decisões rápidas com dados insuficientes sem perceber o risco.');
  }

  // Limite máximo de insights exibidos para não sobrecarregar
  return insights.slice(0, 5);
}

// ---------------------------------------------------------------------------
// describeIntensity
// ---------------------------------------------------------------------------

/**
 * Gera descrição textual da intensidade de um temperamento com base no percentual.
 *
 * @param {number} value - percentual (0–100)
 * @param {'S'|'C'|'M'|'F'} type - temperamento
 * @returns {{ label: string, description: string, level: 'dominant'|'relevant'|'moderate' }}
 */
export function describeIntensity(value, type) {
  const labels = {
    S: 'Sanguíneo',
    C: 'Colérico',
    M: 'Melancólico',
    F: 'Fleumático',
  };

  const descriptions = {
    dominant: {
      S: 'Traço dominante forte: expressividade, impulsividade social e busca por novidade definem seu modo padrão de operar.',
      C: 'Traço dominante forte: orientação a resultado, controle e velocidade de decisão são seus padrões de resposta mais automáticos.',
      M: 'Traço dominante forte: análise, profundidade e exigência de qualidade são os filtros pelos quais você processa a maioria das situações.',
      F: 'Traço dominante forte: estabilidade, previsibilidade e evitação de conflito são os eixos centrais do seu comportamento habitual.',
    },
    relevant: {
      S: 'Presença relevante: expressividade e sociabilidade aparecem com frequência, especialmente em contextos de baixa pressão.',
      C: 'Presença relevante: orientação a resultado e assertividade emergem com clareza em situações de decisão ou liderança.',
      M: 'Presença relevante: análise detalhada e autocrítica aparecem consistentemente, especialmente em trabalho e decisões importantes.',
      F: 'Presença relevante: tendência à estabilidade e harmonia é perceptível, especialmente em contextos relacionais.',
    },
    moderate: {
      S: 'Traço moderado: expressividade social presente mas não dominante — pode variar conforme o contexto e o nível de energia.',
      C: 'Traço moderado: assertividade presente mas não automática — tende a surgir em situações de alta pressão ou baixo resultado.',
      M: 'Traço moderado: tendência analítica presente mas equilibrada — não chega a gerar paralisia, mas influencia o ritmo de decisão.',
      F: 'Traço moderado: estabilidade presente mas não passiva — consegue agir e decidir sem precisar de consenso total.',
    },
  };

  let level;
  if (value >= 65) level = 'dominant';
  else if (value >= 40) level = 'relevant';
  else level = 'moderate';

  return {
    label: labels[type],
    description: descriptions[level][type],
    level,
    value,
  };
}
