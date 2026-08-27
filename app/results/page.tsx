"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { questions } from "@/data/questions";
import { computeResult, hollandLabels, valueLabels } from "@/lib/assessment";
import type { AssessmentResult, Faction } from "@/types";
import "../launch-update.css";

const draftKey = "career-assessment-v3-draft";
const resultKey = "career-assessment-v3-result";
const routeGuides: Record<Faction, { title: string; body: string; action: string; url: string }> = {
  "就业派": { title: "先看就业派实战打法", body: "实习、考证、项目和求职能力，到底该怎么排优先级？先把容易浪费时间的坑避开。", action: "观看《就业全攻略》→", url: "https://v.douyin.com/ovsK9HCTinU/" },
  "升学派": { title: "先看升学派实战打法", body: "保研、考研、留学不是简单三选一。先看大学四年该怎样安排绩点、英语、竞赛和实践。", action: "观看《升学全攻略》→", url: "https://v.douyin.com/UAUFUXMFaOA/" },
  "体制派": { title: "先看体制派实战打法", body: "入党、选调、国省考、考编、央国企可以怎样同步准备？先把长期路径理顺。", action: "观看《体制全攻略》→", url: "https://v.douyin.com/ZoYFMD_qqqA/" },
};

export default function ResultsPage() {
  const router = useRouter();
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [missing, setMissing] = useState<number | null>(null);
  const [savedAnswers, setSavedAnswers] = useState<number[][]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(resultKey);
      const parsed = saved ? JSON.parse(saved) as { answers?: number[][]; duration?: number } : null;
      const answers = Array.from({ length: questions.length }, (_, item) => parsed?.answers?.[item] || []);
      const firstMissing = answers.findIndex((answer) => !answer.length);
      if (firstMissing !== -1) {
        const timer = window.setTimeout(() => {
          setSavedAnswers(answers);
          setMissing(questions.length - answers.filter((answer) => answer.length).length);
        }, 0);
        return () => window.clearTimeout(timer);
      }
      const timer = window.setTimeout(() => setResult(computeResult(answers, parsed?.duration ?? 0)), 0);
      return () => window.clearTimeout(timer);
    } catch {
      const timer = window.setTimeout(() => {
        setMissing(questions.length);
        setSavedAnswers(Array.from({ length: questions.length }, () => []));
      }, 0);
      return () => window.clearTimeout(timer);
    }
  }, []);

  const continueAssessment = () => {
    const firstMissing = savedAnswers.findIndex((answer) => !answer.length);
    localStorage.setItem(draftKey, JSON.stringify({ index: Math.max(firstMissing, 0), answers: savedAnswers }));
    router.replace("/assessment");
  };

  if (missing !== null) return <main className="results incomplete-results"><div className="result-top"><Link href="/" className="brand">老熊猫大学路线图</Link><p>测评未完成</p></div><section className="incomplete-card"><p>还不能生成结果</p><h1>你还差 {missing} 题，完成后才能生成大学路线图。</h1><button type="button" className="primary" onClick={continueAssessment}>继续完成测评 →</button></section></main>;
  if (!result) return <main className="result-transition" role="status" aria-live="polite"><p>正在打开你的大学路线图…</p></main>;

  const guide = routeGuides[result.faction];
  const theme = result.faction === "升学派" ? "study" : result.faction === "就业派" ? "work" : "stable";
  return <main className="results">
    <div className="result-top"><Link href="/" className="brand">老熊猫大学路线图</Link><p>你的测评结果</p></div>
    <section className={`faction-card ${theme}`}><p>你的发展倾向</p><h1>{result.faction}</h1><span>{result.faction === "升学派" ? "越学越有底气" : result.faction === "就业派" ? "在实践中把能力变现" : "在稳定中建立长期优势"}</span></section>
    <section className="result-section"><p className="eyebrow">你的兴趣偏好</p><h2>{result.hollandCode}</h2><p className="code-explain">{result.hollandCode.split("").map((key) => hollandLabels[key as keyof typeof hollandLabels]).join(" · ")}。结果来自行为情境、兴趣活动和价值排序的综合画像，不是人格标签。</p><div className="bars">{Object.entries(result.hollandScores).map(([key, score]) => <div key={key}><span>{key}</span><i><b style={{ width: `${score}%` }} /></i><em>{score}</em></div>)}</div></section>
    <section className="result-section path"><p className="eyebrow">你接下来可以怎么做</p><h2>适合你的发展节奏</h2><p>{result.factionDescription}</p><div className="values">{result.valuesRanking.slice(0, 3).map((key, index) => <span key={key}><b>TOP {index + 1}</b>{valueLabels[key]}</span>)}</div></section>
    <section className="result-action"><p className="eyebrow">接下来，先走这一步</p><h2>{guide.title}</h2><p>{guide.body}</p><a className="route-video-button" href={guide.url} target="_blank" rel="noopener noreferrer">{guide.action}</a></section>
    <section className="fan-group" aria-labelledby="fan-group-title"><div className="fan-group-copy"><p className="eyebrow">进粉丝群领取资料</p><h2 id="fan-group-title">测完别让结果躺着，进群领取大学规划资料</h2><p>老熊猫会在抖音粉丝群持续更新新生核验、选课、升学、就业和体制规划资料。先保存二维码，再打开抖音扫一扫进群。</p><ol><li>保存二维码到相册</li><li>打开抖音搜索页扫一扫</li><li>加入“🐼高校生存指南1群”</li></ol><small>当前二维码有效至 2026 年 9 月 3 日；如失效，请回老熊猫抖音主页查看最新入群入口。</small></div><img src="/douyin-fan-group-qr.jpg" alt="加入老熊猫抖音粉丝群“高校生存指南1群”的二维码，请保存后用抖音扫一扫" width="840" height="1107" /></section>
    <p className="result-refresh-note">结果不是永久标签。这反映的是你此刻更适合的起步方式，第一学期后也可以重新测一次。</p>
    <p className="disclaimer">本测评用于职业探索与自我反思，不是临床心理诊断；结果仅供参考，不构成志愿填报或职业选择的唯一依据。</p>
  </main>;
}
