import { useState, useEffect, useRef, useMemo } from 'react';
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
import { getProfileData } from '../data/profiles';
import { UserBar } from './UserBar';

export function Quiz({ userId, cloudData, userName, onReset, authProps }) {
  const { currentQuestion, currentIndex, total, scores, done, result, answer, reset } = useQuiz();
  const [areaChosen, setAreaChosen] = useState(null);
  const [committed, setCommitted]   = useState(null);

  // ── PERSISTÊNCIA: reconstitui resultado a partir dos scores salvos ────
  // getProfileData(scores) é determinístico — mesmos scores → mesmo resultado completo
  const restoredResult = useMemo(() => {
    if (done && result) return null; // teste acabou nesta sessão — usa useQuiz
    if (!cloudData?.hasCompletedTest) return null;
    if (!cloudData?.scores || Object.keys(cloudData.scores).length === 0) return null;
    try {
      return getProfileData(cloudData.scores);
    } catch {
      return null;
    }
  }, [cloudData, done, result]);

  const effectiveResult = (done && result) ? result : restoredResult;
  const effectiveDone   = done || !!restoredResult;
  const dominant        = effectiveResult?.dominant || null;

  // Se resultado foi restaurado do Firestore, pula CommitmentGate (já viu antes)
  useEffect(() => {
    if (restoredResult && committed === null) setCommitted(true);
  }, [restoredResult]); // eslint-disable-line

  // ── Salva no Firestore quando teste termina nesta sessão ──────────────
  const savedRef = useRef(false);
  useEffect(() => {
    if (done && result && userId && !savedRef.current) {
      savedRef.current = true;
      // Passa scores explicitamente — result não os contém
      saveTestResult(userId, result, scores).catch(() => {});
    }
  }, [done, result, scores, userId]); // eslint-disable-line

  const { area, taskObj, completedToday, currentDay, streak, setArea, markComplete, reset: resetTask }
    = useDailyTask(dominant, userId, cloudData);
  const { plan, isPremium, isBlocked, upgrade, upgrading } = usePlan(userId, cloudData);
  const blocked = isBlocked(currentDay);

  function handleReset() {
    reset(); resetTask();
    setAreaChosen(null); setCommitted(null);
    savedRef.current = false;
    onReset();
  }

  function handleAreaSelect(selectedArea) {
    if (selectedArea) setArea(selectedArea);
    setAreaChosen(selectedArea || false);
  }

  // ── TELA DO QUESTIONÁRIO ──────────────────────────────────────────────
  if (!effectiveDone) {
    if (!currentQuestion) return null;

    return (
      /*
       * Layout: 3 zonas empilhadas dentro de um container de altura fixa.
       *
       * O container usa h-screen (100vh) em vez de position:fixed para
       * respeitar o max-w-md do pai e funcionar corretamente em tablets.
       *
       * Zona 1 (topo, flex-shrink:0): UserBar + ProgressBar — altura natural
       * Zona 2 (meio, flex:1):        Pergunta centralizada — cresce
       * Zona 3 (base, flex-shrink:0): Respostas — altura natural, na base
       *
       * ScaleQuestion e ForcedQuestion recebem flex:1 e gerenciam as zonas
       * 2+3 internamente.
       */
      <div
        style={{
          height: '100dvh',
          display: 'flex',
          flexDirection: 'column',
          background: '#0A0A0F',
          overflow: 'hidden',
        }}
      >
        <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
          <div style={{ background: 'radial-gradient(circle at 50% 0%, rgba(255,213,79,0.04) 0%, transparent 70%)', position: 'absolute', inset: 0 }} />
        </div>

        {/* TOPO — flex-shrink: 0, não cede espaço */}
        <div style={{ flexShrink: 0, position: 'relative', zIndex: 10 }}>
          {authProps && (
            <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '8px 12px 0' }}>
              <UserBar
                user={authProps.user} loading={authProps.loading}
                firebaseReady={authProps.firebaseReady}
                onLogin={authProps.onLogin} onLogout={authProps.onLogout}
              />
            </div>
          )}
          <ProgressBar current={currentIndex} total={total} scores={scores} />
        </div>

        {/* MEIO + BASE — flex: 1, componente filho gerencia internamente */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative', zIndex: 10 }} key={currentQuestion.id}>
          {currentQuestion.type === 'scale'
            ? <ScaleQuestion question={currentQuestion} onAnswer={answer} />
            : <ForcedQuestion question={currentQuestion} onAnswer={answer} />
          }
        </div>
      </div>
    );
  }

  // ── COMMITMENT GATE ───────────────────────────────────────────────────
  if (committed === null && !area) {
    const dominantColor = TEMPERAMENTS[dominant]?.color || '#FFD54F';
    return (
      <CommitmentGate
        dominantColor={dominantColor}
        profileName={effectiveResult?.profileNameV3?.name || ''}
        onCommit={() => setCommitted(true)}
      />
    );
  }

  // ── SELEÇÃO DE ÁREA ───────────────────────────────────────────────────
  if (areaChosen === null && !area) {
    const dominantColor = TEMPERAMENTS[dominant]?.color || '#FFD54F';
    return <AreaSelector dominantColor={dominantColor} onSelect={handleAreaSelect} />;
  }

  // ── RESULTADO / PLANO ─────────────────────────────────────────────────
  return (
    <Results
      result={effectiveResult}
      taskObj={taskObj} area={area}
      completedToday={completedToday} currentDay={currentDay} streak={streak}
      plan={plan} isPremium={isPremium} blocked={blocked}
      onComplete={markComplete} onUpgrade={upgrade} upgrading={upgrading}
      onReset={handleReset} userName={userName}
    />
  );
}
