import Link from "next/link";

export function SiteHeader() {
  return <header className="site-header panda-header">
    <Link href="/" className="brand"><img src="/panda/avatar.png" alt="老熊猫" /><span><b>老熊猫大学路线图</b><small>前大学辅导员 · 大学规划陪跑</small></span></Link>
    <nav><Link href="/">首页</Link><Link href="/majors">专业图鉴</Link><a href="/#resources">资料驿站</a></nav>
  </header>;
}
