/**
 * useDailyTask.js — v3
 *
 * Hook de tarefa diária com:
 * - progressão sequencial de dias
 * - streak de dias consecutivos
 * - localStorage como fallback (sempre funciona)
 * - Firestore como fonte da verdade quando usuário logado
 *
 * Fluxo de dados:
 *   Não logado  → localStorage only
 *   Logado      → carrega Firestore → sincroniza automaticamente a cada mudança
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { getTaskForDay, TASK_FALLBACK_SEQUENCE } from '../data/tasks';
import { saveUserData, isFirestoreAvailable } from '../services/firestore';

const STORAGE_KEY = 'temperamento_v2_task';

// ─── Helpers de data ──────────────────────────────────────────────────────

function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function yesterdayStr() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function computeStreak(savedStreak, lastAccessDate) {
  const today = todayStr();
  const yesterday = yesterdayStr();
  if (!lastAccessDate) return 1;
  if (lastAccessDate === today)     return savedStreak;
  if (lastAccessDate === yesterday) return savedStreak + 1;
  return 1; // pulou um ou mais dias
}

// ─── Estado vazio padrão ──────────────────────────────────────────────────

const EMPTY_STATE = {
  area: null,
  currentDay: 1,
  taskObj: null,
  completedToday: false,
  streak: 1,
  lastTaskDate: null,
  lastAccessDate: null,
};

// ─── Normaliza estado vindo de qualquer fonte (localStorage ou Firestore) ──

/**
 * Recebe dados crus (localStorage ou Firestore) e retorna estado normalizado:
 * - avança dia se necessário
 * - recalcula streak
 * - preserva área
 */
function normalizeState(saved, dominant) {
  if (!saved) return { ...EMPTY_STATE };

  const today = todayStr();
  const newStreak = computeStreak(saved.streak || 1, saved.lastAccessDate);

  // Mesmo dia: retorna como está, só atualiza streak
  if (saved.lastTaskDate === today) {
    const base = { ...EMPTY_STATE, ...saved, streak: newStreak, lastAccessDate: today };
    // Reconstrói taskObj se tiver área e dominant
    if (base.area && dominant && !base.taskObj) {
      base.taskObj = getTaskForDay(dominant, base.area, base.currentDay);
    }
    return base;
  }

  // Novo dia: avança currentDay se a tarefa de ontem foi concluída
  const nextDay = saved.completedToday
    ? (saved.currentDay || 1) + 1
    : (saved.currentDay || 1);

  return {
    ...EMPTY_STATE,
    ...saved,
    currentDay: nextDay,
    taskObj: null,       // será regenerada ao confirmar área
    completedToday: false,
    streak: newStreak,
    lastTaskDate: null,
    lastAccessDate: today,
  };
}

// ─── Leitura do localStorage ──────────────────────────────────────────────

function readLocalStorage() {
  try {
    // Migração de formato antigo
    const oldKey = 'temperamento_daily_task';
    const old = localStorage.getItem(oldKey);
    if (old) {
      const parsed = JSON.parse(old);
      if (parsed && typeof parsed.task === 'string') {
        localStorage.removeItem(oldKey);
        return { ...EMPTY_STATE, area: parsed.area || null };
      }
    }

    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeLocalStorage(state) {
  try {
    // Não salva taskObj no localStorage (será regenerada a partir dos outros campos)
    const { taskObj, ...toSave } = state;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch (_) {}
}

// ─── Hook principal ───────────────────────────────────────────────────────

/**
 * @param {string|null} dominant - temperamento dominante
 * @param {string|null} userId   - uid do Firebase (null = não logado)
 * @param {Object|null} cloudData - dados pré-carregados do Firestore (vindo do useAuth)
 */
export function useDailyTask(dominant, userId = null, cloudData = null) {
  // Inicializa com localStorage; se cloudData chegar, será aplicado via useEffect
  const [state, setState] = useState(() => {
    const local = readLocalStorage();
    const normalized = normalizeState(local, dominant);
    return normalized;
  });

  // Rastreia se já aplicamos os dados da nuvem nesta sessão
  const cloudApplied = useRef(false);

  // ── Aplica dados da nuvem quando chegam ──────────────────────────────
  useEffect(() => {
    if (!cloudData || cloudApplied.current) return;
    cloudApplied.current = true;

    const normalized = normalizeState(cloudData, dominant);

    // Regenera taskObj se tiver área
    if (normalized.area && dominant && !normalized.taskObj) {
      normalized.taskObj = getTaskForDay(dominant, normalized.area, normalized.currentDay);
      normalized.lastTaskDate = todayStr();
    }

    setState(normalized);
    writeLocalStorage(normalized); // Sincroniza localStorage com a nuvem
  }, [cloudData, dominant]);

  // ── Sincroniza com Firestore ──────────────────────────────────────────
  async function syncToCloud(data) {
    if (!userId || !isFirestoreAvailable()) return;
    const { taskObj, ...toSave } = data; // não salva taskObj (derivado)
    await saveUserData(userId, toSave);
  }

  // ── Persiste em ambos os stores ───────────────────────────────────────
  function persist(next) {
    setState(next);
    writeLocalStorage(next);
    syncToCloud(next); // fire-and-forget
  }

  // ── setArea: usuário escolheu uma área ────────────────────────────────
  const setArea = useCallback((area) => {
    if (!dominant) return;
    const taskObj = getTaskForDay(dominant, area, state.currentDay);
    persist({
      ...state,
      area,
      taskObj,
      completedToday: false,
      lastTaskDate: todayStr(),
      lastAccessDate: todayStr(),
    });
  }, [dominant, state, userId]);

  // ── markComplete: tarefa concluída ────────────────────────────────────
  const markComplete = useCallback(() => {
    setState(prev => {
      const next = { ...prev, completedToday: true };
      writeLocalStorage(next);
      syncToCloud(next);
      return next;
    });
  }, [userId]);

  // ── reset: teste refeito ──────────────────────────────────────────────
  const reset = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem('temperamento_daily_task');
    } catch (_) {}
    cloudApplied.current = false;
    setState({ ...EMPTY_STATE });
    // Não apaga Firestore no reset — preserva histórico
  }, []);

  return {
    area:           state.area,
    taskObj:        state.taskObj,
    completedToday: state.completedToday,
    currentDay:     state.currentDay,
    streak:         state.streak,
    setArea,
    markComplete,
    reset,
  };
}

// Exportado para compatibilidade
export function getDailyTask(top, area) {
  return getTaskForDay(top, area, 1)?.task || TASK_FALLBACK_SEQUENCE[0].task;
}
