/**
 * profiles.js
 * Dados estáticos de perfil (nomes, descrições comportamentais, pontos fortes/atenção, sugestões).
 * A função getProfileData agora integra o motor dinâmico de interpretation.js e notifications.js.
 */

import { generateProfile, generateInsights, describeIntensity } from '../utils/interpretation';
import { getDailySuggestion, getSuggestionsForTemperament, getSmartSuggestion } from '../utils/notifications';
import {
  buildProfile,
  generateCoreStatement,
  generateCombinationInsight,
  generateDeepInsights,
  generateIntensityDescription,
} from '../utils/advancedInterpretation';
import {
  buildProfile as buildProfileV2,
  generateCoreStatement as generateCoreStatementV2,
  generateCombinationInsight as generateCombinationInsightV2,
  generateDeepInsights as generateDeepInsightsV2,
  generateMirrorInsight,
  generateIntensityDescription as generateIntensityDescriptionV2,
} from '../utils/advancedInterpretationV2';
import { getSmartSuggestion as getSmartSuggestionV2 } from '../utils/notificationsV2';
import {
  buildProfileV3,
  getProfileName,
  generateImpactStatement,
  generateHiddenPattern,
  generateMirrorV3,
  generateRefinedInsights,
  generateSharePhrase,
  generateFinalPunch,
  buildShareContent,
} from '../utils/impactEngine';

export const PROFILE_NAMES = {
  SC: { name: 'Executor Social', subtitle: 'Ação com tração sobre pessoas' },
  CS: { name: 'Executor Social', subtitle: 'Ação com tração sobre pessoas' },
  SM: { name: 'Comunicador Reflexivo', subtitle: 'Expressão com camadas internas' },
  MS: { name: 'Comunicador Reflexivo', subtitle: 'Expressão com camadas internas' },
  SF: { name: 'Conector Estável', subtitle: 'Presença que sustenta sem dominar' },
  FS: { name: 'Conector Estável', subtitle: 'Presença que sustenta sem dominar' },
  CM: { name: 'Estrategista Rigoroso', subtitle: 'Resultado com exigência de padrão' },
  MC: { name: 'Estrategista Rigoroso', subtitle: 'Resultado com exigência de padrão' },
  CF: { name: 'Líder Consistente', subtitle: 'Direção sem necessidade de palco' },
  FC: { name: 'Líder Consistente', subtitle: 'Direção sem necessidade de palco' },
  MF: { name: 'Analista Estável', subtitle: 'Profundidade com baixo ruído' },
  FM: { name: 'Analista Estável', subtitle: 'Profundidade com baixo ruído' },
};

// Descrições comportamentais reescritas: sem linguagem elogiosa, sem "líder natural"
export const PROFILE_DESCRIPTIONS = {
  SC: `Sanguíneo e Colérico combinados produzem um padrão de alta iniciativa social com forte orientação a resultado. Você tende a puxar situações para frente antes que o grupo esteja alinhado — o que funciona em contextos onde velocidade importa mais que consenso, e falha quando o buy-in é pré-requisito para execução. A mesma energia que mobiliza pessoas cria dificuldade em sustentar projetos após o estágio inicial de entusiasmo. Relacionamentos são iniciados com facilidade e raramente aprofundados com o mesmo esforço.`,

  SM: `Sanguíneo e Melancólico em combinação criam oscilação real entre expressividade e introspecção. Você é capaz de conexão social eficaz, mas carrega necessidades emocionais que não aparecem na superfície — e que raramente são verbalizadas diretamente. A tendência é que pessoas próximas descubram essas necessidades por atrito, não por comunicação. Críticas atingem mais do que seria funcional, e a recuperação leva mais tempo do que o evento justificaria.`,

  SF: `Sanguíneo com Fleumático: alta orientação social combinada com baixa confrontação. Você sustenta ambientes relacionais positivos com consistência, mas a manutenção da harmonia frequentemente tem custo de honestidade. A tendência de ajustar o que diz ao que o outro quer ouvir é um padrão automático, não uma escolha consciente — o que torna difícil identificar quando está sendo deshonesto consigo mesmo.`,

  CM: `Colérico com Melancólico: orientação a resultado e exigência de padrão aplicados simultaneamente. A combinação produz execução de alta qualidade, mas com custo interpessoal que o perfil tende a subestimar. A tolerância a erros alheios é baixa, e a comunicação disso raramente é calibrada — o que gera percepção de agressividade mesmo quando a intenção é técnica. A autocrítica é proporcional à crítica externa, criando um padrão de exigência que raramente tem folga.`,

  CF: `Colérico com Fleumático: capacidade de direcionar com constância, sem dependência de reconhecimento externo. O risco principal não está na execução, mas na relação com as pessoas à volta: a eficiência como modo padrão torna difícil identificar quando alguém precisa de suporte emocional antes de suporte técnico. Essa lacuna raramente é percebida pelo próprio perfil — ela é percebida pelos outros.`,

  MF: `Melancólico com Fleumático: análise profunda combinada com baixa urgência. O resultado é um perfil que produz trabalho de alta qualidade em ritmo próprio, com alta resistência a pressão externa. O ponto crítico é a tendência à passividade em situações que exigem confrontação ou iniciativa sem garantias: a análise é usada para adiar, e a paciência para tolerar situações que deveriam ser alteradas.`,
};

export const STRENGTHS = {
  SC: [
    'Inicia ação em grupos paralisados sem precisar de consenso prévio',
    'Adapta comunicação ao interlocutor com agilidade real',
    'Executa sob pressão sem perder capacidade de influência social',
    'Identifica momentum e age antes que a janela feche',
  ],
  SM: [
    'Lê estados emocionais alheios com precisão acima da média',
    'Consegue traduzir complexidade interna em comunicação acessível',
    'Cria conexão genuína — não superficial — quando investe tempo',
    'Criatividade que emerge da tensão entre análise e expressão',
  ],
  SF: [
    'Sustenta coesão de grupo em períodos prolongados sem desgaste visível',
    'Confiabilidade percebida como constante — as pessoas sabem o que esperar',
    'Capacidade de mediar sem polarizar, mantendo todas as partes ouvidas',
    'Energia social que não intimida — conecta sem competir',
  ],
  CM: [
    'Identifica inconsistências antes que se tornem problemas estruturais',
    'Mantém padrão de entrega mesmo sob pressão intensa',
    'Capacidade de sustentar projetos complexos do diagnóstico à conclusão',
    'Combina velocidade de decisão com exigência de qualidade — raro',
  ],
  CF: [
    'Executa sem depender de aprovação ou reconhecimento externo',
    'Mantém orientação a resultado em projetos de longa duração sem perder foco',
    'Capaz de sustentar decisões impopulares quando os dados as sustentam',
    'Confiabilidade sob pressão prolongada — não oscila com o ambiente',
  ],
  MF: [
    'Produz trabalho com taxa de erro significativamente abaixo da média',
    'Consistência de comportamento que gera confiança estrutural nos outros',
    'Capacidade analítica que identifica o que outros simplificam prematuramente',
    'Mantém comprometimentos mesmo quando o contexto muda',
  ],
};

export const WEAKNESSES = {
  SC: [
    'Inicia mais frentes do que conclui — foco cai em fases intermediárias, não no início',
    'Impaciência com lentidão alheia frequentemente externalizada de forma contraproducente',
    'Rede de relacionamentos larga e rasa — pouco investimento em profundidade',
    'Decisões tomadas por entusiasmo com dados insuficientes: o erro só aparece depois',
  ],
  SM: [
    'Oscilação de humor que confunde e afasta quem não entende o padrão',
    'Personaliza críticas neutras — leva para o pessoal o que era técnico',
    'Dificuldade de estabelecer e manter limites: quer agradar e quer se preservar ao mesmo tempo',
    'Alta energia de início com queda de consistência em projetos longos sem estímulo externo',
  ],
  SF: [
    'Evita confrontos necessários para preservar harmonia de curto prazo',
    'Diz sim quando quer dizer não — o acúmulo de compromissos que não servem cria ressentimento silencioso',
    'Depende de validação social para manter autoestima estável em períodos de pressão',
    'Lento para iniciar qualquer projeto que exija enfrentar resistência ou incerteza',
  ],
  CM: [
    'Exigência em nível que poucos sustentam — cria isolamento mesmo com pessoas competentes',
    'Feedback técnico entregue com tom que é percebido como ataque pessoal',
    'Não delega com autonomia real — acompanha de perto o que deveria soltar',
    'Autocrítica que passa de ajuste para punição em períodos de resultado abaixo do esperado',
  ],
  CF: [
    'Subestima consistentemente necessidades emocionais das pessoas ao redor',
    'Não verbaliza reconhecimento — o que é percebido como indiferença, não como eficiência',
    'Reduz problemas humanos a problemas de processo: a análise ignora a dimensão relacional',
    'Ritmo e tom não se adaptam para contextos que exigem paciência relacional antes de execução',
  ],
  MF: [
    'Análise como mecanismo de evitação de ação: o processo de pensar substitui o de decidir',
    'Conflito direto é evitado mesmo quando necessário — o problema acumula até tornar-se crise',
    'Padrão rígido de qualidade dificulta adaptação quando o contexto exige flexibilidade ou velocidade',
    'Percebido como distante ou indiferente por perfis mais expressivos — a profundidade não é visível externamente',
  ],
};

export const SUGGESTIONS = {
  SC: {
    daily: [
      'Reserve 20 minutos por semana para comparar o que iniciou versus o que concluiu. O balanço vai incomodar — essa é a função.',
      'Antes de aceitar qualquer nova iniciativa, feche uma pendente. Regra de entrada e saída.',
      'Crie uma métrica de conclusão, não de início — seu sistema de recompensa interno confunde os dois.',
    ],
    relationships: [
      'Escolha 2–3 pessoas para investir com profundidade real, não apenas frequência de contato.',
      'Antes de resolver, pergunte: "você quer solução ou quer ser ouvido?" — você pula para o primeiro por padrão.',
      'Verbalizar reconhecimento específico não é natural para você, mas tem impacto desproporcional para quem recebe.',
    ],
    work: [
      'Em projetos longos, defina checkpoints de qualidade explícitos — você naturalmente acelera ao final e perde detalhes.',
      'Inclua um perfil analítico no processo de decisão antes de executar em projetos de alto risco.',
      'Diferencie urgente de importante no início de cada semana — seu padrão é tratar tudo como urgente.',
    ],
  },
  SM: {
    daily: [
      'Documente insights nos momentos de alta energia — você perde material real quando o humor cai.',
      'Construa uma rotina mínima funcional para dias de baixa energia. Não dependa de estar inspirado.',
      'Identifique seus gatilhos de oscilação de humor e trate-os como dados operacionais, não como falhas.',
    ],
    relationships: [
      'Comunique necessidades emocionais de forma direta — as pessoas não leem subtext com precisão.',
      'Defina limites de disponibilidade emocional. Você absorve o estado dos outros mais do que percebe.',
      'Antes de interpretar uma crítica como ataque, verifique a intenção diretamente. Sua interpretação padrão é pessimista.',
    ],
    work: [
      'Estruture projetos em blocos de 2–3 semanas com entregas mensuráveis. Sua consistência não é linear.',
      'Trabalhe em ambientes com estímulo intelectual e estético. Sua produção cai significativamente em ambientes neutros.',
      'Documente seu processo para que seja replicável — a tendência de fazer diferente cada vez prejudica escalabilidade.',
    ],
  },
  SF: {
    daily: [
      'Pratique dizer não para pelo menos uma coisa por semana que você aceitaria apenas para não decepcionar.',
      'Estabeleça horário de encerramento rígido — sua tendência é estender compromissos além do necessário.',
      'Identifique onde está evitando um confronto que já deveria ter acontecido. Adiar tem custo real.',
    ],
    relationships: [
      'Harmonia mantida à custa de verdades não ditas não é harmonia — é adiamento de problema.',
      'Expresse algo difícil e verdadeiro com uma pessoa de confiança. Observe o que acontece.',
      'Identifique quem te energiza e quem te drena. Você investe igualmente nos dois por padrão.',
    ],
    work: [
      'Dê sua opinião antes de conhecer a do grupo — seu hábito de sincronizar obscurece sua perspectiva real.',
      'Busque projetos com componente de iniciativa individual. Você tem capacidade de liderança não exercitada.',
      'Quando precisar de recurso ou suporte, solicite diretamente. Sua aversão a causar inconveniência te prejudica.',
    ],
  },
  CM: {
    daily: [
      'Diferencie alto padrão de perfeccionismo improdutivo: em qual ponto mais esforço não muda o resultado?',
      'Reserve projetos "bons o suficiente" para situações de baixo impacto. Nem tudo justifica seu máximo.',
      'Monitore seu nível de irritação — é um indicador de sobrecarga, não de incompetência alheia.',
    ],
    relationships: [
      'Antes de corrigir, pergunte: isso muda o resultado ou satisfaz minha necessidade de precisão?',
      'Verbalize reconhecimento explícito. Não é automático para você, mas tem impacto desproporcionalmente alto.',
      'O caminho diferente do seu para o mesmo resultado não é necessariamente inferior. Teste essa hipótese.',
    ],
    work: [
      'Pratique delegar com briefing claro e depois se afastar. Microgerenciar custa mais que o erro que quer evitar.',
      'Separe feedback técnico de julgamento de caráter — você frequentemente entrega os dois misturados.',
      'Antes de escalar exigências, crie segunda opinião. O que é óbvio para você frequentemente não é para a maioria.',
    ],
  },
  CF: {
    daily: [
      'Pergunte como as pessoas ao seu redor estão antes de entrar no modo tarefa — não como protocolo, com intenção.',
      'Identifique alguém próximo que pode precisar de suporte emocional que você não percebeu.',
      'Reduza velocidade em conversas 1:1. Sua tendência de resolver rápido retira espaço do outro.',
    ],
    relationships: [
      'Reconhecimento verbalizado tem valor para os outros mesmo quando parece redundante para você.',
      'Situações emocionais raramente têm solução direta. Às vezes a pessoa precisa ser ouvida, não corrigida.',
      'Invista tempo em entender o que motiva cada pessoa individualmente. Eficiência aumenta com esse dado.',
    ],
    work: [
      'Inclua métricas de engajamento da equipe além de produtividade — são indicadores avançados de risco.',
      'Crie rituais de reconhecimento coletivo. Parecem dispensáveis para você, mas têm função estrutural.',
      'Antes de implementar mudança, mapeie resistência provável e construa alinhamento — reduz atrito depois.',
    ],
  },
  MF: {
    daily: [
      'Defina prazo para decidir antes de começar a análise, não depois. Análise sem prazo não gera clareza.',
      'Com 70% das informações, você já pode agir. Identifique o que está impedindo o gatilho.',
      'Identifique algo que está esperando o momento certo. Esse momento não é um evento externo — é uma decisão.',
    ],
    relationships: [
      'Expresse discordância diretamente quando ela existe. Ressentimento silencioso corrói mais que o conflito aberto.',
      'Faça perguntas abertas com intenção de entender, não de avaliar. Há diferença no tom.',
      'Compartilhe sua perspectiva proativamente. As pessoas precisam saber o que você pensa, não só o que você faz.',
    ],
    work: [
      'Regra de 48 horas: se está pensando em algo há mais de dois dias sem agir, force uma decisão.',
      'Busque ambientes que valorizam profundidade. Você funciona abaixo da capacidade em culturas de velocidade superficial.',
      'Documente seu processo de análise para compartilhar. Tem valor pedagógico que você não está aproveitando.',
    ],
  },
};

/**
 * getProfileData — função principal que integra dados estáticos e motor dinâmico.
 * Chamada pelo useQuiz ao concluir o questionário.
 *
 * @param {{ S: number, C: number, M: number, F: number }} scores - scores brutos acumulados
 * @returns {Object} resultado completo para exibição na tela Results
 */
export function getProfileData(scores) {
  // ── Motor legado (mantido para compatibilidade com campos existentes) ──
  const profileMeta = generateProfile(scores);
  const { pct, sorted, dominant, secondary, intensity, gap, gapType } = profileMeta;

  // Lookup estático
  const key = `${dominant}${secondary}`;
  const canonicalKey = PROFILE_NAMES[key]
    ? key
    : (PROFILE_NAMES[`${secondary}${dominant}`] ? `${secondary}${dominant}` : key);

  const insights = generateInsights(pct);
  const intensityDescriptions = sorted.map(t => describeIntensity(pct[t], t));
  const dailySuggestion = getDailySuggestion(pct);
  const notifications = getSuggestionsForTemperament(dominant, 5);

  // ── Motor avançado (novos campos) ──
  const advProfile       = buildProfile(scores);
  const coreStatement    = generateCoreStatement(advProfile);
  const combinationInsight = generateCombinationInsight(advProfile);
  const deepInsights     = generateDeepInsights(scores);
  const advIntensities   = advProfile.sorted.map(t =>
    generateIntensityDescription(advProfile.pct[t], t)
  );
  const smartSuggestion  = getSmartSuggestion(pct);

  // ── Motor V2 ──
  const profileV2            = buildProfileV2(scores);
  const coreStatementV2      = generateCoreStatementV2(profileV2);
  const combinationInsightV2 = generateCombinationInsightV2(profileV2);
  const deepInsightsV2       = generateDeepInsightsV2(scores);
  const mirrorInsight        = generateMirrorInsight(profileV2);
  const advIntensitiesV2     = profileV2.sorted.map(t =>
    generateIntensityDescriptionV2(profileV2.pct[t], t)
  );
  const smartSuggestionV2    = getSmartSuggestionV2(pct);

  // ── Motor V3 — impacto + compartilhamento ──
  const profileV3      = buildProfileV3(scores);
  const profileNameV3   = getProfileName(profileV3.top, profileV3.second);
  const impactStatement = generateImpactStatement(profileV3);
  const hiddenPattern   = generateHiddenPattern(profileV3);
  const mirrorV3        = generateMirrorV3(profileV3);
  const refinedInsights = generateRefinedInsights(scores);
  const sharePhrase     = generateSharePhrase(profileV3);
  const finalPunch      = generateFinalPunch(profileV3);
  const shareContent    = buildShareContent(profileNameV3, sharePhrase.phrase);

  return {
    // ── Campos base ──
    pct,
    sorted,
    dominant,
    secondary,
    key: canonicalKey,
    intensity,
    gap,
    gapType,

    // ── Metadados de perfil ──
    isDominant: profileV3.isDominant,
    isBalanced: profileV3.isBalanced,

    // ── Estático legado ──
    profile: PROFILE_NAMES[canonicalKey] || { name: 'Perfil Híbrido', subtitle: 'Distribuição equilibrada entre temperamentos' },
    description: PROFILE_DESCRIPTIONS[canonicalKey] || PROFILE_DESCRIPTIONS[`${secondary}${dominant}`] || '',
    strengths: STRENGTHS[canonicalKey] || STRENGTHS[`${secondary}${dominant}`] || [],
    weaknesses: WEAKNESSES[canonicalKey] || WEAKNESSES[`${secondary}${dominant}`] || [],
    suggestions: SUGGESTIONS[canonicalKey] || SUGGESTIONS[`${secondary}${dominant}`] || {},

    // ── Dinâmico legado ──
    insights,
    intensityDescriptions,
    dailySuggestion,
    notifications,

    // ── V1 avançado (fallback) ──
    coreStatement,
    combinationInsight,
    deepInsights,
    advIntensities,
    smartSuggestion,

    // ── V2 ──
    coreStatementV2,
    combinationInsightV2,
    deepInsightsV2,
    mirrorInsight,
    advIntensitiesV2,
    smartSuggestionV2,

    // ── V3 — fonte principal ──
    profileNameV3,
    impactStatement,
    hiddenPattern,
    mirrorV3,
    refinedInsights,
    sharePhrase,
    finalPunch,
    shareContent,
  };
}
