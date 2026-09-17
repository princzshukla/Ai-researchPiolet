import Link from "next/link";
import { getReport } from "@/lib/api";
import AgentTrace from "@/components/AgentTrace";
import ReportView from "@/components/ReportView";

export default async function ReportPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let report;
  try {
    report = await getReport(id);
  } catch {
    return (
      <main className="min-h-screen">
        <div className="max-w-2xl mx-auto px-6 py-20">
          <p className="text-text">Couldn&rsquo;t find that report.</p>
          <Link href="/" className="mt-4 inline-block font-mono text-[13px] text-cyan-light">
            &larr; run a new task
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <div className="max-w-2xl mx-auto px-6 py-16">
        <Link
          href="/"
          className="font-mono text-[12px] text-text-dim hover:text-text-muted transition-colors"
        >
          &larr; new task
        </Link>

        <p className="mt-6 font-display text-lg text-text leading-snug">{report.task}</p>

        {report.status === "pending" && (
          <p className="mt-6 font-mono text-[13px] text-text-dim">
            still running &mdash; refresh in a moment
          </p>
        )}

        {report.status === "failed" && (
          <div className="mt-6 rounded-lg bg-crimson/10 border border-crimson/30 px-5 py-4">
            <p className="font-mono text-[13px] text-crimson-light">{report.final_report}</p>
          </div>
        )}

        {report.status === "done" && (
          <>
            {report.completed_steps.length > 0 && (
              <div className="mt-8">
                <AgentTrace steps={report.completed_steps} />
              </div>
            )}

            {report.final_report && (
              <div className="mt-6">
                <ReportView markdown={report.final_report} />
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}