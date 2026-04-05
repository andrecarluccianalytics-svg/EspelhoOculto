import { useState } from 'react';
import { TEMPERAMENTS } from '../data/questions';
import { TemperamentChart } from './TemperamentChart';
import { Paywall } from './Paywall';
import { PDFButton } from './PDFButton';

// ─── Tarefa diária ────────────────────────────────────────────────────────

function DailyTaskBlock({ taskObj, area, completedToday, currentDay, streak, onComplete, dominantColor }) {
  const [justCompleted, setJustCompleted] = useState(false);

  function handleComplete() {
    setJustCompleted(true);
    onComplete();
  }
  const AREA_LABELS = {
    trabalho: 'Trabalho', relacionamentos: 'Relacionamentos',
    decisoes: 'Decisões', autocontrole: 'Autocontrole',
  };
  const areaLabel = AREA_LABELS[area] || area;
  const TOTAL_DAYS = 30;
  const pct = Math.round((currentDay / TOTAL_DAYS) * 100);

  return (
    <div
      className="rounded-2xl border overflow-hidden"
      style={{
        background: completedToday ? 'rgba(67,160,71,0.05)' : `${dominantColor}08`,
        borderColor: completedToday ? '#43A04728' : `${dominantColor}22`,
        transition: 'all 0.35s ease',
      }}
    >
      {/* Cabeçalho */}
      <div
        className="px-5 pt-4 pb-3"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
      >
        <div className="flex items-center justify-between mb-2">
          <div>
            <div className="flex items-center gap-2">
              <p
                className="text-[11px] font-mono tracking-[0.2em] uppercase"
                style={{ color: completedToday ? '#43A047' : `${dominantColor}90` }}
              >
                Seu plano de 30 dias
              </p>
              <span
                className="text-[9px] font-mono px-1.5 py-0.5 rounded"
                style={{ background: `${dominantColor}20`, color: `${dominantColor}CC` }}
              >
                ativo
              </span>
            </div>
            <p className="text-[13px] font-semibold text-white/70 mt-0.5">
              Dia {currentDay} de {TOTAL_DAYS}
              {areaLabel && (
                <span className="text-white/35 font-normal"> · {areaLabel}</span>
              )}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {streak > 1 && (
              <div className="flex items-center gap-1">
                <span style={{ fontSize: '12px' }}>🔥</span>
                <span className="text-[12px] font-mono font-semibold"
                  style={{ color: streak >= 7 ? '#FFD54F' : 'rgba(255,255,255,0.5)' }}>
                  {streak}
                </span>
              </div>
            )}
            {completedToday && (
              <div className="flex items-center gap-1">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6L4.5 8.5L10 3" stroke="#43A047" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="text-[11px] font-semibold" style={{ color: '#43A047' }}>Feito</span>
              </div>
            )}
          </div>
        </div>
        {/* Barra de progresso dos 30 dias */}
        <div className="h-1 w-full rounded-full" style={{ background: 'rgba(255,255,255,0.07)' }}>
          <div
            className="h-full rounded-full"
            style={{
              width: `${pct}%`,
              background: completedToday
                ? 'linear-gradient(90deg, #43A047, #66BB6A)'
                : `linear-gradient(90deg, ${dominantColor}, ${dominantColor}AA)`,
              transition: 'width 0.6s ease',
            }}
          />
        </div>
      </div>

      {/* Corpo */}
      <div className="px-5 pt-4 pb-5">
        {/* Rótulo especial para o Dia 1 */}
        {currentDay === 1 && !completedToday && (
          <p className="text-[11px] font-mono mb-3 tracking-wide"
            style={{ color: `${dominantColor}80` }}>
            Primeiro passo — início do ajuste
          </p>
        )}

        {/* Mensagem de streak quando relevante */}
        {streak >= 3 && !completedToday && (
          <p className="text-[11px] font-mono mb-3"
            style={{ color: streak >= 7 ? '#FFD54F90' : 'rgba(255,255,255,0.28)' }}>
            {streak >= 7
              ? `${streak} dias seguidos — consistência real.`
              : `${streak} dias seguidos. Padrões mudam com repetição.`}
          </p>
        )}

        {/* Tarefa */}
        <p
          className="text-[14px] leading-[1.78] font-medium mb-3"
          style={{ color: completedToday ? 'rgba(240,237,232,0.45)' : 'rgba(240,237,232,0.88)' }}
        >
          {taskObj?.task}
        </p>

        {/* Impacto da tarefa */}
        {taskObj?.gain && !completedToday && (
          <p className="text-[12px] leading-relaxed mb-4" style={{ color: 'rgba(255,255,255,0.32)' }}>
            {taskObj.gain}
          </p>
        )}

        {/* Ganho percebido — impacto interpessoal, sempre visível */}
        {!completedToday && (
          <p className="text-[12px] leading-relaxed mb-4" style={{ color: 'rgba(255,255,255,0.28)' }}>
            Esse tipo de ajuste começa a mudar como as pessoas respondem a você.
          </p>
        )}

        {/* Ação */}
        {!completedToday ? (
          <button
            onClick={handleComplete}
            className="w-full py-3 rounded-xl text-[13px] font-semibold transition-all duration-200 active:scale-[0.98]"
            style={{
              background: `${dominantColor}14`,
              border: `1px solid ${dominantColor}28`,
              color: dominantColor,
            }}
          >
            Aplicado hoje
          </button>
        ) : (
          <div
            className="flex flex-col gap-2.5"
            style={{
              animation: justCompleted ? 'scaleIn 0.4s cubic-bezier(0.34,1.56,0.64,1) both' : 'none',
            }}
          >
            {/* Micro-recompensa com destaque visual */}
            <div
              className="rounded-xl px-4 py-3.5"
              style={{
                background: 'rgba(67,160,71,0.12)',
                border: '1px solid rgba(67,160,71,0.22)',
                boxShadow: justCompleted ? '0 0 20px rgba(67,160,71,0.15)' : 'none',
                transition: 'box-shadow 0.5s ease',
              }}
            >
              <p className="text-[14px] font-semibold" style={{ color: '#43A047' }}>
                ✔ Dia concluído
              </p>
              <p className="text-[13px] mt-1 leading-snug" style={{ color: 'rgba(240,237,232,0.65)' }}>
                Você manteve consistência hoje.
              </p>
            </div>
            {/* Antecipação — cria expectativa para amanhã */}
            <p className="text-[12px] text-center leading-relaxed" style={{ color: 'rgba(255,255,255,0.30)' }}>
              Amanhã você vai perceber algo que normalmente passa despercebido.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Primitivos de layout ─────────────────────────────────────────────────

const Divider = () => (
  <div className="h-px w-full" style={{ background: 'rgba(255,255,255,0.05)' }} />
);

const Section = ({ title, children, accent }) => (
  <div
    className="rounded-2xl p-5 border"
    style={{
      background: 'rgba(255,255,255,0.03)',
      borderColor: accent ? `${accent}28` : 'rgba(255,255,255,0.06)',
    }}
  >
    {title && (
      <h3
        className="text-[10px] font-mono tracking-[0.28em] uppercase mb-4"
        style={{ color: accent || 'rgba(255,255,255,0.3)' }}
      >
        {title}
      </h3>
    )}
    {children}
  </div>
);

const Label = ({ children, color }) => (
  <p
    className="text-[10px] font-mono tracking-[0.25em] uppercase mb-3"
    style={{ color: color || 'rgba(255,255,255,0.28)' }}
  >
    {children}
  </p>
);

const GAP_META = {
  isolado:  { label: 'Perfil definido',  color: '#E53935' },
  definido: { label: 'Combinação clara', color: '#FFD54F' },
  misto:    { label: 'Perfil híbrido',   color: '#43A047' },
};

// ─── Botão de compartilhar — 3 textos rotativos ───────────────────────────

const SHARE_LABELS_IDLE = [
  'Mostrar meu perfil',
  'Enviar isso pra alguém',
  'Descobrir o perfil de um amigo',
];

function ShareButton({ shareContent, dominantColor }) {
  const [state, setState] = useState('idle');
  // Seleciona um dos 3 textos de forma estável (não muda a cada render)
  const [labelIndex] = useState(() => new Date().getDate() % SHARE_LABELS_IDLE.length);

  async function handleShare() {
    if (!navigator.share) {
      try {
        const text = `${shareContent.title}\n\n"${shareContent.text}"\n\n${shareContent.url}`;
        await navigator.clipboard.writeText(text);
        setState('success');
      } catch {
        setState('error');
      }
      setTimeout(() => setState('idle'), 2500);
      return;
    }

    try {
      await navigator.share(shareContent);
      setState('success');
      setTimeout(() => setState('idle'), 2500);
    } catch (err) {
      if (err?.name !== 'AbortError') {
        setState('error');
        setTimeout(() => setState('idle'), 2500);
      }
    }
  }

  const isSuccess = state === 'success';

  return (
    <button
      onClick={handleShare}
      className="w-full py-4 rounded-2xl text-sm font-semibold transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2.5"
      style={{
        background: isSuccess ? 'rgba(67,160,71,0.14)' : `${dominantColor}16`,
        border: `1px solid ${isSuccess ? '#43A04738' : dominantColor + '32'}`,
        color: isSuccess ? '#43A047' : dominantColor,
      }}
    >
      {isSuccess ? (
        <>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M2 7L5.5 10.5L12 4" stroke="#43A047" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Link copiado!
        </>
      ) : state === 'error' ? (
        'Tente novamente'
      ) : (
        <>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="11" cy="3" r="1.5" stroke="currentColor" strokeWidth="1.3"/>
            <circle cx="11" cy="11" r="1.5" stroke="currentColor" strokeWidth="1.3"/>
            <circle cx="3" cy="7" r="1.5" stroke="currentColor" strokeWidth="1.3"/>
            <path d="M9.5 3.8L4.5 6.3M4.5 7.7L9.5 10.2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
          </svg>
          {SHARE_LABELS_IDLE[labelIndex]}
        </>
      )}
    </button>
  );
}

// ─── ABA PERFIL ───────────────────────────────────────────────────────────
// Ordem obrigatória:
// 2. Frase principal
// 3. Frase compartilhável
// 4. Padrão invisível
// 5. Combinação
// 6. Percentuais
// 7. Como você é percebido
// 8. Insights

function TabPerfil({ result, dominantColor, secondaryColor }) {
  const {
    pct, sorted, dominant, secondary, gap, gapType,
    isDominant, isBalanced,
    impactStatement, sharePhrase, hiddenPattern, mirrorV3, refinedInsights,
    combinationInsightV2, advIntensitiesV2,
    combinationInsight, advIntensities,
  } = result;

  const gapMeta     = GAP_META[gapType] || GAP_META.misto;
  const combo       = combinationInsightV2 || combinationInsight;
  const intensities = advIntensitiesV2?.length > 0 ? advIntensitiesV2 : (advIntensities || []);
  const insights    = refinedInsights || [];

  return (
    <div className="flex flex-col gap-4 pt-2 animate-fade-up">

      {/* 2. FRASE PRINCIPAL */}
      {impactStatement && (
        <div
          className="rounded-2xl p-5"
          style={{
            background: `${dominantColor}09`,
            border: `1px solid ${dominantColor}1A`,
            borderLeft: `3px solid ${dominantColor}CC`,
          }}
        >
          <Label color={`${dominantColor}80`}>Seu padrão</Label>
          <p className="text-[15px] leading-[1.85] font-medium" style={{ color: 'rgba(240,237,232,0.90)' }}>
            {impactStatement}
          </p>
        </div>
      )}

      {/* 3. FRASE COMPARTILHÁVEL */}
      {sharePhrase && (
        <div
          className="rounded-2xl px-5 py-4 flex items-start gap-3"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          {/* Aspas decorativas */}
          <span
            className="font-display font-black leading-none flex-shrink-0 mt-0.5"
            style={{ fontSize: '2.2rem', color: `${dominantColor}40`, lineHeight: 1 }}
          >
            "
          </span>
          <div className="flex-1">
            <p className="text-[14px] font-semibold leading-[1.65]" style={{ color: 'rgba(240,237,232,0.82)' }}>
              {sharePhrase.phrase}
            </p>
            <p className="text-[11px] font-mono mt-2" style={{ color: 'rgba(255,255,255,0.28)' }}>
              {sharePhrase.context}
            </p>
          </div>
        </div>
      )}

      {/* 4. PADRÃO INVISÍVEL */}
      {hiddenPattern && (
        <div
          className="rounded-2xl p-5 border"
          style={{ background: 'rgba(255,255,255,0.025)', borderColor: 'rgba(255,255,255,0.07)' }}
        >
          <Label>Padrão invisível</Label>
          <p className="text-[14px] font-semibold text-white/82 mb-2.5 leading-snug">
            {hiddenPattern.title}
          </p>
          <p className="text-white/52 text-[13px] leading-relaxed mb-3">
            {hiddenPattern.pattern}
          </p>
          <div
            className="flex items-center gap-2 pt-2.5"
            style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
          >
            <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: `${dominantColor}65` }} />
            <p className="text-[11px] font-mono" style={{ color: `${dominantColor}65` }}>
              {hiddenPattern.trigger}
            </p>
          </div>
        </div>
      )}

      {/* 5. COMBINAÇÃO */}
      {combo && (
        <Section title="Interação entre traços" accent={secondaryColor}>
          <div className="flex flex-col gap-4">
            <p className="text-white/68 text-[13px] leading-[1.78]">{combo.interaction}</p>
            <Divider />
            <div>
              <p className="text-[10px] font-mono uppercase tracking-widest mb-2" style={{ color: '#43A04785' }}>
                Impacto prático
              </p>
              <p className="text-white/52 text-[13px] leading-[1.78]">{combo.impact}</p>
            </div>
            <Divider />
            <div>
              <p className="text-[10px] font-mono uppercase tracking-widest mb-2" style={{ color: '#E5393585' }}>
                Risco central
              </p>
              <p className="text-white/52 text-[13px] leading-[1.78]">{combo.risk}</p>
            </div>
          </div>
        </Section>
      )}

      {/* 6. PERCENTUAIS */}
      <Section title="Distribuição percentual" accent={dominantColor}>
        <TemperamentChart pct={pct} sorted={sorted} />
      </Section>

      <div className="grid grid-cols-2 gap-3">
        {sorted.map((key, i) => {
          const intDesc = intensities[i];
          const lvl = intDesc?.level;
          const lvlLabel = lvl === 'dominant' ? 'traço forte'
            : lvl === 'relevant' ? 'presença relevante' : 'traço moderado';
          return (
            <div
              key={key}
              className="rounded-2xl p-4 border"
              style={{
                background: `${TEMPERAMENTS[key].color}0D`,
                borderColor: `${TEMPERAMENTS[key].color}26`,
              }}
            >
              <div className="text-2xl font-display font-black" style={{ color: TEMPERAMENTS[key].color }}>
                {pct[key]}%
              </div>
              <div className="text-xs text-white/45 mt-0.5">{TEMPERAMENTS[key].name}</div>
              {i === 0 && (
                <div className="text-[10px] font-mono mt-1" style={{ color: TEMPERAMENTS[key].color }}>
                  Dominante
                </div>
              )}
              {intDesc && (
                <div className="text-[10px] mt-1.5" style={{ color: 'rgba(255,255,255,0.24)' }}>
                  {lvlLabel}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Badge gap */}
      <div
        className="rounded-xl px-4 py-2.5 flex items-center gap-2.5"
        style={{ background: `${gapMeta.color}0B`, border: `1px solid ${gapMeta.color}1E` }}
      >
        <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: gapMeta.color }} />
        <p className="text-[11px]" style={{ color: gapMeta.color }}>
          {gapMeta.label} · gap de {gap}pp
          {isDominant ? ' · traço dominante forte' : isBalanced ? ' · perfil equilibrado' : ''}
        </p>
      </div>

      {/* 7. COMO VOCÊ É PERCEBIDO */}
      {mirrorV3 && (
        <div
          className="rounded-2xl p-5 border"
          style={{ background: 'rgba(255,255,255,0.022)', borderColor: 'rgba(255,255,255,0.07)' }}
        >
          <Label>Como você provavelmente é percebido</Label>
          <p className="text-[15px] font-semibold text-white/86 mb-4 leading-snug">
            {mirrorV3.headline}
          </p>
          <div className="flex flex-col gap-2.5 mb-4">
            {mirrorV3.perceptions.map((p, i) => (
              <div key={i} className="flex gap-2.5 items-start">
                <div
                  className="rounded-full flex-shrink-0 mt-[7px]"
                  style={{ width: '4px', height: '4px', background: `${dominantColor}50` }}
                />
                <p className="text-white/50 text-[13px] leading-relaxed">{p}</p>
              </div>
            ))}
          </div>
          <div
            className="rounded-xl p-3.5"
            style={{ background: 'rgba(255,255,255,0.04)', borderLeft: `2px solid ${dominantColor}42` }}
          >
            <p className="text-[10px] font-mono uppercase tracking-widest mb-1.5" style={{ color: `${dominantColor}70` }}>
              Ponto cego
            </p>
            <p className="text-white/45 text-[12px] leading-relaxed">{mirrorV3.blind_spot}</p>
          </div>
        </div>
      )}

      {/* 8. INSIGHTS */}
      {insights.length > 0 && (
        <Section title="Padrões identificados" accent="#FFD54F">
          <div className="flex flex-col gap-4">
            {insights.map((item, i) => (
              <div key={item.id || i} className="flex gap-3">
                <div
                  className="w-5 h-5 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 text-[10px] font-mono font-bold"
                  style={{ background: 'rgba(255,213,79,0.11)', color: '#FFD54F' }}
                >
                  {i + 1}
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-white/80 text-[13px] font-medium leading-snug">{item.text}</p>
                  {item.consequence && (
                    <p className="text-white/40 text-[12px] leading-relaxed">{item.consequence}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Leitura por temperamento */}
      {intensities.length > 0 && (
        <Section title="Leitura por temperamento" accent="rgba(255,255,255,0.12)">
          <div className="flex flex-col gap-4">
            {intensities.map((d, i) => {
              const key = sorted[i];
              const color = TEMPERAMENTS[key]?.color || '#fff';
              return (
                <div key={key}>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 rounded-full" style={{ background: color }} />
                    <span className="text-xs font-semibold" style={{ color }}>{d.label}</span>
                  </div>
                  <p className="text-white/36 text-[12px] leading-relaxed pl-4">{d.description}</p>
                </div>
              );
            })}
          </div>
        </Section>
      )}
    </div>
  );
}

// ─── ABA ANÁLISE ──────────────────────────────────────────────────────────

function TabAnalise({ strengths, weaknesses }) {
  return (
    <div className="flex flex-col gap-4 pt-2 animate-fade-up">
      <Section title="Pontos fortes" accent="#43A047">
        <div className="flex flex-col gap-3">
          {strengths.map((s, i) => (
            <div key={i} className="flex gap-3">
              <div
                className="w-5 h-5 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ background: 'rgba(67,160,71,0.15)' }}
              >
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M2 5L4 7L8 3" stroke="#43A047" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <p className="text-white/65 text-[13px] leading-relaxed">{s}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Pontos de atenção" accent="#E53935">
        <div className="flex flex-col gap-3">
          {weaknesses.map((w, i) => (
            <div key={i} className="flex gap-3">
              <div
                className="w-5 h-5 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ background: 'rgba(229,57,53,0.12)' }}
              >
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M5 2.5V5.5M5 7.5V7.4" stroke="#E53935" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
              <p className="text-white/65 text-[13px] leading-relaxed">{w}</p>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}

// ─── ABA PRÁTICA ──────────────────────────────────────────────────────────
// Ordem: 9. Frase final → 10. Sugestão do dia → sugestões → lembretes

function TabPratica({ result, dominantColor, dominantName, taskObj, area, completedToday, currentDay, streak, plan, isPremium, blocked, onComplete, onUpgrade, upgrading }) {
  const { suggestions, notifications, finalPunch, smartSuggestionV2, smartSuggestion, dailySuggestion } = result;
  const active = smartSuggestionV2 || smartSuggestion || dailySuggestion;

  const focusLabel = active?.focus === 'excess' ? 'modular excesso'
    : active?.focus === 'deficiency' ? 'desenvolver deficiência'
    : active?.source === 'weakest' ? 'desenvolver ponto fraco' : 'modular ponto forte';

  // ── Badge de plano (quando free, mostra dias restantes) ─────────────
  const freeDaysLeft = blocked ? 0 : Math.max(0, 3 - currentDay + 1);
  const showFreeBadge = plan === 'free' && !blocked && currentDay >= 2;

  return (
    <div className="flex flex-col gap-4 pt-2 animate-fade-up">

      {/* Badge dias restantes no free */}
      {showFreeBadge && (
        <div
          className="rounded-xl px-4 py-2.5 flex items-center justify-between"
          style={{ background: 'rgba(255,213,79,0.07)', border: '1px solid rgba(255,213,79,0.18)' }}
        >
          <div className="flex items-center gap-2">
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <circle cx="6.5" cy="6.5" r="5.5" stroke="#FFD54F" strokeWidth="1.2"/>
              <path d="M6.5 3.5v3l2 1.5" stroke="#FFD54F" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
            <span className="text-[11px]" style={{ color: '#FFD54F' }}>
              Plano gratuito
            </span>
          </div>
          <span className="text-[11px] font-mono" style={{ color: 'rgba(255,213,79,0.65)' }}>
            {freeDaysLeft === 1 ? 'Último dia grátis' : `${freeDaysLeft} dias restantes`}
          </span>
        </div>
      )}

      {/* PAYWALL ou TAREFA DO DIA */}
      {blocked ? (
        <Paywall
          currentDay={currentDay}
          streak={streak}
          dominantColor={dominantColor}
          isPremium={isPremium}
          onUpgrade={onUpgrade}
          upgrading={upgrading}
        />
      ) : taskObj && (
        <>
          <DailyTaskBlock
            taskObj={taskObj}
            area={area}
            completedToday={completedToday}
            currentDay={currentDay}
            streak={streak}
            onComplete={onComplete}
            dominantColor={dominantColor}
          />
          {/* Reforço de continuidade */}
          {!completedToday && (
            <p
              className="text-[12px] text-center leading-relaxed animate-fade-in"
              style={{ color: 'rgba(255,255,255,0.25)' }}
            >
              Você já começou esse processo. Parar agora faz você voltar ao automático.
            </p>
          )}
        </>
      )}

      {/* 9. FRASE FINAL (punch emocional) */}
      {finalPunch && (
        <div
          className="rounded-2xl p-5"
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <p className="text-[17px] font-display font-bold leading-[1.55] text-white/90 mb-3">
            {finalPunch.punch}
          </p>
          <p className="text-white/42 text-[13px] leading-relaxed">{finalPunch.sub}</p>
        </div>
      )}

      {/* 10. SUGESTÃO DO DIA — só quando não bloqueado */}
      {!blocked && active && (
        <div
          className="rounded-2xl p-5 border"
          style={{ background: `${dominantColor}0A`, borderColor: `${dominantColor}26` }}
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[10px] font-mono tracking-[0.25em] uppercase" style={{ color: dominantColor }}>
              Foco do dia
            </span>
            <span
              className="text-[10px] px-2 py-0.5 rounded-full"
              style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.35)' }}
            >
              {focusLabel}
            </span>
          </div>
          <p className="text-white/85 text-[14px] leading-[1.72] font-medium">{active.message}</p>
          {active.rationale && (
            <p
              className="text-white/28 text-[11px] mt-3 pt-3 leading-relaxed"
              style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
            >
              {active.rationale}
            </p>
          )}
        </div>
      )}

      {/* Sugestões contextuais */}
      {[
        { key: 'daily',         label: 'Comportamento diário', icon: '○', color: '#FFD54F' },
        { key: 'relationships', label: 'Relacionamentos',      icon: '◇', color: '#43A047' },
        { key: 'work',          label: 'Trabalho',             icon: '□', color: '#1E88E5' },
      ].map(({ key, label, icon, color }) =>
        suggestions?.[key] ? (
          <Section key={key} title={label} accent={color}>
            <div className="flex flex-col gap-3">
              {suggestions[key].map((s, i) => (
                <div key={i} className="flex gap-3">
                  <span className="text-sm flex-shrink-0 mt-0.5" style={{ color }}>{icon}</span>
                  <p className="text-white/65 text-[13px] leading-relaxed">{s}</p>
                </div>
              ))}
            </div>
          </Section>
        ) : null
      )}

      {/* Lembretes — só quando não bloqueado */}
      {!blocked && notifications?.length > 0 && (
        <Section title="Lembretes para o seu perfil" accent={dominantColor}>
          <p className="text-white/28 text-xs mb-3">
            Baseados no traço {dominantName} como dominante
          </p>
          <div className="flex flex-col gap-2">
            {notifications.map((n, i) => (
              <div
                key={i}
                className="rounded-xl p-3 text-[12px] text-white/52 leading-relaxed"
                style={{ background: 'rgba(255,255,255,0.032)', borderLeft: `2px solid ${dominantColor}2E` }}
              >
                {n}
              </div>
            ))}
          </div>
        </Section>
      )}
    </div>
  );
}

// ─── COMPONENTE PRINCIPAL ─────────────────────────────────────────────────

export function Results({ result, taskObj, area, completedToday, currentDay, streak, plan, isPremium, blocked, onComplete, onUpgrade, upgrading, onReset, userName }) {
  const [activeTab, setActiveTab] = useState('overview');

  const {
    pct, sorted, dominant, secondary,
    profile, strengths, weaknesses, suggestions,
    gap, gapType,
    profileNameV3, shareContent,
  } = result;

  const displayName    = profileNameV3 || profile;
  const dominantColor  = TEMPERAMENTS[dominant]?.color  || '#FFD54F';
  const secondaryColor = TEMPERAMENTS[secondary]?.color || '#1E88E5';
  const dominantName   = TEMPERAMENTS[dominant]?.name   || dominant;
  const secondaryName  = TEMPERAMENTS[secondary]?.name  || secondary;
  const gapMeta        = GAP_META[gapType] || GAP_META.misto;

  const tabs = [
    { id: 'overview',    label: 'Perfil'  },
    { id: 'strengths',   label: 'Análise' },
    { id: 'suggestions', label: 'Prática' },
  ];

  return (
    <div className="flex-1 flex flex-col relative">
      {/* Fundo */}
      <div className="fixed inset-0 pointer-events-none">
        <div
          style={{ background: `radial-gradient(circle at 50% 0%, ${dominantColor}11 0%, transparent 56%)` }}
          className="absolute inset-0"
        />
      </div>

      {/* 1. NOME DO PERFIL — destaque máximo */}
      <div className="px-5 pt-8 pb-0 relative z-10">
        <div className="animate-fade-up">
          {/* Linha de contexto superior */}
          <div className="flex items-center gap-2 mb-3">
            <p className="text-[10px] font-mono tracking-[0.3em] uppercase" style={{ color: `${dominantColor}75` }}>
              Seu perfil
            </p>
            <div
              className="flex items-center gap-1.5 px-2 py-0.5 rounded-full"
              style={{ background: `${gapMeta.color}12`, border: `1px solid ${gapMeta.color}1E` }}
            >
              <div className="w-1 h-1 rounded-full" style={{ background: gapMeta.color }} />
              <span className="text-[10px] font-mono" style={{ color: gapMeta.color }}>
                {gapMeta.label}
              </span>
            </div>
          </div>

          {/* Nome principal */}
          <h1
            className="font-display font-black leading-none mb-2"
            style={{
              fontSize: 'clamp(1.9rem, 8.5vw, 2.7rem)',
              letterSpacing: '-0.03em',
              color: '#F0EDE8',
            }}
          >
            {displayName.name}
          </h1>
          <p className="text-white/40 text-[14px] mb-4">{displayName.subtitle}</p>

          {/* Badges */}
          <div className="flex flex-wrap gap-2 animate-fade-up delay-100">
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
              style={{ background: `${dominantColor}1C`, color: dominantColor, border: `1px solid ${dominantColor}35` }}
            >
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: dominantColor }} />
              {dominantName} {pct[dominant]}%
            </div>
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
              style={{ background: `${secondaryColor}12`, color: secondaryColor, border: `1px solid ${secondaryColor}28` }}
            >
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: secondaryColor }} />
              {secondaryName} {pct[secondary]}%
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-5 pt-5 pb-2 relative z-10">
        <div
          className="flex gap-1 p-1 rounded-xl animate-fade-in delay-200"
          style={{ background: 'rgba(255,255,255,0.05)' }}
        >
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex-1 py-2 rounded-lg text-xs font-semibold transition-all duration-200"
              style={{
                background: activeTab === tab.id ? dominantColor : 'transparent',
                color: activeTab === tab.id ? '#1a1a1a' : 'rgba(255,255,255,0.38)',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Conteúdo das abas */}
      <div className="flex-1 px-5 pb-6 overflow-y-auto relative z-10">
        {activeTab === 'overview' && (
          <TabPerfil
            result={result}
            dominantColor={dominantColor}
            secondaryColor={secondaryColor}
          />
        )}
        {activeTab === 'strengths' && (
          <TabAnalise strengths={strengths} weaknesses={weaknesses} />
        )}
        {activeTab === 'suggestions' && (
          <TabPratica
            result={result}
            dominantColor={dominantColor}
            dominantName={dominantName}
            taskObj={taskObj}
            area={area}
            completedToday={completedToday}
            currentDay={currentDay}
            streak={streak}
            plan={plan}
            isPremium={isPremium}
            blocked={blocked}
            onComplete={onComplete}
            onUpgrade={onUpgrade}
            upgrading={upgrading}
          />
        )}
      </div>

      {/* 11. BOTÃO DE COMPARTILHAR + PDF + Refazer */}
      <div className="px-5 pb-8 pt-2 flex flex-col gap-2.5 relative z-10">
        {shareContent && (
          <ShareButton shareContent={shareContent} dominantColor={dominantColor} />
        )}
        <PDFButton
          result={result}
          taskObj={taskObj}
          area={area}
          userName={userName}
          dominantColor={dominantColor}
        />
        <button
          onClick={onReset}
          className="w-full py-3.5 rounded-2xl border text-sm font-medium transition-all duration-200 hover:bg-white/5 active:scale-[0.98]"
          style={{ borderColor: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.36)' }}
        >
          Refazer o teste
        </button>
      </div>
    </div>
  );
}
