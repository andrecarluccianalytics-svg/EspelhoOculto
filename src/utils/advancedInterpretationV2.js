/**
 * advancedInterpretationV2.js
 *
 * Motor V2 de interpretação. Substitui advancedInterpretation.js como fonte
 * principal — o arquivo anterior é mantido como legado apenas.
 *
 * Todas as funções são puras: mesmo input → mesmo output.
 * Nenhuma depende de estado externo ou de outros utils.
 */

// ---------------------------------------------------------------------------
// Helpers internos
// ---------------------------------------------------------------------------

/** Normaliza scores brutos { S,C,M,F } para percentuais inteiros somando 100. */
function normalizeToPct(scores) {
  const raw = {};
  Object.keys(scores).forEach(k => { raw[k] = Math.max(0, scores[k]); });
  const total = Object.values(raw).reduce((a, b) => a + b, 0) || 1;

  const pct = {};
  Object.keys(raw).forEach(k => { pct[k] = Math.round((raw[k] / total) * 100); });

  // Garantir soma = 100 ajustando o maior
  const diff = 100 - Object.values(pct).reduce((a, b) => a + b, 0);
  if (diff !== 0) {
    const top = Object.keys(pct).reduce((a, b) => pct[a] > pct[b] ? a : b);
    pct[top] += diff;
  }
  return pct;
}

const NAMES = { S: 'Sanguíneo', C: 'Colérico', M: 'Melancólico', F: 'Fleumático' };

// ---------------------------------------------------------------------------
// buildProfile
// ---------------------------------------------------------------------------

/**
 * Constrói o perfil estruturado a partir dos scores brutos.
 *
 * @param {{ S: number, C: number, M: number, F: number }} scores
 * @returns {{
 *   pct: Object,
 *   sorted: string[],
 *   top: string, second: string, third: string, fourth: string,
 *   topValue: number, secondValue: number,
 *   gap: number,
 *   isDominant: boolean,   // gap > 20 — traço único muito acima dos demais
 *   isBalanced: boolean,   // gap < 10 — dois traços em tensão real
 *   gapType: 'isolado'|'definido'|'misto'
 * }}
 */
export function buildProfile(scores) {
  const pct    = normalizeToPct(scores);
  const sorted = Object.keys(pct).sort((a, b) => pct[b] - pct[a]);

  const [top, second, third, fourth] = sorted;
  const topValue    = pct[top];
  const secondValue = pct[second];
  const gap         = topValue - secondValue;

  const isDominant = gap > 20;
  const isBalanced = gap < 10;

  let gapType;
  if (isDominant)    gapType = 'isolado';
  else if (!isBalanced) gapType = 'definido';
  else               gapType = 'misto';

  return {
    pct, sorted,
    top, second, third, fourth,
    topValue, secondValue,
    gap, isDominant, isBalanced, gapType,
  };
}

// ---------------------------------------------------------------------------
// generateCoreStatement
// ---------------------------------------------------------------------------

/**
 * Frase principal do perfil: comportamento + padrão + consequência.
 * Varia conforme isDominant (reforça intensidade) ou isBalanced (indica alternância).
 *
 * @param {ReturnType<typeof buildProfile>} profile
 * @returns {string}
 */
export function generateCoreStatement(profile) {
  const { top, second, isDominant, isBalanced, topValue, secondValue } = profile;

  // Base statements por combinação — comportamento + padrão + consequência
  const BASE = {
    SC: 'Você age rápido e arrasta pessoas junto — buscando resultado com tração social. O padrão é mobilizar antes de alinhar, o que acelera inícios e fragiliza continuidades.',
    CM: 'Você decide rápido e exige alto padrão ao mesmo tempo — o que produz execução rigorosa, mas gera custo relacional frequentemente subestimado.',
    CF: 'Você direciona com consistência sem precisar de protagonismo — operando em modo de entrega contínua. O risco é subestimar o que as pessoas ao redor precisam para continuar engajadas.',
    SM: 'Você alterna entre expressividade intensa e recolhimento profundo — conectando bem na superfície enquanto processa sozinho por dentro. O padrão cria expectativas relacionais que raramente são verbalizadas.',
    SF: 'Você conecta com facilidade e sustenta harmonia de forma quase automática — mas evita confrontos que seriam necessários para preservar relacionamentos de verdade.',
    MF: 'Você processa fundo e age com cautela — priorizando qualidade sobre velocidade. O padrão é usar a análise para adiar decisões que já poderiam ser tomadas.',
  };

  const key  = `${top}${second}`;
  const rkey = `${second}${top}`;
  const base = BASE[key] || BASE[rkey]
    || `Seu perfil combina ${NAMES[top]} e ${NAMES[second]} — cada traço influenciando seu comportamento em contextos distintos.`;

  // Sufixo de variação baseado no GAP
  let suffix = '';

  if (isDominant) {
    // Dominante forte: reforça que o traço opera de forma automática
    const DOMINANT_SUFFIX = {
      C: ` Com ${topValue}% de Colérico, esse padrão diretivo não é uma escolha consciente — é sua resposta automática à maioria das situações.`,
      S: ` Com ${topValue}% de Sanguíneo, a busca por estímulo e conexão define praticamente todos os contextos do seu comportamento.`,
      M: ` Com ${topValue}% de Melancólico, análise e autocrítica são o filtro padrão para quase todas as situações — independente do impacto real.`,
      F: ` Com ${topValue}% de Fleumático, estabilidade e evitação de conflito estruturam a maioria das respostas, mesmo quando movimento seria necessário.`,
    };
    suffix = DOMINANT_SUFFIX[top] || '';
  } else if (isBalanced) {
    // Equilibrado: indica alternância real entre os dois traços
    suffix = ` Com ${topValue}% de ${NAMES[top]} e ${secondValue}% de ${NAMES[second]}, você alterna entre esses dois modos conforme o contexto — o que pode parecer inconsistência para quem observa de fora.`;
  }

  return base + suffix;
}

// ---------------------------------------------------------------------------
// generateCombinationInsight
// ---------------------------------------------------------------------------

/**
 * Insight específico sobre a interação entre os dois traços principais.
 * Não repete a descrição básica — explora a dinâmica real entre os dois.
 *
 * @param {ReturnType<typeof buildProfile>} profile
 * @returns {{ interaction: string, impact: string, risk: string }}
 */
export function generateCombinationInsight(profile) {
  const { top, second, topValue, secondValue, isBalanced } = profile;

  const COMBOS = {
    SC: {
      interaction: 'Colérico e Sanguíneo se amplificam: o impulso de agir (C) ganha tração social (S), criando ciclos de iniciativa com força de arranque acima da média.',
      impact: 'Funciona em contextos que valorizam velocidade e visibilidade. Falha em projetos que exigem consistência após o entusiasmo inicial — a fase de manutenção não recebe o mesmo investimento.',
      risk: 'A movimentação intensa mascara o problema de conclusão. Você pode passar meses com alto nível de atividade e baixo nível de entrega real.',
    },
    CM: {
      interaction: 'Colérico e Melancólico criam tensão interna: agir rápido (C) colide com fazer certo (M). Quando resolvida, produz execução de alta qualidade. Quando não, gera paralisia ou arrependimento pós-decisão.',
      impact: 'Em trabalho técnico com alta consequência, essa combinação entrega padrão acima da média. Em relações, a diretividade somada à exigência frequentemente aliena pessoas que teriam contribuição real.',
      risk: 'O feedback técnico chega aos outros como crítica pessoal. A frequência com que isso acontece é maior do que você estima — e o impacto relacional acumula silenciosamente.',
    },
    CF: {
      interaction: 'Colérico e Fleumático raramente coexistem em equilíbrio estável. O impulso de resultado (C) é moderado pela tolerância estrutural (F) — produzindo direção sem atropelamento na maioria dos contextos.',
      impact: 'Eficaz em projetos de longo prazo com equipes: há direção sem autoritarismo. Em contextos de alta urgência, o Fleumático recua e o Colérico assume — com os custos relacionais correspondentes.',
      risk: 'Você opera em modo eficiente enquanto as pessoas ao redor acumulam necessidades não percebidas. O problema aparece quando já está avançado demais para ser gerenciado sem custo alto.',
    },
    SM: {
      interaction: 'Sanguíneo e Melancólico criam uma contradição funcional: expressividade social (S) coexiste com vida interna intensa (M). O resultado é um perfil que parece mais simples do que é — e que frequentemente decepciona quem se aproxima pela superfície.',
      impact: 'Em contextos criativos e relacionais, a combinação produz profundidade incomum. O problema aparece quando expectativas emocionais internas não encontram equivalente nas relações construídas na superfície.',
      risk: 'Decepção relacional crônica: você conecta facilmente, mas precisa de profundidade que raramente está disponível em quem te conheceu pela expressividade.',
    },
    SF: {
      interaction: 'Sanguíneo e Fleumático criam alta aceitabilidade social: expressivo sem intimidar, caloroso sem dominar. A combinação sustenta ambientes positivos com eficiência — mas a orientação à harmonia suprime confrontações necessárias.',
      impact: 'Muito eficaz onde coesão e relações sustentadas importam. Pouco eficaz onde posição firme, negociação dura ou feedback crítico são necessários.',
      risk: 'Verdades não ditas se acumulam e saem em momentos inadequados, com intensidade desproporcional ao contexto imediato — confundindo quem recebe.',
    },
    MF: {
      interaction: 'Melancólico e Fleumático se reforçam em direção à qualidade e estabilidade: a análise (M) é sustentada pela paciência (F), produzindo rigor com baixo nível de erro.',
      impact: 'Em trabalho especializado e autônomo, output consistentemente acima da média. Em contextos dinâmicos com decisões frequentes, os atrasos são percebidos como desinteresse ou incapacidade.',
      risk: 'A combinação de profundidade e tolerância à espera cria condições ideais para adiar indefinidamente sob o rótulo de "ainda não estou pronto".',
    },
  };

  const key   = `${top}${second}`;
  const rkey  = `${second}${top}`;
  const combo = COMBOS[key] || COMBOS[rkey];

  if (!combo) {
    return {
      interaction: `${NAMES[top]} e ${NAMES[second]} interagem de forma específica no seu perfil — cada traço operando com peso distinto conforme o contexto.`,
      impact: 'O impacto depende de qual traço predomina em cada situação.',
      risk: 'O risco é não reconhecer quando um traço está operando em excesso.',
    };
  }

  // Quando os dois traços estão muito próximos, adiciona contexto de alternância
  if (isBalanced) {
    return {
      ...combo,
      interaction: combo.interaction
        + ` Com ${topValue}% e ${secondValue}% respectivamente, os dois traços têm peso similar — a alternância entre eles depende do contexto e da pressão do momento.`,
    };
  }

  return combo;
}

// ---------------------------------------------------------------------------
// generateDeepInsights
// ---------------------------------------------------------------------------

/**
 * Insights comportamentais baseados em thresholds percentuais precisos.
 * Cada insight: { id, behavior, context, consequence, text }
 *
 * @param {{ S: number, C: number, M: number, F: number }} scores - scores brutos
 * @returns {Array<{ id: string, behavior: string, context: string, consequence: string, text: string }>}
 */
export function generateDeepInsights(scores) {
  const pct = normalizeToPct(scores);

  const make = (id, behavior, context, consequence) => ({
    id,
    behavior,
    context,
    consequence,
    text: `${behavior} ${context} — ${consequence}`,
  });

  const list = [];

  // Colérico > 60: controle + redução de espaço para outros
  if (pct.C > 60) {
    list.push(make(
      'C_high',
      'Você assume controle antes de verificar se o grupo está alinhado.',
      'Em decisões coletivas, o padrão é agir e comunicar depois',
      'o que reduz o espaço de contribuição dos outros mesmo quando essa contribuição teria valor real.'
    ));
  } else if (pct.C >= 45) {
    list.push(make(
      'C_mid',
      'Sua orientação a resultado gera impaciência perceptível quando o ritmo não acompanha.',
      'Em contextos colaborativos, isso é notado pelas outras pessoas antes de você perceber',
      'criando percepção de pressão mesmo quando a intenção era apenas eficiência.'
    ));
  }

  // Melancólico > 50: perfeccionismo + atraso em entrega
  if (pct.M > 50) {
    list.push(make(
      'M_high',
      'Você aplica padrão de exigência elevado de forma ampla — ao seu trabalho e ao dos outros.',
      'O ciclo de revisão raramente tem ponto de corte claro',
      'o que atrasa entregas e desgasta energia em ajustes com retorno decrescente.'
    ));
  } else if (pct.M >= 38) {
    list.push(make(
      'M_mid',
      'Você prolonga decisões quando o mapa de variáveis não está completo.',
      'Em contextos de incerteza — que são a maioria das situações reais',
      'esse padrão opera como freio visível para quem depende da sua decisão.'
    ));
  }

  // Sanguíneo > 50: busca de estímulo + baixa consistência
  if (pct.S > 50) {
    list.push(make(
      'S_high',
      'Você busca estímulo de forma ativa e o engajamento cai de maneira previsível em contextos repetitivos.',
      'O início de projetos recebe investimento alto; a fase de manutenção, não',
      'criando padrão de entrega inconsistente que outros percebem antes de você nomear.'
    ));
  } else if (pct.S >= 38) {
    list.push(make(
      'S_mid',
      'Você conecta facilmente e se adapta a contextos novos com baixo custo.',
      'Em projetos que exigem foco sustentado',
      'a mesma flexibilidade que facilita conexão vira dispersão de atenção.'
    ));
  }

  // Fleumático > 50: evita conflito + adia decisões
  if (pct.F > 50) {
    list.push(make(
      'F_high',
      'Você evita conflito de forma estrutural — como mecanismo automático, não como escolha consciente.',
      'Em situações que exigem confrontação direta ou posição firme',
      'o padrão é adiar ou suavizar, acumulando problemas que reaparecem com custo maior do que teriam no momento original.'
    ));
  } else if (pct.F >= 38) {
    list.push(make(
      'F_mid',
      'Você opera com consistência e confiabilidade percebidas acima da média.',
      'Em contextos de mudança rápida ou urgência real',
      'a mesma consistência pode ser interpretada pelos outros como resistência passiva.'
    ));
  }

  // Fleumático < 15: baixa tolerância à lentidão
  if (pct.F < 15) {
    list.push(make(
      'F_low',
      'Sua tolerância a ambientes lentos, sem ritmo ou indecisivos é muito baixa.',
      'O padrão é frustração visível e frequentemente externalizada',
      'gerando atrito com perfis que operam naturalmente em velocidades menores — e que precisariam do seu engajamento.'
    ));
  }

  // Sanguíneo < 15
  if (pct.S < 15) {
    list.push(make(
      'S_low',
      'Sua inclinação para interação social espontânea é baixa.',
      'Ambientes de alta demanda social têm custo energético real para você',
      'e isso é interpretado pelos outros como desinteresse ou frieza, mesmo quando não é.'
    ));
  }

  // Colérico < 15
  if (pct.C < 15) {
    list.push(make(
      'C_low',
      'Você tende a recuar de posições de liderança ou assertividade mesmo com competência para exercê-las.',
      'Sob pressão externa, o padrão é ceder antes de sustentar posição',
      'o que resulta em ser subestimado em contextos onde direção é valorizada.'
    ));
  }

  // Melancólico < 15
  if (pct.M < 15) {
    list.push(make(
      'M_low',
      'Sua tendência a análise detalhada antes de agir é baixa.',
      'Em decisões de alto impacto, o padrão de dados parciais é funcional em contextos de baixo risco',
      'mas cria exposição em situações onde o custo do erro é desproporcional.'
    ));
  }

  // Combinações
  if (pct.C >= 40 && pct.M >= 35) {
    list.push(make(
      'CM_combo',
      'Velocidade de decisão e alto padrão de exigência operam simultaneamente no seu perfil.',
      'Em projetos próprios, isso produz qualidade real',
      'em relações de trabalho, gera frustração quando os outros não operam no mesmo nível — e isso aparece na comunicação antes que você perceba.'
    ));
  }

  if (pct.S >= 40 && pct.F >= 35) {
    list.push(make(
      'SF_combo',
      'Alta orientação social e forte evitação de confronto coexistem.',
      'Em grupos, isso produz coesão e aceitação ampla',
      'ao custo de honestidade: você tende a dizer o que preserva a relação em vez do que seria mais útil.'
    ));
  }

  if (pct.M >= 40 && pct.F >= 35) {
    list.push(make(
      'MF_combo',
      'Análise prolongada e alta tolerância à espera se reforçam mutuamente.',
      'Isso produz trabalho de alta qualidade em contextos com prazo elástico',
      'e paralisia decisória em contextos com incerteza interpessoal — especialmente quando há risco de conflito.'
    ));
  }

  // Máximo 5 — individuais têm prioridade sobre combinações
  return list.slice(0, 5);
}

// ---------------------------------------------------------------------------
// generateMirrorInsight
// ---------------------------------------------------------------------------

/**
 * Bloco "como você provavelmente é percebido pelos outros".
 * Baseado no temperamento dominante — o que é visível de fora, não o que você sente.
 *
 * @param {ReturnType<typeof buildProfile>} profile
 * @returns {{
 *   headline: string,
 *   perceptions: string[],
 *   blind_spot: string
 * }}
 */
export function generateMirrorInsight(profile) {
  const { top, second, isDominant } = profile;

  const MIRROR = {
    C: {
      headline: 'Direto, decidido e difícil de contrariar.',
      perceptions: [
        'As pessoas percebem você como alguém que sabe o que quer e vai atrás sem hesitar.',
        'Em reuniões ou decisões de grupo, sua presença tende a definir a direção — mesmo quando você não está formalmente no comando.',
        'Quem não te conhece bem pode interpretar sua objetividade como falta de interesse pelo ponto de vista alheio.',
        'Você é visto como confiável para entregas, mas pouco confortável para conversas de suporte emocional.',
      ],
      blind_spot: 'Você provavelmente acha que é mais aberto ao diálogo do que os outros percebem. O espaço que você acha que dá raramente corresponde ao espaço que as pessoas sentem que têm.',
    },
    S: {
      headline: 'Comunicativo, estimulante e difícil de acompanhar.',
      perceptions: [
        'As pessoas te veem como energético, fácil de conversar e naturalmente interessante.',
        'Você cria conexão rápida — mas as pessoas frequentemente têm dificuldade de te localizar quando precisam de consistência.',
        'Em projetos de grupo, sua energia no começo gera expectativas que a fase de execução raramente confirma.',
        'Você é percebido como criativo e adaptável, mas também como alguém que pode abandonar o compromisso quando o estímulo cai.',
      ],
      blind_spot: 'Você provavelmente subestima o quanto as pessoas contam com sua presença constante. Cada vez que a energia cai, alguém registra — mesmo que não diga.',
    },
    M: {
      headline: 'Detalhista, rigoroso e difícil de satisfazer.',
      perceptions: [
        'As pessoas percebem você como alguém que leva tudo a sério e não aceita resultado abaixo do padrão.',
        'Em contextos de trabalho, sua análise é valorizada — mas a régua de exigência pode criar clima de insuficiência ao redor.',
        'Quem não te conhece bem pode interpretar sua crítica técnica como insatisfação pessoal.',
        'Você é visto como confiável para qualidade, mas pouco confortável para situações que exigem "bom o suficiente".',
      ],
      blind_spot: 'Você provavelmente acredita que deixa claro quando algo está bem feito. Na prática, o reconhecimento explícito vem menos frequentemente do que as pessoas precisam para manter o engajamento.',
    },
    F: {
      headline: 'Tranquilo, confiável e difícil de mover.',
      perceptions: [
        'As pessoas te percebem como estabilizador — aquele que não entra em pânico e mantém o ambiente previsível.',
        'Em situações de conflito, sua presença tem efeito moderador real.',
        'Quem trabalha com você pode interpretar sua paciência como falta de posição — especialmente quando o grupo precisa de alguém que tome frente.',
        'Você é percebido como parceiro de longo prazo, mas raramente como quem vai iniciar mudança.',
      ],
      blind_spot: 'Você provavelmente vê sua estabilidade como neutralidade. As pessoas ao redor frequentemente leem como passividade — e ficam esperando uma iniciativa que nunca vem.',
    },
  };

  const base = MIRROR[top];

  // Adiciona nuance do traço secundário quando não é dominante forte
  let secondaryNote = '';
  if (!isDominant && second) {
    const SECONDARY_NOTES = {
      C: 'O traço Colérico secundário faz com que você ocasionalmente surpreenda quem está acostumado com seu modo mais tranquilo — reagindo com assertividade quando algo importante está em jogo.',
      S: 'O traço Sanguíneo secundário adiciona uma camada de calor e expressividade que suaviza a percepção principal — tornando você mais acessível do que o traço dominante sugere.',
      M: 'O traço Melancólico secundário adiciona uma camada de profundidade que às vezes surpreende: por baixo do padrão dominante, há mais análise e exigência do que aparece na superfície.',
      F: 'O traço Fleumático secundário adiciona estabilidade à percepção principal — fazendo com que você pareça menos intenso e mais sustentável do que o traço dominante isolado sugeriria.',
    };
    secondaryNote = SECONDARY_NOTES[second] || '';
  }

  return {
    headline: base.headline,
    perceptions: secondaryNote
      ? [...base.perceptions, secondaryNote]
      : base.perceptions,
    blind_spot: base.blind_spot,
  };
}

// ---------------------------------------------------------------------------
// generateIntensityDescription
// ---------------------------------------------------------------------------

/**
 * Descrição da intensidade de cada temperamento baseada no percentual.
 *
 * @param {number} value - percentual (0–100)
 * @param {'S'|'C'|'M'|'F'} type
 * @returns {{ level: 'dominant'|'relevant'|'moderate', label: string, description: string }}
 */
export function generateIntensityDescription(value, type) {
  const LEVEL_LABELS = {
    dominant: 'Dominante forte',
    relevant: 'Presença relevante',
    moderate: 'Traço moderado',
  };

  const TEXTS = {
    dominant: {
      C: `Colérico em ${value}%: orientação a resultado, controle e velocidade de decisão são respostas automáticas. Em situações neutras, o modo padrão já é diretivo.`,
      S: `Sanguíneo em ${value}%: expressividade, busca por conexão e estímulo definem o modo padrão. A ausência de novidade é sentida como custo, não como estabilidade.`,
      M: `Melancólico em ${value}%: análise, exigência e autocrítica são os filtros predominantes de processamento. Praticamente toda situação passa por esse crivo antes de uma resposta.`,
      F: `Fleumático em ${value}%: estabilidade, previsibilidade e preservação de harmonia estruturam a maioria das decisões. Mudança tem custo percebido maior que o real.`,
    },
    relevant: {
      C: `Colérico em ${value}%: assertividade e resultado emergem com clareza em situações de decisão ou liderança — não é automático, mas é consistente.`,
      S: `Sanguíneo em ${value}%: expressividade e sociabilidade aparecem com frequência, especialmente fora de contextos de alta pressão.`,
      M: `Melancólico em ${value}%: análise e autocrítica surgem de forma consistente em trabalho e decisões com consequência. Influencia o ritmo sem paralisar.`,
      F: `Fleumático em ${value}%: tendência à estabilidade e harmonia é perceptível especialmente nas relações — funciona como moderador em situações de tensão.`,
    },
    moderate: {
      C: `Colérico em ${value}%: assertividade presente mas não automática. Surge sob pressão ou quando o resultado está comprometido; opera em segundo plano no restante.`,
      S: `Sanguíneo em ${value}%: expressividade presente mas não dominante. Varia conforme energia disponível e contexto — influencia sem definir o comportamento.`,
      M: `Melancólico em ${value}%: tendência analítica equilibrada. Adiciona tempo ao processo de decisão quando o assunto importa, sem chegar a gerar paralisia.`,
      F: `Fleumático em ${value}%: estabilidade presente sem rigidez. Consegue agir sem consenso total — o traço aparece mais como paciência do que como evitação.`,
    },
  };

  const level = value >= 65 ? 'dominant' : value >= 40 ? 'relevant' : 'moderate';

  return {
    level,
    label: `${NAMES[type]} · ${LEVEL_LABELS[level]}`,
    description: TEXTS[level][type],
  };
}
