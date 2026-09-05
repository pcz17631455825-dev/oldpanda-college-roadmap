"use client";

import { useEffect, useRef } from "react";
import { mountTransfer } from "@/features/transfer/ui";

export function TransferApp() {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!root.current) return;
    return mountTransfer(root.current, { homeHref: "/", assessmentHref: "/assessment", assetBase: "/" });
  }, []);
  return <div ref={root}><p style={{ padding: 32 }}>正在打开转专业决策助手…</p><noscript>请启用 JavaScript 后使用本地测评功能。</noscript></div>;
}
