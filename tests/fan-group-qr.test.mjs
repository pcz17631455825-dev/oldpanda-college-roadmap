import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import test from "node:test";
import vm from "node:vm";
import { normalizeCareerDraft } from '../features/career-draft.js';

const root = new URL("../", import.meta.url);
const qrName = "douyin-fan-group-2-qr.jpg";
// Exact user-supplied image: preserve the complete QR rather than regenerating it.
const suppliedImageHash = "87e936518ad8481601cd760c2ccdfb247c341b1ab1aa63b837a59c81c67132a5";

test("both website versions use the unchanged group 2 QR image", async () => {
  for (const folder of ["public", "docs"]) {
    const image = await readFile(new URL(`${folder}/${qrName}`, root));
    assert.equal(createHash("sha256").update(image).digest("hex"), suppliedImageHash);
  }
});

test("both result implementations use group 2 and remove the old expiry", async () => {
  for (const file of ["app/results/page.tsx", "docs/app.js"]) {
    const source = await readFile(new URL(file, root), "utf8");
    assert.ok(source.includes(qrName));
    assert.match(source, /加入“🐼高校生存指南2群”/);
    assert.match(source, /alt="加入老熊猫抖音粉丝群“高校生存指南2群”的二维码/);
    assert.match(source, /如二维码暂时无法使用，请回老熊猫抖音主页查看最新入群入口。/);
    assert.doesNotMatch(source, /高校生存指南1群|当前二维码有效至|douyin-fan-group-qr\.jpg/);
  }
});

async function staticResultHarness() {
  const source = (await readFile(new URL("docs/app.js", root), "utf8")).replace(/^import .*;\r?\n/gm, '');
  const questions = JSON.parse(await readFile(new URL("docs/questions.json", root), "utf8"));
  const app = { innerHTML: "" };
  const sandbox = {
    normalizeCareerDraft,
    clearTimeout,
    document: { querySelector: (selector) => selector === "#app" ? app : {} },
    fetch: async () => ({ json: async () => questions }),
    localStorage: { getItem: () => null, setItem() {}, removeItem() {} },
    location: { hash: "#results" },
    window: {},
    addEventListener() {},
  };
  const api = await vm.runInNewContext(`(async () => {
    ${source}
    return {
      renderReport(report) {
        answers = questions.map(() => [0]);
        calculate = () => report;
        result();
      }
    };
  })()`, sandbox);
  return { app, api };
}

test("an incomplete assessment still cannot expose the results or group module", async () => {
  const { app } = await staticResultHarness();
  assert.match(app.innerHTML, /你还差 48 题/);
  assert.doesNotMatch(app.innerHTML, /fan-group-title|你的发展倾向/);
});

for (const [faction, video] of [
  ["就业派", "https://v.douyin.com/ovsK9HCTinU/"],
  ["升学派", "https://v.douyin.com/UAUFUXMFaOA/"],
  ["体制派", "https://v.douyin.com/ZoYFMD_qqqA/"],
]) {
  test(`${faction} renders the new group after its unchanged route video`, async () => {
    const { app, api } = await staticResultHarness();
    // A rendering fixture, not a test or replacement of the scoring algorithm.
    api.renderReport({ faction, code: "RIA", rank: ["income", "achievement", "social"], hollandScores: { R: 70, I: 60, A: 50 } });
    const html = app.innerHTML;
    assert.ok(html.includes(video));
    assert.match(html, /target="_blank" rel="noopener noreferrer"/);
    assert.ok(html.indexOf(video) < html.indexOf('id="fan-group-title"'));
    assert.ok(html.includes(`src="./${qrName}"`));
    assert.match(html, /高校生存指南2群/);
    assert.match(html, /width="840" height="1107"/);
    assert.doesNotMatch(html, /高校生存指南1群|2026 年 9 月 3 日/);
  });
}
