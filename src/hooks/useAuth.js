/**
 * useAuth.js — v5
 *
 * Regras:
 * 1. setAuthReady(true) SEMPRE no finally — nunca trava
 * 2. Firestore é fonte da verdade — localStorage é fallback de task, não de resultado
 * 3. migrateFromLocalStorage só roda se Firestore não tem NENHUM documento
 * 4. cloudData é setado UMA vez e reflecte o estado real do banco
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  loginWithGoogle,
  logout as firebaseLogout,
  onUserChange,
  isConfigured,
  getRedirectResult,
} from '../services/firebase';
import { loadUserData, saveUserData, isFirestoreAvailable } from '../services/firestore';

const USER_CACHE_KEY = 'temperamento_user';

function readCache() {
  try { return JSON.parse(localStorage.getItem(USER_CACHE_KEY)); } catch { return null; }
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

  const cloudLoaded    = useRef(false);
  const authReadySet   = useRef(false);

  function markReady() {
    if (!authReadySet.current) {
      authReadySet.current = true;
      setAuthReady(true);
    }
  }

  // ── Carrega dados do Firestore — nunca lança exceção ─────────────────
  async function fetchCloudData(uid, showMessage = false) {
    if (!isFirestoreAvailable()) return null;
    try {
      console.log('[Auth] fetchCloudData uid:', uid);
      const data = await loadUserData(uid);

      if (data) {
        console.log('[Auth] Dados encontrados:', {
          hasCompletedTest: data.hasCompletedTest,
          planStarted: data.planStarted,
          dominant: data.dominant,
          scoresKeys: Object.keys(data.scores || {}),
        });
        setCloudData(data);
        if (showMessage) {
          setSyncMessage('Progresso sincronizado.');
          setTimeout(() => setSyncMessage(null), 3000);
        }
        return data;
      }

      // Documento não existe — cria documento inicial vazio
      console.log('[Auth] Documento não existe — criando inicial');
      await saveUserData(uid, {
        hasCompletedTest: false,
        planStarted: false,
        createdAt: new Date().toISOString(),
      });
      const fresh = { hasCompletedTest: false, planStarted: false };
      setCloudData(fresh);
      return fresh;

    } catch (err) {
      console.error('[Auth] Erro ao carregar Firestore:', err.code, err.message);
      // Se falhar (permissão, rede), libera o app sem dados cloud
      // O quiz vai funcionar com localStorage
      return null;
    }
  }

  // ── Timeout de segurança ─────────────────────────────────────────────
  useEffect(() => {
    const t = setTimeout(() => {
      if (!authReadySet.current) {
        console.warn('[Auth] Timeout — liberando app');
        markReady();
      }
    }, 6000);
    return () => clearTimeout(t);
  }, []); // eslint-disable-line

  // ── onAuthStateChanged — fonte da verdade ─────────────────────────────
  useEffect(() => {
    if (!isConfigured) { markReady(); return; }

    const unsubscribe = onUserChange(async (firebaseUser) => {
      console.log('[Auth] onAuthStateChanged:', firebaseUser?.email || 'não logado');
      try {
        setUser(firebaseUser);
        writeCache(firebaseUser);
        if (firebaseUser && !cloudLoaded.current) {
          cloudLoaded.current = true;
          await fetchCloudData(firebaseUser.uid, false);
        } else if (!firebaseUser) {
          setCloudData(null);
          setSyncMessage(null);
          cloudLoaded.current = false;
        }
      } catch (err) {
        console.error('[Auth] Erro no callback:', err);
      } finally {
        markReady(); // SEMPRE libera
      }
    });

    return unsubscribe;
  }, []); // eslint-disable-line

  // ── Redirect result ───────────────────────────────────────────────────
  useEffect(() => {
    getRedirectResult()
      .then(async (redirectUser) => {
        if (!redirectUser) return;
        setUser(redirectUser);
        writeCache(redirectUser);
        cloudLoaded.current = true;
        await fetchCloudData(redirectUser.uid, true);
      })
      .catch(err => console.warn('[Auth] Redirect result erro:', err.message));
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
        await fetchCloudData(result.uid, true);
      }
    } catch (err) {
      setError(err.message || 'Não foi possível fazer login.');
    } finally {
      setLoading(false);
    }
  }, []); // eslint-disable-line

  // ── Logout ────────────────────────────────────────────────────────────
  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await firebaseLogout();
      setUser(null); setCloudData(null); setSyncMessage(null);
      writeCache(null);
      cloudLoaded.current = false;
    } catch (err) {
      setError('Erro ao sair.');
    } finally {
      setLoading(false);
    }
  }, []);

  return { user, authReady, loading, error, firebaseReady, cloudData, syncMessage, login, logout };
}
