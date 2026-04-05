/**
 * firestore.js
 *
 * Funções de persistência no Firestore.
 * Todas são silenciosas em caso de erro — o app nunca quebra por falha de rede.
 *
 * Estrutura da coleção:
 *   users/{uid} → {
 *     plan, area, currentDay, streak,
 *     lastTaskDate, lastAccessDate, completedToday,
 *     profile: { dominant, secondary, pct, ... },
 *     updatedAt
 *   }
 *
 * Regra de uso:
 * - usuário logado → Firestore como fonte da verdade
 * - usuário não logado → localStorage (não chega neste arquivo)
 * - erro de rede → mantém o que está em memória/localStorage
 */

import { db } from './firebase';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';

const COLLECTION = 'users';

// ─── Helpers ──────────────────────────────────────────────────────────────

function userRef(userId) {
  return doc(db, COLLECTION, userId);
}

// ─── saveUserData ──────────────────────────────────────────────────────────

/**
 * Salva ou atualiza o progresso do usuário no Firestore.
 * Usa merge parcial — não sobrescreve campos não enviados.
 *
 * @param {string} userId
 * @param {Object} data - campos a persistir
 * @returns {Promise<boolean>} true se salvou, false se falhou
 */
export async function saveUserData(userId, data) {
  if (!db || !userId) return false;
  try {
    const ref = userRef(userId);
    // Remove campos undefined para não poluir o documento
    const clean = Object.fromEntries(
      Object.entries(data).filter(([, v]) => v !== undefined)
    );
    await setDoc(ref, { ...clean, updatedAt: serverTimestamp() }, { merge: true });
    return true;
  } catch (err) {
    console.warn('[Firestore] Erro ao salvar:', err.message);
    return false;
  }
}

// ─── loadUserData ──────────────────────────────────────────────────────────

/**
 * Carrega os dados do usuário do Firestore.
 *
 * @param {string} userId
 * @returns {Promise<Object|null>} dados do usuário ou null se não existir/erro
 */
export async function loadUserData(userId) {
  if (!db || !userId) return null;
  try {
    const snap = await getDoc(userRef(userId));
    if (!snap.exists()) return null;
    const data = snap.data();
    // Remove campo de servidor que não pertence ao estado do app
    const { updatedAt, ...rest } = data;
    return rest;
  } catch (err) {
    console.warn('[Firestore] Erro ao carregar:', err.message);
    return null;
  }
}

// ─── migrateFromLocalStorage ───────────────────────────────────────────────

/**
 * Migra dados do localStorage para o Firestore quando o usuário faz login.
 * Só migra se o Firestore não tiver dados para esse usuário ainda.
 * Após migrar, mantém o localStorage intacto (não apaga).
 *
 * @param {string} userId
 * @param {string} localStorageKey - chave do localStorage com os dados locais
 * @returns {Promise<Object|null>} dados migrados (ou os dados existentes no Firestore)
 */
export async function migrateFromLocalStorage(userId, localStorageKey = 'temperamento_v2_task') {
  if (!db || !userId) return null;

  // 1. Verifica se já tem dados no Firestore
  const existing = await loadUserData(userId);
  if (existing) return existing; // Já tem dados — não migra

  // 2. Lê localStorage
  let localData = null;
  try {
    const raw = localStorage.getItem(localStorageKey);
    if (raw) localData = JSON.parse(raw);
  } catch (_) {}

  if (!localData) return null; // Nada para migrar

  // 3. Migra para o Firestore
  const toMigrate = {
    area:            localData.area        || null,
    currentDay:      localData.currentDay  || 1,
    streak:          localData.streak      || 1,
    lastTaskDate:    localData.lastTaskDate || null,
    lastAccessDate:  localData.lastAccessDate || null,
    completedToday:  localData.completedToday || false,
  };

  await saveUserData(userId, toMigrate);
  return toMigrate;
}

// ─── saveTestResult ───────────────────────────────────────────────────────

/**
 * Salva o resultado do teste no Firestore.
 * Chamado uma vez quando o usuário termina o questionário.
 * Persiste hasCompletedTest: true + campos essenciais do perfil.
 *
 * @param {string} userId
 * @param {Object} result - objeto completo do getProfileData()
 * @returns {Promise<boolean>}
 */
export async function saveTestResult(userId, result) {
  if (!db || !userId || !result) return false;
  try {
    const payload = {
      hasCompletedTest: true,
      dominant:  result.dominant   || null,
      secondary: result.secondary  || null,
      pct:       result.pct        || {},
      sorted:    result.sorted     || [],
      profileName: result.profileNameV3?.name || null,
      testDate:  new Date().toISOString(),
    };
    return await saveUserData(userId, payload);
  } catch (err) {
    console.warn('[Firestore] Erro ao salvar resultado do teste:', err.message);
    return false;
  }
}

// ─── upgradeToPremium ─────────────────────────────────────────────────────

/**
 * Atualiza o plano do usuário para "premium" no Firestore.
 * Simulação de upgrade — sem pagamento real por enquanto.
 *
 * @param {string} userId
 * @returns {Promise<boolean>}
 */
export async function upgradeToPremium(userId) {
  return saveUserData(userId, { plan: 'premium' });
}

// ─── isFirestoreAvailable ──────────────────────────────────────────────────

/** Verifica se o Firestore está inicializado (Firebase configurado). */
export function isFirestoreAvailable() {
  return !!db;
}
