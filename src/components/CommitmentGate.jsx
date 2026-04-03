/**
 * CommitmentGate.jsx
 *
 * Tela de transição entre o resultado do perfil e o plano de 30 dias.
 * Aparece uma vez por usuário antes da seleção de área.
 * Objetivo: criar comprometimento antes de mostrar o plano.
 */

import { useState } from 'react';

export function CommitmentGate({ dominantColor, profileName, onCommit }) {
  const [committed, setCommitted] = useState(false);

  function handleCommit() {
    setCommitted(true);
    // Pequeno delay para o usuário ler o feedback antes de avançar
    setTimeout(() => onCommit(), 1400);
  }

  return (
    <div className="min-h-screen flex flex-col px-5 py-10 relative">
      {/* Fundo */}
      <div className="fixed inset-0 pointer-events-none">
        <div
          style={{ background: `radial-gradient(circle at 50% 30%, ${dominantColor}09 0%, transparent 65%)` }}
          className="absolute inset-0"
        />
      </div>

      <div className="flex-1 flex flex-col justify-center gap-8 relative z-10 max-w-sm mx-auto w-full">

        {/* Contexto */}
        <div className="animate-fade-up">
          <p
            className="text-[10px] font-mono tracking-[0.3em] uppercase mb-4"
            style={{ color: `${dominantColor}70` }}
          >
            Próximo passo
          </p>

          {/* Mensagem principal — sem motivação vazia */}
          <div
            className="rounded-2xl p-5 border mb-5"
            style={{
              background: 'rgba(255,255,255,0.03)',
              borderColor: 'rgba(255,255,255,0.07)',
            }}
          >
            <p
              className="font-display font-bold text-white/90 leading-[1.6] mb-4"
              style={{ fontSize: 'clamp(1.1rem, 5vw, 1.3rem)', letterSpacing: '-0.015em' }}
            >
              Você não precisa mudar tudo de uma vez.
            </p>
            <p className="text-white/55 text-[14px] leading-[1.75] mb-3">
              Mas precisa começar a ajustar o que já identificou.
            </p>
            <p className="text-white/55 text-[14px] leading-[1.75]">
              Nos próximos dias, você vai trabalhar exatamente os pontos que mais impactam seu comportamento.
            </p>
          </div>

          {/* Diferencial — não é só um teste */}
          <div
            className="rounded-2xl px-5 py-4 flex flex-col gap-2"
            style={{
              background: `${dominantColor}0A`,
              border: `1px solid ${dominantColor}22`,
            }}
          >
            <p className="text-[13px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.60)' }}>
              Isso não é só um teste.
            </p>
            <p className="text-[13px] font-medium leading-relaxed" style={{ color: 'rgba(255,255,255,0.80)' }}>
              É o início de um ajuste real no seu comportamento.
            </p>
          </div>
        </div>

        {/* Botão de compromisso */}
        <div className="flex flex-col gap-3 animate-fade-up delay-200">
          {!committed ? (
            <>
              {/* Consequência real — antes do botão, sem alarmismo */}
              <p className="text-[13px] text-center leading-relaxed" style={{ color: 'rgba(255,255,255,0.38)' }}>
                Se você ignorar isso, esse padrão continua influenciando suas decisões sem você perceber.
              </p>
              <button
                onClick={handleCommit}
                className="w-full py-4 rounded-2xl font-semibold text-[15px] transition-all duration-200 active:scale-[0.98] hover:opacity-95"
                style={{
                  background: `linear-gradient(135deg, ${dominantColor} 0%, ${dominantColor}CC 100%)`,
                  color: '#111',
                  letterSpacing: '-0.01em',
                  boxShadow: `0 8px 28px ${dominantColor}28`,
                }}
              >
                Quero evoluir nos próximos 30 dias
              </button>
              <p className="text-center text-[12px] text-white/25">
                Menos de 2 minutos por dia.
              </p>
            </>
          ) : (
            <div
              className="rounded-2xl p-5 flex flex-col gap-3 animate-scale-in"
              style={{ background: 'rgba(67,160,71,0.07)', border: '1px solid rgba(67,160,71,0.20)' }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(67,160,71,0.20)' }}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8L6.5 11.5L13 5" stroke="#43A047" strokeWidth="1.8"
                      strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div>
                  <p className="text-[14px] font-semibold text-white/88 leading-snug">
                    Você iniciou seu plano de evolução.
                  </p>
                  <p className="text-[11px] font-mono mt-0.5" style={{ color: 'rgba(67,160,71,0.8)' }}>
                    Plano ativo · 30 dias
                  </p>
                </div>
              </div>
              <p className="text-[13px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.52)' }}>
                Os próximos dias vão revelar padrões que normalmente passam despercebidos.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
