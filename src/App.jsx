import { useState, useEffect } from 'react';
import { Welcome } from './components/Welcome';
import { Quiz } from './components/Quiz';
import { UserBar } from './components/UserBar';
import { useAuth } from './hooks/useAuth';

// ─── Loading splash ───────────────────────────────────────────────────────
// Exibido apenas enquanto o Firebase confirma o estado de autenticação.
// Dura tipicamente 200–600ms. Evita flash da tela errada.
function AuthLoading() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center gap-4"
      style={{ background: '#0A0A0F' }}
    >
      {/* Quatro pontos pulsando */}
      <div className="flex items-center gap-2">
        {['#FFD54F', '#E53935', '#1E88E5', '#43A047'].map((color, i) => (
          <div
            key={i}
            style={{
              width: i === 1 || i === 2 ? '8px' : '6px',
              height: i === 1 || i === 2 ? '8px' : '6px',
              borderRadius: '50%',
              background: color,
              boxShadow: `0 0 8px ${color}80`,
              animation: `pulse 1.4s ease-in-out ${i * 0.15}s infinite`,
              opacity: 0.7,
            }}
          />
        ))}
      </div>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.35; transform: scale(0.85); }
          50%       { opacity: 0.9;  transform: scale(1.1); }
        }
      `}</style>
    </div>
  );
}

// ─── App principal ────────────────────────────────────────────────────────

export default function App() {
  const {
    user, authReady, loading, error, firebaseReady,
    cloudData, syncMessage,
    login, logout,
  } = useAuth();

  // 'welcome' | 'quiz'
  // Começa em 'welcome'; muda para 'quiz' se cloudData indicar teste já feito
  const [screen, setScreen] = useState('welcome');

  // Quando o cloudData chegar após o login, decide onde mandar o usuário
  useEffect(() => {
    if (!cloudData) return;

    if (cloudData.hasCompletedTest && screen === 'welcome') {
      // Usuário já fez o teste — vai direto para o plano
      setScreen('quiz');
    }
  }, [cloudData]); // eslint-disable-line

  // ── Enquanto Firebase não confirmou estado → splash ───────────────────
  if (!authReady) {
    return <AuthLoading />;
  }

  return (
    <div className="max-w-md mx-auto relative">

      {/* Header de marca — só nas telas que não são quiz em fullscreen */}
      {screen !== 'quiz' && (
        <div className="w-full flex items-center justify-between px-5 pt-5 pb-0 relative z-20">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              {['#FFD54F', '#E53935', '#1E88E5', '#43A047'].map((color, i) => (
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
          <UserBar
            user={user}
            loading={loading}
            firebaseReady={firebaseReady}
            onLogin={login}
            onLogout={logout}
          />
        </div>
      )}

      {/* Header compacto dentro do quiz */}
      {screen === 'quiz' && (
        <div
          className="absolute top-0 right-0 z-30 px-4 pt-2"
          style={{ pointerEvents: 'none' }}
        >
          <div style={{ pointerEvents: 'auto' }}>
            <UserBar
              user={user}
              loading={loading}
              firebaseReady={firebaseReady}
              onLogin={login}
              onLogout={logout}
              compact
            />
          </div>
        </div>
      )}

      {/* Feedback de sincronização */}
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

      {/* Erro de auth */}
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
          onReset={() => {
            setScreen('welcome');
          }}
        />
      )}
    </div>
  );
}
