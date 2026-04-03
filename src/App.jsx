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

      {/* Header de marca — Espelho Oculto */}
      <div
        className="w-full flex items-center justify-between px-5 pt-5 pb-0 relative z-20"
      >
        <div className="flex items-center gap-2">
          {/* Quatro pontos — identidade visual */}
          <div className="flex items-center gap-1">
            {['#FFD54F','#E53935','#1E88E5','#43A047'].map((color, i) => (
              <div
                key={i}
                style={{
                  width: i === 1 || i === 2 ? '7px' : '5px',
                  height: i === 1 || i === 2 ? '7px' : '5px',
                  borderRadius: '50%',
                  background: color,
                  boxShadow: `0 0 6px ${color}70`,
                }}
              />
            ))}
          </div>
          <span
            className="font-display font-black tracking-tight"
            style={{ fontSize: '1.05rem', letterSpacing: '-0.025em', color: 'rgba(240,237,232,0.82)' }}
          >
            Espelho Oculto
          </span>
        </div>

        {/* UserBar integrado no header */}
        <UserBar
        user={user}
        loading={loading}
        firebaseReady={firebaseReady}
        onLogin={login}
        onLogout={logout}
      />
      </div>

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
          userName={user?.name || null}
          onReset={() => setScreen('welcome')}
        />
      )}
    </div>
  );
}
