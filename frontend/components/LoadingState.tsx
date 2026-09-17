export default function LoadingState() {
  return (
    <div className="glass-2 glow-indigo rounded-lg px-5 py-6">
      <span className="inline-flex items-center gap-2 rounded-full bg-indigo/10 border border-indigo/30 px-3 py-1 font-mono text-[11px] tracking-wide text-indigo-light uppercase">
        <span className="relative flex h-1.5 w-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-light opacity-75" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-indigo-light" />
        </span>
        active_synthesis
      </span>

      <p className="mt-4 text-text text-[15px]">
        Planning steps, dispatching tools, compiling report&hellip;
      </p>
      <p className="mt-2 font-mono text-[12px] text-text-dim">
        30&ndash;90s typical. Longer on first request while the server wakes up.
      </p>
    </div>
  );
}