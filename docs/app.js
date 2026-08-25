const app = document.querySelector('#app');
const questions = await fetch('./questions.json').then((response) => response.json());
const HOLLAND = ['R', 'I', 'A', 'S', 'E', 'C'];
const VALUES = ['stability', 'achievement', 'income', 'freedom', 'social'];
const labels = { R: '实用型', I: '研究型', A: '艺术型', S: '社会型', E: '企业型', C: '常规型', stability: '稳定感', achievement: '成长成就', income: '收入回报', freedom: '自主自由', social: '社会贡献' };
const draftKey = 'career-assessment-v2-draft';
let index = 0;
let answers = Array.from({ length: questions.length }, () => []);

try {
  const draft = JSON.parse(localStorage.getItem(draftKey) || 'null');
  if (draft?.answers) {
    answers = Array.from({ length: questions.length }, (_, item) => draft.answers[item] || []);
    index = Math.min(draft.index || 0, questions.length - 1);
  }
} catch { localStorage.removeItem(draftKey); }

const save = () => localStorage.setItem(draftKey, JSON.stringify({ index, answers }));
const header = () => `<header class="site-header"><a class="brand" href="#home"><img src="./panda-avatar.png" alt="老熊猫"><span><b>老熊猫大学路线图</b><small>前大学辅导员 · 大学规划陪跑</small></span></a><nav><a href="#home">首页</a><a href="#resources">资料驿站</a></nav></header>`;

function home() {
  app.innerHTML = `<main class="noir-home">${header()}<section class="noir-hero"><img class="noir-hero-image" src="./panda-hero-noir.png" alt="拿着笔记本的老熊猫"><div class="noir-copy"><p class="noir-kicker"><i></i>OLD PANDA / COLLEGE ROADMAP</p><h1>大学这条路，<br><em>先看清，再出发。</em></h1><p>前大学辅导员老熊猫，陪你从兴趣、价值感与真实选择里，理清升学、体制、就业三条大学路线。</p><button class="primary noir-cta" id="start">开始我的测评 <span>→</span></button></div><div class="noir-index"><span>01</span><b>升学 · 体制 · 就业</b><span>为大学四年，先做一份清醒规划</span></div></section><section class="noir-statement"><p class="eyebrow">ONE QUESTION, THREE ROUTES</p><h2>不替你选择，<br>帮你看清自己该怎样选择。</h2><p>测评不问“你想不想考公、考研或就业”，而是从真实情境里，识别你在兴趣、成长、稳定与行动方式上的偏好。</p></section><section class="noir-routes"><article><span>01</span><h3>升学</h3><p>用课程、科研和长期能力，为更高的平台蓄力。</p></article><article><span>02</span><h3>体制</h3><p>把招录口径、岗位面与基本功，变成稳定选择。</p></article><article><span>03</span><h3>就业</h3><p>通过项目、实习与作品，让能力进入真实世界。</p></article></section><section class="resource-teaser" id="resources"><div><p class="eyebrow">老熊猫资料驿站 · 即将开放</p><h2>把有用的大学经验，留给真正需要的你。</h2><p>新生适应、选课规划、考研准备、求职与考公资料会陆续在这里更新；从抖音内容延伸到可下载、可反复使用的行动清单。</p></div><span>🐼</span></section><footer>本测评用于职业探索与自我反思，不是临床心理诊断；结果仅供参考，不构成志愿填报或职业选择的唯一依据。</footer></main>`;
  document.querySelector('#start').onclick = () => { index = 0; location.hash = 'test'; };
}

function test() {
  const question = questions[index]; const multiple = question.type === 'multiple'; const selected = answers[index]; const last = index === questions.length - 1;
  app.innerHTML = `<main class="assessment-shell"><div class="assessment-top"><span>老熊猫陪你梳理方向</span><span>${index + 1} / ${questions.length}</span></div><div class="progress"><i style="width:${(index + 1) / questions.length * 100}%"></i></div><p class="question-kind">${multiple ? `情境选择 · 可多选，最多 ${question.maxSelections || 2} 项` : '情境选择 · 每题选最接近你的反应'}</p><h1>${question.text}</h1><div class="options">${question.options.map((option, item) => `<button class="choice ${selected.includes(item) ? 'selected' : ''}" data-item="${item}"><span>${'ABCD'[item]}</span>${option.label}</button>`).join('')}</div><div class="assessment-bottom"><button class="text-button" id="back" ${index ? '' : 'disabled'}>← 上一题</button>${multiple ? `<button class="primary small" id="next" ${selected.length ? '' : 'disabled'}>下一题 →</button>` : last && selected.length ? '<button class="primary small" id="next">提交测评，开始解读 →</button>' : '<span class="answer-note">没有标准答案</span>'}</div></main>`;
  document.querySelectorAll('.choice').forEach((button) => button.onclick = () => {
    const item = Number(button.dataset.item);
    if (multiple) {
      if (selected.includes(item)) answers[index] = selected.filter((choice) => choice !== item);
      else if (selected.length < (question.maxSelections || 2)) answers[index] = [...selected, item];
      save(); test();
    } else {
      answers[index] = [item]; save();
      if (last) test();
      else { index += 1; setTimeout(test, 160); }
    }
  });
  document.querySelector('#back').onclick = () => { if (index) { index -= 1; save(); test(); } };
  if (multiple || last) document.querySelector('#next').onclick = () => {
    if (!answers[index].length) return;
    if (last) analyze(); else { index += 1; save(); test(); }
  };
}

function analyze() {
  const steps = ['老熊猫正在翻看你的每一道选择…', '正在梳理你的兴趣与价值偏好…', '正在比对升学、体制与就业路线…', '老熊猫加班完成了解读，马上交给你。'];
  app.innerHTML = `<main class="analysis-screen"><div class="analysis-card"><div class="analysis-panda">🐼</div><p class="analysis-label">老熊猫正在拼命分析</p><h1 id="analysis-copy">${steps[0]}</h1><div class="analysis-progress"><i id="analysis-bar" style="width:25%"></i></div><small id="analysis-number">25% · 请稍等，正在生成你的大学路线图</small></div></main>`;
  [750, 1450, 2200].forEach((delay, step) => setTimeout(() => { document.querySelector('#analysis-copy').textContent = steps[step + 1]; document.querySelector('#analysis-bar').style.width = `${(step + 2) * 25}%`; document.querySelector('#analysis-number').textContent = `${(step + 2) * 25}% · 请稍等，正在生成你的大学路线图`; }, delay));
  setTimeout(() => { location.hash = 'results'; }, 3000);
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

function result() {
  const report = calculate(); const theme = report.faction === '就业派' ? 'work' : report.faction === '体制派' ? 'stable' : 'study';
  const description = { 升学派: '你对成长和更高的平台有明确期待。先建立稳定学习节奏，再用研究、项目和实践持续验证兴趣。', 就业派: '你重视能力转化和真实世界的反馈。尽早用项目、实习和行业访谈验证方向，把可复用能力积累成作品。', 体制派: '你看重稳定、秩序和长期投入。提前了解具体路径，同时把专业基本功、表达和实践打牢。' }[report.faction];
  app.innerHTML = `<main class="results"><div class="result-top"><a href="#home" class="result-brand">🐼 老熊猫大学路线图</a><span>你的测评结果</span></div><section class="faction-card ${theme}"><p>你的发展倾向</p><h1>${report.faction}</h1><span>${report.faction === '升学派' ? '越学越有底气' : report.faction === '就业派' ? '在实践中把能力变现' : '在稳定中建立长期优势'}</span></section><section class="result-section"><p class="eyebrow">HOLLAND INTEREST CODE</p><h2>${report.code}</h2><p>${[...report.code].map((key) => labels[key]).join(' · ')}。结果来自行为情境、兴趣活动和价值排序的综合画像，不是人格标签。</p><div class="bars">${Object.entries(report.hollandScores).map(([key, value]) => `<div><span>${key}</span><i><b style="width:${value}%"></b></i><em>${value}</em></div>`).join('')}</div></section><section class="result-section"><p class="eyebrow">YOUR NEXT CHAPTER</p><h2>适合你的发展节奏</h2><p>${description}</p><div class="values">${report.rank.slice(0, 3).map((key, item) => `<span><b>TOP ${item + 1}</b>${labels[key]}</span>`).join('')}</div></section><p class="disclaimer">本测评用于职业探索与自我反思，不是临床心理诊断；结果仅供参考，不构成志愿填报或职业选择的唯一依据。</p></main>`;
}

function route() { if (location.hash === '#test') test(); else if (location.hash === '#results') result(); else home(); }
addEventListener('hashchange', route); route();
