/**
 * notifications.js
 * 20 mensagens por temperamento + lógica de seleção baseada no perfil real.
 * Mensagens curtas, acionáveis, sem motivação genérica.
 */

export const SUGGESTIONS_POOL = {
  S: [
    'Antes de aceitar um novo compromisso, liste os que já estão abertos. Quantos você realmente vai concluir?',
    'Entusiasmo no início não é garantia de follow-through. Defina o que "concluído" significa antes de começar.',
    'Reserve 15 minutos ao final do dia para registrar o que você prometeu a outras pessoas hoje.',
    'Sua tendência é iniciar múltiplas frentes. Escolha uma para avançar de forma real antes de abrir outra.',
    'Conexão superficial custa pouco e produz pouco. Reserve tempo hoje para uma conversa sem agenda.',
    'Você evitou algo difícil ontem porque pareceu sem graça? Essa é a tarefa para hoje.',
    'Identifique um projeto que você considerou "quase pronto" há mais de duas semanas. Finalize ou abandone.',
    'Sua energia social drena recursos cognitivos. Planeje tarefas que exigem concentração antes das interações.',
    'Não confunda movimento com progresso. O que avançou de forma mensurável nos últimos 7 dias?',
    'Você está procrastinando algo por falta de estímulo, não por falta de capacidade. Identifique qual.',
    'Antes de reagir a uma crítica, espere 24 horas. Sua resposta imediata raramente é a mais útil.',
    'Escolha uma pessoa com quem tem uma conversa pendente há mais de um mês. Inicie hoje.',
    'Variedade é seu combustível, mas compromisso é o que produz resultado. Onde você está sacrificando um pelo outro?',
    'Releia os últimos três compromissos que você assumiu. Todos estão em andamento?',
    'Sua capacidade de começar é uma força. Desenvolva a capacidade de terminar — essa é a lacuna real.',
    'Quando foi a última vez que você ouviu alguém por mais de 5 minutos sem interromper ou redirecionar?',
    'Você tem uma ideia nova hoje? Anote, não execute. Revise em 72 horas antes de agir.',
    'Planeje amanhã em 3 itens, não em 10. Prioridade não é lista — é eliminação.',
    'Sua disposição de ajudar é real, mas você promete mais do que entrega? Isso corrói confiança lentamente.',
    'Reserve um bloco de 2 horas sem interação social para trabalho profundo. Seu melhor trabalho não acontece em movimento.',
  ],

  C: [
    'Você interveio em uma tarefa que havia delegado? Calcule o custo disso para a autonomia dos outros.',
    'Antes de corrigir alguém, pergunte se o erro afeta o resultado final. Se não afeta, não corrija.',
    'Sua impaciência hoje é informação: o que está demandando mais do que você tem a oferecer?',
    'Identifique uma decisão que você tomou sozinho na última semana que deveria ter envolvido outros.',
    'Você deu feedback hoje? Se sim, ele foi sobre o comportamento ou sobre a pessoa?',
    'Delegar não é dar uma tarefa. É explicar o objetivo, os limites e se afastar. Tente isso hoje.',
    'Quando foi a última vez que você mudou de posição baseado no argumento de outra pessoa?',
    'Liste três pessoas que trabalham com você. O que as motiva individualmente? Se não souber, descubra.',
    'Urgência é seu estado padrão. Avalie se a urgência de hoje é real ou uma preferência por velocidade.',
    'Você reconheceu o esforço de alguém publicamente esta semana? Reconhecimento verbal tem custo zero e efeito alto.',
    'Identifique uma situação em que você tinha razão mas comunicou de forma que invalidou o resultado.',
    'Sua tolerância a erro alheio é inversamente proporcional à sua pressão interna. Meça o segundo para entender o primeiro.',
    'Você está gerenciando uma pessoa ou um resultado? A diferença importa para quem está sendo gerenciado.',
    'Reserve 10 minutos hoje para não resolver nada — apenas observar. O que você percebe que normalmente ignora?',
    'Quando alguém traz um problema para você, pergunte: "Você quer uma solução ou quer ser ouvido?" Antes de responder.',
    'Você tem o hábito de interromper? Grave uma reunião e ouça. Os dados vão surpreender.',
    'Identifique algo que só você faz e que outra pessoa poderia aprender. Ensine essa semana.',
    'Sua energia alta pode parecer pressão para pessoas de ritmo diferente. Ajuste o tom antes de acelerar o passo.',
    'O que você evita fazer porque sente que deveria ser feito de um jeito específico? Essa é sua maior âncora.',
    'Você terminou o dia satisfeito com os resultados? Se não, o problema foi execução ou expectativa?',
  ],

  M: [
    'Você está em fase de análise há mais de 48 horas? Defina um prazo para decidir — não para terminar de analisar.',
    'Perfeccionismo protege do erro mas também protege da entrega. Qual é o custo real do atraso hoje?',
    'Há um conflito que você está evitando? Escreva o que diria se não tivesse medo da reação do outro.',
    'Sua autocrítica hoje está sendo produtiva ou punitiva? Há diferença entre ajustar e se castigar.',
    'Identifique algo que você fez bem nos últimos 3 dias. Não minimze — registre e reconheça.',
    'Com 70% das informações necessárias, você já pode agir. O que está esperando que chegue a 70%?',
    'Você revisou algo mais de três vezes hoje? Cada revisão adicional tem retorno decrescente.',
    'Há uma crítica que você recebeu e que ainda está processando? Separe o que é dado do que é interpretação.',
    'Compartilhe uma perspectiva que você normalmente guarda para si com alguém de confiança. Observe o que acontece.',
    'Você está esperando condições ideais para agir? Liste as condições que consideraria "suficientes".',
    'Seu padrão de qualidade é uma força. Quando foi aplicado à pessoa errada ou no momento errado, foi um problema?',
    'Identifique uma tarefa que você está adiando porque não quer fazer de forma medíocre. Faça de forma suficiente.',
    'Você tem expectativas não verbalizadas sobre alguém próximo? Elas vão se tornar um problema antes que você perceba.',
    'Reserve tempo para não fazer nada que precise ser avaliado. Seu cérebro precisa de períodos sem exigência.',
    'Quando foi a última vez que você foi surpreendido positivamente por como alguém fez algo diferente de você?',
    'Você tende a ruminar decisões passadas. Escolha uma e encerre o processo de análise deliberadamente.',
    'Há algo que você quer comunicar mas está esperando o momento certo? O momento certo é agora.',
    'Identifique onde você está aplicando alto padrão em algo de baixo impacto. Redistribua esse esforço.',
    'Você conhece seu limite de carga antes de entrar em modo autocrítico? Mapeie os sinais físicos e cognitivos.',
    'Sua sensibilidade capta muito. O que você captou esta semana que ainda não processou conscientemente?',
  ],

  F: [
    'Você disse sim para algo que queria dizer não? Identifique o custo real desse compromisso.',
    'Há uma verdade que você está guardando para não causar desconforto. Escreva-a. Decida depois se vai comunicar.',
    'Identifique uma situação que está tolerando há mais de um mês sem agir. O que está esperando?',
    'Sua estabilidade é valiosa. Mas estabilidade mantida por evitação não é a mesma coisa que equilíbrio real.',
    'Você foi honesto sobre o que precisava em uma conversa recente ou ajustou sua resposta para não gerar atrito?',
    'Tome uma decisão menor hoje sem consultar ninguém. Observe o desconforto — e observe que passa.',
    'Há uma pessoa próxima que te trata de uma forma que não te serve. Você já nomeou isso para si mesmo?',
    'Qual é o pior cenário real se você expressar discordância em uma situação atual? Escreva. Quantifique.',
    'Você está adiando uma conversa difícil? Cada semana de adiamento adiciona peso ao momento da conversa.',
    'Reserve 30 minutos para uma tarefa que você iniciará e concluirá sozinho, sem consenso ou aprovação.',
    'Sua confiabilidade é percebida pelos outros. Você percebe a sua própria? O que você promete para si mesmo e não cumpre?',
    'Identifique onde você está sendo passivo por conforto, não por convicção.',
    'Você está esperando que alguém perceba o que você precisa sem que você diga? Esse é um padrão custoso.',
    'Quando foi a última vez que você iniciou algo sem esperar um contexto propício ou uma solicitação externa?',
    'Você tem uma opinião sobre uma situação que não compartilhou. Por quê? Medo da reação ou hábito de ceder?',
    'Seu modo padrão é adaptar-se. Em qual situação atual você precisa de posição firme em vez de adaptação?',
    'Identifique algo que você quer mas ainda não pediu. Peça hoje.',
    'Você tende a minimizar seus próprios desconfortos. O que está desconfortável agora que você está ignorando?',
    'Há uma tarefa que só você pode iniciar e que está esperando que alguém peça. Inicie sem ser solicitado.',
    'Sua paciência é um recurso que se esgota. O que está drenando ele agora e você ainda não nomeou?',
  ],
};

/**
 * Seleciona uma sugestão diária baseada no perfil real do usuário.
 * Estratégia: alterna entre reforçar ponto fraco (temperamento mais baixo)
 * e modular ponto forte (temperamento dominante).
 *
 * @param {{ S: number, C: number, M: number, F: number }} pct - percentuais normalizados
 * @returns {{ message: string, source: 'dominant' | 'weakest', temperament: string }}
 */
export function getDailySuggestion(pct) {
  const sorted = Object.keys(pct).sort((a, b) => pct[b] - pct[a]);
  const dominant = sorted[0];
  const weakest = sorted[sorted.length - 1];

  // Alternância determinística baseada no dia do mês (sem estado)
  const dayOfMonth = new Date().getDate();
  const focusWeakest = dayOfMonth % 2 === 0;

  const target = focusWeakest ? weakest : dominant;
  const pool = SUGGESTIONS_POOL[target];

  // Seleção pseudo-aleatória estável dentro do pool
  const seed = new Date().getDate() + new Date().getMonth() * 31;
  const index = seed % pool.length;

  return {
    message: pool[index],
    source: focusWeakest ? 'weakest' : 'dominant',
    temperament: target,
  };
}

/**
 * Retorna N sugestões aleatórias para um temperamento específico.
 * Útil para exibir múltiplos lembretes na tela de resultado.
 *
 * @param {string} temperament - 'S' | 'C' | 'M' | 'F'
 * @param {number} count - quantas sugestões retornar
 * @returns {string[]}
 */
export function getSuggestionsForTemperament(temperament, count = 3) {
  const pool = SUGGESTIONS_POOL[temperament] || [];
  // Shuffle determinístico por data
  const seed = new Date().getDate() + new Date().getMonth();
  const shuffled = [...pool].sort((a, b) => {
    const hashA = (pool.indexOf(a) * 7 + seed) % pool.length;
    const hashB = (pool.indexOf(b) * 7 + seed) % pool.length;
    return hashA - hashB;
  });
  return shuffled.slice(0, count);
}

// ---------------------------------------------------------------------------
// getSmartSuggestion  (novo — lógica mais precisa que getDailySuggestion)
// ---------------------------------------------------------------------------

/**
 * Seleciona uma sugestão inteligente baseada no perfil real.
 * Lógica:
 *   - Dias pares  → trabalhar o EXCESSO do traço dominante (modular)
 *   - Dias ímpares → trabalhar a DEFICIÊNCIA do traço mais baixo (desenvolver)
 * Mensagem sempre curta e acionável.
 *
 * @param {{ S: number, C: number, M: number, F: number }} scores - scores brutos OU percentuais
 * @returns {{
 *   message: string,
 *   focus: 'excess' | 'deficiency',
 *   targetTemperament: string,
 *   targetName: string,
 *   rationale: string
 * }}
 */
export function getSmartSuggestion(scores) {
  const NAMES = { S: 'Sanguíneo', C: 'Colérico', M: 'Melancólico', F: 'Fleumático' };

  // Normaliza: se os valores parecem percentuais (soma próxima de 100), usa direto
  const total = Object.values(scores).reduce((a, b) => a + b, 0);
  let pct;
  if (total >= 80 && total <= 120) {
    pct = scores; // já são percentuais
  } else {
    // Normaliza scores brutos
    const raw = {};
    Object.keys(scores).forEach(k => { raw[k] = Math.max(0, scores[k]); });
    const positiveTotal = Object.values(raw).reduce((a, b) => a + b, 0) || 1;
    pct = {};
    Object.keys(raw).forEach(k => { pct[k] = Math.round((raw[k] / positiveTotal) * 100); });
  }

  const sorted = Object.keys(pct).sort((a, b) => pct[b] - pct[a]);
  const top    = sorted[0];
  const lowest = sorted[sorted.length - 1];

  const day = new Date().getDate();
  const focusExcess = day % 2 === 0;

  const target = focusExcess ? top : lowest;
  const focus  = focusExcess ? 'excess' : 'deficiency';
  const pool   = SUGGESTIONS_POOL[target] || [];

  // Seleção determinística por data — estável no mesmo dia, muda no dia seguinte
  const seed  = new Date().getDate() * 3 + new Date().getMonth() * 7;
  const index = seed % pool.length;

  const rationale = focusExcess
    ? `Seu traço ${NAMES[top]} está em ${pct[top]}% — modular o excesso reduz padrões automáticos que geram custo.`
    : `Seu traço ${NAMES[lowest]} está em ${pct[lowest]}% — desenvolver o ponto mais fraco amplia flexibilidade comportamental.`;

  return {
    message: pool[index],
    focus,
    targetTemperament: target,
    targetName: NAMES[target],
    rationale,
  };
}
