import { TEMPERAMENTS } from '../data/questions';

export function TemperamentChart({ pct, sorted }) {
  const bars = sorted.map(key => ({
    key,
    ...TEMPERAMENTS[key],
    value: pct[key],
  }));

  return (
    <div className="w-full">
      {/* Bar chart */}
      <div className="flex flex-col gap-3">
        {bars.map((t, i) => (
          <div key={t.key} className="animate-fade-up" style={{ animationDelay: `${i * 0.1}s` }}>
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: t.color }} />
                <span className="text-sm font-medium text-white/80">{t.name}</span>
              </div>
              <span className="text-sm font-mono font-semibold" style={{ color: t.color }}>
                {t.value}%
              </span>
            </div>
            <div className="h-2 w-full rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
              <div
                className="h-full rounded-full progress-fill"
                style={{
                  width: `${t.value}%`,
                  background: `linear-gradient(90deg, ${t.color}, ${t.darkColor})`,
                  boxShadow: `0 0 8px ${t.color}60`,
                  animationDelay: `${i * 0.1 + 0.3}s`,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Pie-style visual */}
      <div className="mt-6 flex justify-center">
        <PieChart pct={pct} sorted={sorted} />
      </div>
    </div>
  );
}

function PieChart({ pct, sorted }) {
  const size = 140;
  const cx = size / 2;
  const cy = size / 2;
  const r = 52;
  const innerR = 28;

  // Convert pct to conic segments
  let cumulative = 0;
  const segments = sorted.map(key => {
    const start = cumulative;
    const value = pct[key];
    cumulative += value;
    return {
      key,
      start,
      end: cumulative,
      color: TEMPERAMENTS[key].color,
      name: TEMPERAMENTS[key].name,
    };
  });

  function polarToCartesian(cx, cy, r, angle) {
    const rad = ((angle - 90) * Math.PI) / 180;
    return {
      x: cx + r * Math.cos(rad),
      y: cy + r * Math.sin(rad),
    };
  }

  function arcPath(cx, cy, r, startAngle, endAngle) {
    const start = polarToCartesian(cx, cy, r, (startAngle / 100) * 360);
    const end = polarToCartesian(cx, cy, r, (endAngle / 100) * 360);
    const largeArcFlag = endAngle - startAngle > 50 ? 1 : 0;
    return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`;
  }

  function donutPath(cx, cy, outerR, innerR, startPct, endPct) {
    const startOuter = polarToCartesian(cx, cy, outerR, (startPct / 100) * 360);
    const endOuter = polarToCartesian(cx, cy, outerR, (endPct / 100) * 360);
    const startInner = polarToCartesian(cx, cy, innerR, (endPct / 100) * 360);
    const endInner = polarToCartesian(cx, cy, innerR, (startPct / 100) * 360);
    const large = endPct - startPct > 50 ? 1 : 0;
    return [
      `M ${startOuter.x} ${startOuter.y}`,
      `A ${outerR} ${outerR} 0 ${large} 1 ${endOuter.x} ${endOuter.y}`,
      `L ${startInner.x} ${startInner.y}`,
      `A ${innerR} ${innerR} 0 ${large} 0 ${endInner.x} ${endInner.y}`,
      'Z',
    ].join(' ');
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <defs>
          {segments.map(s => (
            <filter key={s.key} id={`glow-${s.key}`} x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          ))}
        </defs>

        {/* Background circle */}
        <circle cx={cx} cy={cy} r={r + 4} fill="rgba(255,255,255,0.03)" />

        {/* Donut segments */}
        {segments.map((s, i) => (
          <path
            key={s.key}
            d={donutPath(cx, cy, r, innerR, s.start, s.end)}
            fill={s.color}
            opacity="0.9"
            style={{ transition: 'opacity 0.2s' }}
          />
        ))}

        {/* Center */}
        <circle cx={cx} cy={cy} r={innerR - 2} fill="#0A0A0F" />

        {/* Dominant letter in center */}
        <text
          x={cx}
          y={cy + 5}
          textAnchor="middle"
          fontSize="18"
          fontWeight="bold"
          fontFamily="Playfair Display, serif"
          fill={TEMPERAMENTS[sorted[0]]?.color || '#fff'}
        >
          {sorted[0]}
        </text>
      </svg>

      {/* Legend */}
      <div className="flex flex-wrap gap-x-4 gap-y-2 justify-center">
        {segments.map(s => (
          <div key={s.key} className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ background: s.color }} />
            <span className="text-xs text-white/50">{s.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
