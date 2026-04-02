/**
 * usePlan.js
 *
 * Gerencia o plano do usuário (free / premium).
 *
 * Fontes de dados (por prioridade):
 *   1. cloudData.plan  → veio do Firestore ao logar
 *   2. localStorage    → fallback quando não logado ou offline
 *
 * Limites:
 *   free    → tarefas disponíveis por até FREE_DAY_LIMIT dias
 *   premium → sem limite
 */

import { useState, useEffect, useCallback } from 'react';
import { upgradeToPremium, saveUserData, isFirestoreAvailable } from '../services/firestore';

const PLAN_STORAGE_KEY = 'temperamento_plan';
export const FREE_DAY_LIMIT = 3;

function readLocalPlan() {
  try {
    return localStorage.getItem(PLAN_STORAGE_KEY) || 'free';
  } catch { return 'free'; }
}

function writeLocalPlan(plan) {
  try { localStorage.setItem(PLAN_STORAGE_KEY, plan); } catch (_) {}
}

/**
 * @param {string|null} userId    - uid do Firebase (null = não logado)
 * @param {Object|null} cloudData - dados carregados do Firestore
 * @returns {{
 *   plan: 'free'|'premium',
 *   isPremium: boolean,
 *   isBlocked: (currentDay: number) => boolean,
 *   upgrade: () => Promise<void>,
 *   upgrading: boolean,
 * }}
 */
export function usePlan(userId = null, cloudData = null) {
  const [plan, setPlan]         = useState(readLocalPlan);
  const [upgrading, setUpgrading] = useState(false);

  // Sincroniza com cloudData quando chega (login ou reload)
  useEffect(() => {
    if (!cloudData) return;
    const cloudPlan = cloudData.plan || 'free';
    setPlan(cloudPlan);
    writeLocalPlan(cloudPlan);
  }, [cloudData]);

  /**
   * Verifica se o usuário está bloqueado com base no dia atual.
   * @param {number} currentDay
   * @returns {boolean}
   */
  const isBlocked = useCallback((currentDay) => {
    return plan === 'free' && currentDay > FREE_DAY_LIMIT;
  }, [plan]);

  /**
   * Simula upgrade para premium.
   * Atualiza Firestore (se logado) e localStorage.
   */
  const upgrade = useCallback(async () => {
    setUpgrading(true);
    try {
      setPlan('premium');
      writeLocalPlan('premium');

      if (userId && isFirestoreAvailable()) {
        await upgradeToPremium(userId);
      }
    } catch (err) {
      console.warn('[usePlan] Erro no upgrade:', err.message);
    } finally {
      setUpgrading(false);
    }
  }, [userId]);

  return {
    plan,
    isPremium: plan === 'premium',
    isBlocked,
    upgrade,
    upgrading,
  };
}
