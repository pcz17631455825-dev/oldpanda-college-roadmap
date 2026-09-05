// Validate persistence only; the original question bank and scoring are unchanged.
export function normalizeCareerDraft(raw, questions) {
  const answers = questions.map((q, i) => {
    const selected = Array.isArray(raw?.answers?.[i]) ? raw.answers[i] : [];
    return [...new Set(selected.filter(value => Number.isInteger(value) && value >= 0 && value < q.options.length))].slice(0, q.type === 'multiple' ? q.maxSelections || 2 : 1);
  });
  const index = Number.isInteger(raw?.index) ? Math.max(0, Math.min(raw.index, questions.length - 1)) : 0;
  return { answers, index };
}
