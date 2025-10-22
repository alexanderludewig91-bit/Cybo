"use client";

import { getScoreColor, getScoreBgColor } from "@/lib/utils";

interface SecurityScoreProps {
  score: number;
  size?: "sm" | "md" | "lg";
}

export function SecurityScore({ score, size = "md" }: SecurityScoreProps) {
  const radius = size === "sm" ? 30 : size === "md" ? 40 : 50;
  const strokeWidth = size === "sm" ? 4 : size === "md" ? 6 : 8;
  const normalizedRadius = radius - strokeWidth * 0.5;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg height={radius * 2} width={radius * 2}>
        <circle
          stroke="hsl(var(--muted))"
          fill="transparent"
          strokeWidth={strokeWidth}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          stroke="currentColor"
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference + " " + circumference}
          style={{ strokeDashoffset, transition: "stroke-dashoffset 0.5s" }}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          className={getScoreColor(score)}
          transform={`rotate(-90 ${radius} ${radius})`}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`font-bold ${size === "sm" ? "text-sm" : size === "md" ? "text-xl" : "text-2xl"}`}>
          {score}
        </span>
        {size !== "sm" && (
          <span className="text-xs text-muted-foreground">/ 100</span>
        )}
      </div>
    </div>
  );
}

