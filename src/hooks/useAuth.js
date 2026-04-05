/**
 * useAuth.js — v3
 *
 * Hook de autenticação com:
 * - authReady: true quando Firebase confirmou o estado inicial (logado ou não)
 * - cloudData: dados do Firestore carregados após login
 * - syncMessage: feedback de UI
 *
 * FLUXO CRÍTICO:
 *   1. App monta → authReady = false → mostra loading
 *   2. onAuthStateChanged dispara (sempre, mesmo sem usuário)
 *   3. Se logado → carrega Firestore → authReady = true
 *   4. Se não logado → authReady = true imediatamente
 *   5. App renderiza com estado correto
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  loginWithGoogle,
  logout as firebaseLogout,
  onUserChange,
  isConfigured,
  getRedirectResult,
} from '../services/firebase';
import { loadUserData, migrateFromLocalStorage, saveUserData, isFirestoreAvailable } from '../services/firestore';

const USER_CACHE_KEY = 'temperamento_user';

function readCache() {
  try {
    const raw = localStorage.getItem(USER_CACHE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function writeCache(user) {
  try {
    if (user) localStorage.setItem(USER_CACHE_KEY, JSON.stringify(user));
    else localStorage.removeItem(USER_CACHE_KEY);
  } catch (_) {}
}

/**
 * @returns {{
 *   user: {uid,name,email,photo}|null,
 *   authReady: boolean,       ← NOVO: Firebase confirmou estado inicial
 *   loading: boolean,         ← login/logout em progresso
 *   error: string|null,
 *   firebaseReady: boolean,
 *   cloudData: Object|null,
 *   syncMessage: string|null,
 *   login: () => Promise<void>,
 *   logout: () => Promise<void>,
 *   refreshCloudData: () => Promise<void>,
 * }}
 */
export function useAuth() {
  const [user, setUser]               = useState(readCache);
  const [authReady, setAuthReady]     = useState(false);   // ← Firebase confirmou estado
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState(null);
  const [cloudData, setCloudData]     = useState(null);
  const [syncMessage, setSyncMessage] = useState(null);
  const [firebaseReady]               = useState(isConfigured);

  // Evita carregar cloudData duas vezes na mesma sessão
  const cloudLoaded = useRef(false);

  // ── Carrega dados do Firestore para um uid ────────────────────────────
  async function loadCloudData(uid, showMessage = true) {
    if (!isFirestoreAvailable()) return null;

    let data = await loadUserData(uid);

    if (!data) {
      // Primeira vez: cria documento inicial + tenta migrar localStorage
      const migrated = await migrateFromLocalStorage(uid);
      if (migrated) {
        data = migrated;
        if (showMessage) setSyncMessage('Seu progresso local foi sincronizado.');
      } else {
        // Usuário genuinamente novo — cria doc mínimo
        await saveUserData(uid, {
          hasCompletedTest: false,
          createdAt: new Date().toISOString(),
        });
        data = { hasCompletedTest: false };
      }
    } else if (showMessage) {
      setSyncMessage('Progresso sincronizado.');
    }

    if (data) setCloudData(data);
    setTimeout(() => setSyncMessage(null), 3000);
    return data;
  }

  // ── Observa estado de autenticação (fonte da verdade) ─────────────────
  // Este useEffect é o ÚNICO lugar que define authReady.
  useEffect(() => {
    if (!isConfigured) {
      // Firebase não configurado — app funciona sem auth
      setAuthReady(true);
      return;
    }

    const unsubscribe = onUserChange(async (firebaseUser) => {
      setUser(firebaseUser);
      writeCache(firebaseUser);

      if (firebaseUser && !cloudLoaded.current) {
        cloudLoaded.current = true;
        await loadCloudData(firebaseUser.uid, false); // silencioso no auto-login
      } else if (!firebaseUser) {
        setCloudData(null);
        setSyncMessage(null);
        cloudLoaded.current = false;
      }

      // Firebase confirmou o estado — app pode renderizar
      setAuthReady(true);
    });

    return unsubscribe;
  }, []); // eslint-disable-line

  // ── Verifica resultado de redirect ao carregar ────────────────────────
  useEffect(() => {
    getRedirectResult().then(async (redirectUser) => {
      if (redirectUser) {
        setUser(redirectUser);
        writeCache(redirectUser);
        cloudLoaded.current = true;
        const data = await loadCloudData(redirectUser.uid, true);
        if (data) setCloudData(data);
      }
    });
  }, []); // eslint-disable-line

  // ── Login manual ──────────────────────────────────────────────────────
  const login = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await loginWithGoogle();
      if (result) {
        setUser(result);
        writeCache(result);
        cloudLoaded.current = true;
        await loadCloudData(result.uid, true);
      }
    } catch (err) {
      setError(err.message || 'Não foi possível fazer login. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }, []); // eslint-disable-line

  // ── Logout ────────────────────────────────────────────────────────────
  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await firebaseLogout();
      setUser(null);
      setCloudData(null);
      setSyncMessage(null);
      writeCache(null);
      cloudLoaded.current = false;
    } catch {
      setError('Erro ao sair. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Recarrega dados da nuvem manualmente ──────────────────────────────
  const refreshCloudData = useCallback(async () => {
    if (!user?.uid) return;
    const data = await loadCloudData(user.uid, false);
    if (data) setCloudData(data);
  }, [user]); // eslint-disable-line

  return {
    user,
    authReady,
    loading,
    error,
    firebaseReady,
    cloudData,
    syncMessage,
    login,
    logout,
    refreshCloudData,
  };
}
