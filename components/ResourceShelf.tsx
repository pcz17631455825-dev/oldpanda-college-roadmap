"use client";

import { GlareHover } from "./GlareHover";

const resources = [
  { kind: "新生启程", title: "开学前的第一份安排", body: "报到、适应、选课与第一学期目标，先把容易慌乱的事理成一张清单。", lead: true },
  { kind: "大学学习", title: "把四年过成自己的节奏", body: "课程、实践与复盘的规划方法，帮助你把日常积累成看得见的能力。" },
  { kind: "未来准备", title: "升学、就业与体制内规划", body: "不同路径的准备逻辑与时间节点，后续会持续补充成可下载资料。" },
];

export function ResourceShelf() {
  return <div className="resource-shelf" aria-label="老熊猫资料驿站预告">
    {resources.map((resource) => <GlareHover key={resource.title} className={`resource-glare ${resource.lead ? "resource-glare-lead" : ""}`} glareColor="#ffffff" glareOpacity={0.38} transitionDuration={760}>
      <article className="resource-card">
        <p>{resource.kind}</p><h3>{resource.title}</h3><span>{resource.body}</span><b>整理中</b>
      </article>
    </GlareHover>)}
  </div>;
}
