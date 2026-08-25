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

## 代码使用与 2.0 版本

本项目的**源代码**以 MIT License 开放，欢迎同学学习、修改并制作自己的 2.0 版本。完整范围见 [LICENSE](./LICENSE)。

请注意：老熊猫名称、Logo、熊猫角色图片、原创题目、结果解读和页面文案**不在代码授权范围内**。制作衍生版本前，请替换为自己的项目名称、视觉资产、测评题目和文案；不得宣称是老熊猫官方版本或获得官方背书。详细要求见 [BRAND_AND_CONTENT_POLICY.md](./BRAND_AND_CONTENT_POLICY.md)。

### 给 2.0 开发者的快速开始

1. 点击仓库页面绿色 **Code** 按钮，选择 **Download ZIP**；或者执行：

   ```bash
   git clone https://github.com/pcz17631455825-dev/oldpanda-college-roadmap.git
   ```

2. 进入项目目录后安装依赖并启动本地开发：

   ```bash
   npm install
   npm run dev
   ```

3. 对外发布前，按上述 IP 与内容规则替换自己的名称、图片、题目和文案。
