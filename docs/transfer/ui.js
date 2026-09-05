import { QUESTIONS, DIMENSIONS, RATINGS, POLICIES, POLICY_OPTIONS } from './questions.js';
import { STORAGE_KEY, LINKS, emptyDraft, normalizeDraft, completion, firstMissing, answered, canReport, calculateReport, escapeHTML as esc } from './core.js';
import { makeShareImage, reportText } from './share.js';

/** Mount the same isolated feature in both the React site and the static preview. */
export function mountTransfer(root, options = {}) {
  const { homeHref = '/', assessmentHref = '/assessment', assetBase = '/', avatarName = 'panda/avatar.png' } = options;
  let draft = emptyDraft();
  let storageError = false;
  let saveStatus = '';
  let disposed = false;
  let previewUrl = '';
  let advanceTimer = null;
  const controller = new AbortController();
  const signal = controller.signal;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) { draft = normalizeDraft(JSON.parse(raw)); saveStatus = draft.updatedAt ? '已恢复这台设备上的草稿' : ''; }
  } catch { storageError = true; }

  const asset = name => `${assetBase}${name}`;
  const link = (url, title, cls = '') => `<a class="${cls}" href="${esc(url)}" target="_blank" rel="noopener noreferrer">${title}<span class="transfer-sr">（新窗口打开）</span></a>`;
  const button = (action, title, cls = 'transfer-btn', attrs = '') => `<button type="button" class="${cls}" data-action="${action}" ${attrs}>${title}</button>`;
  const completed = () => completion(draft);
  const localNote = () => storageError ? '当前浏览器无法保存草稿；离开或刷新可能丢失本次答案。' : '答案仅保存在这台设备的当前浏览器，不会自动发给老熊猫；中途退出，下次可继续。';
  function save() {
    draft.updatedAt = new Date().toISOString();
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(draft)); storageError = false; saveStatus = '已保存在这台设备'; }
    catch { storageError = true; saveStatus = '暂时无法保存，请勿关闭此页'; }
    const note = root.querySelector('[data-local-note]'); if (note) note.textContent = localNote();
    const status = root.querySelector('[data-save-status]'); if (status) status.textContent = saveStatus;
  }
  function cancelAdvance() { clearTimeout(advanceTimer); advanceTimer = null; }
  function go(path) { cancelAdvance(); const hash = `#transfer${path ? `/${path}` : ''}`; if (location.hash === hash) render(); else location.hash = hash; }
  function path() { return location.hash.startsWith('#transfer/') ? location.hash.slice(10) : ''; }
  const infoList = items => `<ul class="transfer-list">${items.map(item => `<li>${esc(item)}</li>`).join('')}</ul>`;
  function shell(body, step = 0) {
    return `<div class="transfer-shell"><header class="transfer-header"><a href="${homeHref}" class="transfer-brand"><img src="${asset(avatarName)}" width="44" height="44" alt="老熊猫头像"><span>老熊猫大学路线图<small>前大学辅导员 · 大学规划陪跑</small></span></a><nav aria-label="网站导航"><a href="${homeHref}">首页</a><a href="${assessmentHref}">大学路线测评</a></nav></header>
    <main class="transfer-main"><nav class="transfer-steps" aria-label="转专业梳理步骤">${['查培养方案', '核实信息', '对照作答', '探索建议'].map((label, i) => `<span ${step === i ? 'aria-current="step"' : ''}><b>0${i + 1}</b> ${label}</span>`).join('')}</nav>${body}</main>
    <footer class="transfer-footer"><p>这是一份探索工具，不是经标准化验证的心理测验。结果不代表转入资格、录取概率、就业或深造承诺。</p><p data-local-note>${localNote()}</p><span class="transfer-save" data-save-status role="status">${esc(saveStatus)}</span></footer></div>`;
  }
  function intro() {
    return shell(`<section class="transfer-intro"><p class="transfer-eyebrow">转专业决策助手 · 本科版</p><h1>想换一个专业，<br><em>先把理由想清楚。</em></h1><p class="transfer-lede">不用在网站填写专业名称。先查本校培养方案，再梳理兴趣、真实体验与政策边界。约 15 分钟，得到一份可以带去咨询的探索清单。</p>
    <div class="transfer-facts"><span>32 组对照与情境问题</span><span>只给倾向，不替你拍板</span><span>不需要姓名或联系方式</span></div>
    <div class="transfer-actions">${button('begin', completed() ? `继续我的梳理 · 已完成 ${completed()}/${QUESTIONS.length}` : '开始转专业梳理 →')}</div><p class="transfer-caption">适合已确定目标专业的本科生。还没想好转什么的同学，可以先做<a href="${assessmentHref}">大学路线测评</a>。</p>
    <div class="transfer-intro-grid"><article><span>01</span><h2>先查培养方案</h2><p>到本校教务处或学院官网，分别查看两个专业的本科培养方案。</p></article><article><span>02</span><h2>把未知留出来</h2><p>不知道政策或没体验过，可以如实记录，不会被算成低分。</p></article><article><span>03</span><h2>带着问题去行动</h2><p>看清下一步该查什么、试什么，再去讨论转专业。</p></article></div></section>`);
  }
  function policy() {
    return shell(`<section><p class="transfer-eyebrow">01 / 先查培养方案，再核实政策</p><h1>专业介绍，请以本校为准。</h1><p class="transfer-lede">本站不提供专业目录、课程介绍或通用专业对比。请到<strong>本校教务处或学院官网</strong>，分别查阅你正在读的专业和计划转入专业的本科培养方案。</p><aside class="transfer-notice"><h2>先查这几项</h2>${infoList(['核心课程与典型作业：是不是你愿意长期投入的学习内容', '先修课、学分认定和补修安排：转入后实际要补什么', '毕业要求、实践环节与学制：是否可能影响完成学业的节奏', '本校当年转专业通知：转出、转入资格、窗口、名额和选拔方式'])}<p>还没查到？可以先跳过。未知不会被算成不符合，但结果会保留“待核实”标记。</p></aside><div class="transfer-policy-list">${POLICIES.map(p => `<label class="transfer-policy"><span><b>${esc(p.title)}</b><small>${esc(p.prompt)}</small></span><select data-policy="${p.id}" aria-label="${esc(p.title)}"><option value="unknown">未核实</option>${(p.options || POLICY_OPTIONS).filter(([value]) => value !== 'unknown').map(([value, label]) => `<option value="${value}" ${draft.policy[p.id] === value ? 'selected' : ''}>${label}</option>`).join('')}</select></label>`).join('')}</div>
    <label class="transfer-note-label">留给自己的政策笔记（可选，仅保存在本机）<textarea data-policy-note maxlength="800" rows="3" placeholder="例如：两个培养方案的链接、通知年份、申请截止日期；请勿填写身份证或联系方式。">${esc(draft.policyNote)}</textarea></label><div class="transfer-actions">${button('questions', canReport(draft) ? '更新核实情况，返回探索建议 →' : '保存核实情况，开始对照作答 →')}${button('skip-policy', '暂时跳过未核实项', 'transfer-link')}</div><p class="transfer-caption">可直接关闭页面去查资料，回来后继续。若课程未开始，优先做入门体验再作答。</p></section>`, 1);
  }
  function survey(index) {
    const q = QUESTIONS[index];
    const value = draft.answers[q.id];
    const count = completed();
    const group = DIMENSIONS.find(d => d.id === q.dimension);
    return shell(`<section class="transfer-survey"><div class="transfer-progress-meta"><p>${q.type === 'pair' ? esc(group.name) : '现实条件与证据'}</p><span>第 ${index + 1} / ${QUESTIONS.length} 组 · 已完成 <span data-count>${count}</span> 组</span></div><div class="transfer-progress" role="progressbar" aria-label="转专业梳理已完成题数" aria-valuemin="0" aria-valuemax="${QUESTIONS.length}" aria-valuenow="${count}" aria-valuetext="已完成 ${count} 组，共 ${QUESTIONS.length} 组"><span style="width:${count / QUESTIONS.length * 100}%"></span></div>
    <p class="transfer-stage" role="status" data-stage>${stage(count)}</p><h1 class="transfer-question" tabindex="-1">${esc(q.text)}</h1><p>${q.type === 'pair' ? '请分别评价两个专业。依据实际经历，不了解就如实选“还不了解 / 未体验”。' : '选择最接近你目前情况的一项；没有标准答案。'}</p>
    ${q.type === 'pair' ? `<div class="transfer-two transfer-answer-pair">${['current', 'target'].map(side => `<fieldset><legend>${side === 'current' ? '你正在读的专业' : '你计划转入的专业'}</legend><div class="transfer-rating-list">${RATINGS.map(([rating, label]) => `<label class="transfer-option"><input type="radio" name="${q.id}-${side}" data-answer="${q.id}" data-side="${side}" value="${rating}" ${value?.[side] === rating ? 'checked' : ''}><span>${label}</span></label>`).join('')}</div></fieldset>`).join('')}</div>` : `<fieldset class="transfer-context"><legend class="transfer-sr">${esc(q.text)}</legend>${q.options.map(o => `<label class="transfer-option"><input type="radio" name="${q.id}" data-answer="${q.id}" value="${o.id}" ${value === o.id ? 'checked' : ''}><span>${esc(o.label)}${o.note ? `<small>${esc(o.note)}</small>` : ''}</span></label>`).join('')}</fieldset>`}
    <div class="transfer-survey-controls">${button(index ? 'prev' : 'policy', index ? '← 上一组' : '← 核对政策', 'transfer-link', `data-index="${index}"`)}${button(index === QUESTIONS.length - 1 ? 'submit' : 'next', index === QUESTIONS.length - 1 ? '生成我的探索建议 →' : '下一组 →', 'transfer-btn', `data-index="${index}" data-next ${answered(q, value) ? '' : 'disabled'}`)}</div><p class="transfer-caption" data-answer-hint role="status">${answered(q, value) ? '已记录，可以继续，也可以修改。' : q.type === 'pair' ? '两个专业都选择后会自动进入下一组；也可以选择“还不了解 / 未体验”。' : index === QUESTIONS.length - 1 ? '选择后会自动检查作答完整性，进入探索建议。' : '选择一项后会自动进入下一组；之后可返回修改。'}</p><details class="transfer-answer-nav"><summary>查看完成情况 / 跳到某一组</summary><div>${QUESTIONS.map((item, i) => `<button type="button" data-action="jump" data-index="${i}" class="${answered(item, draft.answers[item.id]) ? 'is-done' : ''}" ${i === index ? 'aria-current="step"' : ''} aria-label="第 ${i + 1} 组，${answered(item, draft.answers[item.id]) ? '已完成' : '未完成'}">${i + 1}</button>`).join('')}</div></details></section>`, 2);
  }
  function stage(count) {
    if (!count) return '从第一组开始，按真实情况作答就好。';
    if (count === QUESTIONS.length) return '全部作答已记录。核对后提交，才会生成探索建议。';
    if (count >= 24) return '对照作答已逐步记录，接下来也看看现实条件。';
    if (count >= 12) return '你已完成一段梳理，记得把不确定的地方如实留下。';
    return '每一组都可以返回修改，不需要急着给自己下结论。';
  }
  function guard() {
    const remaining = QUESTIONS.length - completed();
    return shell(`<section class="transfer-panel"><p class="transfer-eyebrow">还不能生成建议</p><h1>你还差 ${remaining} 组问题。</h1><p>完成后才能生成转专业探索建议。未完成时，不生成分数或专业倾向。</p>${button('resume', '继续完成梳理 →')}</section>`, 2);
  }
  function report() {
    const r = calculateReport(draft);
    if (!r) return guard();
    const fmt = value => value === null ? '暂无可比信息' : value.toFixed(1);
    return shell(`<section class="transfer-report"><div class="transfer-result-brand"><div><p class="transfer-eyebrow">老熊猫大学路线图 · 本科转专业助手</p><p class="transfer-brand-note">认真听你的选择，<br>陪你把下一步想清楚。</p></div><img src="${asset('panda-transfer-brand.png')}" width="160" height="160" alt="老熊猫听劝形象：头顶竹子、穿蓝色开衫，手持记下来笔记本"></div><p class="transfer-eyebrow">04 / 你的转专业探索建议</p><p class="transfer-caption">填写记录：${esc(draft.updatedAt ? new Date(draft.updatedAt).toLocaleString('zh-CN', { hour12: false }) : '本次填写')} · 政策状态为本人自述</p><p class="transfer-pair-title">你正在读的专业 <span aria-hidden="true">→</span> 你计划转入的专业</p><h1>${r.title}</h1><p class="transfer-lede">这反映的是你此刻的自评与已核实信息，不是永久标签，更不是“必须转”或“不能转”的决定。完成新的课程体验后，可以回来更新。</p>
    <aside class="transfer-notice ${r.blocked ? 'transfer-warning' : ''}"><h2>${r.blocked ? '先处理资格限制' : r.gaps.length ? '政策仍有待核实项' : '政策状态来自你的填写'}</h2><p>${r.blocked ? '你填报目前不符合转出或转入资格。本页的兴趣比较不能抵消学校限制，请先向教务处核实。' : '网站没有核验你所在学校的政策，不能确认你具备转入资格；最终以本校当年正式通知和学院解释为准。'}</p>${r.gaps.length ? `<p>尚需核实：${esc(r.gaps.join('、'))}。</p>` : ''}${button('policy', '补充 / 修改政策核实情况', 'transfer-link')}</aside>
    <section class="transfer-report-section"><p class="transfer-eyebrow">把感受放在同一把尺子上</p><h2>六个维度，分别看。</h2><p>0–4 分为你的符合程度自评，不是能力等级。只对照两边都已了解的同一组问题；未知不记为 0 分。</p><div class="transfer-score-head"><span>对照维度</span><span>当前专业</span><span>目标专业</span></div>${r.dimensions.map(d => `<div class="transfer-score-row"><div><b>${esc(d.name)}</b><small>可比 ${d.known} / ${d.total} 组</small></div><span>${fmt(d.current)}</span><span>${fmt(d.target)}</span></div>`).join('')}
    <div class="transfer-balance"><span>已知项比较差值</span><b>${r.balance === null ? '暂不计算' : `${r.balance > 0 ? '+' : ''}${r.balance.toFixed(1)}`}</b><p>正值代表当前自评更偏向目标专业，负值更偏向当前专业。范围 −100 至 +100；<strong>不是成功率或适合百分比</strong>。已知 ${r.known}/24 组${r.missing ? `，剩余未知取极端情况时，总体差值可能在 ${r.lower.toFixed(1)} 至 ${r.upper.toFixed(1)} 之间` : ''}。</p></div>
    <p class="transfer-caption">权重试算：将各维度权重分别取等权基准的 0.5 倍或 2 倍，64 种组合与未知边界下，差值范围为 ${r.sensitivityLow.toFixed(1)} 至 ${r.sensitivityHigh.toFixed(1)}。跨过 0 说明侧重点改变可能影响倾向，应优先讨论取舍。</p><details class="transfer-method"><summary>这些建议是怎样得出的？</summary><p>24 组同题对照分为 6 个维度，每维 4 组，等权比较。维度分 = 两边均已了解的对应题自评平均值；比较差值 = Σ（目标 − 当前）÷（可比组数 × 4）× 100。</p><p>未知项按可能的最小 / 最大差异形成区间，不补零、不猜测。若未知可能改变比较方向，或两边缺少亲身任务体验，优先给出“补充信息与体验”。已知差异相近或权重试算可能改变方向时提醒取舍，不设一条通用的转专业分数线。</p><p>这是老熊猫的自我探索框架，不是权威转专业公式，也未经常模、信效度验证。等权、证据门槛和提示规则是透明的产品设计选择，不能用于录取、诊断或替代专业咨询。政策、时间与费用单独提示，不能靠兴趣高分抵消。</p></details></section>
    <div class="transfer-two transfer-report-columns"><section><h2>从答案中看见的线索</h2>${infoList(r.supports)}</section><section><h2>先别忽略这些顾虑</h2>${infoList(r.concerns.length ? r.concerns : ['暂未从这份自评中发现额外提醒，不代表没有风险。仍应核对培养方案、选拔规则及成本。'])}</section></div>
    <section class="transfer-report-section"><p class="transfer-eyebrow">先行动，再决定</p><h2>接下来，可以这样核实。</h2><ol class="transfer-action-list">${r.actions.map(a => `<li>${esc(a)}</li>`).join('')}</ol></section>
    <section class="transfer-share"><div><h2>把摘要带去讨论</h2><p>卡片只包含探索倾向与核实项，不包含专业名称、政策笔记、姓名、联系方式或家庭财务信息。</p></div><div class="transfer-actions">${button('share-image', '保存结果卡片', 'transfer-btn')}${button('copy-report', '复制文字摘要', 'transfer-link')}</div><p role="status" data-share-status></p><div data-share-preview></div></section>
    <section class="transfer-video"><p class="transfer-eyebrow">接下来，先走这一步</p><h2>先听老熊猫讲清转专业的判断边界</h2><p>别只听一句“转”或“不转”。把学校政策、学习体验和代价放在一起，再讨论你的具体选择。</p>${link(LINKS.video, '观看《转专业前，先把这些事想清楚》→', 'transfer-btn')}</section>
    <section class="transfer-group"><div><p class="transfer-eyebrow">免费公开群 · 交流与答疑</p><h2>带着你的问题，<br>进群继续聊。</h2><p>加入“🐼高校生存指南2群”，领取规划资料、交流问题。公开群咨询免费；老熊猫平时工作较多，回复可能不及时，不承诺即时答复。</p><ol><li>保存二维码到相册</li><li>打开抖音搜索页扫一扫</li><li>加入“🐼高校生存指南2群”</li></ol><p>群号：443950191034</p><p class="transfer-caption">如二维码暂时无法使用，${link(LINKS.profile, '到老熊猫抖音主页查看最新入群入口')}。</p><a href="${asset('douyin-fan-group-2-qr.jpg')}" download="老熊猫-高校生存指南2群.jpg" class="transfer-link">保存完整群二维码 ↓</a></div><figure><img src="${asset('douyin-fan-group-2-qr.jpg')}" width="840" height="1107" alt="抖音高校生存指南2群完整入群二维码，群号443950191034，可保存后在抖音扫一扫" loading="lazy"><figcaption>手机可长按保存，不要裁剪二维码</figcaption></figure></section>
    <section class="transfer-membership"><h2>如果你需要更具体的 1v1 陪跑</h2><p>可到老熊猫抖音主页了解专属会员群（付费服务）。在抖音查看服务说明、价格并自主决定是否加入；加入后老熊猫会主动联系，沟通定制陪跑方案。网站不收款，也不会自动向群内发送你的答案。</p>${link(LINKS.profile, '到抖音主页了解专属会员群 →', 'transfer-link')}<p class="transfer-caption">是否加入不影响免费查看完整测评结果；服务不保证转专业、录取或就业结果。</p></section>
    <div class="transfer-actions">${button('review', '返回修改答案', 'transfer-link')}${button('reset-request', '清除本次转专业草稿', 'transfer-link')}<a class="transfer-link" href="${homeHref}">返回首页 →</a></div><div data-reset-confirm></div></section>`, 3);
  }

  function render() {
    cancelAdvance();
    if (disposed) return;
    let p = path();
    if (p === 'setup' || p === 'compare') p = 'policy';
    const n = /^questions\/(\d+)$/.exec(p);
    const index = n ? Math.min(QUESTIONS.length - 1, Math.max(0, Number(n[1]) - 1)) : 0;
    root.innerHTML = p === 'policy' ? policy() : p === 'report' ? report() : n ? survey(index) : intro();
    document.title = '转专业决策助手 · 老熊猫大学路线图';
    const heading = root.querySelector('h1'); if (heading) { heading.setAttribute('tabindex', '-1'); heading.focus({ preventScroll: true }); }
    window.scrollTo({ top: 0, behavior: 'instant' });
  }
  root.addEventListener('input', event => {
    if (event.target.hasAttribute('data-policy-note')) { draft.policyNote = event.target.value; save(); }
  }, { signal });
  root.addEventListener('change', event => {
    const target = event.target;
    if (target.dataset.policy) { draft.policy[target.dataset.policy] = target.value; save(); return; }
    const id = target.dataset.answer;
    if (!id) return;
    const q = QUESTIONS.find(item => item.id === id);
    if (!q) return;
    cancelAdvance();
    if (q.type === 'pair') { draft.answers[id] ||= {}; draft.answers[id][target.dataset.side] = target.value === 'unknown' ? 'unknown' : Number(target.value); }
    else draft.answers[id] = target.value;
    save();
    const count = completed();
    root.querySelector('[data-count]').textContent = count;
    const progress = root.querySelector('[role="progressbar"]');
    progress.setAttribute('aria-valuenow', count); progress.setAttribute('aria-valuetext', `已完成 ${count} 组，共 ${QUESTIONS.length} 组`);
    progress.firstElementChild.style.width = `${count / QUESTIONS.length * 100}%`;
    root.querySelector('[data-stage]').textContent = stage(count);
    root.querySelector('[data-next]').disabled = !answered(q, draft.answers[id]);
    root.querySelector('[data-answer-hint]').textContent = answered(q, draft.answers[id]) ? '已记录，可以继续，也可以修改。' : '两个专业都选择后才能继续。';
    const jump = root.querySelector(`[data-action="jump"][data-index="${QUESTIONS.indexOf(q)}"]`);
    jump.classList.toggle('is-done', answered(q, draft.answers[id]));
    jump.setAttribute('aria-label', `第 ${QUESTIONS.indexOf(q) + 1} 组，${answered(q, draft.answers[id]) ? '已完成' : '未完成'}`);
    if (answered(q, draft.answers[id])) {
      const index = QUESTIONS.indexOf(q);
      const last = index === QUESTIONS.length - 1;
      root.querySelector('[data-answer-hint]').textContent = last ? '已记录，正在检查作答完整性，即将查看探索建议。' : `${q.type === 'pair' ? '两边' : '选择'}已记录，即将进入下一组；之后可返回修改。`;
      const from = location.hash;
      advanceTimer = setTimeout(() => {
        // The report renderer checks every answer before calculating any result.
        if (!disposed && location.hash === from && answered(q, draft.answers[id])) go(last ? 'report' : `questions/${index + 2}`);
      }, 450);
    }
  }, { signal });
  root.addEventListener('click', async event => {
    const el = event.target.closest('[data-action]'); if (!el || !root.contains(el) || el.disabled) return;
    const action = el.dataset.action;
    const i = Number(el.dataset.index || 0);
    if (action === 'policy') go(action);
    else if (['begin', 'resume'].includes(action)) go(canReport(draft) ? 'report' : action === 'begin' && completed() === 0 ? 'policy' : `questions/${Math.max(0, firstMissing(draft)) + 1}`);
    else if (['questions', 'skip-policy'].includes(action)) { save(); go(canReport(draft) ? 'report' : `questions/${Math.max(0, firstMissing(draft)) + 1}`); }
    else if (action === 'prev') go(`questions/${i}`);
    else if (action === 'next' && answered(QUESTIONS[i], draft.answers[QUESTIONS[i].id])) go(`questions/${i + 2}`);
    else if (action === 'jump') go(`questions/${i + 1}`);
    else if (action === 'review') go('questions/1');
    else if (action === 'submit') { save(); go('report'); }
    else if (action === 'reset-request') root.querySelector('[data-reset-confirm]').innerHTML = `<aside class="transfer-notice"><p>只清除转专业助手在本机的草稿。原来的大学路线测评不受影响。确定清除吗？</p>${button('reset', '确定清除')}${button('cancel-reset', '取消', 'transfer-link')}</aside>`;
    else if (action === 'cancel-reset') root.querySelector('[data-reset-confirm]').innerHTML = '';
    else if (action === 'reset') { draft = emptyDraft(); save(); go('policy'); }
    else if (action === 'copy-report') {
      const text = reportText(calculateReport(draft));
      try { await navigator.clipboard.writeText(text); root.querySelector('[data-share-status]').textContent = '已复制摘要，可粘贴给老师或家人讨论。'; }
      catch { root.querySelector('[data-share-preview]').innerHTML = `<label>当前浏览器不能自动复制，请长按或选中以下文字复制。<textarea readonly rows="10">${esc(text)}</textarea></label>`; }
    } else if (action === 'share-image') {
      el.disabled = true;
      const status = root.querySelector('[data-share-status]'); status.textContent = '正在生成摘要卡片…';
      try {
        const blob = await makeShareImage(calculateReport(draft), asset('panda-transfer-brand.png'));
        if (disposed || !root.contains(status)) return;
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        previewUrl = URL.createObjectURL(blob);
        root.querySelector('[data-share-preview]').innerHTML = `<figure class="transfer-card-preview"><img src="${previewUrl}" alt="本次转专业探索摘要卡片，包含探索倾向和待核实项"><figcaption>可长按保存，或点击下方下载。</figcaption></figure><a class="transfer-link" href="${previewUrl}" download="老熊猫-转专业探索摘要.png">下载结果卡片 ↓</a>`;
        status.textContent = '卡片已生成。只包含上方说明的摘要信息。';
      } catch { if (root.contains(status)) status.textContent = '图片生成失败，可使用“复制文字摘要”。'; }
      finally { el.disabled = false; }
    }
  }, { signal });
  window.addEventListener('hashchange', render, { signal });
  render();
  return () => { disposed = true; cancelAdvance(); controller.abort(); if (previewUrl) URL.revokeObjectURL(previewUrl); };
}
