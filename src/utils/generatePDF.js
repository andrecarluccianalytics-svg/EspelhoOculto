/**
 * generatePDF.js — v2
 *
 * Relatório pessoal e compartilhável.
 * Linguagem em segunda pessoa, seções de impacto e gancho viral.
 *
 * Estrutura:
 *   Capa       — identidade + frase de impacto
 *   Página 2   — Seu padrão + composição percentual
 *   Página 3   — Como você age + como é percebido (espelho)
 *   Página 4   — O impacto disso no seu dia a dia (NOVO)
 *   Página 5   — Isso é só o começo + plano dia 1 + gancho viral
 */

import { jsPDF } from 'jspdf';

// ─── Constantes ───────────────────────────────────────────────────────────

const C = {
  bg:      [10,  10,  15],
  surface: [22,  22,  30],
  border:  [42,  42,  55],
  text:    [240, 237, 232],
  muted:   [130, 125, 118],
  dim:     [80,   76,  72],
  green:   [67,  160,  71],
  red:     [229,  57,  53],
  white:   [255, 255, 255],
};

const TCOLORS = {
  S: [255, 213,  79],
  C: [229,  57,  53],
  M: [ 30, 136, 229],
  F: [ 67, 160,  71],
};

const TNAMES = {
  S: 'Sanguíneo',
  C: 'Colérico',
  M: 'Melancólico',
  F: 'Fleumático',
};

const AREA_LABELS = {
  trabalho: 'Trabalho',
  relacionamentos: 'Relacionamentos',
  decisoes: 'Decisões',
  autocontrole: 'Autocontrole',
};

const W  = 210;
const H  = 297;
const MX = 18;          // margin x
const CW = W - MX * 2; // content width

// ─── Helpers ──────────────────────────────────────────────────────────────

const split = (doc, text, maxW, size = 10) => {
  doc.setFontSize(size);
  return doc.splitTextToSize(text || '', maxW);
};

function card(doc, x, y, w, h, fill, stroke) {
  if (fill)   { doc.setFillColor(...fill);   doc.roundedRect(x, y, w, h, 2.5, 2.5, 'F'); }
  if (stroke) { doc.setDrawColor(...stroke); doc.setLineWidth(0.25); doc.roundedRect(x, y, w, h, 2.5, 2.5, 'S'); }
}

function newPage(doc, accentColor) {
  doc.addPage();
  doc.setFillColor(...C.bg);
  doc.rect(0, 0, W, H, 'F');
  // Faixa de cor no topo em todas as páginas internas
  if (accentColor) {
    doc.setFillColor(...accentColor);
    doc.rect(0, 0, W, 2, 'F');
  }
}

function checkY(doc, y, need = 20, accentColor) {
  if (y + need > H - 14) {
    newPage(doc, accentColor);
    return 20;
  }
  return y;
}

function sectionHeader(doc, title, y, accent) {
  y = checkY(doc, y, 18, accent);
  // Barra lateral
  doc.setFillColor(...(accent || C.text));
  doc.rect(MX, y, 3, 7, 'F');
  // Título
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11.5);
  doc.setTextColor(...C.text);
  doc.text(title, MX + 7, y + 5.5);
  // Linha
  doc.setDrawColor(...C.border);
  doc.setLineWidth(0.2);
  doc.line(MX, y + 9.5, W - MX, y + 9.5);
  return y + 17;
}

function bulletList(doc, items, x, y, bulletColor, maxW) {
  (items || []).forEach(item => {
    y = checkY(doc, y, 14);
    doc.setFillColor(...(bulletColor || C.text));
    doc.circle(x + 2, y + 1.5, 1.1, 'F');
    const lines = split(doc, item, maxW - 8, 9.5);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(...C.text);
    doc.text(lines, x + 6.5, y);
    y += lines.length * 5.2 + 2.5;
  });
  return y;
}

function impactCard(doc, text, y, accent) {
  const lines = split(doc, text, CW - 12, 10);
  const h = lines.length * 5.8 + 12;
  y = checkY(doc, y, h + 4);
  card(doc, MX, y, CW, h, C.surface, null);
  doc.setFillColor(...accent);
  doc.rect(MX, y, 2.5, h, 'F');
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(10);
  doc.setTextColor(...C.text);
  doc.text(lines, MX + 8, y + 8);
  return y + h + 5;
}

function mutedParagraph(doc, text, y, size = 9.5) {
  const lines = split(doc, text, CW, size);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(size);
  doc.setTextColor(...C.muted);
  doc.text(lines, MX, y);
  return y + lines.length * (size * 0.52) + 4;
}

// ─── Geração principal ────────────────────────────────────────────────────

export async function generatePDF({ result, taskObj, area, userName }) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });

  const {
    pct = {}, sorted = [], dominant, secondary,
    profileNameV3, impactStatement, description,
    strengths = [], weaknesses = [],
    suggestions = {}, deepInsightsV2 = [], deepInsights = [],
    mirrorV3, finalPunch, sharePhrase,
  } = result;

  const profileName   = profileNameV3?.name     || 'Perfil Comportamental';
  const profileSub    = profileNameV3?.subtitle  || '';
  const domColor      = TCOLORS[dominant]        || C.text;
  const secColor      = TCOLORS[secondary]       || C.muted;
  const domName       = TNAMES[dominant]         || dominant || '';
  const secName       = TNAMES[secondary]        || secondary || '';
  const insights      = deepInsightsV2?.length > 0 ? deepInsightsV2 : (deepInsights || []);
  const areaLabel     = AREA_LABELS[area]        || area || 'Geral';
  const today         = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });

  // ═══════════════════════════════════════════════════════════════════════
  // CAPA
  // ═══════════════════════════════════════════════════════════════════════

  // Fundo
  doc.setFillColor(...C.bg);
  doc.rect(0, 0, W, H, 'F');

  // Faixa superior na cor dominante (mais larga na capa)
  doc.setFillColor(...domColor);
  doc.rect(0, 0, W, 6, 'F');

  // Gradiente simulado: retângulos sobrepostos com alpha decrescente
  for (let i = 0; i < 40; i++) {
    const alpha = 0.06 - i * 0.0015;
    if (alpha <= 0) break;
    doc.setFillColor(domColor[0], domColor[1], domColor[2]);
    doc.setGState(doc.GState({ opacity: alpha }));
    doc.rect(0, 6 + i * 3, W, 4, 'F');
  }
  doc.setGState(doc.GState({ opacity: 1 }));

  // Quatro pontos — identidade visual
  const dotData = [
    { color: [255, 213, 79], r: 3.5 },
    { color: [229,  57, 53], r: 4.5 },
    { color: [ 30, 136,229], r: 4.5 },
    { color: [ 67, 160, 71], r: 3.5 },
  ];
  let dotX = W / 2 - 20;
  dotData.forEach(d => {
    doc.setFillColor(...d.color);
    doc.circle(dotX, 55, d.r, 'F');
    dotX += 13;
  });

  // "Espelho Oculto" — fonte grande
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(30);
  doc.setTextColor(...C.white);
  doc.text('Espelho Oculto', W / 2, 74, { align: 'center' });

  // Subtítulo
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(...C.muted);
  doc.text('Relatório de Perfil Comportamental', W / 2, 83, { align: 'center' });

  // Frase de impacto da capa
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(9.5);
  doc.setTextColor(...C.dim);
  doc.text('Esse relatório revela padrões que normalmente passam despercebidos.', W / 2, 92, { align: 'center' });

  // Linha divisória
  doc.setDrawColor(...C.border);
  doc.setLineWidth(0.4);
  doc.line(W / 2 - 25, 98, W / 2 + 25, 98);

  // Card central do perfil
  card(doc, MX, 108, CW, 68, C.surface, C.border);

  // Nome do perfil
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(19);
  doc.setTextColor(...domColor);
  doc.text(profileName, W / 2, 126, { align: 'center' });

  // Subtítulo do perfil
  if (profileSub) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(...C.muted);
    doc.text(profileSub, W / 2, 134, { align: 'center' });
  }

  // Badges (dominante + secundário)
  const bY = 146;
  card(doc, W / 2 - 54, bY - 5, 50, 10, [...domColor, 0.15], domColor);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...domColor);
  doc.text(`${domName}  ${pct[dominant] || 0}%`, W / 2 - 29, bY + 1.5, { align: 'center' });

  card(doc, W / 2 + 4, bY - 5, 50, 10, [...secColor, 0.15], secColor);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...secColor);
  doc.text(`${secName}  ${pct[secondary] || 0}%`, W / 2 + 29, bY + 1.5, { align: 'center' });

  // sharePhrase — frase em primeira pessoa do usuário
  if (sharePhrase?.phrase) {
    const spLines = split(doc, `"${sharePhrase.phrase}"`, CW - 8, 9);
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(9);
    doc.setTextColor(...C.dim);
    doc.text(spLines, W / 2, 168, { align: 'center' });
  }

  // Rodapé da capa
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...C.dim);
  if (userName) {
    doc.text(`Gerado para ${userName}`, W / 2, H - 28, { align: 'center' });
  }
  doc.text(today, W / 2, H - 21, { align: 'center' });
  doc.setFontSize(8);
  doc.setTextColor(...C.border);
  doc.text('espelhooculto.app', W / 2, H - 13, { align: 'center' });

  // ═══════════════════════════════════════════════════════════════════════
  // PÁGINA 2 — SEU PADRÃO + COMPOSIÇÃO
  // ═══════════════════════════════════════════════════════════════════════

  newPage(doc, domColor);
  let y = 20;

  y = sectionHeader(doc, 'Seu Padrão', y, domColor);

  // Frase de impacto pessoal
  if (impactStatement) {
    y = impactCard(doc, impactStatement, y, domColor);
  }

  // Descrição em segunda pessoa (já está em segunda pessoa nos dados)
  if (description) {
    y = mutedParagraph(doc, description, y, 9.5);
    y += 4;
  }

  // Composição percentual
  y = checkY(doc, y, 20, domColor);
  y = sectionHeader(doc, 'Composição do Perfil', y, domColor);

  sorted.forEach(key => {
    y = checkY(doc, y, 14, domColor);
    const val     = pct[key] || 0;
    const tc      = TCOLORS[key] || C.muted;
    const tn      = TNAMES[key]  || key;
    const filledW = CW * (val / 100);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(...tc);
    doc.text(tn, MX, y);
    doc.text(`${val}%`, W - MX, y, { align: 'right' });

    // Track background
    doc.setFillColor(...C.border);
    doc.roundedRect(MX, y + 2.5, CW, 4, 1.2, 1.2, 'F');
    // Fill
    if (filledW > 0) {
      doc.setFillColor(...tc);
      doc.roundedRect(MX, y + 2.5, filledW, 4, 1.2, 1.2, 'F');
    }
    y += 13;
  });

  // ═══════════════════════════════════════════════════════════════════════
  // PÁGINA 3 — COMO VOCÊ AGE + COMO É PERCEBIDO
  // ═══════════════════════════════════════════════════════════════════════

  newPage(doc, domColor);
  y = 20;

  // Pontos fortes
  y = sectionHeader(doc, 'Como Você Age — Pontos Fortes', y, C.green);
  y = bulletList(doc, strengths, MX, y, C.green, CW);
  y += 6;

  // Pontos de atenção
  y = checkY(doc, y, 20, domColor);
  y = sectionHeader(doc, 'Onde Você Tende a Travar', y, C.red);
  y = bulletList(doc, weaknesses, MX, y, C.red, CW);
  y += 6;

  // Espelho — como é percebido (se couber na página)
  if (mirrorV3) {
    y = checkY(doc, y, 30, domColor);
    y = sectionHeader(doc, 'Como Você Provavelmente É Percebido', y, domColor);

    // Headline
    doc.setFont('helvetica', 'bolditalic');
    doc.setFontSize(10.5);
    doc.setTextColor(...domColor);
    const hlLines = split(doc, `"${mirrorV3.headline}"`, CW, 10.5);
    doc.text(hlLines, MX, y);
    y += hlLines.length * 6 + 4;

    // Percepções (máx 3)
    mirrorV3.perceptions.slice(0, 3).forEach(p => {
      y = checkY(doc, y, 12, domColor);
      doc.setFillColor(...domColor);
      doc.circle(MX + 2, y + 1.5, 1.1, 'F');
      const pl = split(doc, p, CW - 8, 9);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(...C.muted);
      doc.text(pl, MX + 6.5, y);
      y += pl.length * 4.8 + 3;
    });

    // Ponto cego
    if (mirrorV3.blind_spot) {
      y += 3;
      y = checkY(doc, y, 18, domColor);
      const bsl = split(doc, `Ponto cego: ${mirrorV3.blind_spot}`, CW - 8, 9);
      const bsh = bsl.length * 5.2 + 10;
      card(doc, MX, y, CW, bsh, C.surface, C.border);
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(9);
      doc.setTextColor(...C.muted);
      doc.text(bsl, MX + 4, y + 7);
      y += bsh + 6;
    }
  }

  // ═══════════════════════════════════════════════════════════════════════
  // PÁGINA 4 — O IMPACTO DISSO NO SEU DIA A DIA (NOVA SEÇÃO)
  // ═══════════════════════════════════════════════════════════════════════

  newPage(doc, domColor);
  y = 20;

  y = sectionHeader(doc, 'O Impacto Disso no Seu Dia a Dia', y, domColor);

  // Introdução
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(...C.muted);
  const introText = `Seu perfil ${domName} influencia diretamente como você toma decisões, como se relaciona com as pessoas e como reage sob pressão. Esses padrões não são defeitos — são o seu modo padrão de operar. Conhecê-los muda o que você faz com eles.`;
  const introLines = split(doc, introText, CW, 9.5);
  doc.text(introLines, MX, y);
  y += introLines.length * 5.2 + 8;

  // Três subseções: Decisões · Relacionamentos · Comportamento
  const IMPACT_SECTIONS = [
    {
      label: 'Decisões',
      color: domColor,
      items: (suggestions.daily || []).slice(0, 2),
    },
    {
      label: 'Relacionamentos',
      color: TCOLORS.S, // sanguíneo/social
      items: (suggestions.relationships || []).slice(0, 2),
    },
    {
      label: 'Comportamento automático',
      color: C.muted,
      items: insights.slice(0, 2).map(item =>
        typeof item === 'string' ? item : item.text || item.behavior || ''
      ).filter(Boolean),
    },
  ];

  IMPACT_SECTIONS.forEach(sec => {
    if (!sec.items || sec.items.length === 0) return;
    y = checkY(doc, y, 18, domColor);

    // Label da subseção
    doc.setFillColor(...sec.color);
    doc.rect(MX, y, 2, 6, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(...sec.color);
    doc.text(sec.label, MX + 5, y + 4.5);
    y += 9;

    y = bulletList(doc, sec.items, MX + 3, y, sec.color, CW - 3);
    y += 5;
  });

  // Insights profundos (máx 2, formatados como observações pessoais)
  if (insights.length > 0) {
    y = checkY(doc, y, 20, domColor);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(...C.text);
    doc.text('Padrões que merecem sua atenção:', MX, y);
    y += 7;

    insights.slice(0, 2).forEach((item, i) => {
      y = checkY(doc, y, 18, domColor);
      const beh = typeof item === 'string' ? item : (item.behavior || item.text || '');
      const con = typeof item === 'object' ? item.consequence : null;

      const bl = split(doc, `${i + 1}. ${beh}`, CW - 4, 9.5);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(...C.text);
      doc.text(bl, MX, y);
      y += bl.length * 5.2 + 1;

      if (con) {
        const cl = split(doc, con, CW - 8, 9);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(...C.muted);
        doc.text(cl, MX + 4, y);
        y += cl.length * 4.8 + 2;
      }
      y += 3;
    });
  }

  // ═══════════════════════════════════════════════════════════════════════
  // PÁGINA 5 — ISSO É SÓ O COMEÇO + PLANO + GANCHO VIRAL
  // ═══════════════════════════════════════════════════════════════════════

  newPage(doc, domColor);
  y = 20;

  // Seção: Isso é só o começo
  y = sectionHeader(doc, 'Isso É Só o Começo', y, C.green);

  // Texto de continuidade
  const continText = 'Nos próximos dias, você vai trabalhar exatamente esses pontos — um de cada vez, de forma prática e progressiva.';
  const cl1 = split(doc, continText, CW, 9.5);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(...C.muted);
  doc.text(cl1, MX, y);
  y += cl1.length * 5.2 + 5;

  // finalPunch como carta de intenção
  if (finalPunch) {
    y = checkY(doc, y, 22, domColor);
    const fpl = split(doc, finalPunch.punch, CW - 8, 10.5);
    const fph = fpl.length * 6.2 + (finalPunch.sub ? 12 : 4) + 8;
    card(doc, MX, y, CW, fph, C.surface, C.border);
    doc.setFillColor(...domColor);
    doc.rect(MX, y, 2.5, fph, 'F');
    doc.setFont('helvetica', 'bolditalic');
    doc.setFontSize(10.5);
    doc.setTextColor(...C.text);
    doc.text(fpl, MX + 8, y + 8);
    if (finalPunch.sub) {
      const fsl = split(doc, finalPunch.sub, CW - 12, 9);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(...C.muted);
      doc.text(fsl, MX + 8, y + 8 + fpl.length * 6.2 + 2);
    }
    y += fph + 8;
  }

  // Plano — Dia 1
  y = checkY(doc, y, 30, domColor);
  y = sectionHeader(doc, `Seu Plano — Dia 1 · ${areaLabel}`, y, C.green);

  if (taskObj?.task) {
    const tl = split(doc, taskObj.task, CW - 8, 10.5);
    const th = tl.length * 6.2 + 10;
    card(doc, MX, y, CW, th, C.surface, C.green);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(...C.text);
    doc.text(tl, MX + 4, y + 7);
    y += th + 5;

    if (taskObj.gain) {
      const gl = split(doc, taskObj.gain, CW, 9);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(...C.muted);
      doc.text(gl, MX, y);
      y += gl.length * 5 + 6;
    }
  }

  // ── Chamada para voltar ao app ────────────────────────────────────────
  y = checkY(doc, y, 28, domColor);
  y += 6;
  doc.setDrawColor(...C.border);
  doc.setLineWidth(0.25);
  doc.line(MX, y, W - MX, y);
  y += 8;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(...C.muted);
  doc.text('Continue seu plano em:', W / 2, y, { align: 'center' });
  y += 6;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...domColor);
  doc.text('espelhooculto.app', W / 2, y, { align: 'center' });
  y += 10;

  // ── Gancho de compartilhamento ────────────────────────────────────────
  y = checkY(doc, y, 30, domColor);
  const shareCardH = 38;
  card(doc, MX, y, CW, shareCardH, C.surface, C.border);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(...C.text);
  doc.text('Envie este relatório para alguém próximo.', MX + 5, y + 9);

  const shareDesc = 'Compare os padrões. Cada pessoa reage de forma diferente — ver isso em alguém próximo muda sua forma de enxergar.';
  const sdl = split(doc, shareDesc, CW - 10, 8.5);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(...C.muted);
  doc.text(sdl, MX + 5, y + 16);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(...domColor);
  doc.text('espelhooculto.app', MX + 5, y + shareCardH - 5);

  y += shareCardH + 6;

  // Nota final
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...C.dim);
  doc.text('Este relatório é pessoal e baseado nas suas respostas.', W / 2, y, { align: 'center' });

  // ── Numeração de páginas ──────────────────────────────────────────────
  const total = doc.getNumberOfPages();
  for (let i = 2; i <= total; i++) { // Capa (1) sem número
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(...C.border);
    doc.text(`${i - 1} / ${total - 1}`, W - MX, H - 6, { align: 'right' });
  }

  // ── Download ──────────────────────────────────────────────────────────
  const fname = `espelho-oculto-${(domName || 'perfil').toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().slice(0, 10)}.pdf`;
  doc.save(fname);
}
