import { useEffect } from 'react';

const TRAITS = [
  { color: '#FFD54F', label: 'Expressividade' },
  { color: '#E53935', label: 'Determinação'  },
  { color: '#1E88E5', label: 'Profundidade'  },
  { color: '#43A047', label: 'Estabilidade'  },
];

export function Welcome({ onStart }) {
  useEffect(() => { document.title = 'Espelho Oculto'; }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-between px-5 py-10 relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div style={{ background: 'radial-gradient(circle at 20% 20%, rgba(255,213,79,0.06) 0%, transparent 60%)' }} className="absolute inset-0" />
        <div style={{ background: 'radial-gradient(circle at 80% 80%, rgba(30,136,229,0.06) 0%, transparent 60%)' }} className="absolute inset-0" />
        <div style={{ background: 'radial-gradient(circle at 80% 20%, rgba(229,57,53,0.04) 0%, transparent 50%)' }} className="absolute inset-0" />
        <div style={{ background: 'radial-gradient(circle at 20% 80%, rgba(67,160,71,0.04) 0%, transparent 50%)' }} className="absolute inset-0" />
      </div>

      {/* Header */}
      <div className="w-full flex justify-center animate-fade-up">
        <span className="text-xs font-mono tracking-[0.3em] text-white/25 uppercase">
          Autoconhecimento aplicado
        </span>
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-sm gap-7 relative z-10">

        {/* Logo */}
        <div className="text-center animate-fade-up">
          {/* Quatro pontos coloridos formando um espelho fragmentado */}
          <div className="flex items-center justify-center gap-2 mb-5">
            {TRAITS.map((t, i) => (
              <div
                key={i}
                style={{
                  width: i === 1 || i === 2 ? '10px' : '7px',
                  height: i === 1 || i === 2 ? '10px' : '7px',
                  borderRadius: '50%',
                  background: t.color,
                  boxShadow: `0 0 10px ${t.color}70`,
                  transition: 'all 0.3s ease',
                }}
              />
            ))}
          </div>

          <h1
            className="font-display font-black leading-none mb-1"
            style={{
              fontSize: 'clamp(2.2rem, 10vw, 3rem)',
              letterSpacing: '-0.03em',
              color: '#F0EDE8',
            }}
          >
            Espelho Oculto
          </h1>
          <p className="text-white/35 text-[13px] font-mono tracking-widest mt-2">
            Conheça o padrão que rege seu comportamento
          </p>
        </div>

        {/* Proposta de valor — não é só um teste */}
        <div className="text-center animate-fade-up delay-100 px-2">
          <p className="text-white/65 text-[15px] leading-[1.75]">
            30 perguntas para mapear seus{' '}
            <span className="text-white/88 font-medium">padrões comportamentais reais</span>
            {' '}— e um plano personalizado de 30 dias para começar a ajustá-los.
          </p>
        </div>

        {/* O que você vai receber */}
        <div
          className="w-full rounded-2xl p-5 flex flex-col gap-3 animate-fade-up delay-200"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
        >
          {[
            { icon: '◎', text: 'Seu perfil comportamental em percentuais reais' },
            { icon: '◈', text: 'Como você é percebido — o que outros veem e você não' },
            { icon: '◆', text: 'Plano de 30 dias personalizado para o seu padrão' },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="text-[13px] flex-shrink-0 mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>
                {item.icon}
              </span>
              <p className="text-white/60 text-[13px] leading-snug">{item.text}</p>
            </div>
          ))}
        </div>

        {/* Nota de método */}
        <p className="text-white/30 text-[12px] text-center leading-relaxed animate-fade-up delay-300">
          Baseado na teoria dos 4 temperamentos com escala psicométrica e lógica adaptativa.
          Seus dados ficam apenas no seu dispositivo.
        </p>

        {/* CTA */}
        <button
          onClick={onStart}
          className="w-full py-4 rounded-2xl font-semibold text-[15px] transition-all duration-200 animate-fade-up delay-400 hover:scale-[1.02] active:scale-[0.98]"
          style={{
            background: 'linear-gradient(135deg, #FFD54F 0%, #F9A825 100%)',
            color: '#1a1a1a',
            letterSpacing: '-0.01em',
            boxShadow: '0 8px 32px rgba(255,213,79,0.22)',
          }}
        >
          Descobrir meu padrão
        </button>

        <p className="text-white/22 text-[12px] text-center animate-fade-up delay-500">
          Aproximadamente 8–12 minutos
        </p>
      </div>

      {/* Footer */}
      <div className="animate-fade-up delay-500">
        <p className="text-white/15 text-xs text-center">Espelho Oculto © 2025</p>
      </div>
    </div>
  );
}
