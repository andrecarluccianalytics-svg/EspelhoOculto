/**
 * AreaSelector.jsx
 *
 * Tela de seleção de área de melhoria.
 * Aparece uma vez após o resultado — o usuário escolhe e vai para a tarefa.
 * Design alinhado com o restante do app (dark, minimalista).
 */

const AREAS = [
  {
    id: 'trabalho',
    label: 'Trabalho',
    description: 'Foco, entrega e relações profissionais',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <rect x="2" y="6" width="16" height="11" rx="2" stroke="currentColor" strokeWidth="1.4"/>
        <path d="M7 6V5a3 3 0 0 1 6 0v1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: 'relacionamentos',
    label: 'Relacionamentos',
    description: 'Comunicação, escuta e presença real',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle cx="7" cy="8" r="3" stroke="currentColor" strokeWidth="1.4"/>
        <circle cx="13" cy="8" r="3" stroke="currentColor" strokeWidth="1.4"/>
        <path d="M1 17c0-3 2.7-5 6-5M13 12c3.3 0 6 2 6 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: 'decisoes',
    label: 'Decisões',
    description: 'Velocidade, qualidade e consequência',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M10 2v4M10 14v4M2 10h4M14 10h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
        <circle cx="10" cy="10" r="3" stroke="currentColor" strokeWidth="1.4"/>
      </svg>
    ),
  },
  {
    id: 'autocontrole',
    label: 'Autocontrole',
    description: 'Impulsos, reações e padrões automáticos',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M10 3C6.13 3 3 6.13 3 10s3.13 7 7 7 7-3.13 7-7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
        <path d="M14 3l3 3-3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
];

export function AreaSelector({ dominantColor, onSelect }) {
  return (
    <div className="flex-1 flex flex-col px-5 py-10 relative">
      {/* Fundo */}
      <div className="fixed inset-0 pointer-events-none">
        <div
          style={{ background: `radial-gradient(circle at 50% 20%, ${dominantColor}0D 0%, transparent 60%)` }}
          className="absolute inset-0"
        />
      </div>

      {/* Conteúdo */}
      <div className="flex-1 flex flex-col justify-center gap-8 relative z-10 max-w-sm mx-auto w-full">

        {/* Header */}
        <div className="animate-fade-up">
          <p
            className="text-[10px] font-mono tracking-[0.3em] uppercase mb-3"
            style={{ color: `${dominantColor}80` }}
          >
            Próximo passo
          </p>
          <h2
            className="font-display font-black text-[1.75rem] leading-tight text-white/90 mb-2"
            style={{ letterSpacing: '-0.025em' }}
          >
            Em qual área você quer melhorar agora?
          </h2>
          <p className="text-white/40 text-[14px] leading-relaxed">
            Você vai receber uma tarefa prática para hoje baseada no seu perfil.
          </p>
        </div>

        {/* Opções */}
        <div className="flex flex-col gap-3 animate-fade-up delay-100">
          {AREAS.map((area, i) => (
            <button
              key={area.id}
              onClick={() => onSelect(area.id)}
              className="w-full text-left rounded-2xl p-4 border transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] flex items-center gap-4"
              style={{
                background: 'rgba(255,255,255,0.03)',
                borderColor: 'rgba(255,255,255,0.07)',
                animationDelay: `${i * 0.05}s`,
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = `${dominantColor}40`;
                e.currentTarget.style.background = `${dominantColor}0A`;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)';
                e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
              }}
            >
              {/* Ícone */}
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: `${dominantColor}15`, color: dominantColor }}
              >
                {area.icon}
              </div>

              {/* Texto */}
              <div className="flex-1">
                <p className="text-[14px] font-semibold text-white/85">{area.label}</p>
                <p className="text-[12px] text-white/38 mt-0.5">{area.description}</p>
              </div>

              {/* Seta */}
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="flex-shrink-0">
                <path d="M6 3l5 5-5 5" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          ))}
        </div>

        {/* Skip */}
        <button
          onClick={() => onSelect(null)}
          className="text-center text-[12px] text-white/25 py-2 animate-fade-up delay-300"
        >
          Pular por agora
        </button>
      </div>
    </div>
  );
}
