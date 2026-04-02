import { useState } from 'react';
import { SCALE_OPTIONS } from '../data/questions';

const OPTION_COLORS = [
  { border: 'rgba(229,57,53,0.6)', bg: 'rgba(229,57,53,0.1)', glow: 'rgba(229,57,53,0.2)', label: '#E53935' },
  { border: 'rgba(255,160,50,0.6)', bg: 'rgba(255,160,50,0.08)', glow: 'rgba(255,160,50,0.15)', label: '#FF9800' },
  { border: 'rgba(67,160,71,0.6)', bg: 'rgba(67,160,71,0.08)', glow: 'rgba(67,160,71,0.15)', label: '#43A047' },
  { border: 'rgba(30,136,229,0.6)', bg: 'rgba(30,136,229,0.1)', glow: 'rgba(30,136,229,0.2)', label: '#1E88E5' },
];

export function ScaleQuestion({ question, onAnswer }) {
  const [selected, setSelected] = useState(null);
  const [animating, setAnimating] = useState(false);

  const handleSelect = (value) => {
    if (animating) return;
    setSelected(value);
    setAnimating(true);
    setTimeout(() => {
      onAnswer(question.id, value);
      setSelected(null);
      setAnimating(false);
    }, 380);
  };

  const categoryLabel = {
    decisão: 'Decisão',
    social: 'Social',
    emoção: 'Emoção',
    trabalho: 'Trabalho',
    relacionamentos: 'Relacionamentos',
    mudança: 'Mudança',
  }[question.category] || question.category;

  return (
    <div className="flex flex-col flex-1 px-5 pt-4 pb-6 gap-6">
      {/* Category tag */}
      <div className="animate-fade-in">
        <span
          className="text-[10px] font-mono tracking-[0.25em] uppercase px-3 py-1 rounded-full"
          style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.35)' }}
        >
          {categoryLabel}
        </span>
      </div>

      {/* Question text */}
      <div className="flex-1 flex items-center animate-fade-up">
        <h2
          className="font-display text-[22px] leading-[1.35] font-semibold text-white/90"
          style={{ letterSpacing: '-0.01em' }}
        >
          {question.text}
        </h2>
      </div>

      {/* Options */}
      <div className="flex flex-col gap-3 animate-fade-up delay-100">
        {SCALE_OPTIONS.map((opt, i) => {
          const isSelected = selected === opt.value;
          const colors = OPTION_COLORS[i];

          return (
            <button
              key={opt.value}
              onClick={() => handleSelect(opt.value)}
              className="choice-card w-full text-left px-4 py-4 rounded-2xl border"
              style={{
                borderColor: isSelected ? colors.border : 'rgba(255,255,255,0.07)',
                background: isSelected ? colors.bg : 'rgba(255,255,255,0.03)',
                boxShadow: isSelected ? `0 0 20px ${colors.glow}` : 'none',
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-4 h-4 rounded-full border-2 flex-shrink-0 transition-all duration-200 flex items-center justify-center"
                  style={{
                    borderColor: isSelected ? colors.label : 'rgba(255,255,255,0.2)',
                    background: isSelected ? colors.label : 'transparent',
                  }}
                >
                  {isSelected && (
                    <div className="w-1.5 h-1.5 rounded-full bg-white" />
                  )}
                </div>
                <span
                  className="text-[14px] font-medium transition-colors duration-200"
                  style={{ color: isSelected ? '#F0EDE8' : 'rgba(240,237,232,0.55)' }}
                >
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
