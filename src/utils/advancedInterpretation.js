/**
 * advancedInterpretation.js
 *
 * Motor avançado de interpretação de temperamento.
 * Todas as funções recebem scores brutos { S, C, M, F } ou o objeto profile
 * retornado por buildProfile(), e retornam strings ou objetos prontos para exibição.
 *
 * NÃO duplica lógica de normalização de percentual — delega para buildProfile()
 * e consome pct diretamente nas demais funções.
 */

// ---------------------------------------------------------------------------
// Helpers internos
// ---------------------------------------------------------------------------

/** Normaliza scores brutos para percentuais inteiros que somam 100. */
function normalizeToPct(scores) {
  const raw = {};
  Object.keys(scores).forEach(k => { raw[k] = Math.max(0, scores[k]); });
  const total = Object.values(raw).reduce((a, b) => a + b, 0) || 1;

  const pct = {};
  Object.keys(raw).forEach(k => { pct[k] = Math.round((raw[k] / total) * 100); });

  // Garante soma = 100
  const diff = 100 - Object.values(pct).reduce((a, b) => a + b, 0);
  if (diff !== 0) {
    const largest = Object.keys(pct).reduce((a, b) => pct[a] > pct[b] ? a : b);
    pct[largest] += diff;
  }
  return pct;
}

// ---------------------------------------------------------------------------
// buildProfile
// ---------------------------------------------------------------------------

/**
 * Ordena temperamentos por valor e retorna metadados estruturados.
 *
 * @param {{ S: number, C: number, M: number, F: number }} scores - scores brutos
 * @returns {{
 *   pct: Object,
 *   sorted: string[],
 *   top: string,
 *   second: string,
 *   third: string,
 *   fourth: string,
 *   topValue: number,
 *   secondValue: number,
 *   gap: number,
 *   gapType: 'isolado'|'definido'|'misto'
 * }}
 */
export function buildProfile(scores) {
  const pct = normalizeToPct(scores);
  const sorted = Object.keys(pct).sort((a, b) => pct[b] - pct[a]);

  const [top, second, third, fourth] = sorted;
  const topValue    = pct[top];
  const secondValue = pct[second];
  const gap         = topValue - secondValue;

  let gapType;
  if (gap >= 20)      gapType = 'isolado';  // dominante muito acima dos demais
  else if (gap >= 10) gapType = 'definido'; // combinação clara entre dois traços
  else                gapType = 'misto';    // distribuição equilibrada

  return { pct, sorted, top, second, third, fourth, topValue, secondValue, gap, gapType };
}

// ---------------------------------------------------------------------------
// generateCoreStatement
// ---------------------------------------------------------------------------

/**
 * Gera uma frase principal baseada na combinação top + second.
 * Estrutura obrigatória: comportamento + padrão + consequência.
 * Sem linguagem elogiosa ou motivacional.
 *
 * @param {{ top: string, second: string, topValue: number, secondValue: number, gap: number }} profile
 * @returns {string}
 */
export function generateCoreStatement(profile) {
  const { top, second, topValue, secondValue, gap } = profile;
  const key = `${top}${second}`;

  // Frases base por combinação — comportamento + padrão recorrente + consequência observável
  const STATEMENTS = {
    SC: 'Você tende a agir rapidamente e influenciar pessoas ao mesmo tempo — buscando resultado com intensidade social. O padrão recorrente é mobilizar antes de alinhar, o que acelera inícios e fragiliza continuidades.',
    CS: 'Você tende a agir rapidamente e influenciar pessoas ao mesmo tempo — buscando resultado com intensidade social. O padrão recorrente é mobilizar antes de alinhar, o que acelera inícios e fragiliza continuidades.',

    CM: 'Você combina velocidade de decisão com alto padrão de exigência — agindo rápido e avaliando criticamente ao mesmo tempo. O padrão recorrente é ter razão técnica e custo interpessoal simultaneamente.',
    MC: 'Você combina velocidade de decisão com alto padrão de exigência — agindo rápido e avaliando criticamente ao mesmo tempo. O padrão recorrente é ter razão técnica e custo interpessoal simultaneamente.',

    CF: 'Você direciona com consistência sem depender de reconhecimento externo — operando em modo de execução contínua. O padrão recorrente é subestimar o que as pessoas ao redor precisam para permanecer engajadas.',
    FC: 'Você direciona com consistência sem depender de reconhecimento externo — operando em modo de execução contínua. O padrão recorrente é subestimar o que as pessoas ao redor precisam para permanecer engajadas.',

    SM: 'Você alterna entre expressividade intensa e recolhimento profundo — conectando bem na superfície e processando sozinho por dentro. O padrão recorrente é criar expectativas nas relações que nunca são verbalizadas.',
    MS: 'Você alterna entre expressividade intensa e recolhimento profundo — conectando bem na superfície e processando sozinho por dentro. O padrão recorrente é criar expectativas nas relações que nunca são verbalizadas.',

    SF: 'Você conecta com facilidade e sustenta harmonia sem esforço aparente — operando como elemento de coesão em grupos. O padrão recorrente é evitar confrontos que preservariam relacionamentos mais do que o silêncio.',
    FS: 'Você conecta com facilidade e sustenta harmonia sem esforço aparente — operando como elemento de coesão em grupos. O padrão recorrente é evitar confrontos que preservariam relacionamentos mais do que o silêncio.',

    MF: 'Você processa com profundidade e age com cautela — priorizando qualidade e estabilidade sobre velocidade. O padrão recorrente é usar a análise para adiar decisões que já poderiam ser tomadas.',
    FM: 'Você processa com profundidade e age com cautela — priorizando qualidade e estabilidade sobre velocidade. O padrão recorrente é usar a análise para adiar decisões que já poderiam ser tomadas.',
  };

  // Sufixo de intensidade: modifica a frase quando o dominante está muito acima
  let intensitySuffix = '';
  if (gap >= 20) {
    const INTENSITY_SUFFIX = {
      C: ' O traço colérico está tão acima dos demais que o padrão diretivo tende a operar de forma automática, independente do contexto.',
      S: ' O traço sanguíneo está tão acima dos demais que a busca por estímulo e conexão define praticamente todos os contextos de comportamento.',
      M: ' O traço melancólico está tão acima dos demais que análise e autocrítica são o filtro padrão para quase todas as situações.',
      F: ' O traço fleumático está tão acima dos demais que estabilidade e evitação de conflito estruturam a maioria das respostas comportamentais.',
    };
    intensitySuffix = INTENSITY_SUFFIX[top] || '';
  }

  const base = STATEMENTS[key] || STATEMENTS[`${second}${top}`] || `Seu perfil combina ${top} e ${second} como traços dominantes — cada um influenciando seu comportamento em contextos distintos.`;

  return base + intensitySuffix;
}

// ---------------------------------------------------------------------------
// generateCombinationInsight
// ---------------------------------------------------------------------------

/**
 * Gera insight específico sobre a interação entre os dois temperamentos principais.
 * Explica como eles se potencializam, colidem e qual o impacto prático observável.
 *
 * @param {{ top: string, second: string, topValue: number, secondValue: number, gapType: string }} profile
 * @returns {{ interaction: string, impact: string, risk: string }}
 */
export function generateCombinationInsight(profile) {
  const { top, second, topValue, secondValue, gapType } = profile;
  const key = `${top}${second}`;

  const COMBINATIONS = {
    SC: {
      interaction: 'Colérico e Sanguíneo se amplificam mutuamente em contextos de alta energia: o impulso de agir (C) é potencializado pela capacidade de engajar pessoas (S), criando ciclos de iniciativa com forte tração inicial.',
      impact: 'Em ambientes que valorizam velocidade e visibilidade, essa combinação produz resultados acima da média. Em ambientes que exigem consistência e profundidade, ela gera iniciativas incompletas e relacionamentos que não sustentam.',
      risk: 'O risco central é a ilusão de produtividade: alta movimentação com baixa conclusão. A energia alta mascara o problema de foco até que o ciclo se repita múltiplas vezes.',
    },
    CS: {
      interaction: 'Colérico e Sanguíneo se amplificam mutuamente em contextos de alta energia: o impulso de agir (C) é potencializado pela capacidade de engajar pessoas (S), criando ciclos de iniciativa com forte tração inicial.',
      impact: 'Em ambientes que valorizam velocidade e visibilidade, essa combinação produz resultados acima da média. Em ambientes que exigem consistência e profundidade, ela gera iniciativas incompletas e relacionamentos que não sustentam.',
      risk: 'O risco central é a ilusão de produtividade: alta movimentação com baixa conclusão. A energia alta mascara o problema de foco até que o ciclo se repita múltiplas vezes.',
    },
    CM: {
      interaction: 'Colérico e Melancólico criam uma tensão interna real: o impulso de decidir rápido (C) colide com a necessidade de fazer certo (M). Quando resolvida produtivamente, essa tensão gera execução de alta qualidade. Quando não, gera paralisia ou arrependimento.',
      impact: 'Em trabalho técnico e de alta consequência, essa combinação produz padrão acima da média. Em relações interpessoais, a combinação de diretividade e exigência frequentemente aliena mesmo pessoas competentes.',
      risk: 'O risco central é a comunicação: o que você percebe como feedback técnico chega aos outros como crítica pessoal. A frequência com que isso acontece é provavelmente maior do que você estima.',
    },
    MC: {
      interaction: 'Melancólico e Colérico criam uma tensão interna real: a necessidade de fazer certo (M) é pressionada pelo impulso de decidir rápido (C). Quando equilibrada, essa tensão produz rigor com agilidade. Quando não, gera autocrítica por ter agido rápido demais.',
      impact: 'Em trabalho técnico e de alta consequência, essa combinação produz padrão acima da média. Em relações interpessoais, a combinação de exigência e diretividade frequentemente aliena mesmo pessoas competentes.',
      risk: 'O risco central é a comunicação: o que você percebe como feedback técnico chega aos outros como crítica pessoal. A frequência com que isso acontece é provavelmente maior do que você estima.',
    },
    CF: {
      interaction: 'Colérico e Fleumático raramente coexistem em equilíbrio estável: o impulso de resultado (C) é moderado pela tolerância à lentidão (F), produzindo um perfil que dirige sem atropelar. Quando a pressão aumenta, o traço colérico tende a suprimir o fleumático.',
      impact: 'Em projetos de longo prazo com equipes, essa combinação é funcional: há direção sem autoritarismo. Em contextos de alta urgência, o fleumático recua e o colérico assume — com os custos relacionais correspondentes.',
      risk: 'O risco central é a invisibilidade emocional: você opera em modo eficiente enquanto as pessoas ao redor acumulam necessidades que você não percebe até que se tornem problemas.',
    },
    FC: {
      interaction: 'Fleumático e Colérico em combinação produzem um padrão de liderança discreta: a consistência (F) sustenta a direção (C) sem a necessidade de protagonismo. A tensão emerge quando o ambiente exige velocidade que conflita com o ritmo padrão.',
      impact: 'Em projetos de longo prazo com equipes, essa combinação é funcional: há direção sem autoritarismo. Em contextos de alta urgência, o traço colérico pressiona a paciência fleumática — com variação de comportamento que confunde quem trabalha com você.',
      risk: 'O risco central é a invisibilidade emocional: você opera em modo eficiente enquanto as pessoas ao redor acumulam necessidades que você não percebe até que se tornem problemas.',
    },
    SM: {
      interaction: 'Sanguíneo e Melancólico criam uma contradição funcional: a expressividade social (S) coexiste com uma vida interna intensa que raramente aparece na superfície (M). O resultado é um perfil que parece mais simples do que é.',
      impact: 'Em contextos criativos e relacionais, essa combinação produz profundidade incomum para quem parece tão acessível. O problema aparece quando as expectativas emocionais internas não encontram equivalente nas relações que foram construídas na superfície.',
      risk: 'O risco central é a decepção relacional crônica: você conecta com facilidade mas precisa de profundidade, e as pessoas raramente percebem essa necessidade a tempo.',
    },
    MS: {
      interaction: 'Melancólico e Sanguíneo criam uma contradição funcional: a vida interna intensa (M) convive com impulso de conexão e expressão (S). O resultado é um perfil que alterna entre introspecção e extroversão de forma que confunde quem está por perto.',
      impact: 'Em contextos criativos e relacionais, essa combinação produz profundidade incomum para quem parece tão acessível. O problema aparece quando as expectativas emocionais internas não encontram equivalente nas relações que foram construídas na superfície.',
      risk: 'O risco central é a decepção relacional crônica: você conecta com facilidade mas precisa de profundidade, e as pessoas raramente percebem essa necessidade a tempo.',
    },
    SF: {
      interaction: 'Sanguíneo e Fleumático criam um perfil de alta aceitabilidade social: expressivo sem intimidar, caloroso sem dominar. A combinação sustenta ambientes positivos com eficiência, mas a orientação para harmonia é tão forte que dificulta confrontos necessários.',
      impact: 'Em contextos que exigem coesão de grupo e relações sustentadas, essa combinação é muito eficaz. Em contextos que exigem posição firme, negociação dura ou feedback crítico, ela produz evitação com consequências acumuladas.',
      risk: 'O risco central é a honestidade diferida: você acumula insatisfações e verdades não ditas até que saem de forma desproporcional ao contexto imediato, confundindo quem recebe.',
    },
    FS: {
      interaction: 'Fleumático e Sanguíneo criam um perfil de alta aceitabilidade social: estável sem ser rígido, conectado sem ser intrusivo. A combinação sustenta relações duradouras, mas a preferência por harmonia suprime posições firmes quando elas seriam necessárias.',
      impact: 'Em contextos que exigem coesão de grupo e relações sustentadas, essa combinação é muito eficaz. Em contextos que exigem posição firme, negociação dura ou feedback crítico, ela produz evitação com consequências acumuladas.',
      risk: 'O risco central é a honestidade diferida: você acumula insatisfações e verdades não ditas até que saem de forma desproporcional ao contexto imediato, confundindo quem recebe.',
    },
    MF: {
      interaction: 'Melancólico e Fleumático se reforçam na direção de qualidade e estabilidade: a análise (M) é sustentada pela paciência (F), produzindo um perfil que raramente erra e raramente age antes de ter certeza.',
      impact: 'Em trabalho especializado e autônomo, essa combinação produz output consistentemente acima da média. Em contextos dinâmicos com decisões frequentes e incerteza alta, ela produz atrasos que outros interpretam como desinteresse ou incapacidade.',
      risk: 'O risco central é a paralisia por análise: a combinação de profundidade (M) e tolerância à espera (F) cria condições ideais para adiar indefinidamente sob o rótulo de "ainda não estou pronto".',
    },
    FM: {
      interaction: 'Fleumático e Melancólico se reforçam na direção de estabilidade e profundidade: a paciência (F) sustenta a análise (M), produzindo um perfil que age com cautela e entrega com qualidade.',
      impact: 'Em trabalho especializado e autônomo, essa combinação produz output consistentemente acima da média. Em contextos dinâmicos, ela produz atrasos que outros interpretam como desinteresse ou incapacidade.',
      risk: 'O risco central é a paralisia por análise: a combinação de tolerância à espera (F) e profundidade (M) cria condições ideais para adiar indefinidamente sob o rótulo de "ainda não estou pronto".',
    },
  };

  const combo = COMBINATIONS[key] || COMBINATIONS[`${second}${top}`];

  if (!combo) {
    return {
      interaction: `Sua combinação de ${top} e ${second} cria um padrão comportamental específico que se manifesta de formas distintas conforme o contexto.`,
      impact: 'O impacto depende fortemente de como você usa cada traço em cada situação.',
      risk: 'O risco é não reconhecer quando um traço está operando em excesso e o outro está suprimido.',
    };
  }

  // Adiciona contexto de gap quando os dois traços estão muito próximos
  if (gapType === 'misto') {
    return {
      ...combo,
      interaction: combo.interaction + ` Com gap pequeno entre ${top} e ${second} (${topValue}% vs ${secondValue}%), os dois traços alternam influência conforme o contexto — o que pode parecer inconsistência para quem observa de fora.`,
    };
  }

  return combo;
}

// ---------------------------------------------------------------------------
// generateDeepInsights
// ---------------------------------------------------------------------------

/**
 * Gera insights comportamentais profundos baseados em thresholds precisos.
 * Cada insight contém comportamento + contexto + consequência.
 * Não são genéricos — dependem dos valores reais do perfil.
 *
 * @param {{ S: number, C: number, M: number, F: number }} scores - scores brutos
 * @returns {Array<{ id: string, behavior: string, context: string, consequence: string, text: string }>}
 */
export function generateDeepInsights(scores) {
  const pct = normalizeToPct(scores);
  const insights = [];

  // Helper para criar insight estruturado
  const insight = (id, behavior, context, consequence) => ({
    id,
    behavior,
    context,
    consequence,
    // Texto unificado para exibição direta
    text: `${behavior} ${context} — ${consequence}`,
  });

  // --- COLÉRICO > 60 ---
  if (pct.C > 60) {
    insights.push(insight(
      'C_high',
      'Você tende a assumir controle antes de validar o alinhamento do grupo.',
      'Em situações de decisão ou impasse, o padrão é agir e comunicar depois',
      'o que acelera execuções individuais e fragiliza adoção coletiva quando o buy-in era necessário.'
    ));
  } else if (pct.C >= 45) {
    insights.push(insight(
      'C_mid',
      'Você demonstra orientação clara a resultado com impaciência quando o ritmo não acompanha.',
      'Em contextos de grupo ou colaboração, esse padrão é perceptível para os outros antes de você perceber',
      'gerando percepção de pressão mesmo quando a intenção era apenas eficiência.'
    ));
  }

  // --- MELANCÓLICO > 50 ---
  if (pct.M > 50) {
    insights.push(insight(
      'M_high',
      'Você aplica autocrítica elevada de forma ampla — ao próprio trabalho e ao dos outros.',
      'O padrão de exigência raramente tem folga, independente do nível de impacto da tarefa',
      'o que gera desgaste energético contínuo e, em relações, cria uma régua que as pessoas dificilmente alcançam.'
    ));
  } else if (pct.M >= 38) {
    insights.push(insight(
      'M_mid',
      'Você prolonga decisões quando as variáveis não estão completamente mapeadas.',
      'Em contextos de incerteza — que são a maioria — esse padrão opera como freio',
      'produzindo atrasos que outros percebem antes de você reconhecer como problema.'
    ));
  }

  // --- SANGUÍNEO > 50 ---
  if (pct.S > 50) {
    insights.push(insight(
      'S_high',
      'Você busca estímulo e novidade de forma ativa — e o engajamento cai de forma previsível em contextos repetitivos.',
      'O padrão de início forte com queda de consistência não é percebido como problema na fase inicial',
      'mas se torna visível em projetos longos onde a fase de manutenção exige o mesmo esforço que a de lançamento.'
    ));
  } else if (pct.S >= 38) {
    insights.push(insight(
      'S_mid',
      'Você conecta com facilidade e se adapta a contextos novos com baixo custo.',
      'Em ambientes sociais e colaborativos, esse padrão é funcional',
      'mas em projetos que exigem foco sustentado, a mesma flexibilidade vira dispersão.'
    ));
  }

  // --- FLEUMÁTICO > 50 ---
  if (pct.F > 50) {
    insights.push(insight(
      'F_high',
      'Você evita conflito de forma estrutural — não apenas como preferência, mas como mecanismo automático.',
      'Em situações que exigem confrontação direta ou posição firme, o padrão é adiar ou suavizar',
      'acumulando problemas não resolvidos que reaparecem com custo maior do que teriam no momento original.'
    ));
  } else if (pct.F >= 38) {
    insights.push(insight(
      'F_mid',
      'Você opera com consistência e confiabilidade acima da média.',
      'Em ambientes que valorizam previsibilidade, esse padrão é um diferencial real',
      'mas em contextos de mudança ou urgência, a mesma consistência pode ser percebida como resistência passiva.'
    ));
  }

  // --- FLEUMÁTICO < 15 ---
  if (pct.F < 15) {
    insights.push(insight(
      'F_low',
      'Você tem baixa tolerância a ambientes lentos, indecisivos ou sem ritmo claro.',
      'O padrão é frustração visível — e frequentemente externalizada — quando o contexto não corresponde ao ritmo esperado',
      'criando atrito com perfis que operam naturalmente em velocidades menores.'
    ));
  }

  // --- SANGUÍNEO < 15 ---
  if (pct.S < 15) {
    insights.push(insight(
      'S_low',
      'Você tem baixa inclinação para interação social espontânea.',
      'Ambientes de alta demanda social são provavelmente desgastantes — não por timidez, mas por custo energético real',
      'e isso pode ser interpretado pelos outros como frieza ou desinteresse, mesmo quando não é.'
    ));
  }

  // --- COLÉRICO < 15 ---
  if (pct.C < 15) {
    insights.push(insight(
      'C_low',
      'Você tende a evitar posições de liderança ou assertividade mesmo quando tem competência para exercê-las.',
      'O padrão é ceder sob pressão externa antes de sustentar posição',
      'o que pode resultar em ser subestimado em contextos onde visibilidade e direção são valorizadas.'
    ));
  }

  // --- MELANCÓLICO < 15 ---
  if (pct.M < 15) {
    insights.push(insight(
      'M_low',
      'Você tem baixa tendência a análise detalhada e verificação antes de agir.',
      'O padrão é decisão rápida com dados parciais — funcional em contextos de baixo risco',
      'mas problemático em decisões de alto impacto onde o erro tem custo desproporcional.'
    ));
  }

  // --- COMBINAÇÕES ---
  if (pct.C >= 40 && pct.M >= 35) {
    insights.push(insight(
      'CM_combo',
      'Você combina velocidade de decisão com alto padrão de exigência simultaneamente.',
      'Esse padrão produz execução de alta qualidade em projetos próprios',
      'mas gera frustração ao lidar com pessoas menos precisas ou velozes — e isso aparece na comunicação antes que você perceba.'
    ));
  }

  if (pct.S >= 40 && pct.F >= 35) {
    insights.push(insight(
      'SF_combo',
      'Você combina alta orientação social com forte evitação de confronto.',
      'Em grupos, esse padrão produz coesão e aceitação',
      'mas sacrifica honestidade: você tende a dizer o que preserva a relação, não o que seria mais útil.'
    ));
  }

  if (pct.M >= 40 && pct.F >= 35) {
    insights.push(insight(
      'MF_combo',
      'Você combina análise prolongada com alta tolerância à espera.',
      'Esse padrão cria condições ideais para trabalho de alta qualidade',
      'e condições igualmente ideais para paralisia decisória — especialmente quando há risco interpessoal envolvido.'
    ));
  }

  if (pct.C >= 40 && pct.S >= 35) {
    insights.push(insight(
      'CS_combo',
      'Você combina impulso de ação com capacidade de engajamento social.',
      'Esse padrão é eficaz para mobilizar grupos rapidamente',
      'mas produz comprometimentos que excedem a capacidade de entrega — o entusiasmo promete mais do que o foco sustenta.'
    ));
  }

  // Máximo de 5 insights — prioriza os individuais antes dos combinados
  return insights.slice(0, 5);
}

// ---------------------------------------------------------------------------
// generateIntensityDescription
// ---------------------------------------------------------------------------

/**
 * Gera texto descritivo da intensidade de um temperamento.
 * Faixas: >65 dominante forte | 40–65 presença relevante | <40 traço moderado.
 *
 * @param {number} value - percentual (0–100)
 * @param {'S'|'C'|'M'|'F'} type - temperamento
 * @returns {{ level: string, label: string, description: string }}
 */
export function generateIntensityDescription(value, type) {
  const NAME = { S: 'Sanguíneo', C: 'Colérico', M: 'Melancólico', F: 'Fleumático' };

  const TEXTS = {
    dominant: {
      C: `Colérico em ${value}%: orientação a resultado, controle e velocidade de decisão operam como respostas automáticas. Em situações neutras, o modo padrão é diretivo.`,
      S: `Sanguíneo em ${value}%: expressividade, busca por conexão e estímulo definem o modo padrão de operação. A ausência de novidade é percebida como custo, não como estabilidade.`,
      M: `Melancólico em ${value}%: análise, exigência de qualidade e autocrítica são os filtros predominantes. Praticamente toda situação passa por esse processamento antes de uma resposta.`,
      F: `Fleumático em ${value}%: estabilidade, previsibilidade e preservação de harmonia estruturam a maioria das decisões e reações. Mudança tem custo percebido mais alto que o real.`,
    },
    relevant: {
      C: `Colérico em ${value}%: assertividade e orientação a resultado emergem com clareza em situações de decisão, liderança ou baixo resultado. Não é o modo padrão, mas é consistente.`,
      S: `Sanguíneo em ${value}%: expressividade e sociabilidade aparecem com frequência, especialmente em contextos de baixa pressão. A conexão social tem peso real nas escolhas.`,
      M: `Melancólico em ${value}%: análise detalhada e autocrítica aparecem de forma consistente, principalmente em trabalho e decisões com consequência. Não paralisa, mas influencia o ritmo.`,
      F: `Fleumático em ${value}%: tendência à estabilidade e harmonia é perceptível, especialmente nas relações. Funciona como moderador em situações de alta tensão.`,
    },
    moderate: {
      C: `Colérico em ${value}%: assertividade presente mas não automática. Tende a surgir sob pressão ou quando o resultado está comprometido. No restante, opera em segundo plano.`,
      S: `Sanguíneo em ${value}%: expressividade social presente mas não dominante. Pode variar conforme energia disponível e contexto. Não define o comportamento — influencia.`,
      M: `Melancólico em ${value}%: tendência analítica presente mas equilibrada. Não chega a gerar paralisia, mas adiciona tempo ao processo de decisão quando o assunto importa.`,
      F: `Fleumático em ${value}%: estabilidade presente sem ser rígida. Consegue agir e decidir sem precisar de consenso total — o traço aparece mais como paciência do que como evitação.`,
    },
  };

  let level;
  if (value >= 65)      level = 'dominant';
  else if (value >= 40) level = 'relevant';
  else                  level = 'moderate';

  const levelLabels = { dominant: 'Dominante forte', relevant: 'Presença relevante', moderate: 'Traço moderado' };

  return {
    level,
    label: `${NAME[type]} · ${levelLabels[level]}`,
    description: TEXTS[level][type],
  };
}
