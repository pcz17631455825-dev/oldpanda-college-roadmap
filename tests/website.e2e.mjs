// Local-only browser QA. External destinations are intercepted: no login, group join or payment.
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { QUESTIONS, PAIR_QUESTIONS } from '../features/transfer/questions.js';
import { emptyDraft, STORAGE_KEY, LINKS } from '../features/transfer/core.js';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.QA_PLAYWRIGHT_PATH || 'playwright');
const browser = await chromium.launch({ headless: true, channel: process.env.QA_BROWSER_CHANNEL || 'msedge' });
const out = new URL('../outputs/qa/', import.meta.url);
await mkdir(out, { recursive: true });
const results = [];
const oldQuestions = JSON.parse(await readFile(new URL('../docs/questions.json', import.meta.url), 'utf8'));
function fixture(current = 1, target = 4) {
  const d = emptyDraft();
  d.answers = Object.fromEntries(PAIR_QUESTIONS.map(q => [q.id, { current, target }]));
  Object.assign(d.answers, { targetEvidence: 'trial', currentEvidence: 'trial', bottleneck: 'content', catchup: 'plan', resources: 'ready', motive: 'tasks', fallback: 'plan', support: 'yes' });
  return d;
}
async function check(name, fn) {
  try { await fn(); results.push({ name, pass: true }); console.log('PASS ' + name); }
  catch (error) { results.push({ name, pass: false, error: error.message }); console.error('FAIL ' + name + ': ' + error.message); }
}
async function overflow(page) { assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), 'unexpected horizontal scrolling'); }
async function putDraft(page, value) { await page.evaluate(({ key, value }) => localStorage.setItem(key, JSON.stringify(value)), { key: STORAGE_KEY, value }); }
async function waitHash(page, part) { await page.waitForFunction(part => location.hash.endsWith(part), part); }
async function externalClick(page, selector, url) {
  const a = page.locator(selector).first(); assert.equal(await a.getAttribute('href'), url); assert.equal(await a.getAttribute('target'), '_blank'); assert.match(await a.getAttribute('rel'), /noopener/);
  const popupPromise = page.context().waitForEvent('page'); await a.click(); const popup = await popupPromise;
  await popup.waitForLoadState('domcontentloaded'); assert.equal(popup.url(), url); await popup.close();
}
try {
for (const site of [{ name: 'static', base: 'http://127.0.0.1:4173/', transfer: '#transfer', test: '#test', report: '#results' }, { name: 'react', base: 'http://127.0.0.1:4174/', transfer: 'transfer#transfer', test: 'assessment', report: 'results' }]) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce', acceptDownloads: true });
  await context.route(/^https?:\/\/(?!127\.0\.0\.1|localhost)/, route => route.fulfill({ status: 200, contentType: 'text/html', body: '<title>External destination intercepted for local QA</title>' }));
  const page = await context.newPage(); page.setDefaultTimeout(12000);
  const errors = []; page.on('pageerror', error => errors.push(error.message));
  await check(`${site.name}: homepage and both tool entrances`, async () => {
    await page.goto(site.base); await page.locator('[data-home-ready="true"]').waitFor();
    await overflow(page);
    const navTransfer = page.getByRole('navigation').getByRole('link', { name: '转专业助手', exact: true });
    assert.equal(await navTransfer.count(), 1); assert.equal(await navTransfer.getAttribute('href'), '#transfer-section');
    await navTransfer.click(); await page.waitForFunction(() => document.querySelector('#transfer-section')?.getBoundingClientRect().top < 80);
    assert.equal(await page.locator('.transfer-intro').count(), 0);
    const heroCta = page.locator('.education-hero .education-cta');
    assert.match(await heroCta.innerText(), /用15分钟，生成我的大学路线图/);
    await heroCta.click({ noWaitAfter: true });
    await page.locator('.education-page-transition.is-active').waitFor(); assert.match(await page.locator('[data-transition-message]').innerText(), /大学路线图测评/);
    await page.locator('.options').waitFor();
    await page.goto(site.base); await page.locator('[data-home-ready="true"]').waitFor();
    const transferCta = page.locator('.education-transfer-screen .education-cta');
    assert.equal(await transferCta.count(), 1); assert.match(await transferCta.innerText(), /用15分钟，判断转专业优劣/);
    assert.match(await page.locator('.education-contact').innerText(), /高校生存指南2群/);
    assert.match(await page.locator('.education-contact').innerText(), /辅导员老熊猫/);
    const homeQr = page.locator('.education-contact-qr img');
    assert.equal(await homeQr.getAttribute('alt'), '抖音高校生存指南2群二维码，群号443950191034');
    await transferCta.click({ noWaitAfter: true });
    await page.locator('.education-page-transition.is-active').waitFor(); assert.match(await page.locator('[data-transition-message]').innerText(), /转专业助手/);
    await page.locator('.transfer-intro').waitFor();
    assert.equal(await page.locator('input:checked').count(), 0);
    await page.screenshot({ path: fileURLToPath(new URL(`${site.name}-intro-desktop.png`, out)), fullPage: true });
  });
  await check(`${site.name}: has no professional-name collection or generic professional comparison`, async () => {
    await page.locator('[data-action="begin"]').click(); await page.locator('.transfer-policy-list').waitFor();
    assert.equal(await page.locator('input[name="current"], input[name="target"], [data-major-category], .transfer-major').count(), 0);
    assert.match(await page.locator('.transfer-main').innerText(), /本校教务处或学院官网/);
    assert.match(await page.locator('.transfer-main').innerText(), /本站不提供专业目录、课程介绍或通用专业对比/);
    assert.match(await page.locator('.transfer-main').innerText(), /核心课程与典型作业/);
    await overflow(page);
  });
  await check(`${site.name}: policy save, skip, empty choices, real completion and resume`, async () => {
    await page.goto(site.base + site.transfer + '/policy'); await page.locator('[data-policy="window"]').waitFor();
    await page.locator('[data-policy="window"]').selectOption('checked');
    await page.locator('[data-policy-note]').fill('2026年本校通知，测试笔记不分享'); await page.reload();
    await page.locator('[data-policy="window"]').waitFor(); assert.equal(await page.locator('[data-policy="window"]').inputValue(), 'checked');
    await page.locator('[data-action="skip-policy"]').click(); await page.locator('[data-answer="pair-1"]').first().waitFor();
    assert.equal(await page.locator('input:checked').count(), 0); assert.equal(await page.locator('[data-next]').isDisabled(), true);
    assert.equal(await page.locator('[role="progressbar"]').getAttribute('aria-valuenow'), '0');
    await page.locator('[name="pair-1-current"][value="1"]').check(); assert.equal(await page.locator('[data-next]').isDisabled(), true);
    await page.locator('[name="pair-1-target"][value="4"]').check(); assert.equal(await page.locator('[data-count]').innerText(), '1');
    await page.reload(); await page.locator('[data-answer="pair-1"]').first().waitFor(); assert.equal(await page.locator('input:checked').count(), 2);
    await page.goto(site.base + site.transfer + '/report'); await page.locator('h1').waitFor();
    await page.waitForFunction(() => document.querySelector('h1')?.textContent.includes('31'));
    assert.equal(await page.locator('.transfer-score-row').count(), 0);
    await page.locator('[data-action="resume"]').click(); await waitHash(page, 'questions/2');
  });
  await check(`${site.name}: paired auto-next waits for both sides and cancels when navigating back`, async () => {
    await page.locator('[name="pair-2-current"][value="0"]').check();
    await page.waitForTimeout(650); assert.ok(page.url().endsWith('questions/2'));
    await page.locator('[name="pair-2-target"][value="unknown"]').check();
    await page.locator('[data-action="prev"]').click(); await waitHash(page, 'questions/1');
    await page.waitForTimeout(650); assert.ok(page.url().endsWith('questions/1'));
    assert.equal(await page.locator('input:checked').count(), 2);
    await page.locator('[data-next]').click(); await waitHash(page, 'questions/2');
    await page.locator('[name="pair-2-target"][value="4"]').check();
    await waitHash(page, 'questions/3');
    assert.equal(await page.locator('input:checked').count(), 0);
    assert.equal(await page.locator('[data-next]').isDisabled(), true);
  });
  await check(`${site.name}: complete all 32 groups with real clicks, last answer, report`, async () => {
    await page.goto(site.base + site.transfer + '/questions/1');
    for (let i = 0; i < QUESTIONS.length; i++) {
      const q = QUESTIONS[i]; await page.locator(`[data-answer="${q.id}"]`).first().waitFor();
      if (q.type === 'pair') {
        const alreadyAnswered = await page.locator('input:checked').count() === 2;
        await page.locator(`[name="${q.id}-current"][value="1"]`).check(); await page.locator(`[name="${q.id}-target"][value="4"]`).check();
        if (alreadyAnswered) await page.locator('[data-next]').click();
        await waitHash(page, `questions/${i + 2}`);
      } else {
        if (i === QUESTIONS.length - 1) assert.equal(await page.locator('[data-next]').isDisabled(), true);
        await page.locator(`[name="${q.id}"][value="${fixture().answers[q.id]}"]`).check();
        await waitHash(page, i === QUESTIONS.length - 1 ? 'report' : `questions/${i + 2}`);
      }
      if (i === 11) assert.match(await page.locator('[data-stage]').innerText(), /一段梳理/);
    }
    await page.locator('.transfer-report').waitFor(); assert.match(await page.locator('h1').innerText(), /更倾向探索目标/);
    assert.match(await page.locator('.transfer-report').innerText(), /待核实/); await overflow(page);
    await page.screenshot({ path: fileURLToPath(new URL(`${site.name}-report-desktop.png`, out)), fullPage: true });
  });
  await check(`${site.name}: report details, image download, QR bytes and external button behavior`, async () => {
    const brand = page.locator('.transfer-result-brand img');
    const suppliedBrand = await readFile(new URL('../public/panda-transfer-brand.png', import.meta.url));
    await brand.waitFor(); assert.equal(await brand.evaluate(img => img.naturalWidth), suppliedBrand.readUInt32BE(16));
    const brandResponse = await page.request.get(new URL(await brand.getAttribute('src'), page.url()).href);
    assert.deepEqual(await brandResponse.body(), suppliedBrand);
    assert.match(await brand.getAttribute('alt'), /老熊猫听劝/);
    await page.locator('.transfer-method summary').click(); assert.equal(await page.locator('.transfer-method').getAttribute('open'), '');
    await page.locator('[data-action="share-image"]').click(); await page.locator('.transfer-card-preview img').waitFor();
    const downloadPromise = page.waitForEvent('download'); await page.locator('a[download="老熊猫-转专业探索摘要.png"]').click();
    const download = await downloadPromise; const png = await readFile(await download.path()); assert.equal(png.subarray(1, 4).toString(), 'PNG');
    await download.saveAs(fileURLToPath(new URL(`${site.name}-result-card.png`, out)));
    await page.locator('[data-action="copy-report"]').click();
    await page.waitForFunction(() => document.querySelector('[data-share-status]')?.textContent.includes('复制') || document.querySelector('[data-share-preview] textarea'));
    assert.ok((await page.locator('[data-share-status]').innerText()).includes('复制') || await page.locator('[data-share-preview] textarea').count());
    const qr = page.locator('.transfer-group img'); await qr.scrollIntoViewIfNeeded(); assert.equal(await qr.evaluate(img => img.naturalWidth), 840);
    const qrResponse = await page.request.get(new URL(await qr.getAttribute('src'), page.url()).href);
    if (qrResponse.ok()) assert.equal(createHash('sha256').update(await qrResponse.body()).digest('hex'), '87e936518ad8481601cd760c2ccdfb247c341b1ab1aa63b837a59c81c67132a5');
    const qrDownloadPromise = page.waitForEvent('download'); await page.locator('.transfer-group a[download]').click(); const qrDownload = await qrDownloadPromise;
    assert.equal(createHash('sha256').update(await readFile(await qrDownload.path())).digest('hex'), '87e936518ad8481601cd760c2ccdfb247c341b1ab1aa63b837a59c81c67132a5');
    await externalClick(page, '.transfer-video a', LINKS.video); await externalClick(page, '.transfer-membership a', LINKS.profile); await externalClick(page, '.transfer-group a[target]', LINKS.profile);
  });
  await check(`${site.name}: all inclination branches and blocked policies`, async () => {
    for (const [c, t, expected] of [[4, 1, '当前专业仍有'], [3, 3, '两边各有取舍'], ['unknown', 'unknown', '先补充体验']]) {
      await putDraft(page, fixture(c, t)); await page.reload(); await page.waitForFunction(text => document.querySelector('h1')?.textContent.includes(text), expected); await overflow(page);
    }
    const d = fixture(); d.policy.eligible = 'no'; await putDraft(page, d); await page.reload(); await page.locator('.transfer-warning').waitFor();
    assert.match(await page.locator('.transfer-warning').innerText(), /不符合/);
  });
  await check(`${site.name}: reset is scoped to the new tool and retired routes explain the policy step`, async () => {
    await putDraft(page, fixture()); await page.goto(site.base + site.transfer + '/setup'); await page.reload();
    await page.locator('.transfer-policy-list').waitFor();
    assert.match(await page.locator('.transfer-main').innerText(), /专业介绍，请以本校为准/);
    await page.goto(site.base + site.transfer + '/compare'); await page.reload();
    await page.locator('.transfer-policy-list').waitFor();
    await putDraft(page, fixture()); await page.goto(site.base + site.transfer + '/report'); await page.reload();
    await page.evaluate(() => localStorage.setItem('career-assessment-v3-draft', JSON.stringify({ index: 0, answers: [[1]], sentinel: 'original-must-survive' })));
    await page.locator('[data-action="reset-request"]').click(); await page.locator('[data-action="cancel-reset"]').click();
    await page.locator('[data-action="reset-request"]').click(); await page.locator('[data-action="reset"]').click();
    assert.equal(await page.evaluate(() => JSON.parse(localStorage.getItem('career-assessment-v3-draft')).sentinel), 'original-must-survive');
    const d = await page.evaluate(key => JSON.parse(localStorage.getItem(key)), STORAGE_KEY);
    assert.deepEqual(d.answers, {}); assert.equal(d.profile, undefined);
    await page.evaluate(() => localStorage.removeItem('career-assessment-v3-draft'));
  });
  await check(`${site.name}: 390px mobile layouts, fresh choices, tab focus and reduced motion`, async () => {
    await page.setViewportSize({ width: 390, height: 844 }); await page.goto(site.base); await page.locator('[data-home-ready="true"]').waitFor(); await overflow(page);
    const cta = await page.locator('.education-hero .education-cta').boundingBox(); assert.ok(cta.y + cta.height <= 844, `home CTA below fold: ${cta.y}`);
    await page.screenshot({ path: fileURLToPath(new URL(`${site.name}-home-mobile.png`, out)), fullPage: true });
    await page.goto(site.base + site.transfer); await page.locator('.transfer-intro').waitFor(); await overflow(page);
    await page.keyboard.press('Tab'); assert.ok(await page.evaluate(() => document.activeElement !== document.body));
    const d = fixture(); await putDraft(page, d);
    for (const route of ['setup', 'compare', 'policy', 'questions/1', 'report']) {
      await page.goto(site.base + site.transfer + '/' + route); await page.reload(); await page.locator('.transfer-main h1').waitFor(); await overflow(page);
      await page.screenshot({ path: fileURLToPath(new URL(`${site.name}-${route.replace('/', '-')}-mobile.png`, out)), fullPage: true });
    }
  });
  await check(`${site.name}: original quiz first answer, multiple select, back, and results guard`, async () => {
    await page.evaluate(() => { localStorage.removeItem('career-assessment-v3-draft'); localStorage.removeItem('career-assessment-v3-result'); });
    await page.goto(site.base + site.test); await page.locator('.options button').first().waitFor();
    assert.equal(await page.locator('.options [aria-pressed="true"]').count(), 0); assert.match(await page.locator('.answer-storage').innerText(), /已答 0/);
    await page.locator('.options button').first().click(); await page.waitForFunction(() => document.querySelector('.assessment-top')?.textContent.includes('2 /'));
    await page.getByRole('button', { name: '← 上一题' }).click(); assert.equal(await page.locator('.options [aria-pressed="true"]').count(), 1);
    await page.goto(site.base + site.report); await page.locator('.incomplete-card').waitFor(); assert.match(await page.locator('.incomplete-card').innerText(), /47 题/);
    await page.getByRole('button', { name: '继续完成测评 →' }).click(); await page.locator('.options').waitFor();
    await page.waitForFunction(() => document.querySelector('.assessment-top')?.textContent.includes('2 /'));
  });
  await check(`${site.name}: every original question, multiple-selection limits and full submission`, async () => {
    await page.evaluate(() => { localStorage.removeItem('career-assessment-v3-draft'); localStorage.removeItem('career-assessment-v3-result'); });
    await page.goto(site.base + site.test); await page.reload();
    for (let i = 0; i < oldQuestions.length; i++) {
      await page.waitForFunction(n => document.querySelector('.assessment-top')?.textContent.includes(`${n} /`), i + 1);
      const q = oldQuestions[i]; const opts = page.locator('.options button');
      await opts.first().click();
      if (q.type === 'multiple') {
        await opts.nth(1).click(); assert.equal(await page.locator('.options [aria-pressed="true"]').count(), 2);
        if ((q.maxSelections || 2) === 2) { await opts.nth(2).click(); assert.equal(await page.locator('.options [aria-pressed="true"]').count(), 2); }
        await opts.nth(1).click(); assert.equal(await page.locator('.options [aria-pressed="true"]').count(), 1);
      }
      if (i === 47) await page.getByRole('button', { name: '提交测评，开始解读 →' }).click();
      else if (q.type === 'multiple') await page.getByRole('button', { name: '下一题 →' }).click();
    }
    await page.locator('.faction-card').waitFor();
  });
  await check(`${site.name}: original quiz 48th option/submission and all three route videos`, async () => {
    for (const [key, faction, video] of [['income', '就业派', 'https://v.douyin.com/ovsK9HCTinU/'], ['achievement', '升学派', 'https://v.douyin.com/UAUFUXMFaOA/'], ['stability', '体制派', 'https://v.douyin.com/ZoYFMD_qqqA/']]) {
      const answers = oldQuestions.map(q => [q.options.map(o => o.scores[key] || 0).reduce((best, score, i, array) => score > array[best] ? i : best, 0)]);
      const final = answers[47][0]; answers[47] = [];
      await page.evaluate(a => { localStorage.removeItem('career-assessment-v3-result'); localStorage.setItem('career-assessment-v3-draft', JSON.stringify({ index: 47, answers: a })); }, answers);
      await page.goto(site.base + site.test); await page.reload(); await page.waitForFunction(() => document.querySelector('.assessment-top')?.textContent.includes('48 /'));
      assert.equal(await page.getByRole('button', { name: '提交测评，开始解读 →' }).count(), 0);
      await page.locator('.options button').nth(final).click(); assert.equal(await page.locator('.options [aria-pressed="true"]').count(), 1);
      await page.getByRole('button', { name: '提交测评，开始解读 →' }).click(); await page.locator('.faction-card h1').waitFor();
      assert.equal(await page.locator('.faction-card h1').innerText(), faction);
      await externalClick(page, '.route-video-button', video); assert.match(await page.locator('.fan-group').innerText(), /高校生存指南2群/); await overflow(page);
    }
  });
  await check(`${site.name}: context auto-next preserves restored answers and cancels on back`, async () => {
    const d = fixture();
    await putDraft(page, d); await page.goto(site.base + site.transfer + '/questions/25'); await page.reload();
    await page.locator('[data-answer="targetEvidence"]').first().waitFor();
    await page.waitForTimeout(650); assert.ok(page.url().endsWith('questions/25'));
    assert.equal(await page.locator('input:checked').inputValue(), 'trial');
    const alternate = QUESTIONS[24].options.find(option => option.id !== 'trial').id;
    await page.locator(`[data-answer="targetEvidence"][value="${alternate}"]`).check();
    await page.locator('[data-action="prev"]').click(); await waitHash(page, 'questions/24');
    await page.waitForTimeout(650); assert.ok(page.url().endsWith('questions/24'));
    await page.locator('[data-next]').click(); await waitHash(page, 'questions/25');
    await page.locator('[data-answer="targetEvidence"][value="trial"]').check();
    await waitHash(page, 'questions/26');
    await page.waitForTimeout(650); assert.ok(page.url().endsWith('questions/26'));
    await page.locator('[data-next]').click(); await waitHash(page, 'questions/27');
  });
  await check(`${site.name}: missing earlier answer at final automatic submit remains guarded`, async () => {
    const d = fixture(); delete d.answers['pair-3']; delete d.answers.support;
    await putDraft(page, d); await page.goto(site.base + site.transfer + '/questions/32'); await page.reload();
    await page.locator('[data-answer="support"][value="yes"]').check(); await waitHash(page, 'report');
    await page.waitForFunction(() => document.querySelector('h1')?.textContent.includes('1 组'));
    assert.equal(await page.locator('.transfer-score-row').count(), 0); await page.locator('[data-action="resume"]').click(); await waitHash(page, 'questions/3');
  });
  await check(`${site.name}: refreshing corrupt data cannot fabricate completed answers`, async () => {
    await page.evaluate(key => localStorage.setItem(key, '{invalid'), STORAGE_KEY); await page.goto(site.base + site.transfer + '/policy'); await page.reload(); await page.locator('.transfer-policy-list').waitFor();
    await page.goto(site.base + site.transfer + '/report'); await page.locator('[data-action="resume"]').waitFor(); assert.equal(await page.locator('.transfer-score-row').count(), 0);
    await page.evaluate(() => localStorage.setItem('career-assessment-v3-draft', JSON.stringify({ index: -100, answers: Array(48).fill([999]) })));
    await page.goto(site.base + site.test); await page.reload(); await page.locator('.options').waitFor();
    assert.match(await page.locator('.answer-storage').innerText(), /已答 0/); assert.equal(await page.locator('.options [aria-pressed="true"]').count(), 0);
  });
  await check(`${site.name}: no unhandled browser exceptions`, async () => { assert.deepEqual(errors, []); });
  await context.close();
}
await check('storage unavailable: new tool still works in-session and warns honestly', async () => {
  const context = await browser.newContext();
  await context.addInitScript(() => { Storage.prototype.setItem = () => { throw new DOMException('Blocked', 'SecurityError'); }; });
  const p = await context.newPage(); await p.goto('http://127.0.0.1:4173/#transfer/policy');
  await p.locator('[data-policy="window"]').selectOption('checked'); assert.match(await p.locator('[data-local-note]').innerText(), /无法保存/);
  await p.locator('[data-action="skip-policy"]').click();
  await p.locator('[name="pair-1-current"][value="unknown"]').check(); await p.locator('[name="pair-1-target"][value="unknown"]').check();
  assert.equal(await p.locator('[data-count]').innerText(), '1'); await context.close();
});
} finally {
  await browser.close();
  await writeFile(new URL('results.json', out), JSON.stringify(results, null, 2));
}
if (results.some(result => !result.pass)) process.exitCode = 1;
console.log(`Browser QA: ${results.filter(result => result.pass).length}/${results.length} passed`);
