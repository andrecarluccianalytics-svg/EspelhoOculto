/**
 * UserBar.jsx
 *
 * Barra de usuário compacta: aparece no topo de todas as telas.
 * - Logado: avatar + nome abreviado + botão "Sair"
 * - Deslogado: botão "Entrar com Google" (só se Firebase estiver configurado)
 * - Firebase não configurado: nada é exibido (sem ruído visual)
 */

export function UserBar({ user, loading, firebaseReady, onLogin, onLogout }) {
  // Se Firebase não está configurado, não exibe nada
  if (!firebaseReady) return null;

  return (
    <div
      className="w-full flex items-center justify-end px-5 pt-4 pb-2 relative z-20"
      style={{ minHeight: '48px' }}
    >
      {user ? (
        // ── Usuário logado ──────────────────────────────────────────────
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="flex items-center gap-2">
            {user.photo ? (
              <img
                src={user.photo}
                alt={user.name}
                className="w-7 h-7 rounded-full object-cover"
                style={{ border: '1px solid rgba(255,255,255,0.15)' }}
                onError={e => { e.target.style.display = 'none'; }}
              />
            ) : (
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold"
                style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)' }}
              >
                {user.name?.[0]?.toUpperCase() || '?'}
              </div>
            )}
            <span className="text-[12px] text-white/50 max-w-[100px] truncate">
              {user.name?.split(' ')[0]}
            </span>
          </div>

          {/* Logout */}
          <button
            onClick={onLogout}
            disabled={loading}
            className="text-[11px] font-mono px-3 py-1.5 rounded-lg transition-all duration-200 active:scale-[0.97]"
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: 'rgba(255,255,255,0.35)',
            }}
          >
            {loading ? '...' : 'Sair'}
          </button>
        </div>
      ) : (
        // ── Usuário deslogado ───────────────────────────────────────────
        <button
          onClick={onLogin}
          disabled={loading}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all duration-200 active:scale-[0.97] hover:opacity-90"
          style={{
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.10)',
            color: 'rgba(255,255,255,0.55)',
          }}
        >
          {loading ? (
            <>
              <svg className="animate-spin" width="13" height="13" viewBox="0 0 13 13" fill="none">
                <circle cx="6.5" cy="6.5" r="5" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5"/>
                <path d="M6.5 1.5a5 5 0 0 1 5 5" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              Entrando...
            </>
          ) : (
            <>
              {/* Google G icon */}
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Entrar com Google
            </>
          )}
        </button>
      )}
    </div>
  );
}
