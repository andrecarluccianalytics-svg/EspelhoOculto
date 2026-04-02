import { useState } from 'react';

export function ForcedQuestion({ question, onAnswer }) {
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
    decisão: 'Escolha Forçada · Decisão',
    social: 'Escolha Forçada · Social',
    trabalho: 'Escolha Forçada · Trabalho',
    mudança: 'Escolha Forçada · Estilo',
  }[question.category] || 'Escolha Forçada';

  const OPTIONS = [
    { key: 'A', option: question.optionA, color: '#E53935', glow: 'rgba(229,57,53,0.2)', bg: 'rgba(229,57,53,0.1)' },
    { key: 'B', option: question.optionB, color: '#1E88E5', glow: 'rgba(30,136,229,0.2)', bg: 'rgba(30,136,229,0.1)' },
  ];

  return (
    <div className="flex flex-col flex-1 px-5 pt-4 pb-6 gap-6">
      {/* Category tag */}
      <div className="animate-fade-in flex items-center gap-2">
        <span
          className="text-[10px] font-mono tracking-[0.25em] uppercase px-3 py-1 rounded-full"
          style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.35)' }}
        >
          {categoryLabel}
        </span>
        <span
          className="text-[10px] font-mono px-2 py-1 rounded-full"
          style={{ background: 'rgba(255,213,79,0.1)', color: '#FFD54F' }}
        >
          Escolha uma
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
      <div className="flex flex-col gap-4 animate-fade-up delay-100">
        {OPTIONS.map(({ key, option, color, glow, bg }) => {
          const isSelected = selected === key;

          return (
            <button
              key={key}
              onClick={() => handleSelect(key)}
              className="choice-card w-full text-left rounded-2xl border overflow-hidden"
              style={{
                borderColor: isSelected ? `${color}80` : 'rgba(255,255,255,0.07)',
                background: isSelected ? bg : 'rgba(255,255,255,0.03)',
                boxShadow: isSelected ? `0 0 24px ${glow}` : 'none',
              }}
            >
              <div className="flex items-start gap-4 p-4">
                {/* Letter badge */}
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 font-mono font-bold text-sm transition-all duration-200"
                  style={{
                    background: isSelected ? color : 'rgba(255,255,255,0.06)',
                    color: isSelected ? '#fff' : 'rgba(255,255,255,0.4)',
                  }}
                >
                  {key}
                </div>

                {/* Option text */}
                <div className="flex-1 pt-0.5">
                  <p
                    className="text-[14px] leading-relaxed font-medium transition-colors duration-200"
                    style={{ color: isSelected ? '#F0EDE8' : 'rgba(240,237,232,0.6)' }}
                  >
                    {option.text}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <p className="text-center text-white/20 text-xs animate-fade-in delay-200">
        Escolha a que melhor descreve você na maioria das situações
      </p>
    </div>
  );
}
