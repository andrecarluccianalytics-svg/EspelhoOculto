import { useState, useEffect } from 'react';
import { Welcome } from './components/Welcome';
import { Quiz } from './components/Quiz';
import { useAuth } from './hooks/useAuth';

function InlineLoading() {
  const [slow, setSlow] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setSlow(true), 4000);
    return () => clearTimeout(t);
  }, []);
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 50,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      gap: '12px', background: '#0A0A0F',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {['#FFD54F','#E53935','#1E88E5','#43A047'].map((color, i) => (
          <div key={i} style={{
            width: i===1||i===2 ? '8px' : '6px', height: i===1||i===2 ? '8px' : '6px',
            borderRadius: '50%', background: color,
            boxShadow: `0 0 8px ${color}80`,
            animation: `appPulse 1.4s ease-in-out ${i*0.15}s infinite`, opacity: 0.75,
          }} />
        ))}
      </div>
      {slow && (
        <p style={{ color: 'rgba(255,255,255,0.22)', fontSize: '11px', fontFamily: 'monospace', margin: 0 }}>
          verificando conexão...
        </p>
      )}
      <style>{`
        @keyframes appPulse {
          0%,100% { opacity:0.3;  transform:scale(0.82); }
          50%      { opacity:0.85; transform:scale(1.08); }
        }
      `}</style>
    </div>
  );
}

export default function App() {
  const {
    user, authReady, loading, error, firebaseReady,
    cloudData, syncMessage, login, logout,
  } = useAuth();

  const authProps = { user, loading, firebaseReady, onLogin: login, onLogout: logout };

  // ── Roteamento baseado em cloudData ───────────────────────────────────
  // 'auto'   = App decide com base no Firestore (estado inicial)
  // 'welcome'= usuário clicou em "voltar" ou não tem dados
  // 'quiz'   = usuário está no quiz/plano
  const [screen, setScreen] = useState('auto');

  // Tela efetiva: calculada no render, não em useEffect
  // Isso elimina a janela de race condition entre authReady e cloudData
  let effectiveScreen = screen;
  if (screen === 'auto') {
    if (!authReady) {
      effectiveScreen = 'loading'; // mostra loading
    } else if (cloudData?.hasCompletedTest) {
      effectiveScreen = 'quiz';    // tem histórico → vai direto ao plano
    } else {
      effectiveScreen = 'welcome'; // sem histórico → tela inicial
    }
  }

  return (
    <div className="max-w-md mx-auto flex flex-col min-h-screen relative overflow-x-hidden">

      {/* Loading overlay — cobre tudo enquanto Firebase confirma estado */}
      {(!authReady || effectiveScreen === 'loading') && <InlineLoading />}

      {/* Notificações */}
      {authReady && (syncMessage || error) && effectiveScreen !== 'quiz' && (
        <div style={{
          position: 'fixed', top: '54px', left: '50%', transform: 'translateX(-50%)',
          width: 'min(100%, 448px)', padding: '0 20px', zIndex: 40,
          display: 'flex', flexDirection: 'column', gap: '4px',
        }}>
          {syncMessage && (
            <div className="px-4 py-2 rounded-xl text-[12px] text-center animate-fade-in"
              style={{ background:'rgba(67,160,71,0.14)', color:'#43A047', border:'1px solid rgba(67,160,71,0.22)' }}>
              ✓ {syncMessage}
            </div>
          )}
          {error && (
            <div className="px-4 py-2 rounded-xl text-[12px] text-center"
              style={{ background:'rgba(229,57,53,0.14)', color:'#E53935', border:'1px solid rgba(229,57,53,0.22)' }}>
              {error}
            </div>
          )}
        </div>
      )}

      {authReady && effectiveScreen === 'welcome' && (
        <Welcome
          authProps={authProps}
          onStart={() => setScreen('quiz')}
        />
      )}

      {authReady && effectiveScreen === 'quiz' && (
        <Quiz
          authProps={authProps}
          userId={user?.uid || null}
          cloudData={cloudData}
          userName={user?.name || null}
          onReset={() => setScreen('welcome')}
        />
      )}
    </div>
  );
}
