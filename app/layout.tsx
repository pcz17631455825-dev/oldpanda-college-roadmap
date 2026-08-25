import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://college-direction-lab.pcz17631455825.chatgpt.site"),
  title: "老熊猫大学路线图｜升学·体制·就业",
  description: "前大学辅导员老熊猫的大学规划陪跑：用情境测评梳理升学、体制、就业三条路线。",
  openGraph: { title: "老熊猫大学路线图｜升学·体制·就业", description: "大学这条路，老熊猫陪你先看明白。", images: ["/og.png"] },
  twitter: { card: "summary_large_image", title: "老熊猫大学路线图", description: "大学这条路，老熊猫陪你先看明白。", images: ["/og.png"] },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="zh-CN"><body>{children}</body></html>; }
