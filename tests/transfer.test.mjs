import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { QUESTIONS, PAIR_QUESTIONS, POLICIES } from '../features/transfer/questions.js';
import { emptyDraft, normalizeDraft, completion, firstMissing, calculateReport, canReport, escapeHTML, STORAGE_KEY, VERSION } from '../features/transfer/core.js';
import { reportText } from '../features/transfer/share.js';

function fixture(current = 1, target = 4) {
  const draft = emptyDraft();
  draft.answers = Object.fromEntries(PAIR_QUESTIONS.map(q => [q.id, { current, target }]));
  Object.assign(draft.answers, { targetEvidence: 'trial', currentEvidence: 'trial', bottleneck: 'content', catchup: 'plan', resources: 'ready', motive: 'tasks', fallback: 'plan', support: 'yes' });
  return draft;
}

test('fresh and incomplete answers cannot create a score or tendency', () => {
  const draft = emptyDraft();
  assert.equal(STORAGE_KEY, 'oldpanda-transfer-v2-draft');
  assert.equal(completion(draft), 0); assert.equal(firstMissing(draft), 0); assert.equal(calculateReport(draft), null);
  draft.answers['pair-1'] = { current: 4 };
  assert.equal(completion(draft), 0); assert.equal(calculateReport(draft), null);
});
test('professional names are neither collected nor retained in the v2 draft', () => {
  const old = { ...fixture(), version: 1, profile: { level: '本科', current: '社会工作', target: '会计学' } };
  assert.equal(completion(normalizeDraft(old)), 0);
  const restored = normalizeDraft({ ...fixture(), profile: { current: '社会工作', target: '会计学' } });
  assert.equal(restored.profile, undefined);
  assert.equal(canReport(restored), true);
  const report = calculateReport(restored);
  assert.deepEqual(report.labels, { current: '当前专业', target: '计划转入专业' });
  assert.ok(!reportText(report).includes('社会工作'));
});
test('draft validation preserves zero and explicit unknown without defaulting', () => {
  const draft = fixture(0, 'unknown'); assert.equal(completion(normalizeDraft(draft)), 32); assert.equal(normalizeDraft(draft).answers['pair-1'].current, 0);
  draft.answers['pair-1'].current = -1; draft.answers['pair-2'].current = '4'; draft.answers.targetEvidence = 'fake';
  assert.equal(completion(normalizeDraft(draft)), 29); assert.equal(calculateReport(draft), null);
  assert.equal(completion(normalizeDraft({ ...draft, version: VERSION - 1 })), 0);
});
test('all unknown counts as intentional completion, not low scores', () => {
  const report = calculateReport(fixture('unknown', 'unknown'));
  assert.equal(report.kind, 'evidence'); assert.equal(report.balance, null); assert.equal(report.currentMean, null); assert.equal(report.targetMean, null);
  assert.equal(report.lower, -100); assert.equal(report.upper, 100); assert.equal(report.known, 0);
});
test('target, current and tie produce different conditional advice', () => {
  assert.equal(calculateReport(fixture(1, 4)).kind, 'target'); assert.equal(calculateReport(fixture(4, 1)).kind, 'current'); assert.equal(calculateReport(fixture(3, 3)).kind, 'mixed');
});
test('policy and cost constraints are not compensated by preference', () => {
  const draft = fixture(); const original = calculateReport(draft); assert.equal(original.gaps.length, 6);
  draft.policy.eligible = 'no'; draft.answers.resources = 'limited'; const report = calculateReport(draft);
  assert.equal(report.blocked, true); assert.equal(report.costBlocked, true); assert.equal(report.balance, original.balance); assert.match(report.actions[0], /上限/);
});
test('weight and missing-information safeguards remain conditional', () => {
  const draft = fixture(2, 3); for (const q of PAIR_QUESTIONS.filter(q => q.dimension === 'interest')) draft.answers[q.id] = { current: 4, target: 0 };
  let report = calculateReport(draft); assert.ok(report.balance > 0); assert.ok(report.sensitivityLow < 0); assert.equal(report.kind, 'mixed');
  for (const q of PAIR_QUESTIONS.slice(0, 8)) draft.answers[q.id] = { current: 'unknown', target: 'unknown' };
  report = calculateReport(draft); assert.ok(report.lower < 0); assert.ok(report.upper > 0); assert.equal(report.kind, 'evidence');
});
test('policy edits keep answers and share excludes private notes and professional names', () => {
  const draft = fixture(); draft.policyNote = '私人地址电话号码和家庭情况'; for (const p of POLICIES) draft.policy[p.id] = p.id === 'eligible' ? 'yes' : 'checked';
  const report = calculateReport(draft); assert.equal(report.gaps.length, 0); assert.equal(canReport(draft), true);
  const text = reportText(report); assert.match(text, /当前专业 · 计划转入专业/); assert.ok(!text.includes(draft.policyNote));
});
test('32 question framework stays intact', () => {
  assert.equal(QUESTIONS.length, 32); assert.equal(new Set(QUESTIONS.map(q => q.id)).size, 32);
});
test('user inputs are escaped before HTML rendering', () => { assert.equal(escapeHTML('<img src=x onerror="alert(1)">'), '&lt;img src=x onerror=&quot;alert(1)&quot;&gt;'); });
test('static and React feature logic and styling remain identical', async () => {
  for (const file of await readdir(new URL('../features/transfer/', import.meta.url))) {
    if (!/\.(css|js)$/.test(file)) continue;
    assert.deepEqual(await readFile(new URL(`../features/transfer/${file}`, import.meta.url)), await readFile(new URL(`../docs/transfer/${file}`, import.meta.url)), file);
  }
});
