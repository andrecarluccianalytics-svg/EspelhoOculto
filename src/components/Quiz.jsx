import { useState, useEffect, useRef, useMemo } from 'react';
import { useQuiz } from '../hooks/useQuiz';
import { useDailyTask } from '../hooks/useDailyTask';
import { usePlan } from '../hooks/usePlan';
import { ProgressBar } from './ProgressBar';
import { ScaleQuestion } from './ScaleQuestion';
import { ForcedQuestion } from './ForcedQuestion';
import { AreaSelector } from './AreaSelector';
import { saveTestResult, startPlan, saveUserData } from '../services/firestore';
import { CommitmentGate } from './CommitmentGate';
import { Results } from './Results';
import { TEMPERAMENTS } from '../data/questions';
import { getProfileData } from '../data/profiles';
import { UserBar } from './UserBar';

export function Quiz({ userId, cloudData, userName, onReset, authProps }) {
  const { currentQuestion, currentIndex, total, scores, done, result, answer, reset } = useQuiz();

  // ── Estados de fluxo ──────────────────────────────────────────────────
  // committed: null=não viu Gate | true=confirmou
  const [committed, setCommitted] = useState(null);
  // areaChosen: null=não escolheu | string=área escolhida | false=pulou
  const [areaChosen, setAreaChosen] = useState(null);

  // ── PERSISTÊNCIA: reconstitui resultado a partir dos scores salvos ────
  //
  // getProfileData(scores) é determinístico — mesmos scores → mesmo resultado.
  // Isso elimina a necessidade de serializar o objeto result inteiro.
  //
  const restoredResult = useMemo(() => {
    if (done && result) return null;                               // teste feito agora
    if (!cloudData?.hasCompletedTest) return null;                 // nunca fez o teste
    if (!cloudData?.scores || !Object.keys(cloudData.scores).length) return null;
    try {
      console.log('[Quiz] Reconstituindo resultado do Firestore, scores:', cloudData.scores);
      return getProfileData(cloudData.scores);
    } catch (err) {
      console.error('[Quiz] Erro ao reconstituir resultado:', err);
      return null;
    }
  }, [cloudData, done, result]);

  const effectiveResult = (done && result) ? result : restoredResult;
  const effectiveDone   = done || !!restoredResult;
  const dominant        = effectiveResult?.dominant || null;

  // ── Roteamento ao restaurar dados do Firestore ────────────────────────
  //
  // Lógica de rota baseada nos campos do Firestore:
  //   hasCompletedTest=true + planStarted=false → mostra CommitmentGate
  //   hasCompletedTest=true + planStarted=true  → vai direto ao plano (pula Gate)
  //
  useEffect(() => {
    if (!restoredResult) return;
    if (cloudData?.planStarted) {
      // Usuário já confirmou o plano antes — pula CommitmentGate
      setCommitted(true);
    }
    // Se planStarted=false, committed fica null → CommitmentGate aparece
  }, [restoredResult, cloudData?.planStarted]);

  // ── Salva resultado no Firestore quando teste termina nesta sessão ────
  const savedRef = useRef(false);
  useEffect(() => {
    if (done && result && userId && !savedRef.current) {
      savedRef.current = true;
      console.log('[Quiz] Salvando resultado no Firestore...');
      saveTestResult(userId, result, scores)
        .then(ok => console.log('[Quiz] saveTestResult:', ok ? 'OK' : 'FALHOU'))
        .catch(err => console.error('[Quiz] saveTestResult erro:', err));
    }
  }, [done, result, scores, userId]); // eslint-disable-line

  // ── Hooks de tarefa e plano ───────────────────────────────────────────
  const { area, taskObj, completedToday, currentDay, streak, setArea, markComplete, reset: resetTask }
    = useDailyTask(dominant, userId, cloudData);
  const { plan, isPremium, isBlocked, upgrade, upgrading } = usePlan(userId, cloudData);
  const blocked = isBlocked(currentDay);

  // ── Handlers ─────────────────────────────────────────────────────────
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

  async function handleCommit() {
    // Salva planStarted=true no Firestore para não mostrar CommitmentGate novamente
    if (userId) {
      startPlan(userId).catch(() => {});
    }
    setCommitted(true);
  }

  // ══════════════════════════════════════════════════════════════════════
  // TELA 1 — QUESTIONÁRIO
  // Aparece quando o teste ainda não foi concluído e não há resultado salvo
  // ══════════════════════════════════════════════════════════════════════
  if (!effectiveDone) {
    if (!currentQuestion) return null;
    return (
      <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column', background: '#0A0A0F', overflow: 'hidden' }}>
        <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
          <div style={{ background: 'radial-gradient(circle at 50% 0%, rgba(255,213,79,0.04) 0%, transparent 70%)', position: 'absolute', inset: 0 }} />
        </div>

        {/* TOPO — UserBar + ProgressBar */}
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

        {/* PERGUNTA + RESPOSTAS */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative', zIndex: 10 }} key={currentQuestion.id}>
          {currentQuestion.type === 'scale'
            ? <ScaleQuestion question={currentQuestion} onAnswer={answer} />
            : <ForcedQuestion question={currentQuestion} onAnswer={answer} />
          }
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════════
  // TELA 2 — COMMITMENT GATE
  // Aparece UMA VEZ após o teste, antes de iniciar o plano.
  // Salto quando planStarted=true no Firestore (já confirmou antes).
  // ══════════════════════════════════════════════════════════════════════
  if (committed === null) {
    const dominantColor = TEMPERAMENTS[dominant]?.color || '#FFD54F';
    return (
      <CommitmentGate
        dominantColor={dominantColor}
        profileName={effectiveResult?.profileNameV3?.name || ''}
        onCommit={handleCommit}
      />
    );
  }

  // ══════════════════════════════════════════════════════════════════════
  // TELA 3 — SELEÇÃO DE ÁREA
  // Aparece quando ainda não escolheu área (cloudData.area também é null)
  // ══════════════════════════════════════════════════════════════════════
  if (areaChosen === null && !area) {
    const dominantColor = TEMPERAMENTS[dominant]?.color || '#FFD54F';
    return <AreaSelector dominantColor={dominantColor} onSelect={handleAreaSelect} />;
  }

  // ══════════════════════════════════════════════════════════════════════
  // TELA 4 — RESULTADO + PLANO
  // ══════════════════════════════════════════════════════════════════════
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
