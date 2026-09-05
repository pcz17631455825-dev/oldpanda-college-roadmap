export function normalizeCareerDraft(raw: unknown, questions: readonly { options: readonly unknown[]; type: string; maxSelections?: number }[]): { answers: number[][]; index: number };
