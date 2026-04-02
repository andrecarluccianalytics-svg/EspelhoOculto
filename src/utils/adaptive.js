/**
 * adaptive.js
 * Funções de ordenação adaptativa com detecção de conflito real entre temperamentos.
 */

/**
 * Retorna TRUE se a pergunta cria conflito psicométrico real entre t1 e t2.
 * Conflito real = os dois temperamentos recebem pontuações em direções opostas,
 * OU a diferença absoluta entre os pesos dos dois é >= 2 (discriminação alta).
 *
 * @param {Object} question - pergunta com campo `weights`
 * @param {string} t1 - temperamento dominante (ex: 'C')
 * @param {string} t2 - temperamento secundário (ex: 'M')
 * @returns {boolean}
 */
export function createsConflict(question, t1, t2) {
  if (question.type !== 'scale') return false;

  const w1 = question.weights[t1] ?? 0;
  const w2 = question.weights[t2] ?? 0;

  // Condição 1: sinais opostos (um sobe enquanto o outro cai)
  const oppositeSigns = (w1 > 0 && w2 < 0) || (w1 < 0 && w2 > 0);

  // Condição 2: alta discriminação mesmo que não opostos
  const highDiscrimination = Math.abs(w1 - w2) >= 2;

  return oppositeSigns || highDiscrimination;
}

/**
 * Calcula um score de conflito para ranking de prioridade.
 * Quanto maior, mais útil a pergunta é para discriminar entre t1 e t2.
 *
 * @param {Object} question
 * @param {string} t1
 * @param {string} t2
 * @returns {number} score de 0 a 4
 */
function conflictScore(question, t1, t2) {
  if (question.type !== 'scale') return 0;

  const w1 = question.weights[t1] ?? 0;
  const w2 = question.weights[t2] ?? 0;

  // Penalizar questões onde ambos os pesos são 0 (irrelevante)
  if (w1 === 0 && w2 === 0) return 0;

  const signConflict = (w1 > 0 && w2 < 0) || (w1 < 0 && w2 > 0) ? 2 : 0;
  const magnitude = Math.min(Math.abs(w1 - w2), 4); // cap em 4

  return signConflict + magnitude;
}

/**
 * Ordena perguntas restantes priorizando as que criam maior conflito
 * entre os dois temperamentos mais fortes identificados até agora.
 * Perguntas sem conflito ficam no final, mantendo a ordem original entre si.
 *
 * @param {Array} remainingQuestions - perguntas ainda não respondidas (type === 'scale')
 * @param {[string, string]} top2 - [dominante, secundário] em ordem
 * @returns {Array} perguntas ordenadas por conflito decrescente
 */
export function prioritizeQuestions(remainingQuestions, top2) {
  const [t1, t2] = top2;

  return [...remainingQuestions].sort((a, b) => {
    const scoreA = conflictScore(a, t1, t2);
    const scoreB = conflictScore(b, t1, t2);

    // Decrescente por score de conflito; empate mantém ordem original (índice estável)
    return scoreB - scoreA;
  });
}
