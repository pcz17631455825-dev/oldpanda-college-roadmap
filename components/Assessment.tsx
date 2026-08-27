"use client";

import { useEffect, useState } from "react";
import { questions } from "@/data/questions";

// Keep the new assessment separate from legacy drafts that could contain
// incorrect default selections from an earlier version.
const draftKey = "career-assessment-v3-draft";
const resultKey = "career-assessment-v3-result";

export function Assessment() {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<number[][]>(Array.from({ length: questions.length }, () => []));
  const [generating, setGenerating] = useState(false);
  const question = questions[index];
  const isLast = index === questions.length - 1;
  const completed = answers.filter((answer) => answer.length).length;

  useEffect(() => {
    const saved = localStorage.getItem(draftKey);
    if (!saved) return;
    try {
      const draft = JSON.parse(saved) as { index: number; answers: number[][] };
      const nextIndex = Math.min(draft.index, questions.length - 1);
      const nextAnswers = Array.from({ length: questions.length }, (_, item) => draft.answers[item] || []);
      const timer = window.setTimeout(() => { setIndex(nextIndex); setAnswers(nextAnswers); }, 0);
      return () => window.clearTimeout(timer);
    } catch { localStorage.removeItem(draftKey); }
  }, []);

  const save = (next: number[][], nextIndex = index) => {
    setAnswers(next);
    localStorage.setItem(draftKey, JSON.stringify({ index: nextIndex, answers: next }));
  };

  const finish = (final: number[][]) => {
    const firstMissing = final.findIndex((answer) => !answer.length);
    if (firstMissing !== -1) {
      setIndex(firstMissing);
      save(final, firstMissing);
      return;
    }
    localStorage.setItem(resultKey, JSON.stringify({ answers: final, duration: 0 }));
    localStorage.removeItem(draftKey);
    setGenerating(true);
    window.setTimeout(() => window.location.assign("/results"), 360);
  };

  const choose = (option: number) => {
    const current = answers[index];
    const maximum = question.maxSelections ?? question.options.length;
    if (question.type === "multiple" && !current.includes(option) && current.length >= maximum) return;
    const picked = question.type === "multiple"
      ? current.includes(option) ? current.filter((item) => item !== option) : [...current, option]
      : [option];
    const next = answers.map((item, itemIndex) => itemIndex === index ? picked : item);
    if (question.type === "single" && !isLast) {
      const nextIndex = index + 1;
      save(next, nextIndex);
      window.setTimeout(() => setIndex(nextIndex), 160);
      return;
    }
    save(next);
  };

  const nextQuestion = () => {
    if (!answers[index].length) return;
    if (isLast) finish(answers);
    else {
      const nextIndex = index + 1;
      setIndex(nextIndex);
      save(answers, nextIndex);
    }
  };

  if (generating) return <main className="result-transition" role="status" aria-live="polite"><p>正在生成你的大学路线图…</p></main>;

  return <main className="assessment-shell">
    <div className="assessment-top"><span>老熊猫陪你梳理方向</span><span>{index + 1} / {questions.length}</span></div>
    <div className="progress" role="progressbar" aria-label="测评答题进度" aria-valuemin={1} aria-valuemax={questions.length} aria-valuenow={index + 1} aria-valuetext={`第 ${index + 1} 题，共 ${questions.length} 题`}><i style={{ width: `${((index + 1) / questions.length) * 100}%` }} /></div>
    {completed > 0 && completed % 12 === 0 && <p className="stage-feedback" role="status">你已经完成 {Math.round((completed / questions.length) * 100)}%，方向正在变得更清楚。</p>}
    <p className="answer-storage">当前已答 {completed} / {questions.length} 题 · 答案仅保存在这台设备；中途退出，下次可继续。</p>
    <p className="question-kind">{question.type === "multiple" ? `情境选择 · 可多选，最多 ${question.maxSelections ?? 2} 项` : "情境选择 · 每题选最接近你的反应"}</p>
    <h1>{question.text}</h1>
    <div className="options">{question.options.map((option, item) => <button type="button" key={option.label} onClick={() => choose(item)} aria-pressed={answers[index].includes(item)} className={answers[index].includes(item) ? "selected" : ""}><span>{String.fromCharCode(65 + item)}</span>{option.label}</button>)}</div>
    <div className="assessment-bottom"><button type="button" className="text-button" onClick={() => { const previous = Math.max(0, index - 1); setIndex(previous); save(answers, previous); }} disabled={index === 0}>← 上一题</button>{isLast ? answers[index].length ? <button type="button" className="primary small" onClick={nextQuestion}>提交测评，开始解读 →</button> : <span className="answer-note">选择后即可提交</span> : question.type === "multiple" && <button type="button" className="primary small" onClick={nextQuestion} disabled={!answers[index].length}>下一题 →</button>}</div>
  </main>;
}
