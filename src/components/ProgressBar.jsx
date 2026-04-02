import { TEMPERAMENTS } from '../data/questions';

export function ProgressBar({ current, total, scores }) {
  const pct = Math.round((current / total) * 100);
  
  // Determine dominant color based on current scores
  let barColor = '#FFD54F';
  if (current > 8) {
    const dominant = Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b);
    barColor = TEMPERAMENTS[dominant]?.color || '#FFD54F';
  }

  return (
    <div className="w-full px-5 pt-5 pb-3 relative z-10">
      <div className="flex justify-between items-center mb-2">
        <span className="text-white/30 text-xs font-mono">{current} / {total}</span>
        <span className="text-white/30 text-xs font-mono">{pct}%</span>
      </div>
      <div className="h-0.5 w-full rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
        <div
          className="h-full rounded-full progress-fill"
          style={{
            width: `${pct}%`,
            background: barColor,
            boxShadow: `0 0 8px ${barColor}80`,
          }}
        />
      </div>
    </div>
  );
}
