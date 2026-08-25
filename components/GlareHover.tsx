"use client";

import type { CSSProperties, ReactNode } from "react";
import styles from "./GlareHover.module.css";

type GlareHoverProps = {
  width?: string;
  height?: string;
  background?: string;
  borderRadius?: string;
  borderColor?: string;
  children: ReactNode;
  glareColor?: string;
  glareOpacity?: number;
  glareAngle?: number;
  glareSize?: number;
  transitionDuration?: number;
  playOnce?: boolean;
  className?: string;
  style?: CSSProperties;
};

// React Bits GlareHover, adapted to CSS Modules for this Vinext project.
export function GlareHover({
  width = "100%", height = "100%", background = "transparent", borderRadius = "2px", borderColor = "transparent",
  children, glareColor = "#ffffff", glareOpacity = 0.34, glareAngle = -45, glareSize = 250,
  transitionDuration = 700, playOnce = false, className = "", style = {},
}: GlareHoverProps) {
  const hex = glareColor.replace("#", "");
  let rgba = glareColor;
  if (/^[0-9A-Fa-f]{6}$/.test(hex)) {
    const red = parseInt(hex.slice(0, 2), 16); const green = parseInt(hex.slice(2, 4), 16); const blue = parseInt(hex.slice(4, 6), 16);
    rgba = `rgba(${red}, ${green}, ${blue}, ${glareOpacity})`;
  }
  const variables: CSSProperties & Record<string, string> = {
    "--gh-width": width, "--gh-height": height, "--gh-bg": background, "--gh-br": borderRadius,
    "--gh-angle": `${glareAngle}deg`, "--gh-duration": `${transitionDuration}ms`, "--gh-size": `${glareSize}%`,
    "--gh-rgba": rgba, "--gh-border": borderColor,
  };
  return <div className={`${styles.glareHover} ${playOnce ? styles.playOnce : ""} ${className}`} style={{ ...variables, ...style }}>{children}</div>;
}
