import { useState } from 'react';

const TEMP_COLORS = [
  { letter: 'S', label: 'Sanguíneo', color: '#FFD54F', trait: 'Expressividade' },
  { letter: 'C', label: 'Colérico',  color: '#E53935', trait: 'Determinação' },
  { letter: 'M', label: 'Melancólico', color: '#1E88E5', trait: 'Profundidade' },
  { letter: 'F', label: 'Fleumático', color: '#43A047', trait: 'Estabilidade' },
];

export function Welcome({ onStart }) {
  const [hovered, setHovered] = useState(null);

  return (
    <div className="min-h-screen flex flex-col items-center justify-between px-5 py-10 relative overflow-hidden">
      {/* Background orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div style={{ background: 'radial-gradient(circle at 20% 20%, rgba(255,213,79,0.07) 0%, transparent 60%)' }} className="absolute inset-0" />
        <div style={{ background: 'radial-gradient(circle at 80% 80%, rgba(30,136,229,0.07) 0%, transparent 60%)' }} className="absolute inset-0" />
        <div style={{ background: 'radial-gradient(circle at 80% 20%, rgba(229,57,53,0.05) 0%, transparent 50%)' }} className="absolute inset-0" />
        <div style={{ background: 'radial-gradient(circle at 20% 80%, rgba(67,160,71,0.05) 0%, transparent 50%)' }} className="absolute inset-0" />
      </div>

      {/* Header */}
      <div className="w-full flex justify-center animate-fade-up">
        <span className="text-xs font-mono tracking-[0.3em] text-white/30 uppercase">Autoconhecimento</span>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-sm gap-8 relative z-10">
        {/* Logo / Title */}
        <div className="text-center animate-fade-up">
          <div className="flex items-center justify-center gap-2 mb-4">
            {TEMP_COLORS.map((t, i) => (
              <div
                key={t.letter}
                className="w-3 h-3 rounded-full"
                style={{
                  background: t.color,
                  animationDelay: `${i * 0.1}s`,
                  boxShadow: `0 0 12px ${t.color}60`,
                }}
              />
            ))}
          </div>
          <h1
            className="text-4xl font-display font-black leading-none tracking-tight mb-2"
            style={{ letterSpacing: '-0.02em' }}
          >
            Temperare
          </h1>
          <p className="text-white/40 text-sm font-mono tracking-wider">Mapeamento de Temperamento</p>
        </div>

        {/* Description */}
        <div className="text-center animate-fade-up delay-100">
          <p className="text-white/70 text-[15px] leading-relaxed">
            30 perguntas baseadas nos <span className="text-white/90 font-medium">4 temperamentos clínicos</span>.
            Resultado em formato percentual com interpretação profunda.
          </p>
        </div>

        {/* Temperament cards */}
        <div className="grid grid-cols-2 gap-3 w-full animate-fade-up delay-200">
          {TEMP_COLORS.map((t) => (
            <div
              key={t.letter}
              className="rounded-2xl p-4 border transition-all duration-200 cursor-default"
              style={{
                background: hovered === t.letter ? `${t.color}15` : 'rgba(255,255,255,0.03)',
                borderColor: hovered === t.letter ? `${t.color}60` : 'rgba(255,255,255,0.06)',
              }}
              onMouseEnter={() => setHovered(t.letter)}
              onMouseLeave={() => setHovered(null)}
            >
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: t.color }} />
                <span className="text-xs font-mono" style={{ color: t.color }}>{t.label}</span>
              </div>
              <p className="text-white/50 text-xs">{t.trait}</p>
            </div>
          ))}
        </div>

        {/* Method note */}
        <div
          className="w-full rounded-2xl p-4 text-center animate-fade-up delay-300"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <p className="text-white/40 text-xs leading-relaxed">
            Baseado na teoria dos 4 temperamentos com escala psicométrica e lógica adaptativa.
            Seus dados ficam apenas no seu dispositivo.
          </p>
        </div>

        {/* CTA */}
        <button
          onClick={onStart}
          className="w-full py-4 rounded-2xl font-semibold text-sm tracking-wide transition-all duration-200 animate-fade-up delay-400 hover:scale-[1.02] active:scale-[0.98]"
          style={{
            background: 'linear-gradient(135deg, #FFD54F, #F9A825)',
            color: '#1a1a1a',
            boxShadow: '0 8px 32px rgba(255,213,79,0.25)',
          }}
        >
          Iniciar Mapeamento
        </button>

        <p className="text-white/25 text-xs text-center animate-fade-up delay-500">
          Aproximadamente 8–12 minutos
        </p>
      </div>

      {/* Footer */}
      <div className="animate-fade-up delay-500">
        <p className="text-white/20 text-xs text-center">Temperare © 2025</p>
      </div>
    </div>
  );
}
