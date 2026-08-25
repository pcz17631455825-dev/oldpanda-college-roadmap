"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { questions } from "@/data/questions";

const draftKey = "career-assessment-v2-draft";
const resultKey = "career-assessment-v2-result";

export function Assessment() {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<number[][]>(Array.from({ length: questions.length }, () => []));
  const [started] = useState(Date.now());
  const question = questions[index];
  useEffect(() => {
    const saved = localStorage.getItem(draftKey);
    if (!saved) return;
    try {
      const draft = JSON.parse(saved) as { index: number; answers: number[][] };
      setIndex(Math.min(draft.index, questions.length - 1));
      setAnswers(Array.from({ length: questions.length }, (_, i) => draft.answers[i] || []));
    } catch { localStorage.removeItem(draftKey); }
  }, []);
  const save = (next: number[][]) => {
    setAnswers(next);
    localStorage.setItem(draftKey, JSON.stringify({ index, answers: next }));
  };
  const finish = (final: number[][]) => {
    if (final.some((answer) => !answer.length)) return;
    localStorage.setItem(resultKey, JSON.stringify({ answers: final, duration: Math.round((Date.now() - started) / 1000) }));
    localStorage.removeItem(draftKey);
    router.push("/results");
  };
  const choose = (option: number) => {
    const current = answers[index];
    const maximum = question.maxSelections ?? question.options.length;
    if (question.type === "multiple" && !current.includes(option) && current.length >= maximum) return;
    const picked = question.type === "multiple" ? current.includes(option) ? current.filter((item) => item !== option) : [...current, option] : [option];
    const next = answers.map((item, i) => i === index ? picked : item);
    save(next);
    if (question.type === "single") setTimeout(() => index < questions.length - 1 ? setIndex(index + 1) : finish(next), 180);
  };
  const nextQuestion = () => {
    if (!answers[index].length) return;
    if (index < questions.length - 1) {
      setIndex(index + 1);
      localStorage.setItem(draftKey, JSON.stringify({ index: index + 1, answers }));
    } else finish(answers);
  };
  return <main className="assessment-shell">
    <div className="assessment-top"><span>老熊猫陪你梳理方向</span><span>{index + 1} / {questions.length}</span></div>
    <div className="progress"><i style={{ width: `${((index + 1) / questions.length) * 100}%` }} /></div>
    <p className="question-kind">{question.type === "multiple" ? `情境选择 · 可多选，最多 ${question.maxSelections ?? 2} 项` : "情境选择 · 每题选最接近你的反应"}</p>
    <h1>{question.text}</h1>
    <div className="options">{question.options.map((option, i) => <button key={option.label} onClick={() => choose(i)} className={answers[index].includes(i) ? "selected" : ""}><span>{String.fromCharCode(65 + i)}</span>{option.label}</button>)}</div>
    <div className="assessment-bottom"><button className="text-button" onClick={() => setIndex(Math.max(0, index - 1))} disabled={index === 0}>← 上一题</button>{question.type === "multiple" && <button className="primary small" onClick={nextQuestion} disabled={!answers[index].length}>{index === questions.length - 1 ? "查看结果" : "下一题 →"}</button>}</div>
  </main>;
}
