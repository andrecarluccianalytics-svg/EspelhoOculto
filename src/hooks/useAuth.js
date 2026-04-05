/**
 * useAuth.js — v4
 *
 * Regra de ouro: setAuthReady(true) é chamado NO FINALLY — sempre.
 * Nenhum erro de Firestore, rede ou permissão pode travar o app.
 *
 * Hierarquia de robustez:
 *   1. try/catch em TODO await dentro do onAuthStateChanged
 *   2. setAuthReady(true) no finally — nunca dentro do try
 *   3. Timeout de 6s como último recurso (rede travada, erro silencioso)
 *   4. Firestore opcional: se falhar, app funciona normalmente sem dados cloud
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  loginWithGoogle,
  logout as firebaseLogout,
  onUserChange,
  isConfigured,
  getRedirectResult,
} from '../services/firebase';
import {
  loadUserData,
  migrateFromLocalStorage,
  saveUserData,
  isFirestoreAvailable,
} from '../services/firestore';

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

export function useAuth() {
  const [user, setUser]               = useState(readCache);
  const [authReady, setAuthReady]     = useState(false);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState(null);
  const [cloudData, setCloudData]     = useState(null);
  const [syncMessage, setSyncMessage] = useState(null);
  const [firebaseReady]               = useState(isConfigured);

  const cloudLoaded = useRef(false);
  // Garante que setAuthReady(true) só é chamado uma vez
  const authReadySet = useRef(false);

  function markReady() {
    if (!authReadySet.current) {
      authReadySet.current = true;
      setAuthReady(true);
    }
  }

  // ── Carrega dados do Firestore — nunca lança exceção para fora ────────
  async function loadCloudData(uid, showMessage = false) {
    if (!isFirestoreAvailable()) {
      console.log('[Auth] Firestore não disponível — usando localStorage');
      return null;
    }

    try {
      console.log('[Auth] Carregando dados do Firestore para uid:', uid);
      let data = await loadUserData(uid);

      if (!data) {
        console.log('[Auth] Usuário novo — tentando migrar localStorage');
        const migrated = await migrateFromLocalStorage(uid).catch(() => null);

        if (migrated) {
          data = migrated;
          if (showMessage) setSyncMessage('Progresso local sincronizado.');
          console.log('[Auth] Migração concluída:', migrated);
        } else {
          console.log('[Auth] Criando documento inicial');
          await saveUserData(uid, {
            hasCompletedTest: false,
            createdAt: new Date().toISOString(),
          }).catch(() => {});
          data = { hasCompletedTest: false };
        }
      } else {
        console.log('[Auth] Dados carregados:', data);
        if (showMessage) setSyncMessage('Progresso sincronizado.');
      }

      if (data) setCloudData(data);
      if (showMessage) setTimeout(() => setSyncMessage(null), 3000);
      return data;

    } catch (err) {
      // Erro de Firestore (permissão, rede, regras expiradas) — NÃO trava o app
      console.error('[Auth] Erro ao carregar Firestore (app continua):', err.code, err.message);
      return null;
    }
  }

  // ── Timeout de segurança: 6s sem resposta → libera o app ─────────────
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!authReadySet.current) {
        console.warn('[Auth] Timeout de segurança disparado — liberando app');
        markReady();
      }
    }, 6000);
    return () => clearTimeout(timeout);
  }, []); // eslint-disable-line

  // ── onAuthStateChanged — fonte da verdade ─────────────────────────────
  useEffect(() => {
    if (!isConfigured) {
      console.log('[Auth] Firebase não configurado — app sem autenticação');
      markReady();
      return;
    }

    console.log('[Auth] Iniciando listener de autenticação');

    const unsubscribe = onUserChange(async (firebaseUser) => {
      console.log('[Auth] Estado de auth recebido:', firebaseUser?.email || 'não logado');

      try {
        setUser(firebaseUser);
        writeCache(firebaseUser);

        if (firebaseUser && !cloudLoaded.current) {
          cloudLoaded.current = true;
          await loadCloudData(firebaseUser.uid, false);
        } else if (!firebaseUser) {
          setCloudData(null);
          setSyncMessage(null);
          cloudLoaded.current = false;
        }
      } catch (err) {
        // Captura qualquer erro inesperado — nunca trava
        console.error('[Auth] Erro inesperado no callback de auth:', err);
      } finally {
        // SEMPRE libera o app, independente do que aconteceu acima
        markReady();
      }
    });

    return unsubscribe;
  }, []); // eslint-disable-line

  // ── Redirect result (fallback de popup bloqueado) ─────────────────────
  useEffect(() => {
    getRedirectResult()
      .then(async (redirectUser) => {
        if (!redirectUser) return;
        console.log('[Auth] Redirect result:', redirectUser.email);
        setUser(redirectUser);
        writeCache(redirectUser);
        cloudLoaded.current = true;
        await loadCloudData(redirectUser.uid, true);
      })
      .catch((err) => {
        console.warn('[Auth] Erro no redirect result:', err.message);
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
      console.error('[Auth] Erro no login:', err.message);
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
    } catch (err) {
      console.error('[Auth] Erro no logout:', err.message);
      setError('Erro ao sair. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshCloudData = useCallback(async () => {
    if (!user?.uid) return;
    await loadCloudData(user.uid, false);
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
