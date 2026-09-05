import Link from "next/link";

export function SiteHeader() {
  return <header className="site-header panda-header"><Link href="/" className="brand"><img src="/panda/avatar.png" alt="老熊猫头像" /><span><b>老熊猫大学路线图</b><small>前大学辅导员 · 大学规划陪跑</small></span></Link><nav aria-label="网站导航"><Link href="/">首页</Link><a href="#transfer-section" data-scroll-transfer>转专业助手</a></nav></header>;
}
