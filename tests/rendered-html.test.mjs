import assert from 'node:assert/strict';
import test from 'node:test';
async function render(path) {
  const { default: worker } = await import('../dist/server/index.js');
  return worker.fetch(new Request(`http://localhost${path}`, { headers: { accept: 'text/html' } }),
    { ASSETS: { fetch: async () => new Response('Not found', { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} });
}
test('built homepage renders both real tools, not starter content', async () => {
  const response = await render('/'); assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /老熊猫大学路线图/); assert.match(html, /转专业助手/);
  assert.match(html, /用15分钟，生成我的大学路线图/);
  assert.match(html, /用15分钟，判断转专业优劣/);
  assert.match(html, /高校生存指南2群/);
  assert.match(html, /辅导员老熊猫/);
  assert.match(html, /href="\/transfer"/); assert.match(html, /href="\/assessment"/);
  assert.doesNotMatch(html, /Your site is taking shape|整理中|资料驿站/);
});
for (const path of ['/transfer', '/assessment', '/results']) {
  test(`built ${path} is reachable without authentication`, async () => {
    const response = await render(path); assert.equal(response.status, 200);
    assert.match(response.headers.get('content-type'), /text\/html/);
  });
}
