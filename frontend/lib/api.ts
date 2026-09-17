const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "https://ai-researchpiolet.onrender.com";

export interface CompletedStep {
  step: string;
  tool_used: string;
  result: string;
}

export interface ReportResponse {
  id: string;
  task: string;
  plan: string[];
  completed_steps: CompletedStep[];
  final_report: string | null;
  status: "pending" | "done" | "failed";
  created_at: string;
}

export interface TaskResponse {
  id: string;
  status: string;
  final_report: string | null;
}

export async function submitTask(task: string): Promise<TaskResponse> {
  const res = await fetch(`${API_URL}/task`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ task }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.detail ?? `Request failed with status ${res.status}`);
  }

  return res.json();
}

export async function getReport(id: string): Promise<ReportResponse> {
  const res = await fetch(`${API_URL}/report/${id}`, { cache: "no-store" });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.detail ?? `Request failed with status ${res.status}`);
  }

  return res.json();
}