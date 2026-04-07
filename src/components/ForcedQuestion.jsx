import { useState } from 'react';

export function ForcedQuestion({ question, onAnswer }) {
  const [selected, setSelected]   = useState(null);
  const [pressed, setPressed]     = useState(null);
  const [animating, setAnimating] = useState(false);

  const handleSelect = (value) => {
    if (animating) return;
    setPressed(value);
    setSelected(value);
    setAnimating(true);
    setTimeout(() => setPressed(null), 110);
    setTimeout(() => { onAnswer(question.id, value); setSelected(null); setAnimating(false); }, 290);
  };

  const categoryLabel = {
    decisão: 'Escolha Forçada · Decisão', social: 'Escolha Forçada · Social',
    trabalho: 'Escolha Forçada · Trabalho', mudança: 'Escolha Forçada · Estilo',
  }[question.category] || 'Escolha Forçada';

  const OPTIONS = [
    { key: 'A', option: question.optionA, color: '#E53935', glow: 'rgba(229,57,53,0.20)', bg: 'rgba(229,57,53,0.12)' },
    { key: 'B', option: question.optionB, color: '#1E88E5', glow: 'rgba(30,136,229,0.20)', bg: 'rgba(30,136,229,0.12)' },
  ];

  return (
    <div className="animate-question" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '0 20px 20px' }}>

      {/* ZONA 2 — pergunta */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '10px', paddingTop: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span className="text-[10px] font-mono tracking-[0.2em] uppercase px-2.5 py-0.5 rounded-full"
            style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.28)' }}>
            {categoryLabel}
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full"
            style={{ background: 'rgba(255,213,79,0.08)', color: 'rgba(255,213,79,0.65)' }}>
            Escolha uma
          </span>
        </div>
        <h2 className="font-display font-semibold text-white/92"
          style={{ fontSize: 'clamp(16px, 4.5vw, 20px)', lineHeight: 1.35, letterSpacing: '-0.015em', maxWidth: '32ch', margin: 0 }}>
          {question.text}
        </h2>
      </div>

      {/* ZONA 3 — respostas */}
      <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '16px', padding: '8px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: '7px' }}>
          {OPTIONS.map(({ key, option, color, glow, bg }) => {
            const isSelected = selected === key;
            const isPressed  = pressed  === key;
            return (
              <button key={key} onClick={() => handleSelect(key)}
                className="choice-card w-full text-left rounded-xl border overflow-hidden"
                style={{
                  borderColor: isSelected ? `${color}75` : 'rgba(255,255,255,0.06)',
                  background:  isSelected ? bg : 'transparent',
                  boxShadow:   isSelected ? `0 0 18px ${glow}` : 'none',
                  transform:   isPressed ? 'scale(0.975)' : 'scale(1)',
                  transition:  'transform 0.09s ease, border-color 0.15s ease, background 0.15s ease, box-shadow 0.18s ease',
                }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '10px 12px' }}>
                  <div style={{
                    width: '27px', height: '27px', flexShrink: 0, borderRadius: '9px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'monospace', fontWeight: 700, fontSize: '12px',
                    background: isSelected ? color : 'rgba(255,255,255,0.06)',
                    color: isSelected ? '#fff' : 'rgba(255,255,255,0.35)',
                    transition: 'background 0.15s ease, color 0.15s ease',
                  }}>
                    {key}
                  </div>
                  <p style={{ margin: 0, paddingTop: '3px', fontSize: '13px', fontWeight: 500, lineHeight: 1.35, color: isSelected ? '#F0EDE8' : 'rgba(240,237,232,0.58)', transition: 'color 0.15s ease' }}>
                    {option.text}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
        <p style={{ margin: 0, textAlign: 'center', fontSize: '10px', color: 'rgba(255,255,255,0.14)' }}>
          Escolha a que melhor descreve você na maioria das situações
        </p>
      </div>
    </div>
  );
}
