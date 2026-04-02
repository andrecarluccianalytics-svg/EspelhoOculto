import { useState } from 'react';

/**
 * Paywall.jsx — v2
 *
 * Aparece no lugar da DailyTaskBlock quando free + currentDay > 3.
 * Props:
 *   currentDay, streak     → dados reais do usuário para copy dinâmica
 *   dominantColor          → cor do temperamento para consistência visual
 *   isPremium              → se já é premium, mostra badge de acesso completo
 *   onUpgrade, upgrading   → ação e estado de loading
 */

// ─── Sub-componente: Badge de acesso premium ──────────────────────────────

function PremiumBadge({ dominantColor }) {
  return (
    <div
      className="rounded-2xl p-5 border flex flex-col gap-3 animate-scale-in"
      style={{ background: `${dominantColor}0A`, borderColor: `${dominantColor}28` }}
    >
      <div className="flex items-center gap-3">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: `${dominantColor}20`, color: dominantColor }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M9 2l2 4.5 4.5.5-3.3 3.2.8 4.5L9 12.3l-4 2.4.8-4.5L2.5 7l4.5-.5L9 2z"
              stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
          </svg>
        </div>
        <div>
          <p className="text-[13px] font-semibold" style={{ color: dominantColor }}>
            Acesso completo ativo
          </p>
          <p className="text-[11px] text-white/38 mt-0.5">
            Você tem acesso completo à sua evolução.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Sub-componente: Feedback pós-upgrade ────────────────────────────────

function UpgradeSuccess() {
  return (
    <div
      className="rounded-2xl p-6 border flex flex-col items-center gap-3 animate-scale-in"
      style={{ background: 'rgba(67,160,71,0.08)', borderColor: '#43A04730' }}
    >
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center"
        style={{ background: 'rgba(67,160,71,0.18)' }}
      >
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <path d="M4 11L8.5 15.5L18 7" stroke="#43A047" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <p className="text-[16px] font-semibold text-white/90 text-center leading-snug">
        Acesso liberado.
      </p>
      <p className="text-white/45 text-[13px] text-center leading-relaxed">
        Continue evoluindo seu padrão.
      </p>
    </div>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────

export function Paywall({ currentDay, streak, dominantColor, isPremium, onUpgrade, upgrading }) {
  const [upgraded, setUpgraded] = useState(false);

  // Usuário já é premium — mostra badge discreto
  if (isPremium) {
    return <PremiumBadge dominantColor={dominantColor} />;
  }

  // Feedback imediato pós-clique (antes do componente sumir com plan update)
  if (upgraded && !upgrading) {
    return <UpgradeSuccess />;
  }

  async function handleUpgrade() {
    await onUpgrade();
    setUpgraded(true);
  }

  // ── Copy dinâmica baseada nos dados reais ──────────────────────────────
  const daysLabel = currentDay === 1
    ? '1 dia'
    : `${currentDay} dias`;

  const streakLine = streak >= 3
    ? `${streak} dias seguidos. Esse ritmo já é mais do que a maioria mantém.`
    : streak === 2
    ? `2 dias seguidos. Você está no começo de um padrão novo.`
    : `Você completou ${daysLabel} e começou a ajustar seu padrão.`;

  return (
    <div className="flex flex-col gap-5 pt-2 animate-fade-up">

      {/* ── 1. Prova de valor dinâmica (dados reais) ── */}
      <div
        className="rounded-2xl px-5 py-4"
        style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <div className="flex items-start gap-3">
          <span style={{ fontSize: '20px', lineHeight: 1, marginTop: '1px' }}>🔥</span>
          <div>
            <p className="text-[14px] font-semibold text-white/85 leading-snug mb-1">
              {streakLine}
            </p>
            <p className="text-[12px] text-white/38 leading-relaxed">
              Você já completou {daysLabel} e começou a ajustar seu padrão.
            </p>
          </div>
        </div>
      </div>

      {/* ── 2. Mensagem principal ── */}
      <div className="flex flex-col gap-2">
        <p
          className="text-[10px] font-mono tracking-[0.25em] uppercase"
          style={{ color: `${dominantColor}70` }}
        >
          Para continuar
        </p>
        <h2
          className="font-display font-black leading-tight text-white/92"
          style={{ fontSize: 'clamp(1.45rem, 6.5vw, 1.9rem)', letterSpacing: '-0.025em' }}
        >
          Você começou a mudar um padrão importante.
        </h2>
        <p className="text-white/52 text-[14px] leading-[1.7] mt-1">
          Nos últimos dias você deu os primeiros passos.
          Parar agora faz você voltar ao automático.
        </p>
      </div>

      {/* ── 3. Benefícios claros ── */}
      <div
        className="rounded-2xl p-5 border flex flex-col gap-3.5"
        style={{
          background: 'rgba(255,255,255,0.025)',
          borderColor: 'rgba(255,255,255,0.07)',
        }}
      >
        {[
          {
            icon: (
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                <path d="M7.5 1.5v5l3 2" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round"/>
                <circle cx="7.5" cy="7.5" r="6" stroke="currentColor" strokeWidth="1.35"/>
              </svg>
            ),
            text: 'Continue evoluindo seu padrão todos os dias',
          },
          {
            icon: (
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                <path d="M2 7.5h11M7.5 2l5.5 5.5-5.5 5.5" stroke="currentColor" strokeWidth="1.35"
                  strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            ),
            text: 'Receba tarefas progressivas e personalizadas',
          },
          {
            icon: (
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                <path d="M2.5 8L6 11.5l6.5-7" stroke="currentColor" strokeWidth="1.35"
                  strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            ),
            text: 'Consolide mudanças reais no seu comportamento',
          },
          {
            icon: (
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                <path d="M7.5 2l1.4 3.3 3.6.5-2.6 2.5.6 3.5L7.5 10l-3 1.8.6-3.5L2.5 5.8l3.6-.5L7.5 2z"
                  stroke="currentColor" strokeWidth="1.35" strokeLinejoin="round"/>
              </svg>
            ),
            text: 'Streak preservado — seu progresso continua',
          },
        ].map((b, i) => (
          <div key={i} className="flex items-start gap-3">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
              style={{ background: `${dominantColor}16`, color: dominantColor }}
            >
              {b.icon}
            </div>
            <p className="text-white/65 text-[13px] leading-relaxed">{b.text}</p>
          </div>
        ))}
      </div>

      {/* ── 4. Preço + CTA ── */}
      <div className="flex flex-col gap-3">
        {/* Preço visível antes do botão */}
        <div className="flex items-baseline justify-between px-1">
          <span className="text-[12px] text-white/38">Plano completo</span>
          <span className="text-[15px] font-semibold text-white/75">
            R$&nbsp;4,90
            <span className="text-[12px] font-normal text-white/35">/mês</span>
          </span>
        </div>

        {/* Botão principal */}
        <button
          onClick={handleUpgrade}
          disabled={upgrading}
          className="w-full py-4 rounded-2xl font-semibold text-[15px] transition-all duration-200 active:scale-[0.98]"
          style={{
            background: upgrading
              ? 'rgba(255,255,255,0.07)'
              : `linear-gradient(135deg, ${dominantColor} 0%, ${dominantColor}CC 100%)`,
            color: upgrading ? 'rgba(255,255,255,0.35)' : '#111',
            boxShadow: upgrading ? 'none' : `0 8px 28px ${dominantColor}30`,
            letterSpacing: '-0.01em',
          }}
        >
          {upgrading ? 'Liberando acesso...' : 'Continuar minha evolução'}
        </button>

        {/* ── 5. Urgência — abaixo do botão, tom seco ── */}
        <p className="text-center text-[12px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.30)' }}>
          Se você parar agora, esse progresso se perde.
        </p>
      </div>

      {/* Nota de simulação */}
      <p className="text-center text-[10px] text-white/15 pb-1">
        Integração com pagamento em breve.
      </p>
    </div>
  );
}
