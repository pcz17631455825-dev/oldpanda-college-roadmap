import { QUESTIONS, PAIR_QUESTIONS, DIMENSIONS, POLICIES } from './questions.js';

// v2 intentionally drops the two professional-name fields. Those names are not
// needed for the self-assessment and are better verified in a student's own school.
export const STORAGE_KEY = 'oldpanda-transfer-v2-draft';
export const VERSION = 2;
export const LINKS = { video: 'https://v.douyin.com/pjvlMkddlE0/', profile: 'https://v.douyin.com/4Dh6ZKeHj50/' };
export const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const own = (obj, key) => obj && typeof obj === 'object' && Object.hasOwn(obj, key);
export const isRating = value => value === 'unknown' || (Number.isInteger(value) && value >= 0 && value <= 4);
export function answered(question, value) {
  return question.type === 'pair'
    ? !!value && isRating(value.current) && isRating(value.target)
    : question.options.some(option => option.id === value);
}
export function emptyDraft() {
  return { version: VERSION, policy: {}, policyNote: '', answers: {}, updatedAt: null };
}
export function normalizeDraft(raw) {
  const draft = emptyDraft();
  if (!raw || raw.version !== VERSION) return draft;
  for (const question of QUESTIONS) {
    if (!own(raw.answers, question.id)) continue;
    const answer = raw.answers[question.id];
    if (question.type === 'pair' && answer && typeof answer === 'object') {
      const pair = {};
      for (const side of ['current', 'target']) if (isRating(answer[side])) pair[side] = answer[side];
      draft.answers[question.id] = pair;
    } else if (answered(question, answer)) draft.answers[question.id] = answer;
  }
  for (const p of POLICIES) {
    const allowed = p.id === 'eligible' ? ['yes', 'no', 'unknown'] : ['checked', 'unknown', 'na'];
    if (own(raw.policy, p.id) && allowed.includes(raw.policy[p.id])) draft.policy[p.id] = raw.policy[p.id];
  }
  draft.policyNote = typeof raw.policyNote === 'string' ? raw.policyNote.slice(0, 800) : '';
  draft.updatedAt = typeof raw.updatedAt === 'string' ? raw.updatedAt : null;
  return draft;
}
export const completion = draft => QUESTIONS.filter(q => answered(q, draft.answers[q.id])).length;
export const firstMissing = draft => QUESTIONS.findIndex(q => !answered(q, draft.answers[q.id]));
export const canReport = draft => completion(draft) === QUESTIONS.length;

// An exploratory equal-weight comparison, NOT a validated scale or a transfer-success probability.
// Missing information remains an interval; it never becomes a low-fit score.
export function calculateReport(input) {
  const draft = normalizeDraft(input);
  if (!canReport(draft)) return null;
  let sum = 0, known = 0, currentSum = 0, targetSum = 0;
  const dimensions = DIMENSIONS.map(dimension => {
    let c = 0, t = 0, n = 0;
    for (const q of PAIR_QUESTIONS.filter(q => q.dimension === dimension.id)) {
      const answer = draft.answers[q.id];
      if (typeof answer.current !== 'number' || typeof answer.target !== 'number') continue;
      c += answer.current; t += answer.target; n++;
    }
    sum += t - c; known += n; currentSum += c; targetSum += t;
    return { ...dimension, current: n ? c / n : null, target: n ? t / n : null, known: n, total: 4, delta: n ? (t - c) / n : null,
      lower: (t - c - (4 - n) * 4) / 16 * 100, upper: (t - c + (4 - n) * 4) / 16 * 100 };
  });
  const missing = PAIR_QUESTIONS.length - known;
  const scale = PAIR_QUESTIONS.length * 4;
  const lower = (sum - missing * 4) / scale * 100;
  const upper = (sum + missing * 4) / scale * 100;
  const balance = known ? sum / (known * 4) * 100 : null;
  // Illustrative sensitivity, not an empirically validated set of weights.
  const sensitivity = Array.from({ length: 64 }, (_, mask) => {
    const weights = dimensions.map((_, i) => (mask & (1 << i)) ? 2 : 0.5);
    const total = weights.reduce((a, b) => a + b, 0);
    return { low: dimensions.reduce((a, d, i) => a + d.lower * weights[i], 0) / total,
      high: dimensions.reduce((a, d, i) => a + d.upper * weights[i], 0) / total };
  });
  const sensitivityLow = Math.min(...sensitivity.map(s => s.low));
  const sensitivityHigh = Math.max(...sensitivity.map(s => s.high));
  const targetEvidence = draft.answers.targetEvidence === 'trial';
  const currentEvidence = ['trial', 'deep'].includes(draft.answers.currentEvidence);
  let kind = 'mixed', title = '两边各有取舍，先做一轮具体比较';
  if (!known || !targetEvidence || !currentEvidence || (missing > 0 && lower <= 0 && upper >= 0)) {
    kind = 'evidence'; title = '先补充体验与信息，再看转向倾向';
  } else if (lower > 0 && sensitivityLow > 0) {
    kind = 'target'; title = '目前更倾向探索目标专业';
  } else if (upper < 0 && sensitivityHigh < 0) {
    kind = 'current'; title = '当前专业仍有值得继续探索的基础';
  }
  const gaps = POLICIES.filter(p => !draft.policy[p.id] || draft.policy[p.id] === 'unknown').map(p => p.title);
  const blocked = draft.policy.eligible === 'no';
  const costBlocked = draft.answers.resources === 'limited' || draft.answers.catchup === 'hard';
  const concerns = [];
  const actions = [];
  if (costBlocked) { concerns.push('你填报的资源或补修承受能力存在明显约束；偏好较高不代表转入方案已经可执行。'); actions.push('先与学院核算补修、学习年限与费用，确认自己能承担的上限；约束未解决前，保留当前专业的可行安排。'); }
  if (blocked) { concerns.push('你填报的资格条件目前不符合。兴趣比较不能抵消学校的申请限制。'); actions.push('向教务处核对限制的适用年级、录取类型和当年通知；在确认前，不把转入当成可执行方案。'); }
  if (gaps.length) actions.push(`到本校教务处官网核实：${gaps.join('、')}。保存通知链接、年份与截止日期；往年信息只作参考。`);
  if (!targetEvidence) { concerns.push('目标专业尚缺亲身任务体验，暂不能把期待当作适配证据。'); actions.push('从目标专业培养方案选一项入门任务，用一周完成；记录投入、困难、反馈，再回来更新答案。'); }
  if (!currentEvidence) { concerns.push('当前专业也缺少实际体验，可能还没有充分可比的依据。'); actions.push('尝试一项当前专业的典型作业，向高年级学生核对后续课程，避免只比较开学初的感受。'); }
  if (missing) concerns.push(`有 ${missing} 组比较尚未充分了解；未了解不等于不适合。`);
  if (draft.answers.bottleneck === 'environment') { concerns.push('环境不适应未必能通过换专业解决。'); actions.push('把宿舍、人际、授课方式与专业内容分别列出，先确认真正需要改变的是哪一项。'); }
  if (draft.answers.bottleneck === 'method') { concerns.push('基础或方法困难不等于专业不匹配。'); actions.push('先尝试一次学习方法调整或答疑支持，再比较调整后的学习体验。'); }
  if (draft.answers.catchup !== 'plan') actions.push('对照两个专业的培养方案列出差异课、先修课与每周补修时间；向学院确认学分认定。');
  if (['limited', 'uncertain', 'unknown'].includes(draft.answers.resources)) { concerns.push('新增时间、费用或资源余量尚未形成可执行安排。'); actions.push('核对是否降级、延毕和新增费用，与能提供支持的人讨论可承受边界；无需在网站提交具体收入。'); }
  if (draft.answers.motive === 'reputation') concerns.push('当前动机较依赖“热门”等外部评价，需要用实际课程和岗位任务再次核对。');
  if (['none', 'deadline'].includes(draft.answers.fallback)) actions.push('写一份没转成也能执行的备选计划，例如相关选修、项目或交叉学习；先核实本校是否提供。');
  if (['different', 'alone', 'unknown'].includes(draft.answers.support)) actions.push('带着具体差异课程、成本与疑问去找学院老师讨论；把意见分歧落实到可核实的问题。');
  if (!actions.length) actions.push('用一周再做一次目标专业的实际任务，并带着课程、政策和成本清单咨询学院；按当年正式通知准备，不将本结果视为录取承诺。');
  const supports = dimensions.filter(d => d.known > 0 && d.delta !== 0).map(d => `${d.name}：已了解的 ${d.known}/4 组中，你对${d.delta > 0 ? '目标' : '当前'}专业的自评更高${d.known < 4 ? '，仍有信息待补齐' : ''}。`);
  if (!supports.length) supports.push(known ? '已了解的比较项没有呈现清晰差异；相近分数不代表两个专业完全相同。' : '暂时没有足够的成对信息，不能形成专业匹配比较。');
  return { kind, title, dimensions, balance, lower, upper, sensitivityLow, sensitivityHigh, known, missing, currentMean: known ? currentSum / known : null, targetMean: known ? targetSum / known : null, gaps, blocked, costBlocked, concerns, actions, supports, labels: { current: '当前专业', target: '计划转入专业' } };
}
