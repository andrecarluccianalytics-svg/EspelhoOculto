/**
 * PDFButton.jsx
 *
 * Botão de geração de PDF do relatório completo.
 * Estado: idle → generating → done (reset após 3s)
 * Design alinhado com o restante do app.
 */

import { useState } from 'react';
import { generatePDF } from '../utils/generatePDF';

export function PDFButton({ result, taskObj, area, userName, dominantColor }) {
  const [status, setStatus] = useState('idle'); // idle | generating | done | error

  async function handleClick() {
    if (status === 'generating') return;
    setStatus('generating');
    try {
      await generatePDF({ result, taskObj, area, userName });
      setStatus('done');
      setTimeout(() => setStatus('idle'), 3000);
    } catch (err) {
      console.error('[PDF] Erro ao gerar:', err);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  }

  const color = dominantColor || '#FFD54F';

  const CONTENT = {
    idle: {
      icon: (
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
          <path d="M7.5 1v8M4.5 6.5L7.5 9.5l3-3" stroke="currentColor" strokeWidth="1.4"
            strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M2 11v1a1 1 0 0 0 1 1h9a1 1 0 0 0 1-1v-1" stroke="currentColor"
            strokeWidth="1.4" strokeLinecap="round"/>
        </svg>
      ),
      label: 'Salvar meu relatório completo',
    },
    generating: {
      icon: (
        <svg className="animate-spin" width="15" height="15" viewBox="0 0 15 15" fill="none">
          <circle cx="7.5" cy="7.5" r="6" stroke="rgba(255,255,255,0.25)" strokeWidth="1.4"/>
          <path d="M7.5 1.5a6 6 0 0 1 6 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
        </svg>
      ),
      label: 'Gerando seu relatório...',
    },
    done: {
      icon: (
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
          <path d="M2.5 7.5L6 11L12.5 4" stroke="#43A047" strokeWidth="1.5"
            strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      label: 'Relatório salvo!',
    },
    error: {
      icon: (
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
          <circle cx="7.5" cy="7.5" r="6" stroke="#E53935" strokeWidth="1.4"/>
          <path d="M7.5 4.5v4M7.5 10.5v.5" stroke="#E53935" strokeWidth="1.4" strokeLinecap="round"/>
        </svg>
      ),
      label: 'Erro ao gerar. Tente novamente.',
    },
  };

  const { icon, label } = CONTENT[status] || CONTENT.idle;
  const isGenerating = status === 'generating';
  const isDone       = status === 'done';
  const isError      = status === 'error';

  return (
    <button
      onClick={handleClick}
      disabled={isGenerating}
      className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-2xl border text-[13px] font-medium transition-all duration-200 active:scale-[0.98]"
      style={{
        background: isDone
          ? 'rgba(67,160,71,0.08)'
          : isError
          ? 'rgba(229,57,53,0.08)'
          : 'rgba(255,255,255,0.04)',
        borderColor: isDone
          ? 'rgba(67,160,71,0.25)'
          : isError
          ? 'rgba(229,57,53,0.25)'
          : 'rgba(255,255,255,0.09)',
        color: isDone
          ? '#43A047'
          : isError
          ? '#E53935'
          : isGenerating
          ? 'rgba(255,255,255,0.35)'
          : 'rgba(255,255,255,0.55)',
        cursor: isGenerating ? 'not-allowed' : 'pointer',
      }}
    >
      {icon}
      {label}
    </button>
  );
}
