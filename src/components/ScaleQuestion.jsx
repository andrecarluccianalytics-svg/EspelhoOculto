import { useState } from 'react';
import { SCALE_OPTIONS } from '../data/questions';

const OPTION_COLORS = [
  { border: 'rgba(229,57,53,0.75)',  bg: 'rgba(229,57,53,0.13)',  glow: 'rgba(229,57,53,0.20)',  label: '#E53935' },
  { border: 'rgba(255,160,50,0.75)', bg: 'rgba(255,160,50,0.11)', glow: 'rgba(255,160,50,0.16)', label: '#FF9800' },
  { border: 'rgba(67,160,71,0.75)',  bg: 'rgba(67,160,71,0.11)',  glow: 'rgba(67,160,71,0.16)',  label: '#43A047' },
  { border: 'rgba(30,136,229,0.75)', bg: 'rgba(30,136,229,0.13)', glow: 'rgba(30,136,229,0.20)', label: '#1E88E5' },
];

const MICRO_INSIGHTS = [
  'Seu padrão aparece nas pequenas decisões.',
  'Isso não é sobre certo ou errado — é sobre padrão.',
  'Você provavelmente já percebeu esse comportamento em si.',
  'Respostas honestas produzem resultados mais precisos.',
  'O que parece óbvio para você pode ser invisível para outros.',
  'Padrões que não nomeamos continuam operando no automático.',
];

export function ScaleQuestion({ question, onAnswer }) {
  const [selected, setSelected]   = useState(null);
  const [pressed, setPressed]     = useState(null);
  const [animating, setAnimating] = useState(false);

  const handleSelect = (value) => {
    if (animating) return;
    setPressed(value);
    setSelected(value);
    setAnimating(true);
    setTimeout(() => setPressed(null), 110);
    setTimeout(() => {
      onAnswer(question.id, value);
      setSelected(null);
      setAnimating(false);
    }, 290);
  };

  const categoryLabel = {
    decisão: 'Decisão', social: 'Social', emoção: 'Emoção',
    trabalho: 'Trabalho', relacionamentos: 'Relacionamentos', mudança: 'Mudança',
  }[question.category] || question.category;

  const INSIGHT_AT = [8, 15, 22];
  const showInsight = INSIGHT_AT.includes(question.id);
  const insightText = showInsight
    ? MICRO_INSIGHTS[INSIGHT_AT.indexOf(question.id) % MICRO_INSIGHTS.length]
    : null;

  return (
    <div
      // animate-question = questionEnter 0.22s — suaviza transição entre perguntas
      className="animate-question flex flex-col flex-1 px-5"
      style={{ paddingTop: '10px', paddingBottom: '16px', justifyContent: 'space-between' }}
    >

      {/* ── TOPO: categoria + pergunta ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>

        {/* Categoria */}
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className="text-[10px] font-mono tracking-[0.2em] uppercase px-2.5 py-0.5 rounded-full"
            style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.28)' }}
          >
            {categoryLabel}
          </span>
          {showInsight && (
            <span style={{ fontSize: '10px', fontStyle: 'italic', color: 'rgba(255,255,255,0.20)' }}>
              {insightText}
            </span>
          )}
        </div>

        {/* Pergunta — max-width para linha de leitura confortável */}
        <h2
          className="font-display font-semibold text-white/92"
          style={{
            fontSize: 'clamp(16.5px, 4.2vw, 20px)',
            lineHeight: 1.35,
            letterSpacing: '-0.015em',
            maxWidth: '32ch',
          }}
        >
          {question.text}
        </h2>
      </div>

      {/* ── BASE: grupo de opções com fundo sutil ── */}
      <div
        style={{
          background: 'rgba(255,255,255,0.02)',
          borderRadius: '16px',
          padding: '8px',
          border: '1px solid rgba(255,255,255,0.05)',
          display: 'flex',
          flexDirection: 'column',
          gap: '5px',
        }}
      >
        {SCALE_OPTIONS.map((opt, i) => {
          const isSelected = selected === opt.value;
          const isPressed  = pressed  === opt.value;
          const colors     = OPTION_COLORS[i];

          return (
            <button
              key={opt.value}
              onClick={() => handleSelect(opt.value)}
              className="choice-card w-full text-left rounded-xl border"
              style={{
                borderColor: isSelected ? colors.border : 'rgba(255,255,255,0.06)',
                background:  isSelected ? colors.bg     : 'transparent',
                boxShadow:   isSelected ? `0 0 14px ${colors.glow}` : 'none',
                padding:     '10px 12px',
                // Press effect
                transform:   isPressed ? 'scale(0.975)' : 'scale(1)',
                transition:  [
                  'transform 0.09s ease',
                  'border-color 0.15s ease',
                  'background 0.15s ease',
                  'box-shadow 0.18s ease',
                ].join(', '),
              }}
            >
              <div className="flex items-center gap-3">
                {/* Radio indicator */}
                <div
                  style={{
                    width: '15px', height: '15px', flexShrink: 0,
                    borderRadius: '50%',
                    border: `2px solid ${isSelected ? colors.label : 'rgba(255,255,255,0.18)'}`,
                    background: isSelected ? colors.label : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {isSelected && (
                    <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#fff' }} />
                  )}
                </div>

                <span style={{
                  fontSize: '13px',
                  fontWeight: 500,
                  lineHeight: 1.3,
                  color: isSelected ? '#F0EDE8' : 'rgba(240,237,232,0.52)',
                  transition: 'color 0.15s ease',
                }}>
                  {opt.label}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
