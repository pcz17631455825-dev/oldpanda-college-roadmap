"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { computeResult } from "@/lib/assessment";
import { majors } from "@/data/majors";
import type { AssessmentResult } from "@/types";
type SortBy = "match" | "outlook" | "study";

export default function MajorsPage() {
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [sort, setSort] = useState<SortBy>("match");
  useEffect(() => { const saved = localStorage.getItem("career-assessment-v2-result"); if (saved) { const { answers, duration } = JSON.parse(saved) as { answers: number[][]; duration: number }; setResult(computeResult(answers, duration)); } }, []);
  const list = useMemo(() => result ? [...result.recommendations].sort((a, b) => sort === "match" ? b.matchScore - a.matchScore : sort === "outlook" ? b.major.outlook - a.major.outlook : b.major.studyFriendly - a.major.studyFriendly) : majors.map((major, index) => ({ major, matchScore: 92 - index * 4 })), [result, sort]);
  return <main><SiteHeader /><section className="major-intro"><p className="eyebrow">OLD PANDA · MAJOR GUIDE</p><h1>{result ? "这些专业，和你的选择更合拍。" : "从一门专业，打开一条新路。"}</h1><p>{result ? `基于你的 ${result.hollandCode} 兴趣代码与${result.faction}倾向，老熊猫为你排出了这份优先了解清单。` : "先浏览专业图鉴；完成测评后，可获得更贴近你发展路线的排序。"}</p></section><main className="major-list"><div className="sorts">{([['match','匹配度'],['outlook','就业前景'],['study','升学友好度']] as [SortBy, string][]).map(([key, label]) => <button key={key} onClick={() => setSort(key)} className={sort === key ? "active" : ""}>{label}</button>)}</div><div className="major-grid">{list.map(({ major, matchScore }, index) => <Link href={`/majors/${major.id}`} className="major-card" key={major.id}><div><span className="rank">0{index + 1}</span><span className="score">{matchScore}% 匹配</span></div><h2>{major.name}</h2><p>{major.category} · {major.degree}</p><b>{major.tag}</b><span className={`public-job public-${major.publicJobs}`}>考公岗位：{major.publicJobs}</span><span className="card-arrow">↗</span></Link>)}</div><p className="salary-note">考公岗位数量为专业口径的相对提示，不等同于保证录用；招录专业、学历、地区等要求，请以当年官方公告和职位表为准。</p></main></main>;
}
