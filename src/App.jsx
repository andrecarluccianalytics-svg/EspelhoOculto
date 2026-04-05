import { useState, useEffect } from 'react';
import { Welcome } from './components/Welcome';
import { Quiz } from './components/Quiz';
import { UserBar } from './components/UserBar';
import { useAuth } from './hooks/useAuth';

// ─── Loading inline ───────────────────────────────────────────────────────
// Renderizado DENTRO do container principal — nunca substitui o layout.
function InlineLoading() {
  const [slow, setSlow] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setSlow(true), 4000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className="flex flex-col items-center justify-center gap-4"
      style={{ minHeight: '100dvh' }}
    >
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
              animation: `appPulse 1.4s ease-in-out ${i * 0.15}s infinite`,
              opacity: 0.7,
            }}
          />
        ))}
      </div>
      {slow && (
        <p style={{ color: 'rgba(255,255,255,0.22)', fontSize: '11px', fontFamily: 'monospace' }}>
          verificando conexão...
        </p>
      )}
      <style>{`
        @keyframes appPulse {
          0%, 100% { opacity: 0.35; transform: scale(0.85); }
          50%       { opacity: 0.9;  transform: scale(1.1); }
        }
      `}</style>
    </div>
  );
}

// ─── Brand header (welcome) ───────────────────────────────────────────────
function BrandHeader({ user, loading, firebaseReady, onLogin, onLogout }) {
  return (
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
        user={user} loading={loading}
        firebaseReady={firebaseReady}
        onLogin={onLogin} onLogout={onLogout}
      />
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────
export default function App() {
  const {
    user, authReady, loading, error, firebaseReady,
    cloudData, syncMessage,
    login, logout,
  } = useAuth();

  const [screen, setScreen] = useState('welcome');

  // Redireciona para o plano quando cloudData confirmar teste concluído
  useEffect(() => {
    if (cloudData?.hasCompletedTest && screen === 'welcome') {
      setScreen('quiz');
    }
  }, [cloudData]); // eslint-disable-line

  const isQuiz = screen === 'quiz' && authReady;

  return (
    // Container raiz — NUNCA sai do DOM.
    // max-w-md centraliza em desktop; min-h-dvh garante altura correta.
    <div
      className="max-w-md mx-auto relative"
      style={{ minHeight: '100dvh' }}
    >

      {/* ── Estado de loading — dentro do container, não substitui ── */}
      {!authReady && <InlineLoading />}

      {/* ── Conteúdo principal — visível só quando authReady ── */}
      {authReady && (
        <>
          {/* Header de marca — apenas nas telas não-quiz */}
          {!isQuiz && (
            <BrandHeader
              user={user} loading={loading}
              firebaseReady={firebaseReady}
              onLogin={login} onLogout={logout}
            />
          )}

          {/* UserBar flutuante dentro do quiz */}
          {isQuiz && (
            <div
              className="absolute top-0 right-0 z-30 px-4 pt-2"
              style={{ pointerEvents: 'none' }}
            >
              <div style={{ pointerEvents: 'auto' }}>
                <UserBar
                  user={user} loading={loading}
                  firebaseReady={firebaseReady}
                  onLogin={login} onLogout={logout}
                  compact
                />
              </div>
            </div>
          )}

          {/* Notificações não-bloqueantes */}
          {(syncMessage || error) && !isQuiz && (
            <div className="px-5 pt-2 flex flex-col gap-1">
              {syncMessage && (
                <div
                  className="px-4 py-2 rounded-xl text-[12px] text-center animate-fade-in"
                  style={{
                    background: 'rgba(67,160,71,0.12)',
                    color: '#43A047',
                    border: '1px solid rgba(67,160,71,0.2)',
                  }}
                >
                  ✓ {syncMessage}
                </div>
              )}
              {error && (
                <div
                  className="px-4 py-2 rounded-xl text-[12px] text-center"
                  style={{
                    background: 'rgba(229,57,53,0.12)',
                    color: '#E53935',
                    border: '1px solid rgba(229,57,53,0.2)',
                  }}
                >
                  {error}
                </div>
              )}
            </div>
          )}

          {/* Telas */}
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
        </>
      )}
    </div>
  );
}
