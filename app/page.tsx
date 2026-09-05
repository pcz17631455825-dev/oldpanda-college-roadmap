import { HomeMotion } from "@/components/HomeMotion";
import { SiteHeader } from "@/components/SiteHeader";
import "@/features/transfer/style.css";
import "./education-home.css";
import "./home-motion.css";
import "./launch-update.css";

export default function Home() {
  return (
    <main className="education-home">
      <HomeMotion>
        <SiteHeader />
        <section className="education-hero">
          <div className="education-copy motion-hero-copy">
            <p className="education-kicker">老熊猫大学路线图</p>
            <h1>大学开始前，方向先想明白。</h1>
            <p className="education-lede">前大学辅导员老熊猫，陪你从真实选择里，看清适合自己的大学节奏与发展方向。</p>
            <a className="education-cta" href="/assessment" data-page-transition data-transition-copy="老熊猫正在打开大学路线图测评">用15分钟，生成我的大学路线图 <span aria-hidden="true">→</span></a>
            <ul className="education-benefits" aria-label="完成测评后你将获得"><li>看懂自己的三条路线倾向</li><li>拿到下一步可执行的方向</li><li>进入粉丝群领取对应规划资料</li></ul>
            <p className="education-note">48 道情境题，答案仅保存在这台设备；中途退出，下次可继续。</p>
          </div>
          <figure className="education-portrait motion-portrait">
            <img src="/panda/home-study.png" alt="老熊猫在校园阅览室认真写下大学规划" />
            <figcaption>把每一步想清楚，再稳稳出发。</figcaption>
          </figure>
        </section>

        <section className="education-transfer-screen motion-intro" id="transfer-section" aria-labelledby="transfer-title">
          <div className="education-transfer-copy">
            <p className="education-section-kicker">第二步 · 转专业助手</p>
            <h2 id="transfer-title">想转专业？<br />先做一次认真比较。</h2>
            <p>填入你正在读的专业和已经想好的目标专业，把学习体验、个人适配、学校政策与现实代价放在一起比较。</p>
            <a className="education-cta" href="/transfer" data-page-transition data-transition-copy="老熊猫正在打开转专业助手">用15分钟，判断转专业优劣 <span aria-hidden="true">→</span></a>
            <small>得到的是一份倾向建议，不替你拍板，也不承诺转专业结果。</small>
          </div>
          <div className="education-transfer-points" aria-label="转专业助手会帮你完成的比较">
            <article><span>01</span><div><b>比较两边是否适合</b><p>同一组问题分别评价当前专业与目标专业，不靠一时冲动。</p></div></article>
            <article><span>02</span><div><b>把学校政策单独核对</b><p>能不能转、什么时候转、是否降级，未知项会明确提醒你去教务处查。</p></div></article>
            <article><span>03</span><div><b>看见收益，也看见代价</b><p>结果会说明更值得继续验证的方向，以及下一步该补什么信息。</p></div></article>
          </div>
        </section>

        <section className="education-contact motion-resource" aria-labelledby="contact-title">
          <div className="education-contact-copy">
            <p className="education-section-kicker">第三步 · 继续和老熊猫聊</p>
            <h2 id="contact-title">大学里的新问题，<br />不用一个人硬猜。</h2>
            <p>测完以后，保存二维码，用抖音扫一扫进入免费公开群。老熊猫会持续分享选课、转专业、升学、就业和体制规划内容。</p>
            <dl className="education-contact-list">
              <div><dt>抖音</dt><dd><a href="https://v.douyin.com/4Dh6ZKeHj50/" target="_blank" rel="noopener noreferrer">老熊猫 ↗</a></dd></div>
              <div><dt>小红书</dt><dd>搜索“辅导员老熊猫”</dd></div>
              <div><dt>粉丝群</dt><dd>🐼高校生存指南2群 · 443950191034</dd></div>
            </dl>
            <small>公开群免费交流；老熊猫日常工作较多，消息可能不能及时回复。</small>
          </div>
          <figure className="education-contact-qr">
            <img src="/douyin-fan-group-2-qr.jpg" alt="抖音高校生存指南2群二维码，群号443950191034" />
            <figcaption>保存图片后，打开抖音搜索页扫一扫</figcaption>
          </figure>
        </section>
        <div className="education-page-transition" aria-hidden="true" role="status" aria-live="polite">
          <div><img src="/panda/avatar.png" alt="老熊猫头像" /><p data-transition-message>老熊猫正在打开测评</p><i aria-hidden="true" /></div>
        </div>
        <footer>本测评用于职业探索与自我反思，不是临床心理诊断；结果仅供参考，不构成志愿填报或职业选择的唯一依据。</footer>
      </HomeMotion>
    </main>
  );
}
