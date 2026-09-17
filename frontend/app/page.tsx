import TaskInput from "@/components/TaskInput";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <div className="max-w-2xl mx-auto px-6 py-20">
        <div className="flex items-center gap-2 mb-6">
          <div className="h-6 w-6 rounded bg-indigo/15 border border-indigo/30 flex items-center justify-center">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-light" />
          </div>
          <span className="font-mono text-[11px] tracking-wide text-text-dim uppercase">
            Research Agent &middot; Autonomous
          </span>
        </div>

        <h1 className="font-display text-3xl md:text-4xl font-semibold text-text leading-tight">
          Give it a task. It plans, researches,
          <br />
          and writes the report.
        </h1>
        <p className="mt-4 text-text-muted max-w-[55ch] text-[15px]">
          Describe what you want researched. The agent breaks it into steps,
          decides which tools to use &mdash; web search, document lookup, or a
          calculator &mdash; and compiles the findings into a structured report.
        </p>

        <div className="mt-10">
          <TaskInput />
        </div>
      </div>
    </main>
  );
}