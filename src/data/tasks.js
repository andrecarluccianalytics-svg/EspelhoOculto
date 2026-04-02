/**
 * tasks.js — v2
 *
 * Tarefas organizadas em sequência progressiva por temperamento + área.
 * Cada entrada é um array de dias: dia 1 → dia 2 → dia 3 → ...
 * A progressão é gradual: observar → aplicar → consolidar → expandir.
 *
 * Quando o usuário esgota os dias disponíveis, o ciclo recomeça
 * com a mesma lógica (modulo do índice) — sem quebrar a experiência.
 */

export const TASK_SEQUENCES = {

  // ── COLÉRICO ─────────────────────────────────────────────────────────
  C: {
    trabalho: [
      // Dia 1 — observar
      {
        task: 'Antes de tomar qualquer decisão importante hoje, pause 5 minutos. Só isso.',
        gain: 'Decisões tomadas depois de uma pausa geram menos retrabalho e mais alinhamento.',
      },
      // Dia 2 — aplicar
      {
        task: 'Antes de decidir, pergunte a opinião de uma pessoa diretamente afetada. Ouça antes de fechar posição.',
        gain: 'Incluir perspectivas externas reduz pontos cegos e aumenta adesão da equipe.',
      },
      // Dia 3 — expandir
      {
        task: 'Delegue uma tarefa hoje e não acompanhe o processo. Deixe a pessoa trabalhar do jeito dela.',
        gain: 'Delegar com autonomia real desenvolve a equipe e libera sua capacidade para o que só você faz.',
      },
      // Dia 4
      {
        task: 'Reconheça o trabalho de alguém de forma explícita — sem adicionar sugestão de melhoria.',
        gain: 'Reconhecimento sem ressalva é raro para o seu perfil. Quando acontece, tem impacto desproporcional.',
      },
      // Dia 5
      {
        task: 'Identifique algo que está gerenciando de perto mas não precisaria. Solte hoje.',
        gain: 'Soltar controle em áreas de baixo risco cria espaço para o que realmente exige sua atenção.',
      },
      // Dia 6
      {
        task: 'Antes de responder uma mensagem importante, espere 30 minutos. Só então escreva.',
        gain: 'Respostas com intervalo têm tom mais calibrado e geram menos desgaste relacional.',
      },
      // Dia 7 — consolidar
      {
        task: 'Escolha a prática dos últimos 6 dias que mais gerou resultado. Repita ela hoje com intenção.',
        gain: 'Consistência transforma ajuste pontual em padrão novo. Um dia repetido vale mais que seis isolados.',
      },
    ],

    relacionamentos: [
      {
        task: 'Em uma conversa hoje, ouça até o fim antes de falar. Sem formular resposta enquanto o outro fala.',
        gain: 'Ser ouvido de verdade é raro. Quando você oferece isso, muda como as pessoas se sentem com você.',
      },
      {
        task: 'Pergunte para alguém próximo como ele está — e fique só ouvindo. Sem resolver, sem aconselhar.',
        gain: 'Nem toda conversa precisa de solução. Presença sem agenda cria vínculo que conselhos não criam.',
      },
      {
        task: 'Antes de corrigir alguém hoje, pergunte: "você quer ouvir minha opinião?" Só avance se a resposta for sim.',
        gain: 'Feedback consentido tem dez vezes mais chance de ser recebido e aplicado.',
      },
      {
        task: 'Passe uma conversa inteira sem dar sua opinião, a menos que seja diretamente solicitada.',
        gain: 'Conter a opinião quando ela não foi pedida sinaliza respeito — e aumenta seu peso quando você fala.',
      },
      {
        task: 'Identifique uma situação recente em que você interrompeu alguém. Mencione e reconheça.',
        gain: 'Reconhecer um padrão para quem foi afetado por ele desfaz resistências que você provavelmente não percebeu.',
      },
      {
        task: 'Inicie uma conversa sem agenda. Só para saber como a pessoa está. Sem resolver nada.',
        gain: 'Contatos sem objetivo imediato constroem o tipo de relação que sustenta trabalho difícil.',
      },
      {
        task: 'Escolha a prática relacional dos últimos dias que mais te custou. Repita ela hoje.',
        gain: 'O que custa mais é o que mais muda. Repetir o difícil é onde o padrão começa a se reformar.',
      },
    ],

    decisoes: [
      {
        task: 'Antes de decidir algo relevante, anote três consequências possíveis. Só então avance.',
        gain: 'Mapear consequências antes reduz decisões que parecem certas no momento e custam depois.',
      },
      {
        task: 'Quando sentir impulso de decidir, espere 10 minutos. Observe se o impulso persiste ou muda.',
        gain: 'Impulsos com mais de 10 minutos costumam ser sinais reais. Os que somem eram ruído.',
      },
      {
        task: 'Escolha uma decisão pendente e consulte alguém com perfil mais analítico antes de avançar.',
        gain: 'Perfis analíticos veem riscos que você não prioriza. A perspectiva deles complementa, não atrasa.',
      },
      {
        task: 'Identifique uma decisão que você tomou rápido demais recentemente. O que teria mudado com mais tempo?',
        gain: 'Diagnosticar decisões passadas é a forma mais eficiente de calibrar decisões futuras.',
      },
      {
        task: 'Para a próxima decisão importante, liste as variáveis antes de fechar posição — mesmo que pareça óbvio.',
        gain: 'Tornar explícito o que parece óbvio revela o que estava oculto na análise.',
      },
      {
        task: 'Tome uma decisão que você estava adiando por falta de certeza. Decida com o que tem agora.',
        gain: 'Adiar com certeza perfeita é diferente de adiar por desconforto. Identifique qual está acontecendo.',
      },
      {
        task: 'Revise a melhor decisão que você tomou nesta semana. O que tornou ela boa? Guarde esse critério.',
        gain: 'Extrair o critério de uma boa decisão é mais útil do que qualquer framework externo.',
      },
    ],

    autocontrole: [
      {
        task: 'Quando sentir impaciência hoje, nomeie o sentimento em voz baixa antes de reagir.',
        gain: 'Nomear a emoção antes de agir cria um segundo de distância entre o gatilho e a resposta.',
      },
      {
        task: 'Identifique um gatilho que te faz perder o controle do tom. Fique atento a ele ao longo do dia.',
        gain: 'Conhecer o gatilho não elimina a reação — mas avisa antes dela. E isso já é suficiente.',
      },
      {
        task: 'Antes de responder algo que te irritou, respire fundo três vezes. Literalmente, três vezes.',
        gain: 'Três respirações lentas reduzem fisiologicamente a resposta de estresse. Não é metáfora.',
      },
      {
        task: 'Quando sentir vontade de assumir o controle de algo, pergunte: "isso é meu para resolver?"',
        gain: 'Resolver o que não é seu cria dependência nos outros e esgota você. A pergunta separa os dois.',
      },
      {
        task: 'Passe o dia sem interromper ninguém. Apenas escute até o fim.',
        gain: 'Quem não interrompe é percebido como mais inteligente e mais seguro. O custo é só esperar.',
      },
      {
        task: 'Monitore quantas vezes você impõe ritmo ou decisão hoje. Só observe. Não julgue.',
        gain: 'Observar sem julgamento é o primeiro passo para mudar o que ainda não está visível para você.',
      },
      {
        task: 'Escolha o gatilho que mais te custou esta semana. Crie um sinal interno para identificá-lo amanhã.',
        gain: 'Um sinal específico para um gatilho específico é mais eficaz que intenção genérica de se controlar.',
      },
    ],
  },

  // ── SANGUÍNEO ────────────────────────────────────────────────────────
  S: {
    trabalho: [
      {
        task: 'Escolha uma tarefa aberta há mais de uma semana. Avance nela por pelo menos 45 minutos hoje.',
        gain: 'Começar o que já existe é mais difícil que abrir algo novo. Esse esforço é o que separa resultado de atividade.',
      },
      {
        task: 'Não abra nenhuma nova iniciativa hoje. Avance apenas no que já está em andamento.',
        gain: 'Cada nova frente divide atenção. Fechar o que está aberto libera energia que você não percebe que está gastando.',
      },
      {
        task: 'Reserve 90 minutos sem checar mensagens, redes ou e-mail. Trabalho fundo sem interrupção.',
        gain: 'Trabalho fundo em blocos gera resultado qualitativo que o trabalho fragmentado nunca produz.',
      },
      {
        task: 'Antes de aceitar qualquer novo compromisso hoje, liste o que está aberto. Feche um antes de abrir outro.',
        gain: 'A regra "um entra, um sai" parece lenta. Na prática é a única forma de ter menos abertos que ontem.',
      },
      {
        task: 'Entregue algo que está "quase pronto" há dias. Bom o suficiente entregue vale mais que perfeito represado.',
        gain: 'Entregar completa o ciclo cognitivo. O que fica em aberto consome energia mesmo quando você não está nele.',
      },
      {
        task: 'Escolha a tarefa mais chata da sua lista. Conclua ela hoje sem desviar para algo mais estimulante.',
        gain: 'Executar o que não dá energia é onde o autocontrole se constrói de verdade.',
      },
      {
        task: 'Revise quantas frentes você abriu esta semana e quantas avançaram de verdade. Feche uma.',
        gain: 'O inventário semanal é o espelho mais honesto da diferença entre movimento e progresso.',
      },
    ],

    relacionamentos: [
      {
        task: 'Ouça alguém por 10 minutos sem redirecionar a conversa para a sua experiência.',
        gain: 'Ouvir sem redirecionar é uma habilidade rara. Quando você oferece isso, as pessoas percebem.',
      },
      {
        task: 'Cumpra um compromisso que você fez com alguém e estava adiando.',
        gain: 'Cada compromisso honrado constrói confiabilidade. Cada um adiado a corrói silenciosamente.',
      },
      {
        task: 'Escreva uma mensagem para alguém que você disse "a gente precisa se ver" há mais de um mês.',
        gain: 'Intenção sem ação não conta para quem está esperando. Uma mensagem curta vale mais que uma intenção grande.',
      },
      {
        task: 'Em uma conversa hoje, resista ao impulso de contar uma história sua quando a pessoa estiver falando.',
        gain: 'Cada vez que você aguarda, a pessoa sente que o que ela diz importa. Isso faz mais diferença do que você imagina.',
      },
      {
        task: 'Identifique alguém que você decepcionou por falta de consistência. Reconheça isso diretamente.',
        gain: 'Reconhecer a decepção sem desculpa fecha um ciclo que, aberto, continua afetando a relação.',
      },
      {
        task: 'Escolha uma relação importante. Invista nela de forma profunda hoje — não só contato rápido.',
        gain: 'Contato frequente com baixa profundidade cria a sensação de proximidade sem o vínculo real.',
      },
      {
        task: 'Revise os compromissos que fez com pessoas próximas nesta semana. Quantos cumpriu de verdade?',
        gain: 'Esse balanço é difícil de fazer. Mas é o único dado honesto sobre sua confiabilidade real.',
      },
    ],

    decisoes: [
      {
        task: 'Antes de agir em um impulso hoje, escreva a ideia e revise amanhã. Só então decida.',
        gain: 'Ideias que sobrevivem 24 horas têm muito mais chance de ser válidas do que as que pedem ação imediata.',
      },
      {
        task: 'Para qualquer decisão relevante hoje, liste um risco real antes de avançar.',
        gain: 'Um risco nomeado antes é um problema evitado depois. Seu perfil tende a pular essa etapa.',
      },
      {
        task: 'Identifique uma decisão que você tomou por entusiasmo e precisou reverter. O que mudaria hoje?',
        gain: 'Diagnosticar decisões passadas é aprendizado real. Mais útil do que qualquer curso sobre decisão.',
      },
      {
        task: 'Evite dar resposta imediata a qualquer pedido que exija comprometimento. Durma e responda amanhã.',
        gain: 'A maioria dos pedidos aguenta 24 horas. Sua resposta depois desse intervalo costuma ser mais precisa.',
      },
      {
        task: 'Verifique se tem capacidade real antes de executar uma ideia nova que surgiu hoje.',
        gain: 'Capacidade não é só tempo — é atenção disponível. Mapear isso antes protege o que já está em curso.',
      },
      {
        task: 'Escolha entre duas opções que está avaliando há dias. Decida agora com o que tem.',
        gain: 'Adiar com dados parciais é diferente de adiar por desconforto. Quando os dados estão lá, o segundo atrasa sem motivo.',
      },
      {
        task: 'Revise a melhor e a pior decisão que tomou esta semana. O que as diferenciou?',
        gain: 'Comparar as duas extremidades de uma semana revela o padrão de forma mais nítida do que qualquer análise isolada.',
      },
    ],

    autocontrole: [
      {
        task: 'Identifique algo que prometeu para si mesmo e não cumpriu. Faça hoje, agora.',
        gain: 'Cada promessa não cumprida para si mesmo reduz a confiança que você tem em si. Quebrar um ciclo desses importa.',
      },
      {
        task: 'Quando sentir vontade de mudar de contexto hoje, fique mais 15 minutos no que está fazendo.',
        gain: '15 minutos adicionais em algo difícil é onde a maioria para. Quem fica é quem entrega.',
      },
      {
        task: 'Passe o dia sem iniciar nenhuma conversa apenas por tédio ou necessidade de estímulo.',
        gain: 'Observar quando você busca estímulo externo revela dependências que afetam sua consistência.',
      },
      {
        task: 'Escolha uma tarefa difícil e pouco estimulante. Conclua sem desviar para outra coisa.',
        gain: 'Executar o que não dá prazer é uma habilidade. E como qualquer habilidade, melhora com repetição.',
      },
      {
        task: 'Monitore quantas vezes você muda de contexto hoje. Só conta, não julga.',
        gain: 'O dado bruto de quantas vezes você muda é revelador. A maioria subestima por um fator de dois ou três.',
      },
      {
        task: 'Identifique a hora do dia em que sua consistência cai mais. Proteja esse horário amanhã.',
        gain: 'Proteger o horário fraco é mais eficiente do que tentar melhorar o dia inteiro de uma vez.',
      },
      {
        task: 'Revise: quantas vezes esta semana você fez o que era necessário sem esperar estar animado?',
        gain: 'Essa contagem é o medidor mais honesto de autocontrole real. Não o que você sente — o que você fez.',
      },
    ],
  },

  // ── MELANCÓLICO ──────────────────────────────────────────────────────
  M: {
    trabalho: [
      {
        task: 'Entregue algo hoje com 80% de qualidade. Sem revisar depois de enviar.',
        gain: 'Entregar em 80% libera você para o próximo item. O 20% restante raramente muda o resultado.',
      },
      {
        task: 'Defina um horário de corte para uma tarefa em andamento. Quando chegar, pare e entregue.',
        gain: 'Tarefas sem prazo se expandem para preencher o tempo disponível. Um corte artificial funciona.',
      },
      {
        task: 'Delegue uma parte do trabalho sem reescrever o que a pessoa entregou.',
        gain: 'Reescrever o que foi delegado elimina o ganho da delegação. Diferente não é inferior.',
      },
      {
        task: 'Identifique onde está revisando algo além do necessário. Finalize e envie.',
        gain: 'Cada revisão adicional tem retorno decrescente. A segunda vale metade da primeira.',
      },
      {
        task: 'Escolha uma tarefa travada por perfeccionismo. Estabeleça "suficientemente bom" e conclua.',
        gain: 'Suficientemente bom entregue no prazo gera mais resultado acumulado do que perfeito fora do tempo.',
      },
      {
        task: 'Trabalhe por 2 horas em algo sem abrir para revisão no meio. Só no final.',
        gain: 'Revisar durante a execução fragmenta o pensamento. Deixar fluir e revisar no final é mais eficiente.',
      },
      {
        task: 'Revise quantas entregas desta semana foram atrasadas por excesso de revisão. Uma mudaria o que?',
        gain: 'Quantificar o custo do perfeccionismo é mais convincente do que qualquer argumento abstrato.',
      },
    ],

    relacionamentos: [
      {
        task: 'Expresse um reconhecimento para alguém próximo — sem ressalva, sem "mas".',
        gain: 'Reconhecimento sem ressalva é incomum para o seu perfil. Exatamente por isso tem peso maior.',
      },
      {
        task: 'Comunique uma expectativa que você tem sobre alguém e nunca disse diretamente.',
        gain: 'Expectativas implícitas criam decepções previsíveis. Verbalizá-las resolve antes do problema aparecer.',
      },
      {
        task: 'Em uma conversa hoje, compartilhe como você está de verdade, sem minimizar.',
        gain: 'Mostrar o estado real, não a versão filtrada, cria o tipo de conexão que você procura mas raramente inicia.',
      },
      {
        task: 'Passe uma interação inteira sem avaliar internamente o que a outra pessoa fez de errado.',
        gain: 'A avaliação constante cria distância mesmo quando não é verbalizada. As pessoas percebem.',
      },
      {
        task: 'Identifique uma crítica que você guardou para não magoar. Expresse com cuidado, mas expresse.',
        gain: 'Críticas guardadas não desaparecem — se acumulam e saem maiores do que precisariam.',
      },
      {
        task: 'Faça uma pergunta genuína sobre a vida de alguém próximo — sem agenda e sem avaliar a resposta.',
        gain: 'Curiosidade sem avaliação é rara e percebida. Cria mais conexão do que qualquer conversa profunda forçada.',
      },
      {
        task: 'Revise: quantas vezes esta semana você se conectou com alguém sem uma agenda ou crítica mental?',
        gain: 'Esse número é o indicador mais honesto de presença real nas suas relações.',
      },
    ],

    decisoes: [
      {
        task: 'Tome uma decisão relevante com 70% das informações que normalmente exigiria.',
        gain: 'A diferença de resultado entre 70% e 95% de informação é menor do que o custo do tempo adicional.',
      },
      {
        task: 'Defina um prazo para uma análise em andamento. Quando acabar o tempo, decida com o que tem.',
        gain: 'Análise sem prazo não converge. Um prazo artificial força a priorização do que realmente importa.',
      },
      {
        task: 'Identifique uma decisão que está adiando há mais de uma semana. Resolva hoje.',
        gain: 'Decisões adiadas consomem energia mesmo quando você não está ativamente pensando nelas.',
      },
      {
        task: 'Escreva as duas principais opções de uma decisão pendente. Escolha sem análise adicional.',
        gain: 'Quando as opções já estão no papel, a análise adicional raramente muda a escolha — só o atraso.',
      },
      {
        task: 'Tome uma decisão pequena de forma deliberadamente rápida. Observe o resultado.',
        gain: 'Testar velocidade em decisões de baixo risco calibra onde a análise é necessária e onde é excesso.',
      },
      {
        task: 'Identifique onde está usando análise para evitar a decisão, não para melhorá-la.',
        gain: 'Análise como adiamento e análise como ferramenta parecem iguais. Distingui-las é o trabalho real.',
      },
      {
        task: 'Revise: qual decisão desta semana você mais adiou? O que o impediu? O impedimento era real?',
        gain: 'Diagnosticar o impedimento honestamente revela se era informação ou desconforto. Os dois têm soluções diferentes.',
      },
    ],

    autocontrole: [
      {
        task: 'Quando a autocrítica surgir hoje, pergunte: "isso é dado ou interpretação?"',
        gain: 'Autocrítica baseada em dado é útil. Baseada em interpretação é punição disfarçada de análise.',
      },
      {
        task: 'Registre algo que foi bem feito hoje — sem minimizar, sem "mas", sem contexto.',
        gain: 'Registrar o que funcionou treina o sistema de atenção a balancear o que ele naturalmente filtra.',
      },
      {
        task: 'Identifique onde está ruminando uma decisão passada. Encerre esse ciclo agora.',
        gain: 'Ruminar uma decisão já tomada não a melhora. Só consome o recurso que seria usado na próxima.',
      },
      {
        task: 'Passe o dia sem aplicar seu padrão de qualidade a algo de baixo impacto.',
        gain: 'Padrão alto em tudo nivela tudo por cima — e esgota antes que chegue ao que realmente importa.',
      },
      {
        task: 'Quando sentir que algo não foi bom o suficiente, pergunte: bom para quem e para qual propósito?',
        gain: 'Especificar o critério transforma o vago "não foi bom" em algo avaliável — e frequentemente suficiente.',
      },
      {
        task: 'Observe quantas vezes hoje você criticou algo seu ou alheio internamente. Só conta.',
        gain: 'O número surpresa. Quantificar sem julgar é o primeiro passo para calibrar sem suprimir.',
      },
      {
        task: 'Revise: onde esta semana o padrão alto produziu resultado? Onde produziu só atraso?',
        gain: 'Distinguir as duas aplicações do padrão é mais útil do que tentar reduzir o padrão em geral.',
      },
    ],
  },

  // ── FLEUMÁTICO ───────────────────────────────────────────────────────
  F: {
    trabalho: [
      {
        task: 'Inicie uma tarefa hoje sem esperar o momento certo, as condições ideais ou mais informação.',
        gain: 'O momento certo raramente aparece. Começar cria o contexto que o momento certo não cria.',
      },
      {
        task: 'Tome uma decisão de trabalho sem consultar ninguém. Só você, agora.',
        gain: 'Decidir sozinho é desconfortável para o seu perfil. Esse desconforto é exatamente o que fortalece.',
      },
      {
        task: 'Identifique algo que está adiando por não querer causar atrito. Avance hoje.',
        gain: 'Adiar para evitar atrito frequentemente cria atrito maior quando a situação não resolvida explode.',
      },
      {
        task: 'Posicione-se em uma situação de trabalho em que costuma ficar neutro.',
        gain: 'Neutralidade permanente é percebida como falta de posição — não como equilíbrio. Posicionar-se muda essa percepção.',
      },
      {
        task: 'Estabeleça um prazo para si mesmo em uma entrega sem prazo externo. Cumpra.',
        gain: 'Prazos auto-impostos são mais difíceis de manter do que externos. Honrá-los constrói confiança interna.',
      },
      {
        task: 'Inicie uma conversa difícil que você está adiando. Só iniciar já conta.',
        gain: 'O início é o obstáculo real. Depois que começa, a conversa raramente é tão difícil quanto a antecipação.',
      },
      {
        task: 'Revise: quantas situações de trabalho esta semana você deixou passar sem se posicionar?',
        gain: 'Esse número revela o custo acumulado da neutralidade. Cada situação não posicionada tem um efeito.',
      },
    ],

    relacionamentos: [
      {
        task: 'Expresse uma discordância diretamente com alguém próximo — sem suavizar demais.',
        gain: 'Discordância expressa de forma clara é respeitada. Discordância suavizada a ponto de desaparecer não resolve nada.',
      },
      {
        task: 'Diga não para um pedido que você aceitaria apenas para não decepcionar.',
        gain: 'Cada não honesto constrói mais respeito do que dez sins forçados. As pessoas percebem a diferença.',
      },
      {
        task: 'Comunique algo que está guardando para não gerar conflito.',
        gain: 'O que fica guardado não desaparece — fermenta. E sai maior do que precisaria quando finalmente aparece.',
      },
      {
        task: 'Levante um ponto difícil em uma conversa em vez de esperar que o outro levante.',
        gain: 'Quem inicia a conversa difícil define o tom. Esperar transfere esse poder para o outro.',
      },
      {
        task: 'Identifique uma verdade que está evitando dizer. Diga hoje, com cuidado — mas diga.',
        gain: 'Verdades não ditas criam distância silenciosa. Dizê-las, mesmo que custe, cria a possibilidade de proximidade real.',
      },
      {
        task: 'Em uma interação hoje, expresse claramente o que você quer — sem pedir permissão antes.',
        gain: 'Pedir permissão para querer algo reduz a força da expressão. Querer e comunicar são passos separados.',
      },
      {
        task: 'Revise: quantas verdades você guardou esta semana para preservar harmonia? Uma delas precisava ser dita.',
        gain: 'A harmonia preservada com verdades engolidas é frágil. A construída com verdade dita é durável.',
      },
    ],

    decisoes: [
      {
        task: 'Tome uma decisão menor hoje sem consultar ninguém e sem buscar consenso.',
        gain: 'Decidir sozinho em decisões pequenas treina a musculatura para as grandes. Começa pequeno, mas começa.',
      },
      {
        task: 'Identifique uma situação que está tolerando há semanas. Decida: muda ou encerra.',
        gain: 'Tolerar sem decidir é uma decisão implícita de manter. Torná-la explícita muda o peso que ela tem.',
      },
      {
        task: 'Escolha entre duas opções sem esperar mais informação. Decida com o que tem agora.',
        gain: 'Informação adicional raramente muda o resultado em decisões onde os dados principais já estão disponíveis.',
      },
      {
        task: 'Agende uma conversa difícil que você tem adiado. Só agendar já é uma decisão.',
        gain: 'Agendar cria compromisso sem exigir coragem total agora. É um passo real que o pensamento não é.',
      },
      {
        task: 'Identifique onde está esperando que o problema se resolva sozinho. Aja em uma coisa.',
        gain: 'Problemas que se resolvem sozinhos existem. São a minoria. Identificar qual é qual poupa tempo e energia.',
      },
      {
        task: 'Tome uma decisão que você normalmente delegaria para o grupo ou adiaria por consenso.',
        gain: 'Algumas decisões demoram porque você espera que alguém decida. Quando você decide, libera todos.',
      },
      {
        task: 'Revise: qual decisão desta semana você mais adiou? O que estava esperando que não chegou?',
        gain: 'O que você esperava raramente era o bloqueador real. Identificar o bloqueador real muda o próximo ciclo.',
      },
    ],

    autocontrole: [
      {
        task: 'Quando sentir impulso de evitar um conflito hoje, pause e avalie: evitar serve a quem?',
        gain: 'Evitar serve a você quando protege uma relação genuína. Serve ao desconforto quando só adia o problema.',
      },
      {
        task: 'Identifique onde está sendo passivo por conforto, não por convicção.',
        gain: 'Passividade por conforto e passividade por estratégia têm consequências opostas. Distingui-las é o trabalho.',
      },
      {
        task: 'Inicie algo que estava esperando a hora certa. A hora certa é agora.',
        gain: 'A hora certa é uma condição que seu perfil cria internamente. Iniciar revela que ela não era necessária.',
      },
      {
        task: 'Passe o dia sem ajustar suas respostas para evitar desconforto nos outros.',
        gain: 'Ajustar a resposta para proteger o outro é cuidado. Para proteger a si mesmo é evitação. Os dois parecem iguais.',
      },
      {
        task: 'Quando sentir resistência a agir, pergunte: estou protegendo algo real ou só o desconforto?',
        gain: 'Resistência com função protege. Resistência por hábito mantém o mesmo ponto por mais tempo do que serve.',
      },
      {
        task: 'Observe quantas vezes hoje você cedeu sem realmente querer. Só conta.',
        gain: 'O número real de concessões involuntárias por dia costuma surpreender. O dado muda a percepção.',
      },
      {
        task: 'Revise: onde esta semana você agiu a partir de convicção genuína? Onde foi só para manter paz?',
        gain: 'Essa distinção é o mapa mais honesto do que está e do que não está sob seu controle de fato.',
      },
    ],
  },
};

/** Fallback para combinações ausentes */
export const TASK_FALLBACK_SEQUENCE = [
  {
    task: 'Identifique um padrão seu que apareceu hoje. Observe como ele afetou uma situação.',
    gain: 'Observar o padrão em ação é o início da mudança. Sem observação, não há escolha.',
  },
  {
    task: 'Escolha uma coisa difícil que está adiando. Faça pelo menos o primeiro passo agora.',
    gain: 'O primeiro passo quebra a inércia. Os seguintes ficam progressivamente menores.',
  },
  {
    task: 'Fale com alguém próximo de forma honesta sobre algo que normalmente guardaria.',
    gain: 'Verdade dita com cuidado cria mais proximidade do que a proteção que o silêncio oferece.',
  },
  {
    task: 'Encerre o dia sem deixar uma pendência importante em aberto.',
    gain: 'Pendências em aberto consomem atenção mesmo quando você não está nelas.',
  },
];

/**
 * Retorna a tarefa do dia baseada no dia sequencial do usuário.
 * Usa módulo para que ao esgotar os dias, o ciclo recomece.
 *
 * @param {string} top - temperamento dominante
 * @param {string} area - área selecionada
 * @param {number} currentDay - dia atual na sequência (1-based)
 * @returns {{ task: string, gain: string }}
 */
export function getTaskForDay(top, area, currentDay) {
  const sequence = TASK_SEQUENCES[top]?.[area];

  if (!sequence || sequence.length === 0) {
    const idx = (currentDay - 1) % TASK_FALLBACK_SEQUENCE.length;
    return TASK_FALLBACK_SEQUENCE[idx];
  }

  const idx = (currentDay - 1) % sequence.length;
  return sequence[idx];
}
