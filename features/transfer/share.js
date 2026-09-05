export function reportText(report) {
  return ['老熊猫 · 转专业探索摘要', '当前专业 · 计划转入专业', report.title,
    report.blocked ? '资格提醒：本人填报目前不符合申请条件，请向教务处核实。' : '本摘要不表示已经获得转入资格。',
    `政策待核实：${report.gaps.length ? report.gaps.join('、') : '清单内已由本人标记核实，仍以学校当年通知为准'}`,
    `下一步：${report.actions[0]}`, '仅供自我探索，不是诊断、录取概率或必须转/不转的判断。'].join('\n');
}

export async function makeShareImage(report, brandUrl) {
  if (document.fonts?.ready) await document.fonts.ready;
  const brand = new Image();
  await new Promise((resolve, reject) => {
    brand.onload = resolve;
    brand.onerror = () => reject(new Error('老熊猫品牌图片加载失败，请稍后重试。'));
    brand.src = brandUrl;
  });
  const canvas = document.createElement('canvas');
  canvas.width = 1080; canvas.height = 2400;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('当前浏览器不支持图片生成，请复制文字摘要。');
  ctx.fillStyle = '#f3f5f1'; ctx.fillRect(0, 0, 1080, canvas.height);
  // Keep the supplied artwork whole, including the text and bamboo.
  const scale = Math.min(240 / brand.naturalWidth, 240 / brand.naturalHeight);
  ctx.drawImage(brand, 752 + (240 - brand.naturalWidth * scale) / 2, 40 + (240 - brand.naturalHeight * scale) / 2, brand.naturalWidth * scale, brand.naturalHeight * scale);
  ctx.fillStyle = '#28513d'; ctx.fillRect(64, 84, 8, 105);
  let y = 126;
  function text(value, size, color = '#19211c', gap = 1.5) {
    ctx.fillStyle = color;
    ctx.font = `${size >= 42 ? 600 : 400} ${size}px "Microsoft YaHei", "PingFang SC", sans-serif`;
    let line = '';
    for (const char of value) {
      if (ctx.measureText(line + char).width > 908 && line) { ctx.fillText(line, 88, y); y += size * gap; line = ''; }
      line += char;
    }
    if (line) { ctx.fillText(line, 88, y); y += size * gap; }
  }
  text('老熊猫大学路线图', 38, '#28513d');
  text('前大学辅导员 · 大学规划陪跑', 24, '#5d6a62');
  y = 330;
  text('本科转专业探索摘要', 54); y += 24;
  text('当前专业 · 计划转入专业', 36); y += 50;
  ctx.fillStyle = '#d7ded7'; ctx.fillRect(88, y, 904, 2); y += 74;
  text(report.title, 44, '#28513d'); y += 40;
  text(report.blocked ? '资格提醒：你填报目前不符合申请条件。请向教务处核实，兴趣分数不能抵消政策限制。' : '本摘要不表示已经具备申请或转入资格。', 28); y += 30;
  text('仍需核实', 32, '#28513d');
  text(report.gaps.length ? report.gaps.join(' / ') : '清单内事项已由本人标记核实，仍以学校当年正式通知为准。', 28); y += 34;
  text('接下来，先走这一步', 32, '#28513d');
  text(report.actions[0], 28);
  y = Math.max(1420, y + 50);
  ctx.fillStyle = '#d7ded7'; ctx.fillRect(88, y, 904, 2);
  y += 52; text('探索参考，不是诊断、录取概率或必须转 / 不转的判断。', 23, '#5d6a62');
  text('不含姓名、联系方式或家庭财务信息。', 23, '#5d6a62');
  const output = document.createElement('canvas');
  output.width = canvas.width; output.height = Math.ceil(y + 48);
  output.getContext('2d').drawImage(canvas, 0, 0);
  return new Promise((resolve, reject) => output.toBlob(blob => blob ? resolve(blob) : reject(new Error('图片生成失败，请复制文字摘要。')), 'image/png'));
}
