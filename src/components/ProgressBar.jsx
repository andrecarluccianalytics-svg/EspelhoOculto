import { TEMPERAMENTS } from '../data/questions';

/** Retorna mensagem motivacional baseada no progresso */
function progressHint(current, total) {
  const pct = current / total;
  if (current <= 2)  return null;
  if (pct < 0.35)    return 'continue';
  if (pct < 0.55)    return 'metade';
  if (pct < 0.80)    return 'quase';
  if (pct < 1)       return 'final';
  return null;
}

const HINTS = {
  continue: 'continue assim',
  metade:   'passando da metade',
  quase:    'quase lá',
  final:    'última etapa',
};

export function ProgressBar({ current, total, scores }) {
  const pct  = Math.round((current / total) * 100);
  const hint = progressHint(current, total);

  let barColor = '#FFD54F';
  if (current > 8) {
    const dominant = Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b);
    barColor = TEMPERAMENTS[dominant]?.color || '#FFD54F';
  }

  return (
    <div className="w-full px-5 relative z-10" style={{ paddingTop: '10px', paddingBottom: '8px' }}>
      <div className="flex justify-between items-center" style={{ marginBottom: '6px' }}>
        {/* Copy humano com hint contextual */}
        <span style={{ color: 'rgba(255,255,255,0.30)', fontSize: '10.5px', fontFamily: 'monospace' }}>
          {current} de {total}
          {hint && (
            <span style={{ color: 'rgba(255,255,255,0.18)', marginLeft: '5px' }}>
              — {HINTS[hint]}
            </span>
          )}
        </span>
        <span style={{ color: 'rgba(255,255,255,0.22)', fontSize: '10px', fontFamily: 'monospace' }}>
          {pct}%
        </span>
      </div>

      {/* Track */}
      <div className="w-full rounded-full" style={{ height: '1.5px', background: 'rgba(255,255,255,0.07)' }}>
        <div
          className="h-full rounded-full"
          style={{
            width: `${pct}%`,
            background: barColor,
            boxShadow: `0 0 5px ${barColor}55`,
            transition: 'width 0.5s cubic-bezier(0.4,0,0.2,1)',
          }}
        />
      </div>
    </div>
  );
}
