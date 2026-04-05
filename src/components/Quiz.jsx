import { useState, useEffect, useRef } from 'react';
import { useQuiz } from '../hooks/useQuiz';
import { useDailyTask } from '../hooks/useDailyTask';
import { usePlan } from '../hooks/usePlan';
import { ProgressBar } from './ProgressBar';
import { ScaleQuestion } from './ScaleQuestion';
import { ForcedQuestion } from './ForcedQuestion';
import { AreaSelector } from './AreaSelector';
import { saveTestResult } from '../services/firestore';
import { CommitmentGate } from './CommitmentGate';
import { Results } from './Results';
import { TEMPERAMENTS } from '../data/questions';
import { UserBar } from './UserBar';

export function Quiz({ userId, cloudData, userName, onReset, authProps }) {
  const { currentQuestion, currentIndex, total, scores, done, result, answer, reset } = useQuiz();

  // null = não viu ainda | false = pulou | string = área escolhida
  const [areaChosen, setAreaChosen]         = useState(null);
  // null = não viu | false = recusou | true = confirmou
  const [committed, setCommitted]           = useState(null);

  const dominant = result?.dominant || null;

  // ── Salva resultado no Firestore quando o teste termina ───────────────
  // Executa uma única vez por sessão quando done+result ficam disponíveis
  const savedResult = useRef(false);
  useEffect(() => {
    if (done && result && userId && !savedResult.current) {
      savedResult.current = true;
      saveTestResult(userId, result).catch(() => {}); // fire-and-forget silencioso
    }
  }, [done, result, userId]); // eslint-disable-line

  const {
    area, taskObj, completedToday, currentDay, streak,
    setArea, markComplete, reset: resetTask,
  } = useDailyTask(dominant, userId, cloudData);

  const { plan, isPremium, isBlocked, upgrade, upgrading } = usePlan(userId, cloudData);
  const blocked = isBlocked(currentDay);

  function handleReset() {
    reset();
    resetTask();
    setAreaChosen(null);
    setCommitted(null);
    onReset();
  }

  function handleAreaSelect(selectedArea) {
    if (selectedArea) setArea(selectedArea);
    setAreaChosen(selectedArea || false);
  }

  // ── Questionário ──────────────────────────────────────────────────────
  if (!done || !result) {
    if (!currentQuestion) return null;
    return (
      <div className="flex flex-col relative" style={{ height: "100dvh", maxHeight: "100dvh", overflow: "hidden" }}>
        <div className="fixed inset-0 pointer-events-none">
          <div
            style={{ background: 'radial-gradient(circle at 50% 0%, rgba(255,213,79,0.04) 0%, transparent 70%)' }}
            className="absolute inset-0"
          />
        </div>
        {/* UserBar flutuante no canto superior direito do quiz */}
        {authProps && (
          <div className="absolute top-0 right-0 z-30 pr-2" style={{ pointerEvents: 'none' }}>
            <div style={{ pointerEvents: 'auto' }}>
              <UserBar
                user={authProps.user}
                loading={authProps.loading}
                firebaseReady={authProps.firebaseReady}
                onLogin={authProps.onLogin}
                onLogout={authProps.onLogout}
              />
            </div>
          </div>
        )}
        <div className="relative z-10">
          <ProgressBar current={currentIndex} total={total} scores={scores} />
        </div>
        <div className="flex-1 flex flex-col relative z-10" key={currentQuestion.id}>
          {currentQuestion.type === 'scale'
            ? <ScaleQuestion question={currentQuestion} onAnswer={answer} />
            : <ForcedQuestion question={currentQuestion} onAnswer={answer} />
          }
        </div>
      </div>
    );
  }

  // ── CommitmentGate: aparece UMA VEZ antes da área (se ainda não comprometeu) ──
  if (committed === null && !area) {
    const dominantColor = TEMPERAMENTS[dominant]?.color || '#FFD54F';
    const profileName   = result?.profileNameV3?.name || '';
    return (
      <CommitmentGate
        dominantColor={dominantColor}
        profileName={profileName}
        onCommit={() => setCommitted(true)}
      />
    );
  }

  // ── Seleção de área ───────────────────────────────────────────────────
  if (areaChosen === null && !area) {
    const dominantColor = TEMPERAMENTS[dominant]?.color || '#FFD54F';
    return (
      <AreaSelector dominantColor={dominantColor} onSelect={handleAreaSelect} />
    );
  }

  // ── Resultado ─────────────────────────────────────────────────────────
  return (
    <Results
      result={result}
      taskObj={taskObj}
      area={area}
      completedToday={completedToday}
      currentDay={currentDay}
      streak={streak}
      plan={plan}
      isPremium={isPremium}
      blocked={blocked}
      onComplete={markComplete}
      onUpgrade={upgrade}
      upgrading={upgrading}
      onReset={handleReset}
      userName={userName}
    />
  );
}
