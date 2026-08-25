import { SiteHeader } from "@/components/SiteHeader";

export default function Home() {
  return <main className="noir-home">
    <SiteHeader />
    <section className="noir-hero">
      <img className="noir-hero-image" src="/panda/hero-noir.png" alt="拿着笔记本的老熊猫" />
      <div className="noir-copy"><p className="noir-kicker"><i /> OLD PANDA / COLLEGE ROADMAP</p><h1>大学这条路，<br /><em>先看清，再出发。</em></h1><p>前大学辅导员老熊猫，陪你从兴趣、价值感与真实选择里，理清升学、体制、就业三条大学路线。</p><a className="primary noir-cta" href="/assessment">开始我的测评 <span>→</span></a></div>
      <div className="noir-index"><span>01</span><b>升学 · 体制 · 就业</b><span>为大学四年，先做一份清醒规划</span></div>
    </section>
    <section className="noir-statement"><p className="eyebrow">ONE QUESTION, THREE ROUTES</p><h2>不替你选择，<br />帮你看清自己该怎样选择。</h2><p>测评不问“你想不想考公、考研或就业”，而是从真实情境里，识别你在兴趣、成长、稳定与行动方式上的偏好。</p></section>
    <section className="noir-routes"><article><span>01</span><h3>升学</h3><p>用课程、科研和长期能力，为更高的平台蓄力。</p></article><article><span>02</span><h3>体制</h3><p>把招录口径、岗位面与基本功，变成稳定选择。</p></article><article><span>03</span><h3>就业</h3><p>通过项目、实习与作品，让能力进入真实世界。</p></article></section>
    <section id="resources" className="resource-teaser"><div><p className="eyebrow">老熊猫资料驿站 · 即将开放</p><h2>把有用的大学经验，留给真正需要的你。</h2><p>新生适应、选课规划、考研准备、求职与考公资料会陆续在这里更新；从抖音内容延伸到可下载、可反复使用的行动清单。</p></div><span>🐼</span></section>
    <footer>本测评用于职业探索与自我反思，不是临床心理诊断；结果仅供参考，不构成志愿填报或职业选择的唯一依据。</footer>
  </main>;
}
