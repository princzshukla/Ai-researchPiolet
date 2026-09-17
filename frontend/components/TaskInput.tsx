"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { submitTask } from "@/lib/api";
import LoadingState from "./LoadingState";

const EXAMPLES = [
  "Compare LangGraph and CrewAI for multi-agent systems",
  "Current state of RAG evaluation frameworks",
  "Solana vs Ethereum transaction costs in 2026",
];

function CornerBracket({ className }: { className: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={className}>
      <path d="M1 6V1H6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

export default function TaskInput() {
  const [task, setTask] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!task.trim() || isSubmitting) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const result = await submitTask(task.trim());
      router.push(`/report/${result.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setIsSubmitting(false);
    }
  }

  if (isSubmitting) {
    return <LoadingState />;
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative">
        {/* corner brackets */}
        <CornerBracket className="absolute -top-1.5 -left-1.5 text-indigo-light z-10" />
        <CornerBracket className="absolute -top-1.5 -right-1.5 text-indigo-light z-10 rotate-90" />
        <CornerBracket className="absolute -bottom-1.5 -left-1.5 text-cyan-light z-10 -rotate-90" />
        <CornerBracket className="absolute -bottom-1.5 -right-1.5 text-cyan-light z-10 rotate-180" />

        {/* animated rotating gradient border */}
        <div className="relative rounded-xl overflow-hidden p-[1.5px]">
          <div
            className={`absolute inset-[-100%] ${isFocused ? "animate-spin-slow" : ""}`}
            style={{
              background: isFocused
                ? "conic-gradient(from 0deg, transparent 0%, #6366f1 15%, transparent 30%, #06b6d4 55%, transparent 70%)"
                : "conic-gradient(from 0deg, rgba(255,255,255,0.06), rgba(255,255,255,0.12), rgba(255,255,255,0.06))",
            }}
          />

          <div className="relative glass-2 rounded-[11px] overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-border">
              <span className="flex items-center gap-2 font-mono text-[11px] tracking-wide text-text-dim uppercase">
                <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                  <path d="M2 3h12v10H2z" stroke="currentColor" strokeWidth="1.2" opacity="0.4" />
                  <path d="M4.5 6.5l2.5 1.8-2.5 1.8M8.5 10h3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Agent Prompt Channel
              </span>
              <span className="flex items-center gap-1.5 font-mono text-[11px] text-emerald-light">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald opacity-60" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald" />
                </span>
                ready
              </span>
            </div>

            <textarea
              value={task}
              onChange={(e) => setTask(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Direct the agent's focus — e.g. Compare LangGraph and CrewAI for building multi-agent systems"
              rows={4}
              className="w-full resize-none bg-transparent px-4 py-4 text-text text-[15px]
                         placeholder:text-text-dim focus:outline-none"
            />

            <div className="flex items-center justify-between px-4 py-2.5 border-t border-border">
              <span className="font-mono text-[11px] text-text-dim">
                {task.length.toLocaleString()} chars
              </span>

              <button
                type="submit"
                disabled={!task.trim()}
                className="group flex items-center gap-1.5 rounded-md bg-indigo px-4 py-2 text-sm font-medium text-white
                           disabled:opacity-30 disabled:cursor-not-allowed
                           hover:bg-indigo-light hover:shadow-[0_0_20px_rgba(99,102,241,0.5)]
                           transition-all"
              >
                Run research
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 16 16"
                  fill="none"
                  className="transition-transform group-hover:translate-x-0.5"
                >
                  <path
                    d="M3 8h10M9 4l4 4-4 4"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <p className="mt-3 font-mono text-[13px] text-crimson-light">{error}</p>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        {EXAMPLES.map((example) => (
          <button
            key={example}
            type="button"
            onClick={() => setTask(example)}
            className="rounded-full border border-border px-3 py-1.5 font-mono text-[12px] text-text-dim
                       hover:text-text-muted hover:border-border-strong transition-colors"
          >
            {example}
          </button>
        ))}
      </div>
    </form>
  );
}