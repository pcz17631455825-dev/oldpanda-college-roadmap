import { SiteHeader } from "@/components/SiteHeader";

export default function Home() {
  return <main>
    <SiteHeader />
    <section className="hero panda-hero">
      <div className="hero-copy"><p className="eyebrow">OLD PANDA · COLLEGE ROADMAP</p><h1>大学这条路，<br /><em>老熊猫陪你先看明白。</em></h1><p className="hero-text">前大学辅导员老熊猫，用更接近真实选择的情境题，陪你梳理升学、体制、就业三条大学路线；不替你下结论，只帮你把下一步走扎实。</p><a className="primary" href="/assessment">开始我的测评 <span>→</span></a><p className="micro">48 道情境题 · 含多选题 · 约 15–20 分钟 · 结果仅供参考</p></div>
      <div className="panda-hero-art"><img src="/panda/hero-library.png" alt="老熊猫在校园图书馆" /><div className="hero-note"><b>竹节三路线</b><span>升学 · 体制 · 就业</span></div></div>
    </section>
    <section className="panda-paths"><p className="eyebrow">THREE ROUTES, ONE STEADY START</p><h2>先选适合自己的节奏，<br />再把大学四年过成筹码。</h2><div className="feature-grid"><article><i>①</i><h3>升学竹节</h3><p>适合愿意持续深耕、把平台和专业能力做厚的同学。老熊猫陪你把课程、科研与升学节奏拆开。</p></article><article><i>②</i><h3>体制竹节</h3><p>稳定不是等机会。更看重招录口径、岗位面、表达与长期基本功；专业推荐会标明考公岗位数量。</p></article><article><i>③</i><h3>就业竹节</h3><p>从真实项目、实习和作品里建立职业能力。每个专业会说明它为何更利于就业、如何累积优势。</p></article></div></section>
    <section id="resources" className="resource-teaser"><div><p className="eyebrow">老熊猫资料驿站 · 即将开放</p><h2>把有用的大学经验，留给真正需要的你。</h2><p>新生适应、选课规划、考研准备、求职与考公资料会陆续在这里更新；从抖音内容延伸到可下载、可反复使用的行动清单。</p></div><span>🐼</span></section>
    <footer>本测评用于职业探索与自我反思，不是临床心理诊断；结果仅供参考，不构成志愿填报或职业选择的唯一依据。</footer>
  </main>;
}
