import { mountTransfer } from './transfer/ui.js';
import { normalizeCareerDraft } from './career-draft.js';
const app = document.querySelector('#app');
const questions = await fetch('./questions.json').then((response) => response.json());
const HOLLAND = ['R', 'I', 'A', 'S', 'E', 'C'];
const VALUES = ['stability', 'achievement', 'income', 'freedom', 'social'];
const labels = { R: '实用型', I: '研究型', A: '艺术型', S: '社会型', E: '企业型', C: '常规型', stability: '稳定感', achievement: '成长成就', income: '收入回报', freedom: '自主自由', social: '社会贡献' };
// v3 starts a clean assessment session so a legacy v2 draft can never look like
// a freshly selected set of answers. New answers are still saved on this device.
const draftKey = 'career-assessment-v3-draft';
const routeGuides = {
  就业派: { title: '先看就业派实战打法', body: '实习、考证、项目和求职能力，到底该怎么排优先级？先把容易浪费时间的坑避开。', action: '观看《就业全攻略》→', url: 'https://v.douyin.com/ovsK9HCTinU/' },
  升学派: { title: '先看升学派实战打法', body: '保研、考研、留学不是简单三选一。先看大学四年该怎样安排绩点、英语、竞赛和实践。', action: '观看《升学全攻略》→', url: 'https://v.douyin.com/UAUFUXMFaOA/' },
  体制派: { title: '先看体制派实战打法', body: '入党、选调、国省考、考编、央国企可以怎样同步准备？先把长期路径理顺。', action: '观看《体制全攻略》→', url: 'https://v.douyin.com/ZoYFMD_qqqA/' },
};

let index = 0;
let answers = Array.from({ length: questions.length }, () => []);
let disposeHomeMotion = () => {};
let disposeTransfer = null;
let careerAdvancing = false;
let careerTimer;
let careerStorageUnavailable = false;
function clearHomeMotion() { disposeHomeMotion(); disposeHomeMotion = () => {}; }

try {
  const draft = JSON.parse(localStorage.getItem(draftKey) || 'null');
  const normalized = normalizeCareerDraft(draft, questions);
  answers = normalized.answers;
  index = normalized.index;
} catch { careerStorageUnavailable = true; }

const save = () => { try { localStorage.setItem(draftKey, JSON.stringify({ index, answers })); careerStorageUnavailable = false; } catch { careerStorageUnavailable = true; } };
const incompleteIndexes = () => answers.flatMap((answer, item) => answer.length ? [] : [item]);
const header = () => `<header class="site-header"><a class="brand" href="#home"><img src="./panda-avatar.png" alt="老熊猫头像"><span><b>老熊猫大学路线图</b><small>前大学辅导员 · 大学规划陪跑</small></span></a><nav aria-label="网站导航"><a href="#home">首页</a><a href="#transfer-section" data-scroll-transfer>转专业助手</a></nav></header>`;

function home() {
  clearHomeMotion();
  app.innerHTML = `<main class="education-home">${header()}
    <section class="education-hero"><div class="education-copy motion-hero-copy"><p class="education-kicker">老熊猫大学路线图</p><h1>大学开始前，方向先想明白。</h1><p class="education-lede">前大学辅导员老熊猫，陪你从真实选择里，看清适合自己的大学节奏与发展方向。</p><button class="education-cta" id="start" data-page-transition data-transition-href="test" data-transition-copy="老熊猫正在打开大学路线图测评">用15分钟，生成我的大学路线图 <span aria-hidden="true">→</span></button><ul class="education-benefits" aria-label="完成测评后你将获得"><li>看懂自己的三条路线倾向</li><li>拿到下一步可执行的方向</li><li>进入粉丝群领取对应规划资料</li></ul><p class="education-note">48 道情境题，答案仅保存在这台设备；中途退出，下次可继续。</p></div><figure class="education-portrait motion-portrait"><img src="./panda-home-study.png" alt="老熊猫在校园阅览室认真写下大学规划"><figcaption>把每一步想清楚，再稳稳出发。</figcaption></figure></section>
    <section class="education-transfer-screen motion-intro" id="transfer-section" aria-labelledby="transfer-title"><div class="education-transfer-copy"><p class="education-section-kicker">第二步 · 转专业助手</p><h2 id="transfer-title">想转专业？<br>先做一次认真比较。</h2><p>填入你正在读的专业和已经想好的目标专业，把学习体验、个人适配、学校政策与现实代价放在一起比较。</p><a class="education-cta" href="#transfer" data-page-transition data-transition-href="transfer" data-transition-copy="老熊猫正在打开转专业助手">用15分钟，判断转专业优劣 <span aria-hidden="true">→</span></a><small>得到的是一份倾向建议，不替你拍板，也不承诺转专业结果。</small></div><div class="education-transfer-points" aria-label="转专业助手会帮你完成的比较"><article><span>01</span><div><b>比较两边是否适合</b><p>同一组问题分别评价当前专业与目标专业，不靠一时冲动。</p></div></article><article><span>02</span><div><b>把学校政策单独核对</b><p>能不能转、什么时候转、是否降级，未知项会明确提醒你去教务处查。</p></div></article><article><span>03</span><div><b>看见收益，也看见代价</b><p>结果会说明更值得继续验证的方向，以及下一步该补什么信息。</p></div></article></div></section>
    <section class="education-contact motion-resource" aria-labelledby="contact-title"><div class="education-contact-copy"><p class="education-section-kicker">第三步 · 继续和老熊猫聊</p><h2 id="contact-title">大学里的新问题，<br>不用一个人硬猜。</h2><p>测完以后，保存二维码，用抖音扫一扫进入免费公开群。老熊猫会持续分享选课、转专业、升学、就业和体制规划内容。</p><dl class="education-contact-list"><div><dt>抖音</dt><dd><a href="https://v.douyin.com/4Dh6ZKeHj50/" target="_blank" rel="noopener noreferrer">老熊猫 ↗</a></dd></div><div><dt>小红书</dt><dd>搜索“辅导员老熊猫”</dd></div><div><dt>粉丝群</dt><dd>🐼高校生存指南2群 · 443950191034</dd></div></dl><small>公开群免费交流；老熊猫日常工作较多，消息可能不能及时回复。</small></div><figure class="education-contact-qr"><img src="./douyin-fan-group-2-qr.jpg" alt="抖音高校生存指南2群二维码，群号443950191034"><figcaption>保存图片后，打开抖音搜索页扫一扫</figcaption></figure></section>
    <div class="education-page-transition" aria-hidden="true" role="status" aria-live="polite"><div><img src="./panda-avatar.png" alt="老熊猫头像"><p data-transition-message>老熊猫正在打开测评</p><i aria-hidden="true"></i></div></div>
    <footer>本测评用于职业探索与自我反思，不是临床心理诊断；结果仅供参考，不构成志愿填报或职业选择的唯一依据。</footer></main>`;
  document.querySelector('[data-scroll-transfer]').onclick = (event) => { event.preventDefault(); document.querySelector('#transfer-section').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' }); };
  document.querySelectorAll('[data-page-transition]').forEach((target) => target.onclick = (event) => {
    event.preventDefault();
    if (target.id === 'start') { index = incompleteIndexes()[0] ?? 0; save(); }
    const overlay = document.querySelector('.education-page-transition');
    overlay.querySelector('[data-transition-message]').textContent = target.dataset.transitionCopy || '老熊猫正在打开测评';
    overlay.classList.add('is-active'); overlay.setAttribute('aria-hidden', 'false');
    setTimeout(() => { location.hash = target.dataset.transitionHref; }, matchMedia('(prefers-reduced-motion: reduce)').matches ? 300 : 460);
  });
  document.querySelector('.education-home').setAttribute('data-home-ready', 'true');
  initHomeMotion();
}

function initHomeMotion() {
  if (!window.gsap || !window.ScrollTrigger || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const { gsap, ScrollTrigger } = window;
  gsap.registerPlugin(ScrollTrigger);
  const context = gsap.context(() => {
    gsap.fromTo('.motion-hero-copy', { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: .72, ease: 'power2.out' });
    gsap.fromTo('.motion-portrait', { autoAlpha: 0, y: 22 }, { autoAlpha: 1, y: 0, duration: .86, delay: .08, ease: 'power2.out' });
    gsap.fromTo('.motion-intro', { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: .62, ease: 'power2.out', scrollTrigger: { trigger: '.motion-intro', start: 'top 78%', toggleActions: 'play none none reverse' } });
    gsap.fromTo('.motion-resource', { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: .58, ease: 'power2.out', scrollTrigger: { trigger: '.motion-resource', start: 'top 78%', toggleActions: 'play none none reverse' } });
  }, app);
  disposeHomeMotion = () => context.revert();
}

function stageFeedback(completed) {
  if (!completed || completed % 12) return '';
  return `<p class="stage-feedback" role="status">你已经完成 ${Math.round(completed / questions.length * 100)}%，方向正在变得更清楚。</p>`;
}

function test() {
  careerAdvancing = false;
  const question = questions[index];
  const multiple = question.type === 'multiple';
  const selected = answers[index];
  const last = index === questions.length - 1;
  const completed = answers.filter((answer) => answer.length).length;
  const action = last ? (selected.length ? '<button class="primary small" id="next">提交测评，开始解读 →</button>' : '<span class="answer-note">选择后即可提交</span>') : multiple ? `<button class="primary small" id="next" ${selected.length ? '' : 'disabled'}>下一题 →</button>` : '<span class="answer-note">没有标准答案</span>';
  app.innerHTML = `<main class="assessment-shell"><div class="assessment-top"><span>老熊猫陪你梳理方向</span><span>${index + 1} / ${questions.length}</span></div><div class="progress" role="progressbar" aria-label="测评答题进度" aria-valuemin="1" aria-valuemax="${questions.length}" aria-valuenow="${index + 1}" aria-valuetext="第 ${index + 1} 题，共 ${questions.length} 题"><i style="width:${(index + 1) / questions.length * 100}%"></i></div>${stageFeedback(completed)}<p class="answer-storage">当前已答 ${completed} / ${questions.length} 题 · 答案仅保存在这台设备；中途退出，下次可继续。</p><p class="question-kind">${multiple ? `情境选择 · 可多选，最多 ${question.maxSelections || 2} 项` : '情境选择 · 每题选最接近你的反应'}</p><h1>${question.text}</h1><div class="options">${question.options.map((option, item) => `<button type="button" class="choice ${selected.includes(item) ? 'selected' : ''}" aria-pressed="${selected.includes(item)}" data-item="${item}"><span>${'ABCD'[item]}</span>${option.label}</button>`).join('')}</div><div class="assessment-bottom"><button type="button" class="text-button" id="back" ${index ? '' : 'disabled'}>← 上一题</button>${action}</div></main>`;
  if (careerStorageUnavailable) document.querySelector('.answer-storage').textContent = `当前已答 ${completed} / ${questions.length} 题；此浏览器无法保存草稿，刷新或关闭可能丢失答案。`;
  document.querySelectorAll('.choice').forEach((button) => button.onclick = () => {
    if (careerAdvancing) return;
    const item = Number(button.dataset.item);
    if (multiple) {
      if (selected.includes(item)) answers[index] = selected.filter((choice) => choice !== item);
      else if (selected.length < (question.maxSelections || 2)) answers[index] = [...selected, item];
      save(); test();
    } else {
      answers[index] = [item];
      save();
      if (last) test();
      else { careerAdvancing = true; document.querySelectorAll('.choice').forEach(el => { el.disabled = true; }); index += 1; save(); careerTimer = setTimeout(test, 160); }
    }
  });
  document.querySelector('#back').onclick = () => { if (careerAdvancing) return; if (index) { index -= 1; save(); test(); } };
  const nextButton = document.querySelector('#next');
  if (nextButton) nextButton.onclick = () => {
    if (!answers[index].length) return;
    if (last) analyze(); else { index += 1; save(); test(); }
  };
}

function analyze() {
  const missing = incompleteIndexes();
  if (missing.length) { index = missing[0]; save(); if (location.hash === '#test') test(); else location.hash = 'test'; return; }
  app.innerHTML = `<main class="result-transition" role="status" aria-live="polite"><p>正在生成你的大学路线图…</p></main>`;
  careerTimer = setTimeout(() => { location.hash = 'results'; }, 360);
}

function calculate() {
  const raw = {};
  answers.forEach((picked, questionIndex) => picked.forEach((optionIndex) => Object.entries(questions[questionIndex].options[optionIndex].scores).forEach(([key, value]) => raw[key] = (raw[key] || 0) + value)));
  const scores = (keys) => Object.fromEntries(keys.map((key) => {
    const max = questions.reduce((total, question) => total + Math.max(...question.options.map((option) => option.scores[key] || 0)), 0);
    return [key, Math.round((raw[key] || 0) / max * 100)];
  }));
  const hollandScores = scores(HOLLAND); const valueScores = scores(VALUES); const code = [...HOLLAND].sort((a, b) => hollandScores[b] - hollandScores[a]).slice(0, 3).join(''); const rank = [...VALUES].sort((a, b) => valueScores[b] - valueScores[a]);
  const faction = valueScores.stability >= valueScores.achievement && valueScores.stability >= valueScores.income && valueScores.freedom <= valueScores.stability ? '体制派' : valueScores.income >= valueScores.achievement || (valueScores.income + valueScores.achievement >= 100 && valueScores.stability < valueScores.income) ? '就业派' : '升学派';
  return { hollandScores, code, rank, faction };
}

function incompleteResult() {
  const missing = incompleteIndexes();
  app.innerHTML = `<main class="results incomplete-results"><div class="result-top"><a href="#home" class="result-brand">老熊猫大学路线图</a><span>测评未完成</span></div><section class="incomplete-card"><p>还不能生成结果</p><h1>你还差 ${missing.length} 题，完成后才能生成大学路线图。</h1><button type="button" class="primary" id="continue-test">继续完成测评 →</button></section></main>`;
  document.querySelector('#continue-test').onclick = () => { index = missing[0]; save(); location.hash = 'test'; };
}

function result() {
  const missing = incompleteIndexes();
  if (missing.length) { incompleteResult(); return; }
  const report = calculate();
  const theme = report.faction === '就业派' ? 'work' : report.faction === '体制派' ? 'stable' : 'study';
  const description = { 升学派: '你对成长和更高的平台有明确期待。先建立稳定学习节奏，再用研究、项目和实践持续验证兴趣。', 就业派: '你重视能力转化和真实世界的反馈。尽早用项目、实习和行业访谈验证方向，把可复用能力积累成作品。', 体制派: '你看重稳定、秩序和长期投入。提前了解具体路径，同时把专业基本功、表达和实践打牢。' }[report.faction];
  const guide = routeGuides[report.faction];
  app.innerHTML = `<main class="results"><div class="result-top"><a href="#home" class="result-brand">老熊猫大学路线图</a><span>你的测评结果</span></div><section class="faction-card ${theme}"><p>你的发展倾向</p><h1>${report.faction}</h1><span>${report.faction === '升学派' ? '越学越有底气' : report.faction === '就业派' ? '在实践中把能力变现' : '在稳定中建立长期优势'}</span></section><section class="result-section"><p class="eyebrow">你的兴趣偏好</p><h2>${report.code}</h2><p>${[...report.code].map((key) => labels[key]).join(' · ')}。结果来自行为情境、兴趣活动和价值排序的综合画像，不是人格标签。</p><div class="bars">${Object.entries(report.hollandScores).map(([key, value]) => `<div><span>${key}</span><i><b style="width:${value}%"></b></i><em>${value}</em></div>`).join('')}</div></section><section class="result-section"><p class="eyebrow">你接下来可以怎么做</p><h2>适合你的发展节奏</h2><p>${description}</p><div class="values">${report.rank.slice(0, 3).map((key, item) => `<span><b>TOP ${item + 1}</b>${labels[key]}</span>`).join('')}</div></section><section class="result-action"><p class="eyebrow">接下来，先走这一步</p><h2>${guide.title}</h2><p>${guide.body}</p><a class="route-video-button" href="${guide.url}" target="_blank" rel="noopener noreferrer">${guide.action}</a></section><section class="fan-group" aria-labelledby="fan-group-title"><div class="fan-group-copy"><p class="eyebrow">进粉丝群领取资料</p><h2 id="fan-group-title">测完别让结果躺着，进群领取大学规划资料</h2><p>老熊猫会在抖音粉丝群持续更新新生核验、选课、升学、就业和体制规划资料。先保存二维码，再打开抖音扫一扫进群。</p><ol><li>保存二维码到相册</li><li>打开抖音搜索页扫一扫</li><li>加入“🐼高校生存指南2群”</li></ol><small>如二维码暂时无法使用，请回老熊猫抖音主页查看最新入群入口。</small></div><img src="./douyin-fan-group-2-qr.jpg" alt="加入老熊猫抖音粉丝群“高校生存指南2群”的二维码，请保存后用抖音扫一扫" width="840" height="1107"></section><p class="result-refresh-note">结果不是永久标签。这反映的是你此刻更适合的起步方式，第一学期后也可以重新测一次。</p><p class="disclaimer">本测评用于职业探索与自我反思，不是临床心理诊断；结果仅供参考，不构成志愿填报或职业选择的唯一依据。</p></main>`;
}

function route() {
  clearTimeout(careerTimer); careerAdvancing = false;
  if (location.hash === '#transfer' || location.hash.startsWith('#transfer/')) {
    clearHomeMotion();
    if (!disposeTransfer) disposeTransfer = mountTransfer(app, { homeHref: '#home', assessmentHref: '#test', assetBase: './', avatarName: 'panda-avatar.png' });
    return;
  }
  if (disposeTransfer) { disposeTransfer(); disposeTransfer = null; }
  document.title = '老熊猫大学路线图｜升学·体制·就业';
  if (location.hash === '#test') { clearHomeMotion(); test(); }
  else if (location.hash === '#results') { clearHomeMotion(); result(); }
  else home();
}
addEventListener('hashchange', route); route();
