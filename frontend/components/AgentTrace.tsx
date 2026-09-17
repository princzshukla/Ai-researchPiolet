import type { CompletedStep } from "@/lib/api";

const TOOL_LABEL: Record<string, string> = {
  web_search: "web search",
  rag_search: "document search",
  calculator: "calculator",
};

export default function AgentTrace({ steps }: { steps: CompletedStep[] }) {
  if (steps.length === 0) return null;

  return (
    <div className="glass-2 rounded-lg px-5 py-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-sm font-semibold text-text">
          Decomposition Trace
        </h3>
        <span className="font-mono text-[11px] text-text-dim">
          {steps.length} step{steps.length > 1 ? "s" : ""}
        </span>
      </div>

      <div className="relative pl-6">
        <div className="absolute left-[9px] top-1 bottom-1 w-px bg-border-strong" />

        {steps.map((item, i) => (
          <div key={i} className="relative pb-5 last:pb-0">
            <div className="absolute -left-6 top-0.5 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-emerald/15 border border-emerald/40">
              <svg width="9" height="9" viewBox="0 0 12 12" fill="none">
                <path d="M2 6.5L4.8 9L10 3" stroke="#34D399" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-[11px] text-text-dim">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="inline-flex items-center rounded-full bg-cyan/10 border border-cyan/30 px-2 py-0.5 font-mono text-[10px] tracking-wide text-cyan-light uppercase">
                {TOOL_LABEL[item.tool_used] ?? item.tool_used}
              </span>
            </div>

            <p className="text-[14px] text-text">{item.step}</p>
            <p className="mt-1 text-[13px] text-text-muted whitespace-pre-wrap">
              {truncate(item.result, 400)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return text.slice(0, max).trimEnd() + "\u2026";
}