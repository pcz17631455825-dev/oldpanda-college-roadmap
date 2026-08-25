"use client";

import { useEffect, useState } from "react";
import { questions } from "@/data/questions";

const draftKey = "career-assessment-v2-draft";
const resultKey = "career-assessment-v2-result";
const analysisSteps = ["老熊猫正在翻看你的每一道选择…", "正在梳理你的兴趣与价值偏好…", "正在比对升学、体制与就业路线…", "老熊猫加班完成了解读，马上交给你。"];

export function Assessment() {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<number[][]>(Array.from({ length: questions.length }, () => []));
  const [started] = useState(Date.now());
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);
  const question = questions[index];
  const isLast = index === questions.length - 1;

  useEffect(() => {
    const saved = localStorage.getItem(draftKey);
    if (!saved) return;
    try { const draft = JSON.parse(saved) as { index: number; answers: number[][] }; setIndex(Math.min(draft.index, questions.length - 1)); setAnswers(Array.from({ length: questions.length }, (_, i) => draft.answers[i] || [])); }
    catch { localStorage.removeItem(draftKey); }
  }, []);

  const save = (next: number[][], nextIndex = index) => { setAnswers(next); localStorage.setItem(draftKey, JSON.stringify({ index: nextIndex, answers: next })); };
  const finish = (final: number[][]) => {
    if (final.some((answer) => !answer.length)) return;
    localStorage.setItem(resultKey, JSON.stringify({ answers: final, duration: Math.round((Date.now() - started) / 1000) }));
    localStorage.removeItem(draftKey);
    setAnalyzing(true);
    [750, 1450, 2200].forEach((delay, step) => setTimeout(() => setAnalysisStep(step + 1), delay));
    setTimeout(() => window.location.assign("/results"), 3000);
  };
  const choose = (option: number) => {
    const current = answers[index]; const maximum = question.maxSelections ?? question.options.length;
    if (question.type === "multiple" && !current.includes(option) && current.length >= maximum) return;
    const picked = question.type === "multiple" ? current.includes(option) ? current.filter((item) => item !== option) : [...current, option] : [option];
    const next = answers.map((item, i) => i === index ? picked : item); save(next);
    if (question.type === "single" && !isLast) setTimeout(() => setIndex(index + 1), 180);
  };
  const nextQuestion = () => {
    if (!answers[index].length) return;
    if (isLast) finish(answers);
    else { setIndex(index + 1); save(answers, index + 1); }
  };

  if (analyzing) return <main className="analysis-screen"><div className="analysis-card"><div className="analysis-panda">🐼</div><p className="analysis-label">老熊猫正在拼命分析</p><h1>{analysisSteps[analysisStep]}</h1><div className="analysis-progress"><i style={{ width: `${(analysisStep + 1) * 25}%` }} /></div><small>{25 + analysisStep * 25}% · 请稍等，正在生成你的大学路线图</small></div></main>;
  return <main className="assessment-shell"><div className="assessment-top"><span>老熊猫陪你梳理方向</span><span>{index + 1} / {questions.length}</span></div><div className="progress"><i style={{ width: `${((index + 1) / questions.length) * 100}%` }} /></div><p className="question-kind">{question.type === "multiple" ? `情境选择 · 可多选，最多 ${question.maxSelections ?? 2} 项` : "情境选择 · 每题选最接近你的反应"}</p><h1>{question.text}</h1><div className="options">{question.options.map((option, i) => <button key={option.label} onClick={() => choose(i)} className={answers[index].includes(i) ? "selected" : ""}><span>{String.fromCharCode(65 + i)}</span>{option.label}</button>)}</div><div className="assessment-bottom"><button className="text-button" onClick={() => setIndex(Math.max(0, index - 1))} disabled={index === 0}>← 上一题</button>{(question.type === "multiple" || isLast) && <button className="primary small" onClick={nextQuestion} disabled={!answers[index].length}>{isLast ? "提交测评，开始解读 →" : "下一题 →"}</button>}</div></main>;
}
