import TaskInput from "@/components/TaskInput";

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* ambient glow */}
      <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 h-[420px] w-[720px] rounded-full bg-indigo/20 blur-[120px]" />
      <div className="pointer-events-none absolute top-40 right-0 h-[280px] w-[280px] rounded-full bg-cyan/10 blur-[100px]" />

      <div className="relative max-w-2xl mx-auto px-6 py-20">
        <div className="inline-flex items-center gap-2 mb-8 rounded-full glass-1 px-3 py-1.5">
          <div className="h-5 w-5 rounded bg-indigo/20 border border-indigo/40 flex items-center justify-center">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-light shadow-[0_0_6px_rgba(129,140,248,0.8)]" />
          </div>
          <span className="font-mono text-[11px] tracking-wide text-text-dim uppercase">
            Research Agent &middot; Autonomous
          </span>
        </div>

        <h1 className="font-display text-4xl md:text-[42px] font-semibold text-text leading-[1.1] tracking-tight">
          Give it a task. It plans, researches,{" "}
          <span className="bg-gradient-to-r from-indigo-light to-cyan-light bg-clip-text text-transparent">
            and writes the report.
          </span>
        </h1>
        <p className="mt-5 text-text-muted max-w-[54ch] text-[15px] leading-relaxed">
          Describe what you want researched. The agent breaks it into steps,
          decides which tools to use &mdash; web search, document lookup, or a
          calculator &mdash; and compiles the findings into a structured report.
        </p>

        <div className="mt-4 flex items-center gap-4 font-mono text-[11px] text-text-dim">
          <span className="flex items-center gap-1.5">
            <span className="h-1 w-1 rounded-full bg-cyan-light" /> web search
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-1 w-1 rounded-full bg-emerald-light" /> document retrieval
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-1 w-1 rounded-full bg-indigo-light" /> calculator
          </span>
        </div>

        <div className="mt-10">
          <TaskInput />
        </div>
      </div>
    </main>
  );
}