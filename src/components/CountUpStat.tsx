"use client";

import { useEffect, useRef, useState } from "react";

function parseStatValue(value: string) {
  const match = value.match(/^([\d.]+)(.*)$/);
  if (!match) return { target: 0, suffix: value, decimals: 0 };
  const numStr = match[1];
  const suffix = match[2];
  const decimals = numStr.includes(".") ? numStr.split(".")[1].length : 0;
  return { target: parseFloat(numStr), suffix, decimals };
}

function formatValue(current: number, decimals: number, suffix: string) {
  const num =
    decimals > 0 ? current.toFixed(decimals) : Math.round(current).toString();
  return `${num}${suffix}`;
}

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

export default function CountUpStat({
  value,
  className,
  start = false,
}: {
  value: string;
  className?: string;
  start?: boolean;
}) {
  const { target, suffix, decimals } = parseStatValue(value);
  const [display, setDisplay] = useState(() => formatValue(0, decimals, suffix));
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!start) {
      hasAnimated.current = false;
      setDisplay(formatValue(0, decimals, suffix));
      return;
    }
    if (hasAnimated.current) return;
    hasAnimated.current = true;

    const duration = 1600;
    const startTime = performance.now();
    let frameId = 0;

    const tick = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const current = target * easeOutCubic(progress);
      setDisplay(formatValue(current, decimals, suffix));
      if (progress < 1) frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [start, target, decimals, suffix, value]);

  return <span className={className}>{display}</span>;
}
