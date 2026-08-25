import { HomeMotion } from "@/components/HomeMotion";
import { ResourceShelf } from "@/components/ResourceShelf";
import { SiteHeader } from "@/components/SiteHeader";
import "./education-home.css";
import "./home-motion.css";

export default function Home() {
  return (
    <main className="education-home">
      <HomeMotion>
        <SiteHeader />
        <section className="education-hero">
          <div className="education-copy motion-hero-copy">
            <p className="education-kicker">老熊猫大学路线图</p>
            <h1>大学开始前，<br />先把方向想明白。</h1>
            <p className="education-lede">前大学辅导员老熊猫，陪你从真实选择里，看清适合自己的大学节奏与发展方向。</p>
            <a className="education-cta" href="/assessment">开始我的测评 <span aria-hidden="true">→</span></a>
            <p className="education-note">48 道情境题，约 15 至 20 分钟完成</p>
          </div>
          <figure className="education-portrait motion-portrait">
            <img src="/panda/home-study.png" alt="老熊猫在校园阅览室认真写下大学规划" />
            <figcaption>把每一步想清楚，再稳稳出发。</figcaption>
          </figure>
        </section>

        <section className="education-intro motion-intro">
          <p>先读自己，再选路径</p>
          <h2>不急着选专业，<br />先把自己看明白。</h2>
          <div>测评不直问你想考研、考公还是就业，而是用接近真实生活的情境，梳理兴趣、价值感、稳定需求与行动方式。</div>
        </section>

        <section className="education-routes" aria-label="三条大学发展路线">
          <p className="routes-title">你可能更适合的起步方式</p>
          <article className="motion-route"><b>升学</b><p>在课程、科研与长期能力里，为更高的平台蓄力。</p></article>
          <article className="motion-route"><b>体制</b><p>把政策理解、岗位机会与基本功，变成稳妥选择。</p></article>
          <article className="motion-route"><b>就业</b><p>用项目、实习与作品，让能力更早进入真实世界。</p></article>
        </section>

        <section id="resources" className="education-resources motion-resource">
          <div className="resource-heading">
            <p>老熊猫资料驿站</p>
            <h2>把有用的大学经验，留给真正需要的你。</h2>
            <span>新生适应、选课规划、升学准备、求职与体制内规划资料会陆续更新，做成能下载、能反复使用的行动清单。</span>
          </div>
          <ResourceShelf />
        </section>

        <footer>本测评用于职业探索与自我反思，不是临床心理诊断；结果仅供参考，不构成志愿填报或职业选择的唯一依据。</footer>
      </HomeMotion>
    </main>
  );
}
