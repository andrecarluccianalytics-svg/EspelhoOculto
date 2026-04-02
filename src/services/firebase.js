/**
 * firebase.js
 *
 * Configuração do Firebase e funções de autenticação.
 *
 * ─── COMO CONFIGURAR ───────────────────────────────────────────────────────
 * 1. Acesse https://console.firebase.google.com
 * 2. Crie um projeto (ou use um existente)
 * 3. Clique em "Adicionar app" → Web (ícone </>)
 * 4. Copie o objeto firebaseConfig gerado
 * 5. Cole os valores abaixo substituindo os placeholders
 * 6. No console Firebase: Authentication → Sign-in method → Google → Ativar
 * 7. Em "Domínios autorizados", adicione seu domínio do Vercel
 *    (ex: temperamento-app.vercel.app)
 * ───────────────────────────────────────────────────────────────────────────
 *
 * VARIÁVEIS DE AMBIENTE (recomendado para produção):
 * Crie um arquivo .env na raiz do projeto com:
 *
 *   VITE_FIREBASE_API_KEY=sua_api_key
 *   VITE_FIREBASE_AUTH_DOMAIN=seu_projeto.firebaseapp.com
 *   VITE_FIREBASE_PROJECT_ID=seu_projeto_id
 *   VITE_FIREBASE_APP_ID=seu_app_id
 *
 * E substitua os valores hardcoded pelas variáveis:
 *   apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
 */

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';

// ─── Configuração do Firebase ─────────────────────────────────────────────
// ⚠️  Substitua estes valores pelos do seu projeto Firebase
const firebaseConfig = {
  apiKey:            'AIzaSyANRtNv_dA1ZwUhljGE8ReObvJs-KeEgQA',
  authDomain:        'espelho-oculto-3c589.firebaseapp.com',
  projectId:         'espelho-oculto-3c589',
  storageBucket:     'espelho-oculto-3c589.firebasestorage.app',
  messagingSenderId: '509720219875',
  appId:             '1:509720219875:web:4f56dbe95a283c322ef5d6',
};

// Verifica se as credenciais foram configuradas
const isConfigured = !Object.values(firebaseConfig).some(v =>
  v.startsWith('COLE_') || v === ''
);

// ─── Inicialização ────────────────────────────────────────────────────────
let auth = null;
let googleProvider = null;
let db = null;

if (isConfigured) {
  try {
    const app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    googleProvider = new GoogleAuthProvider();
    googleProvider.setCustomParameters({ prompt: 'select_account' });
    db = getFirestore(app);
  } catch (err) {
    console.error('[Firebase] Erro na inicialização:', err.message);
  }
}

// ─── Funções de autenticação ──────────────────────────────────────────────

/**
 * Login com Google via popup.
 * @returns {Promise<{ uid, name, email, photo } | null>}
 */
export async function loginWithGoogle() {
  if (!auth || !googleProvider) {
    console.warn('[Firebase] Não configurado. Configure firebase.js com suas credenciais.');
    return null;
  }
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    return {
      uid:   user.uid,
      name:  user.displayName,
      email: user.email,
      photo: user.photoURL,
    };
  } catch (err) {
    // Usuário fechou o popup — não é erro real
    if (err.code === 'auth/popup-closed-by-user' || err.code === 'auth/cancelled-popup-request') {
      return null;
    }
    console.error('[Firebase] Erro no login:', err.message);
    return null;
  }
}

/**
 * Logout.
 * @returns {Promise<void>}
 */
export async function logout() {
  if (!auth) return;
  try {
    await signOut(auth);
  } catch (err) {
    console.error('[Firebase] Erro no logout:', err.message);
  }
}

/**
 * Observa mudanças no estado de autenticação.
 * Chame na inicialização do app para restaurar sessão.
 *
 * @param {(user: {uid,name,email,photo}|null) => void} callback
 * @returns {() => void} unsubscribe function
 */
export function onUserChange(callback) {
  if (!auth) {
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(auth, (firebaseUser) => {
    if (firebaseUser) {
      callback({
        uid:   firebaseUser.uid,
        name:  firebaseUser.displayName,
        email: firebaseUser.email,
        photo: firebaseUser.photoURL,
      });
    } else {
      callback(null);
    }
  });
}

export { isConfigured, db };
