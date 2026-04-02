/**
 * impactEngine.js — Motor V3
 *
 * Foco: impacto psicológico + identificação + compartilhabilidade.
 * Todas as funções são puras. Nenhum texto genérico.
 * Cada output deve parecer escrito especificamente para quem recebeu.
 */

const NAMES = { S: 'Sanguíneo', C: 'Colérico', M: 'Melancólico', F: 'Fleumático' };

// ─── Normalização interna ─────────────────────────────────────────────────

function normPct(scores) {
  const raw = {};
  Object.keys(scores).forEach(k => { raw[k] = Math.max(0, scores[k]); });
  const total = Object.values(raw).reduce((a, b) => a + b, 0) || 1;
  const pct = {};
  Object.keys(raw).forEach(k => { pct[k] = Math.round((raw[k] / total) * 100); });
  const diff = 100 - Object.values(pct).reduce((a, b) => a + b, 0);
  if (diff !== 0) {
    const top = Object.keys(pct).reduce((a, b) => pct[a] > pct[b] ? a : b);
    pct[top] += diff;
  }
  return pct;
}

// ─── 1. getProfileName ────────────────────────────────────────────────────

/**
 * Retorna nome do perfil baseado na combinação top+second.
 * Nomes com identidade — não descrições funcionais.
 *
 * @param {string} top - 'S'|'C'|'M'|'F'
 * @param {string} second - 'S'|'C'|'M'|'F'
 * @returns {{ name: string, subtitle: string }}
 */
export function getProfileName(top, second) {
  const PROFILES = {
    SC: { name: 'Executor Estratégico',        subtitle: 'Age com velocidade e arrasta pessoas junto' },
    CS: { name: 'Executor Estratégico',        subtitle: 'Age com velocidade e arrasta pessoas junto' },
    CM: { name: 'Executor de Alta Performance', subtitle: 'Decide rápido e exige o máximo — sem concessão' },
    MC: { name: 'Estrategista de Precisão',    subtitle: 'Analisa fundo, age com alto padrão' },
    CF: { name: 'Diretor Silencioso',          subtitle: 'Entrega resultado sem precisar de palco' },
    FC: { name: 'Líder por Consistência',      subtitle: 'Sustenta direção sem barulho' },
    SM: { name: 'Comunicador de Profundidade', subtitle: 'Conecta na superfície, processa no fundo' },
    MS: { name: 'Analista Expressivo',         subtitle: 'Sente fundo, fala com clareza' },
    SF: { name: 'Catalisador de Grupo',        subtitle: 'Cria conexão onde outros criam atrito' },
    FS: { name: 'Âncora Social',               subtitle: 'Estabiliza ambientes com presença constante' },
    MF: { name: 'Especialista em Consistência', subtitle: 'Qualidade acima da velocidade, sempre' },
    FM: { name: 'Analista Estável',            subtitle: 'Profundidade com baixo ruído' },
  };

  const key = `${top}${second}`;
  return PROFILES[key]
    || PROFILES[`${second}${top}`]
    || { name: 'Perfil Singular', subtitle: 'Combinação incomum de traços' };
}

// ─── 2. generateImpactStatement ──────────────────────────────────────────

/**
 * Frase principal de alto impacto: comportamento + tensão + consequência.
 * Sem suavização. Sem elogio. Deve gerar reconhecimento imediato.
 *
 * @param {{ top: string, second: string, isDominant: boolean, isBalanced: boolean, topValue: number, secondValue: number }} profile
 * @returns {string}
 */
export function generateImpactStatement(profile) {
  const { top, second, isDominant, isBalanced, topValue, secondValue } = profile;

  const STATEMENTS = {
    SC: 'Você não espera — você age. E arrasta quem consegue acompanhar. O problema é que nem todos conseguem, e você raramente percebe quem ficou para trás.',
    CS: 'Você não espera — você age. E arrasta quem consegue acompanhar. O problema é que nem todos conseguem, e você raramente percebe quem ficou para trás.',
    CM: 'Você decide rápido e exige alto padrão ao mesmo tempo. Quando funciona, é impressionante. Quando não, as pessoas ao redor sentem a pressão antes de você perceber que está aplicando.',
    MC: 'Você decide rápido e exige alto padrão ao mesmo tempo. Quando funciona, é impressionante. Quando não, as pessoas ao redor sentem a pressão antes de você perceber que está aplicando.',
    CF: 'Você produz resultado sem precisar de palco. O problema não é a entrega — é que as pessoas ao redor frequentemente não sabem o que você espera delas até que já erraram.',
    FC: 'Você produz resultado sem precisar de palco. O problema não é a entrega — é que as pessoas ao redor frequentemente não sabem o que você espera delas até que já erraram.',
    SM: 'Você conecta com qualquer pessoa, mas poucos te conhecem de verdade. Não porque você esconde — mas porque a maioria para na superfície e você não insiste.',
    MS: 'Você conecta com qualquer pessoa, mas poucos te conhecem de verdade. Não porque você esconde — mas porque a maioria para na superfície e você não insiste.',
    SF: 'Você mantém o grupo unido quase sem esforço. O custo é que você raramente diz o que realmente pensa quando isso poderia gerar conflito.',
    FS: 'Você mantém o grupo unido quase sem esforço. O custo é que você raramente diz o que realmente pensa quando isso poderia gerar conflito.',
    MF: 'Você pensa antes de agir. Sempre. O problema é que "pensar mais um pouco" virou desculpa para não agir quando seria necessário.',
    FM: 'Você pensa antes de agir. Sempre. O problema é que "pensar mais um pouco" virou desculpa para não agir quando seria necessário.',
  };

  const key = `${top}${second}`;
  const base = STATEMENTS[key] || STATEMENTS[`${second}${top}`]
    || `Seu perfil combina ${NAMES[top]} e ${NAMES[second]} de forma que define como você age, reage — e onde você se trava.`;

  // Variação por gap
  if (isDominant) {
    const DOMINANT_ADDENDUM = {
      C: ` Com ${topValue}% de Colérico, isso não é uma tendência ocasional — é seu modo padrão em qualquer situação de pressão.`,
      S: ` Com ${topValue}% de Sanguíneo, você não funciona bem sem estímulo. Ambientes estáveis custam mais energia do que parecem.`,
      M: ` Com ${topValue}% de Melancólico, a autocrítica é constante — mesmo quando ninguém mais está avaliando.`,
      F: ` Com ${topValue}% de Fleumático, a estabilidade que você oferece tem um preço: você aguenta mais do que deveria antes de agir.`,
    };
    return base + (DOMINANT_ADDENDUM[top] || '');
  }

  if (isBalanced) {
    return base + ` Com ${topValue}% de ${NAMES[top]} e ${secondValue}% de ${NAMES[second]}, você alterna entre esses dois modos — o que pode parecer instabilidade para quem te observa de fora.`;
  }

  return base;
}

// ─── 3. generateHiddenPattern ─────────────────────────────────────────────

/**
 * Revela o comportamento automático inconsciente — o que o usuário faz
 * sem perceber, baseado no temperamento dominante e combinação.
 *
 * @param {{ top: string, second: string, topValue: number, isDominant: boolean }} profile
 * @returns {{ title: string, pattern: string, trigger: string }}
 */
export function generateHiddenPattern(profile) {
  const { top, second, topValue, isDominant } = profile;

  const PATTERNS = {
    C: {
      title: 'Você assume controle automaticamente',
      pattern: 'Em situações de impasse ou lentidão, você toma o comando antes de verificar se foi convidado a fazê-lo. Não é arrogância — é um reflexo que acontece antes da consciência.',
      trigger: 'Gatilho: quando algo está indo devagar ou na direção errada.',
    },
    S: {
      title: 'Você busca validação social de forma automática',
      pattern: 'Em qualquer ambiente novo, sua atenção vai primeiro para as pessoas — quem está ali, como reagem a você, se estão engajadas. Você calibra seu comportamento com base nesse retorno antes de perceber que está fazendo isso.',
      trigger: 'Gatilho: qualquer ambiente social, especialmente novos.',
    },
    M: {
      title: 'Você avalia tudo antes de aceitar',
      pattern: 'Quando alguém apresenta uma ideia, seu primeiro movimento interno é encontrar o que está errado ou incompleto. Não é pessimismo — é um filtro automático que opera antes de qualquer decisão consciente.',
      trigger: 'Gatilho: qualquer proposta, resultado ou trabalho apresentado.',
    },
    F: {
      title: 'Você evita confronto antes de processar se ele seria necessário',
      pattern: 'Quando surge tensão, seu primeiro impulso é reduzir a temperatura — ajustar o tom, ceder um ponto, mudar de assunto. O filtro opera antes de você decidir se o confronto seria, na verdade, produtivo.',
      trigger: 'Gatilho: qualquer sinal de desacordo ou tensão interpessoal.',
    },
  };

  const base = PATTERNS[top];

  // Nuance do segundo traço quando equilibrado
  const SECONDARY_NUANCE = {
    C: ' O traço Colérico secundário faz com que isso aconteça com mais urgência em situações de resultado comprometido.',
    S: ' O traço Sanguíneo secundário adiciona um componente social: você busca não só controlar, mas também que os outros aprovem a direção.',
    M: ' O traço Melancólico secundário faz com que o padrão se aprofunde em análise — você não só assume, você também verifica se está certo.',
    F: ' O traço Fleumático secundário modera a intensidade: o padrão acontece, mas com menos atrito do que o temperamento dominante isolado produziria.',
  };

  const nuance = !isDominant && second !== top ? (SECONDARY_NUANCE[second] || '') : '';

  return {
    title: base.title,
    pattern: base.pattern + nuance,
    trigger: base.trigger,
  };
}

// ─── 4. generateMirrorV3 ──────────────────────────────────────────────────

/**
 * Bloco "como você provavelmente é percebido".
 * Tom: direto, levemente desconfortável, realista.
 * Não é sobre o que você quer transmitir — é sobre o que o outro recebe.
 *
 * @param {{ top: string, second: string, isDominant: boolean }} profile
 * @returns {{ headline: string, perceptions: string[], blind_spot: string }}
 */
export function generateMirrorV3(profile) {
  const { top, second, isDominant } = profile;

  const MIRROR = {
    C: {
      headline: 'Eficiente — e difícil de contrariar.',
      perceptions: [
        'As pessoas te respeitam, mas raramente discordam na sua frente.',
        'Você é visto como quem resolve, não como quem escuta.',
        'Quem trabalha com você sabe o que você quer. Mas raramente sabe o que você está sentindo.',
        'Em grupos, sua presença define a direção mesmo quando você não está liderando formalmente.',
      ],
      blind_spot: 'Você provavelmente acha que dá mais espaço do que dá. O silêncio das pessoas ao seu redor frequentemente não é concordância.',
    },
    S: {
      headline: 'Carismático — e difícil de localizar quando importa.',
      perceptions: [
        'As pessoas gostam de estar com você, mas nem sempre contam com você.',
        'Você parece disponível para tudo — e isso cria expectativas que você nem sempre percebe.',
        'Sua energia no começo de algo é contagiante. A ausência depois é igualmente marcante.',
        'As pessoas te acham fácil de conversar, mas às vezes difícil de acompanhar.',
      ],
      blind_spot: 'Você provavelmente subestima quanto as pessoas registram quando você some ou muda de direção. Elas guardam mais do que mostram.',
    },
    M: {
      headline: 'Competente — e difícil de satisfazer.',
      perceptions: [
        'As pessoas confiam no seu trabalho, mas ficam em dúvida se estão correspondendo ao seu padrão.',
        'Você é visto como alguém com alto padrão. Isso impressiona e pressiona ao mesmo tempo.',
        'Seu silêncio diante de um trabalho alheio é frequentemente interpretado como insatisfação — mesmo quando não é.',
        'As pessoas tendem a revisar o que fizeram antes de te mostrar. Mesmo quando não precisariam.',
      ],
      blind_spot: 'Você provavelmente acha que reconhece esforço com mais frequência do que reconhece. Na prática, o reconhecimento explícito vem raramente — e as pessoas contam.',
    },
    F: {
      headline: 'Confiável — e difícil de ler.',
      perceptions: [
        'As pessoas contam com você para manter a calma. Mas raramente sabem o que você realmente quer.',
        'Você é visto como neutro, equilibrado, seguro. Isso atrai — e às vezes frustra quem precisava de posição.',
        'Em conflitos, sua presença reduz a temperatura. Mas as pessoas frequentemente não sabem qual lado você está.',
        'Sua paciência é percebida como virtude — até o ponto em que vira ausência de opinião.',
      ],
      blind_spot: 'Você provavelmente vê sua postura como equilíbrio. As pessoas ao redor frequentemente interpretam como passividade — e param de te consultar sobre decisões importantes.',
    },
  };

  const base = MIRROR[top];

  // Adição do traço secundário quando não dominante forte
  const SECONDARY_ADDITIONS = {
    C: 'O traço Colérico secundário faz com que você surpreenda quem está acostumado com seu modo mais suave — reagindo com assertividade quando algo importante está em risco.',
    S: 'O traço Sanguíneo adiciona calor à percepção principal — tornando você mais acessível do que o traço dominante isolado sugeriria.',
    M: 'O traço Melancólico adiciona uma camada de profundidade: por baixo do que aparece na superfície, há mais avaliação interna do que as pessoas percebem.',
    F: 'O traço Fleumático adiciona estabilidade — fazendo você parecer menos intenso e mais previsível do que o traço dominante isolado produziria.',
  };

  const perceptions = !isDominant && second
    ? [...base.perceptions, SECONDARY_ADDITIONS[second]].filter(Boolean)
    : base.perceptions;

  return {
    headline: base.headline,
    perceptions,
    blind_spot: base.blind_spot,
  };
}

// ─── 5. generateRefinedInsights ───────────────────────────────────────────

/**
 * Insights comportamentais: comportamento + consequência real.
 * Formato curto, direto, sem cabeçalho de temperamento.
 * Devem parecer observações de alguém que te conhece bem.
 *
 * @param {{ S: number, C: number, M: number, F: number }} scores
 * @returns {Array<{ id: string, text: string, consequence: string }>}
 */
export function generateRefinedInsights(scores) {
  const pct = normPct(scores);
  const list = [];

  const add = (id, text, consequence) => list.push({ id, text, consequence });

  // Colérico
  if (pct.C > 60) {
    add('C_high',
      'Você tende a decidir antes de ouvir tudo.',
      'Isso acelera execução — e às vezes corta contribuições que teriam mudado o resultado.'
    );
  } else if (pct.C >= 45) {
    add('C_mid',
      'Você prioriza velocidade de decisão.',
      'O custo aparece quando a pressa gera retrabalho que teria sido evitado com 10 minutos a mais de alinhamento.'
    );
  }

  // Melancólico
  if (pct.M > 50) {
    add('M_high',
      'Você aplica o mesmo padrão de exigência ao seu trabalho e ao dos outros.',
      'O resultado é qualidade real — e um ambiente onde as pessoas raramente se sentem suficientemente boas.'
    );
  } else if (pct.M >= 38) {
    add('M_mid',
      'Você tende a prolongar o processo de análise além do necessário.',
      'Isso reduz erros de execução — e aumenta o custo de oportunidade de decisões atrasadas.'
    );
  }

  // Sanguíneo
  if (pct.S > 50) {
    add('S_high',
      'Você investe mais energia no início de projetos do que na fase de manutenção.',
      'O padrão produz inícios brilhantes e entregas inconsistentes — o que outros registram mais do que você percebe.'
    );
  } else if (pct.S >= 38) {
    add('S_mid',
      'Você se adapta rápido a contextos novos.',
      'A mesma flexibilidade que facilita entrada em novos projetos dificulta o foco sustentado nos que já estão em andamento.'
    );
  }

  // Fleumático
  if (pct.F > 50) {
    add('F_high',
      'Você evita confronto antes mesmo de avaliar se ele seria útil.',
      'Situações que precisariam de posição firme ficam sem resolução — e o custo acumula até aparecer de forma mais cara.'
    );
  } else if (pct.F >= 38) {
    add('F_mid',
      'Você funciona melhor em ambientes previsíveis.',
      'Em contextos de mudança rápida, a mesma consistência que é um ativo pode ser percebida como resistência.'
    );
  }

  // Thresholds baixos
  if (pct.F < 15) {
    add('F_low',
      'Você tem baixa tolerância a ambientes lentos ou sem ritmo.',
      'A frustração aparece antes que você nomeie de onde vem — e quem está perto sente antes de você verbalizar.'
    );
  }

  if (pct.S < 15) {
    add('S_low',
      'Ambientes de alta demanda social têm custo energético real para você.',
      'Isso é frequentemente interpretado pelos outros como frieza — mesmo quando você está apenas preservando energia.'
    );
  }

  if (pct.C < 15) {
    add('C_low',
      'Você recua de posições de liderança mesmo quando tem competência para ocupá-las.',
      'O resultado é ser subestimado em contextos onde direção é valorizada — e onde você poderia contribuir mais.'
    );
  }

  if (pct.M < 15) {
    add('M_low',
      'Você age com dados parciais com mais frequência do que percebe.',
      'Em decisões de baixo risco, isso é eficiência. Em decisões de alto impacto, é exposição.'
    );
  }

  // Combinações
  if (pct.C >= 40 && pct.M >= 35) {
    add('CM_combo',
      'Você combina urgência e exigência de padrão no mesmo momento.',
      'Quando o resultado é bom, isso impressiona. Quando o processo envolve outras pessoas, o atrito é quase inevitável.'
    );
  }

  if (pct.S >= 40 && pct.F >= 35) {
    add('SF_combo',
      'Você prefere preservar o relacionamento a entregar a verdade difícil.',
      'O custo aparece quando a outra pessoa descobre — mais tarde — que você sabia e não disse.'
    );
  }

  if (pct.M >= 40 && pct.F >= 35) {
    add('MF_combo',
      'Análise e paciência, juntas, criam o ambiente perfeito para adiar o que precisa ser feito.',
      'A racionalização é sempre boa o suficiente para parecer justificada — até que o prazo force a decisão.'
    );
  }

  return list.slice(0, 5);
}

// ─── 6. buildProfileV3 ───────────────────────────────────────────────────

/**
 * Versão consolidada do buildProfile para uso interno no engine V3.
 * Retorna todos os campos necessários para as demais funções.
 */
export function buildProfileV3(scores) {
  const pct    = normPct(scores);
  const sorted = Object.keys(pct).sort((a, b) => pct[b] - pct[a]);
  const [top, second, third, fourth] = sorted;
  const topValue    = pct[top];
  const secondValue = pct[second];
  const gap         = topValue - secondValue;
  const isDominant  = gap > 20;
  const isBalanced  = gap < 10;
  const gapType     = isDominant ? 'isolado' : isBalanced ? 'misto' : 'definido';

  return { pct, sorted, top, second, third, fourth, topValue, secondValue, gap, isDominant, isBalanced, gapType };
}

// ─── 7. Texto de compartilhamento ────────────────────────────────────────

/**
 * Gera o conteúdo para navigator.share().
 *
 * @param {{ name: string }} profileName
 * @param {string} statement
 * @returns {{ title: string, text: string, url: string }}
 */
export function buildShareContent(profileName, statement) {
  // Limita statement a ~120 chars para compartilhamento
  const short = statement.length > 120
    ? statement.slice(0, 117).replace(/\s\w+$/, '') + '...'
    : statement;

  return {
    title: `Meu temperamento: ${profileName.name}`,
    text: `${profileName.name} — ${profileName.subtitle}\n\n"${short}"\n\nDescubra o seu perfil:`,
    url: typeof window !== 'undefined' ? window.location.href : 'https://temperare.app',
  };
}


// ─── generateSharePhrase ─────────────────────────────────────────────────

/**
 * Frase curta e direta para compartilhamento — escrita em primeira pessoa.
 * Deve soar como algo que o usuário diria sobre si mesmo.
 * Alta identificação + levemente desconfortável = compartilhável.
 *
 * @param {{ top: string, topValue: number, isDominant: boolean }} profile
 * @returns {{ phrase: string, context: string }}
 */
export function generateSharePhrase(profile) {
  const { top, topValue, isDominant } = profile;

  const PHRASES = {
    C: {
      phrase: 'Eu ajo rápido e cobro alto — nem todo mundo acompanha.',
      context: 'Colérico em ' + topValue + '%',
    },
    S: {
      phrase: 'Eu começo com energia — mas nem sempre termino com consistência.',
      context: 'Sanguíneo em ' + topValue + '%',
    },
    M: {
      phrase: 'Eu busco fazer certo — às vezes isso me trava.',
      context: 'Melancólico em ' + topValue + '%',
    },
    F: {
      phrase: 'Eu evito conflito — mesmo quando deveria agir.',
      context: 'Fleumático em ' + topValue + '%',
    },
  };

  const base = PHRASES[top] || { phrase: 'Meu padrão define como ajo — e onde me trava.', context: top + ' em ' + topValue + '%' };

  // Reforça quando dominante forte
  if (isDominant) {
    const STRONG = {
      C: 'Eu ajo rápido, cobro alto e não espero — nem todo mundo aguenta o ritmo.',
      S: 'Eu começo tudo com energia — e termino o que me interessa, o resto fica.',
      M: 'Eu preciso fazer certo — às vezes isso me trava mais do que o problema em si.',
      F: 'Eu evito conflito automaticamente — mesmo quando sei que deveria enfrentar.',
    };
    if (STRONG[top]) {
      return { phrase: STRONG[top], context: base.context };
    }
  }

  return base;
}

// ─── generateFinalPunch ───────────────────────────────────────────────────

/**
 * Frase final de impacto — o "punch" que fecha o resultado.
 * Aponta o próximo passo real, não motivação genérica.
 * Baseada no temperamento dominante.
 *
 * @param {{ top: string, isDominant: boolean, isBalanced: boolean }} profile
 * @returns {{ punch: string, sub: string }}
 */
export function generateFinalPunch(profile) {
  const { top, isDominant } = profile;

  const PUNCHES = {
    C: {
      punch: 'Seu maior ganho agora não está em agir mais — está em desacelerar antes de agir.',
      sub: 'Mais velocidade não vai resolver o que a falta de alinhamento já criou.',
    },
    S: {
      punch: 'Seu maior ganho agora não está em começar — está em terminar.',
      sub: 'A próxima energia que você sentir, direcione para algo que já está em andamento.',
    },
    M: {
      punch: 'Seu maior ganho agora não está em melhorar — está em concluir.',
      sub: 'Entregue o que está pronto. Perfeito que não sai não serve a ninguém.',
    },
    F: {
      punch: 'Seu maior ganho agora não está em evitar — está em decidir.',
      sub: 'A situação que você está tolerando provavelmente não vai se resolver sozinha.',
    },
  };

  return PUNCHES[top] || {
    punch: 'Seu maior ganho agora está em usar o que você já sabe sobre si mesmo.',
    sub: 'O autoconhecimento só serve se mudar algo concreto.',
  };
}
