"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { submitTask } from "@/lib/api";
import LoadingState from "./LoadingState";

export default function TaskInput() {
  const [task, setTask] = useState("");
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
      <div className="glass-2 rounded-lg overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-border">
          <span className="font-mono text-[11px] tracking-wide text-text-dim uppercase">
            Agent Prompt Channel
          </span>
          <span className="flex items-center gap-1.5 font-mono text-[11px] text-emerald">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald" />
            ready
          </span>
        </div>

        <textarea
          value={task}
          onChange={(e) => setTask(e.target.value)}
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
            className="rounded-md bg-indigo px-4 py-2 text-sm font-medium text-white
                       disabled:opacity-30 disabled:cursor-not-allowed
                       hover:bg-indigo-light hover:shadow-[0_0_16px_rgba(99,102,241,0.45)]
                       transition-all"
          >
            Run research
          </button>
        </div>
      </div>

      {error && (
        <p className="mt-3 font-mono text-[13px] text-crimson-light">{error}</p>
      )}
    </form>
  );
}