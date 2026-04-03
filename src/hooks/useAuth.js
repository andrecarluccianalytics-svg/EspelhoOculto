/**
 * useAuth.js — v2
 *
 * Hook de autenticação com integração Firestore:
 * - ao logar: carrega dados do Firestore (ou migra do localStorage)
 * - expõe cloudData para repassar ao useDailyTask
 * - expõe syncMessage para feedback de UI
 */

import { useState, useEffect, useCallback } from 'react';
import { loginWithGoogle, logout as firebaseLogout, onUserChange, isConfigured, getRedirectResult } from '../services/firebase';
import { loadUserData, migrateFromLocalStorage, isFirestoreAvailable } from '../services/firestore';

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
 *   loading: boolean,
 *   error: string|null,
 *   firebaseReady: boolean,
 *   cloudData: Object|null,
 *   syncMessage: string|null,
 *   login: () => Promise<void>,
 *   logout: () => Promise<void>,
 * }}
 */
export function useAuth() {
  const [user, setUser]             = useState(readCache);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState(null);
  const [cloudData, setCloudData]   = useState(null);
  const [syncMessage, setSyncMessage] = useState(null);
  const [firebaseReady]             = useState(isConfigured);

  // ── Carrega dados do Firestore após autenticação ──────────────────────
  async function loadCloudData(uid) {
    if (!isFirestoreAvailable()) return;

    // Tenta carregar — se não existir, migra do localStorage
    let data = await loadUserData(uid);

    if (!data) {
      data = await migrateFromLocalStorage(uid);
      if (data) {
        setSyncMessage('Seu progresso local foi sincronizado com a nuvem.');
      }
    } else {
      setSyncMessage('Progresso sincronizado.');
    }

    if (data) setCloudData(data);

    // Limpa mensagem após 3 segundos
    setTimeout(() => setSyncMessage(null), 3000);
  }

  // ── Observa mudanças de auth (fonte da verdade) ───────────────────────
  useEffect(() => {
    const unsubscribe = onUserChange(async (firebaseUser) => {
      setUser(firebaseUser);
      writeCache(firebaseUser);

      if (firebaseUser) {
        // Usuário acabou de logar — carrega dados da nuvem
        await loadCloudData(firebaseUser.uid);
      } else {
        // Logout — limpa dados da nuvem
        setCloudData(null);
        setSyncMessage(null);
      }
    });
    return unsubscribe;
  }, []);

  // ── Login ─────────────────────────────────────────────────────────────
  const login = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await loginWithGoogle();
      if (result) {
        setUser(result);
        writeCache(result);
        await loadCloudData(result.uid);
      }
    } catch (err) {
      // Mostra a mensagem real do erro (domínio não autorizado, popup bloqueado, etc.)
      setError(err.message || 'Não foi possível fazer login. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Logout ────────────────────────────────────────────────────────────
  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await firebaseLogout();
      setUser(null);
      setCloudData(null);
      setSyncMessage(null);
      writeCache(null);
    } catch {
      setError('Erro ao sair. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    user,
    loading,
    error,
    firebaseReady,
    cloudData,
    syncMessage,
    login,
    logout,
  };
}
