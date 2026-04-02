import { useReducer, useCallback } from 'react';
import { QUESTIONS, SCORE_MAP } from '../data/questions';
import { getProfileData } from '../data/profiles';
import { prioritizeQuestions } from '../utils/adaptive';

const INITIAL_SCORES = { S: 0, C: 0, M: 0, F: 0 };

function computePartialScores(answers, allQuestions) {
  const partialScores = { ...INITIAL_SCORES };
  answers.forEach(a => {
    const q = allQuestions.find(x => x.id === a.questionId);
    if (!q || q.type !== 'scale') return;
    const rawVal = SCORE_MAP[a.value];
    Object.keys(q.weights).forEach(t => {
      partialScores[t] = (partialScores[t] || 0) + rawVal * q.weights[t];
    });
  });
  return partialScores;
}

function getAdaptiveOrder(answers, allQuestions) {
  const scaleQuestions = allQuestions.filter(q => q.type === 'scale');
  const forcedQuestions = allQuestions.filter(q => q.type === 'forced');
  const answeredIds = new Set(answers.map(a => a.questionId));
  const answeredScale = scaleQuestions.filter(q => answeredIds.has(q.id));
  const remainingScale = scaleQuestions.filter(q => !answeredIds.has(q.id));
  const remainingForced = forcedQuestions.filter(q => !answeredIds.has(q.id));

  // Default: manter ordem original para as primeiras 8 perguntas de escala
  if (answeredScale.length < 8) {
    return [...remainingScale, ...remainingForced];
  }

  // A partir de 8 respostas: calcular scores parciais e identificar top-2
  const partialScores = computePartialScores(answers, allQuestions);
  const sorted = Object.keys(partialScores).sort((a, b) => partialScores[b] - partialScores[a]);
  const top2 = [sorted[0], sorted[1]];

  // Usar prioritizeQuestions com detecção de conflito real
  const prioritized = prioritizeQuestions(remainingScale, top2);

  return [...prioritized, ...remainingForced];
}

function calcScores(answers) {
  const scores = { ...INITIAL_SCORES };
  answers.forEach(a => {
    const q = QUESTIONS.find(x => x.id === a.questionId);
    if (!q) return;
    if (q.type === 'scale') {
      const rawVal = SCORE_MAP[a.value];
      Object.keys(q.weights).forEach(t => {
        scores[t] = (scores[t] || 0) + rawVal * (q.weights[t] || 0);
      });
    } else if (q.type === 'forced') {
      const option = a.value === 'A' ? q.optionA : q.optionB;
      Object.keys(option.weights).forEach(t => {
        scores[t] = (scores[t] || 0) + option.weights[t];
      });
    }
  });
  return scores;
}

function reducer(state, action) {
  switch (action.type) {
    case 'ANSWER': {
      const newAnswers = [...state.answers, { questionId: action.questionId, value: action.value }];
      const remaining = getAdaptiveOrder(newAnswers, QUESTIONS);
      const nextQuestion = remaining[0] || null;
      const done = !nextQuestion;
      const scores = done ? calcScores(newAnswers) : state.scores;
      const result = done ? getProfileData(scores) : null;

      if (done && result) {
        try { localStorage.setItem('temperamento_result', JSON.stringify({ scores, result, date: new Date().toISOString() })); }
        catch (_) {}
      }

      return {
        ...state,
        answers: newAnswers,
        currentQuestion: nextQuestion,
        currentIndex: state.currentIndex + 1,
        done,
        scores,
        result,
      };
    }
    case 'RESET':
      return initState();
    case 'UNDO': {
      if (state.answers.length === 0) return state;
      const newAnswers = state.answers.slice(0, -1);
      const remaining = getAdaptiveOrder(newAnswers, QUESTIONS);
      return {
        ...state,
        answers: newAnswers,
        currentQuestion: remaining[0] || state.currentQuestion,
        currentIndex: Math.max(0, state.currentIndex - 1),
        done: false,
        result: null,
      };
    }
    default:
      return state;
  }
}

function initState() {
  const initialOrder = getAdaptiveOrder([], QUESTIONS);
  return {
    answers: [],
    currentQuestion: initialOrder[0],
    currentIndex: 0,
    done: false,
    scores: { ...INITIAL_SCORES },
    result: null,
    total: QUESTIONS.length,
  };
}

export function useQuiz() {
  const [state, dispatch] = useReducer(reducer, null, initState);

  const answer = useCallback((questionId, value) => {
    dispatch({ type: 'ANSWER', questionId, value });
  }, []);

  const reset = useCallback(() => dispatch({ type: 'RESET' }), []);
  const undo = useCallback(() => dispatch({ type: 'UNDO' }), []);

  return { ...state, answer, reset, undo };
}
