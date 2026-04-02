/**
 * notificationsV2.js
 *
 * Sistema de sugestões V2 — mensagens curtas, diretas, acionáveis e humanas.
 * Padrão: "Hoje: [ação concreta]." — sem motivação, sem elogio.
 *
 * getSmartSuggestion é a função principal, usada pelo app.
 * Os pools são usados internamente e exportados para eventual extensão.
 */

// ---------------------------------------------------------------------------
// Pools de mensagens — 20 por temperamento
// ---------------------------------------------------------------------------

export const MESSAGES_V2 = {
  // Modular o EXCESSO de cada traço
  excess: {
    C: [
      'Hoje: antes de decidir, pergunte a opinião de uma pessoa que vai ser afetada.',
      'Hoje: delegue uma tarefa sem acompanhar o processo.',
      'Hoje: quando alguém apresentar uma ideia diferente da sua, deixe-a terminar antes de responder.',
      'Hoje: identifique uma decisão que você tomou sozinho na última semana que deveria ter sido coletiva.',
      'Hoje: não corrija algo que não afeta o resultado final.',
      'Hoje: antes de dar feedback, pergunte se a pessoa quer ouvir.',
      'Hoje: reduza o ritmo de uma conversa em pelo menos 20% — espere dois segundos antes de cada resposta.',
      'Hoje: identifique onde você está resolvendo o problema de outra pessoa sem que ela pediu.',
      'Hoje: observe quantas vezes você interrompe alguém. Apenas observe.',
      'Hoje: deixe algo imperfeito sem intervir.',
      'Hoje: pergunte "o que você acha?" antes de dar a sua opinião.',
      'Hoje: resista ao impulso de pegar a frente de uma situação em que outra pessoa poderia liderar.',
      'Hoje: antes de responder a uma mensagem de trabalho, espere uma hora.',
      'Hoje: identifique algo urgente que na verdade não é.',
      'Hoje: reconheça o trabalho de alguém sem adicionar sugestão de melhoria.',
      'Hoje: ouça uma conversa até o fim sem formular resposta enquanto a pessoa fala.',
      'Hoje: não inicie nenhum projeto novo — conclua um que está em andamento.',
      'Hoje: quando sentir impaciência, nomeie o sentimento em vez de agir a partir dele.',
      'Hoje: pergunte a uma pessoa da equipe o que ela precisaria para trabalhar melhor.',
      'Hoje: saia de uma reunião sem dar a última palavra.',
    ],
    S: [
      'Hoje: termine o que começou antes de abrir algo novo.',
      'Hoje: não aceite um compromisso novo sem checar os que estão em aberto.',
      'Hoje: trabalhe duas horas sem checar redes sociais ou mensagens.',
      'Hoje: identifique uma conversa que você iniciou e não concluiu. Conclua.',
      'Hoje: escolha uma tarefa difícil e fique nela por 45 minutos sem mudar de contexto.',
      'Hoje: anote uma ideia nova em vez de executá-la imediatamente.',
      'Hoje: verifique quantos projetos você tem abertos. Feche um ou abandone conscientemente.',
      'Hoje: passe uma hora sem estimular nenhuma nova interação social.',
      'Hoje: entregue algo que já está 80% pronto em vez de continuar aperfeiçoando.',
      'Hoje: identifique onde está usando variedade para evitar algo que precisa de atenção.',
      'Hoje: mantenha um compromisso que você estava tentado a cancelar.',
      'Hoje: ouça alguém por 10 minutos sem redirecionar o assunto para si.',
      'Hoje: reveja o que você prometeu na última semana. O que não foi entregue?',
      'Hoje: planeje amanhã em três itens — não em dez.',
      'Hoje: reserve duas horas sem agenda para trabalho profundo.',
      'Hoje: não inicie uma conversa apenas para ter companhia.',
      'Hoje: identifique um compromisso que você não vai honrar e comunique agora.',
      'Hoje: complete uma tarefa burocrática que você estava evitando por falta de estímulo.',
      'Hoje: resista a aceitar um convite social se tiver uma entrega pendente.',
      'Hoje: escolha uma relação e invista profundidade em vez de amplitude.',
    ],
    M: [
      'Hoje: defina 70% de informações como suficiente para decidir — e decida.',
      'Hoje: entregue algo sem revisar pela terceira vez.',
      'Hoje: identifique onde o perfeccionismo está protegendo da entrega, não do erro.',
      'Hoje: dê um retorno positivo a alguém sem adicionar ressalva.',
      'Hoje: estabeleça um horário de corte para análise. Após ele, decida com o que tem.',
      'Hoje: compartilhe uma opinião que normalmente guardaria para si.',
      'Hoje: encerre o dia sem avaliar o que poderia ter sido melhor.',
      'Hoje: identifique uma tarefa que você está adiando por não querer fazer de forma medíocre. Faça.',
      'Hoje: quando receber uma crítica, espere 24 horas antes de processar.',
      'Hoje: diga "está suficientemente bom" para algo e siga em frente.',
      'Hoje: escolha uma situação passada que você ainda está ruminando e encerre o ciclo de análise.',
      'Hoje: aceite que o processo de outra pessoa pode ser diferente sem ser inferior.',
      'Hoje: dê feedback sobre o comportamento, não sobre o padrão de qualidade esperado.',
      'Hoje: identifique onde está aplicando alto padrão em algo de baixo impacto.',
      'Hoje: pergunte a si mesmo: "isso que estou revisando vai mudar algo real?"',
      'Hoje: comunique um desconforto que está guardando há mais de uma semana.',
      'Hoje: registre algo que foi bem feito — sem "mas".',
      'Hoje: delegue uma tarefa e não revise o resultado.',
      'Hoje: ao fazer uma crítica, pergunte primeiro se a pessoa quer ouvir.',
      'Hoje: passe 30 minutos sem avaliar nada — nem a si mesmo.',
    ],
    F: [
      'Hoje: tome uma decisão menor sem consultar ninguém.',
      'Hoje: expresse uma discordância diretamente, sem suavizar.',
      'Hoje: inicie algo que estava esperando o momento certo.',
      'Hoje: diga não para um pedido que você aceitaria apenas para não decepcionar.',
      'Hoje: comunique algo que você estava guardando para não causar desconforto.',
      'Hoje: identifique uma situação tolerada há mais de um mês. Decida: muda ou encerra.',
      'Hoje: pague uma conta ou resolva uma burocracia que está adiada.',
      'Hoje: posicione-se em uma conversa em que costuma permanecer neutro.',
      'Hoje: inicie uma tarefa sem esperar ser solicitado.',
      'Hoje: expresse uma preferência quando alguém perguntar o que você quer.',
      'Hoje: identifique onde está sendo passivo por conforto, não por convicção.',
      'Hoje: levante uma questão em uma reunião em vez de esperar que alguém levante.',
      'Hoje: peça algo que você precisa sem minimizar antes.',
      'Hoje: escreva o que diria se não tivesse medo da reação. Depois decida se vai enviar.',
      'Hoje: avance um projeto em andamento sem esperar condições perfeitas.',
      'Hoje: termine o dia com uma decisão que você estava adiando.',
      'Hoje: identifique algo que você está tolerando em silêncio. Nomeie para si mesmo.',
      'Hoje: agende uma conversa difícil que você tem adiado.',
      'Hoje: não ajuste sua resposta para evitar conflito em uma situação de baixo risco.',
      'Hoje: estabeleça um prazo para si mesmo em uma tarefa sem prazo externo.',
    ],
  },

  // Desenvolver a DEFICIÊNCIA de cada traço
  deficiency: {
    C: [
      'Hoje: tome uma decisão que você normalmente adiaria pedindo mais informação.',
      'Hoje: inicie uma conversa difícil que está postergando.',
      'Hoje: expresse claramente o que você quer em uma situação onde costuma ser vago.',
      'Hoje: direcione um grupo em uma decisão sem esperar consenso prévio.',
      'Hoje: defenda uma posição mesmo quando alguém discordar.',
      'Hoje: dê uma resposta direta quando perguntado — sem rodeios.',
      'Hoje: pague para ver: execute algo imperfeitamente e observe o que acontece.',
      'Hoje: encerre um ciclo de análise e aja com o que tem.',
      'Hoje: estabeleça um prazo para algo que não tem data.',
      'Hoje: assuma responsabilidade por uma decisão de grupo.',
      'Hoje: pede o que precisa sem justificar extensamente antes.',
      'Hoje: fale primeiro em uma reunião em vez de esperar os outros.',
      'Hoje: identifique onde está terceirizando a liderança por desconforto. Assuma.',
      'Hoje: estabeleça um limite claro com alguém.',
      'Hoje: recuse uma demanda que vai além do que faz sentido.',
      'Hoje: dê a sua opinião antes de saber a do grupo.',
      'Hoje: faça uma mudança pequena sem consultar todos os envolvidos.',
      'Hoje: priorize velocidade sobre perfeição em uma tarefa de baixo risco.',
      'Hoje: comunique sua posição em um conflito em vez de aguardar que se resolva.',
      'Hoje: execute uma ideia sem apresentar para aprovação.',
    ],
    S: [
      'Hoje: inicie uma conversa com alguém que você não conhece bem.',
      'Hoje: compartilhe algo pessoal com alguém de confiança.',
      'Hoje: responda a uma mensagem com entusiasmo visível.',
      'Hoje: saia do seu espaço habitual por pelo menos uma hora.',
      'Hoje: aceite um convite social que você normalmente recusaria.',
      'Hoje: conecte duas pessoas que se beneficiariam de se conhecer.',
      'Hoje: expresse animação com algo, mesmo que não seja o estilo usual.',
      'Hoje: faça uma pausa em um projeto sério e faça algo só por diversão.',
      'Hoje: conte algo que aconteceu com você sem transformar em análise.',
      'Hoje: tente algo diferente da rotina — qualquer coisa.',
      'Hoje: elogie alguém com genuíno entusiasmo.',
      'Hoje: envolva outras pessoas em uma tarefa que você costuma fazer sozinho.',
      'Hoje: responda de forma mais leve a uma situação que normalmente levaria a sério.',
      'Hoje: explore um assunto fora da sua área sem agenda utilitária.',
      'Hoje: adicione algum elemento lúdico a uma tarefa rotineira.',
      'Hoje: procure um ponto de contato genuíno em uma conversa que seria puramente funcional.',
      'Hoje: compartilhe uma ideia incompleta sem precisar ter certeza antes.',
      'Hoje: celebre uma pequena vitória — a sua ou de outra pessoa.',
      'Hoje: dedique tempo a algo que te dá prazer sem justificativa produtiva.',
      'Hoje: inicie interação social antes de ser solicitado.',
    ],
    M: [
      'Hoje: reserve 30 minutos para analisar um problema sem pressa de chegar à solução.',
      'Hoje: documente o raciocínio por trás de uma decisão que tomou.',
      'Hoje: revise algo que entregou na semana passada com olhar crítico.',
      'Hoje: mapeie riscos de uma decisão antes de executar.',
      'Hoje: faça perguntas de detalhe em uma reunião antes de aceitar a proposta.',
      'Hoje: anote o que poderia ter sido feito melhor em uma tarefa recente — sem culpa, como dado.',
      'Hoje: leia algo fora da sua área usual com profundidade real.',
      'Hoje: identifique uma suposição que está tomando como fato. Verifique.',
      'Hoje: peça o raciocínio por trás de uma decisão que afeta você.',
      'Hoje: dedique tempo a entender um problema antes de agir sobre ele.',
      'Hoje: observe os detalhes de uma situação que normalmente lida de forma rápida.',
      'Hoje: escreva o que você pensa sobre um tema relevante — sem publicar, só para você.',
      'Hoje: identifique onde uma decisão rápida gerou um problema que uma análise teria evitado.',
      'Hoje: faça uma revisão cuidadosa antes de enviar algo importante.',
      'Hoje: mapeie as consequências de segunda ordem de algo que está planejando.',
      'Hoje: invista tempo em qualidade onde normalmente aceitaria "bom o suficiente".',
      'Hoje: pergunte a si mesmo o que está assumindo que talvez não seja verdade.',
      'Hoje: estude o fundo de algo que usa no dia a dia sem entender bem.',
      'Hoje: registre três aprendizados da semana.',
      'Hoje: antes de agir, pergunte: qual é o custo do erro aqui?',
    ],
    F: [
      'Hoje: identifique o que te dá estabilidade — e reconheça quando está excessivamente dependente disso.',
      'Hoje: sustente um ritmo constante em uma tarefa por 90 minutos sem desvio.',
      'Hoje: escolha uma área e aprofunde o conhecimento sem agenda de aplicação imediata.',
      'Hoje: mostre-se confiável para alguém que precisa de consistência.',
      'Hoje: construa uma rotina pequena que você vai manter por uma semana.',
      'Hoje: responda a uma mensagem que estava deixando para depois.',
      'Hoje: mantenha um compromisso mesmo com vontade de mudar de plano.',
      'Hoje: trabalhe em uma tarefa longa sem medir resultado parcial.',
      'Hoje: demonstre para alguém que pode contar com você sem que precise pedir.',
      'Hoje: proteja um bloco de tempo para trabalho focado — sem interrupções.',
      'Hoje: complete uma sequência de pequenas tarefas sem desviar para estímulos.',
      'Hoje: retorne a algo que abandonou pela metade.',
      'Hoje: crie um sistema simples para uma tarefa recorrente.',
      'Hoje: faça algo chato que precisa ser feito sem adiar para depois.',
      'Hoje: sustente presença em uma conversa longa sem buscar mudança de assunto.',
      'Hoje: trabalhe em segundo plano em algo que não precisa de visibilidade imediata.',
      'Hoje: mantenha ritmo regular mesmo quando o resultado não aparece imediatamente.',
      'Hoje: escolha uma área de crescimento e trabalhe nela de forma consistente por uma semana.',
      'Hoje: tome nota de algo que funcionou hoje — não para analisar, só para registrar.',
      'Hoje: preserve energia para o que importa mais, sem dispersar em estímulos novos.',
    ],
  },
};

// ---------------------------------------------------------------------------
// getSmartSuggestion
// ---------------------------------------------------------------------------

/**
 * Seleciona uma sugestão inteligente baseada no perfil real.
 *
 * Lógica:
 *   - Dias pares  → modular o EXCESSO do traço dominante
 *   - Dias ímpares → desenvolver a DEFICIÊNCIA do traço mais baixo
 *
 * @param {{ S: number, C: number, M: number, F: number }} scores - brutos ou percentuais
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

  // Normaliza — aceita tanto scores brutos quanto percentuais
  const rawTotal = Object.values(scores).reduce((a, b) => a + b, 0);
  let pct;
  if (rawTotal >= 80 && rawTotal <= 120) {
    pct = { ...scores }; // já são percentuais
  } else {
    const raw = {};
    Object.keys(scores).forEach(k => { raw[k] = Math.max(0, scores[k]); });
    const posTotal = Object.values(raw).reduce((a, b) => a + b, 0) || 1;
    pct = {};
    Object.keys(raw).forEach(k => { pct[k] = Math.round((raw[k] / posTotal) * 100); });
  }

  const sorted  = Object.keys(pct).sort((a, b) => pct[b] - pct[a]);
  const top     = sorted[0];
  const lowest  = sorted[sorted.length - 1];

  const day        = new Date().getDate();
  const focusExcess = day % 2 === 0;

  const target = focusExcess ? top : lowest;
  const focus  = focusExcess ? 'excess' : 'deficiency';
  const pool   = MESSAGES_V2[focus][target] || [];

  // Seleção determinística estável no mesmo dia — muda no dia seguinte
  const seed  = day * 3 + new Date().getMonth() * 7;
  const index = seed % pool.length;

  const rationale = focusExcess
    ? `${NAMES[top]} em ${pct[top]}% — modular o excesso reduz padrões automáticos com custo visível.`
    : `${NAMES[lowest]} em ${pct[lowest]}% — desenvolver o traço mais baixo amplia flexibilidade comportamental.`;

  return {
    message: pool[index],
    focus,
    targetTemperament: target,
    targetName: NAMES[target],
    rationale,
  };
}
