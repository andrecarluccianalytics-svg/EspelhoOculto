import { useState } from 'react';
import { Welcome } from './components/Welcome';
import { Quiz } from './components/Quiz';
import { UserBar } from './components/UserBar';
import { useAuth } from './hooks/useAuth';

export default function App() {
  const [screen, setScreen] = useState('welcome');
  const {
    user, loading, error, firebaseReady,
    cloudData, syncMessage,
    login, logout,
  } = useAuth();

  return (
    <div className="max-w-md mx-auto relative">

      {/* Barra de usuário — presente em todas as telas */}
      <UserBar
        user={user}
        loading={loading}
        firebaseReady={firebaseReady}
        onLogin={login}
        onLogout={logout}
      />

      {/* Feedback de sincronização (não bloqueante, some sozinho) */}
      {syncMessage && (
        <div
          className="mx-5 mb-2 px-4 py-2 rounded-xl text-[12px] text-center animate-fade-in"
          style={{
            background: 'rgba(67,160,71,0.12)',
            color: '#43A047',
            border: '1px solid rgba(67,160,71,0.2)',
          }}
        >
          ✓ {syncMessage}
        </div>
      )}

      {/* Erro de auth (não bloqueante) */}
      {error && (
        <div
          className="mx-5 mb-2 px-4 py-2 rounded-xl text-[12px] text-center"
          style={{
            background: 'rgba(229,57,53,0.12)',
            color: '#E53935',
            border: '1px solid rgba(229,57,53,0.2)',
          }}
        >
          {error}
        </div>
      )}

      {screen === 'welcome' && (
        <Welcome onStart={() => setScreen('quiz')} />
      )}
      {screen === 'quiz' && (
        <Quiz
          userId={user?.uid || null}
          cloudData={cloudData}
          onReset={() => setScreen('welcome')}
        />
      )}
    </div>
  );
}
