# 老熊猫大学路线图

前大学辅导员“老熊猫”的大学规划陪跑网站，面向中国准大一新生提供职业兴趣测评与专业探索。

## 测评设计

- 48 道行为情境与等吸引力强迫选择题，避免直问“想不想考研、进体制或就业”。
- 以霍兰德 RIASEC 职业兴趣、工作价值观和情境决策为核心，结果用于职业探索，不用于人格贴标签或临床诊断。
- 输出兴趣代码、三派发展倾向、价值观排序、推荐专业与专业解读。

## 公开发布到 GitHub Pages

本仓库的 `.github/workflows/deploy-pages.yml` 会把 `docs/` 目录部署为公开静态网站；网站不需要登录，也不收集账号信息。

首次推送到 GitHub 后，在仓库的 **Settings → Pages** 中将发布源设置为 **GitHub Actions**。工作流完成后，公开地址格式为：

`https://你的GitHub用户名.github.io/仓库名/`

## 本地开发

```bash
npm install
npm run dev
npm run build
```

`app/` 是完整网站源码；`docs/` 是为 GitHub Pages 准备的纯静态公开版本。
