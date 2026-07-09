import { useMemo, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";

type Recommendation = "APPLY" | "MAYBE" | "SKIP";
type FitCategory = "STRONG" | "MODERATE" | "STRETCH" | "WEAK";

type ResumeAnalysis = {
  recommendation: Recommendation;
  confidence_score: number;
  overall_match_score: number;
  skills_match_score: number;
  experience_match_score: number;
  career_direction_score: number;
  fit_category: FitCategory;
  strong_matches: string[];
  transferable_matches: string[];
  missing_skills: string[];
  learnable_gaps: string[];
  serious_gaps: string[];
  deal_breakers: string[];
  matched_keywords: string[];
  missing_keywords: string[];
  role_alignment: string;
  reasoning: string;
};

type AnalyzeResponse = {
  company: string;
  role: string;
  analysis: ResumeAnalysis;
};

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

const recommendationStyles: Record<Recommendation, string> = {
  APPLY: "from-emerald-400 to-teal-500 text-emerald-950",
  MAYBE: "from-amber-300 to-orange-400 text-amber-950",
  SKIP: "from-rose-400 to-red-500 text-rose-950"
};

const fitStyles: Record<FitCategory, string> = {
  STRONG: "border-emerald-300 bg-emerald-50 text-emerald-800",
  MODERATE: "border-sky-300 bg-sky-50 text-sky-800",
  STRETCH: "border-amber-300 bg-amber-50 text-amber-800",
  WEAK: "border-rose-300 bg-rose-50 text-rose-800"
};

function ScoreCard({
  label,
  score,
  hint
}: {
  label: string;
  score: number;
  hint: string;
}) {
  const color =
    score >= 75
      ? "text-emerald-600"
      : score >= 55
        ? "text-amber-600"
        : "text-rose-600";

  return (
    <div className="rounded-3xl border border-white/70 bg-white/80 p-5 shadow-sm backdrop-blur">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <div className="mt-3 flex items-end gap-2">
        <span className={`text-4xl font-black tracking-tight ${color}`}>
          {score}
        </span>
        <span className="pb-1 text-sm font-semibold text-slate-400">/100</span>
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-500">{hint}</p>
    </div>
  );
}

function Section({
  title,
  items,
  tone = "neutral"
}: {
  title: string;
  items: string[];
  tone?: "neutral" | "good" | "warn" | "bad";
}) {
  const dotClass =
    tone === "good"
      ? "bg-emerald-400"
      : tone === "warn"
        ? "bg-amber-400"
        : tone === "bad"
          ? "bg-rose-400"
          : "bg-slate-300";

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="text-lg font-bold text-slate-900">{title}</h3>
      {items.length ? (
        <ul className="mt-4 space-y-3">
          {items.map((item, index) => (
            <li key={`${title}-${index}`} className="flex gap-3 text-sm leading-6 text-slate-600">
              <span className={`mt-2 h-2 w-2 shrink-0 rounded-full ${dotClass}`} />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 text-sm text-slate-400">Nothing significant found.</p>
      )}
    </div>
  );
}

function App() {
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState<AnalyzeResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const wordCount = useMemo(() => {
    return jobDescription.trim()
      ? jobDescription.trim().split(/\s+/).length
      : 0;
  }, [jobDescription]);

  async function handleFileUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const text = await file.text();
    setJobDescription(text);
  }

  async function handleAnalyze(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setResult(null);

    if (!jobDescription.trim()) {
      setError("Paste or upload a job description first.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/analyze`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          company,
          role,
          job_description: jobDescription
        })
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new Error(payload?.detail || "Analysis failed.");
      }

      const payload = (await response.json()) as AnalyzeResponse;
      setResult(payload);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,#dbeafe,transparent_35%),linear-gradient(135deg,#f8fafc_0%,#eef2ff_45%,#fdf2f8_100%)] px-5 py-8 text-slate-900">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <div className="inline-flex rounded-full border border-white/70 bg-white/70 px-4 py-2 text-sm font-semibold text-indigo-700 shadow-sm backdrop-blur">
              Job Agent · Fit Check
            </div>
            <h1 className="mt-5 max-w-4xl text-4xl font-black tracking-tight text-slate-950 md:text-6xl">
              Know your fit before you apply.
            </h1>
            <p className="mt-4 max-w-5xl text-lg leading-8 text-slate-600 xl:whitespace-nowrap">
              Upload the job description and get a structured fit analysis based
              on your resume, experience, strengths, and career direction.
            </p>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[440px_1fr]">
          <form
            onSubmit={handleAnalyze}
            className="rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-xl shadow-indigo-100/60 backdrop-blur"
          >
            <h2 className="text-2xl font-black text-slate-950">Job Details</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Provide the role details and JD text. It will be used to evaluate
              fit and generate the recommendation.
            </p>

            <label className="mt-6 block">
              <span className="text-sm font-bold text-slate-700">Company</span>
              <input
                value={company}
                onChange={(event) => setCompany(event.target.value)}
                placeholder="e.g. Edwards Lifesciences"
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
              />
            </label>

            <label className="mt-4 block">
              <span className="text-sm font-bold text-slate-700">Role</span>
              <input
                value={role}
                onChange={(event) => setRole(event.target.value)}
                placeholder="e.g. Senior Engineer, AI & ML"
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
              />
            </label>

            <label className="mt-4 block">
              <span className="text-sm font-bold text-slate-700">Upload JD</span>
              <input
                type="file"
                accept=".txt,.md"
                onChange={handleFileUpload}
                className="mt-2 w-full rounded-2xl border border-dashed border-indigo-200 bg-indigo-50/60 px-4 py-4 text-sm text-slate-600 file:mr-4 file:rounded-full file:border-0 file:bg-indigo-600 file:px-4 file:py-2 file:text-sm file:font-bold file:text-white hover:file:bg-indigo-700"
              />
              <span className="mt-2 block text-xs font-medium text-slate-400">
                Supported format: .txt
              </span>
            </label>

            <label className="mt-4 block">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-700">Job Description</span>
                <span className="text-xs font-semibold text-slate-400">{wordCount} words</span>
              </div>
              <textarea
                value={jobDescription}
                onChange={(event) => setJobDescription(event.target.value)}
                placeholder="Paste the JD here..."
                rows={16}
                className="mt-2 w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
              />
            </label>

            {error && (
              <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="mt-6 w-full rounded-2xl bg-slate-950 px-5 py-4 text-sm font-black text-white shadow-lg shadow-slate-300 transition hover:-translate-y-0.5 hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
            >
              {isLoading ? "Generating recommendation..." : "Analyze"}
            </button>
          </form>

          <section className="min-h-[680px]">
            {!result && !isLoading && (
              <div className="flex h-full min-h-[680px] items-center justify-center rounded-[2rem] border border-white/70 bg-white/60 p-10 text-center shadow-xl shadow-indigo-100/60 backdrop-blur">
                <div>
                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-indigo-600 text-3xl text-white shadow-lg shadow-indigo-200">
                    ✦
                  </div>
                  <h2 className="mt-6 text-3xl font-black text-slate-950">
                    Your analysis will appear here.
                  </h2>
                  <p className="mx-auto mt-3 max-w-md text-slate-500">
                    The first version focuses on genuine fit. ATS gap analysis
                    comes next as a separate stage.
                  </p>
                </div>
              </div>
            )}

            {isLoading && (
              <div className="flex h-full min-h-[680px] items-center justify-center rounded-[2rem] border border-white/70 bg-white/70 p-10 text-center shadow-xl shadow-indigo-100/60 backdrop-blur">
                <div>
                  <div className="mx-auto h-16 w-16 animate-spin rounded-full border-4 border-indigo-100 border-t-indigo-600" />
                  <h2 className="mt-6 text-3xl font-black text-slate-950">
                    Evaluating your fit...
                  </h2>
                  <p className="mx-auto mt-3 max-w-md text-slate-500">
                    This may take a moment while the analyzer reviews the role,
                    your resume, and your profile.
                  </p>
                </div>
              </div>
            )}

            {result && (
              <div className="space-y-6">
                <div className="overflow-hidden rounded-[2rem] border border-white/70 bg-white shadow-xl shadow-indigo-100/60">
                  <div className={`bg-gradient-to-r p-8 ${recommendationStyles[result.analysis.recommendation]}`}>
                    <p className="text-sm font-black uppercase tracking-[0.3em] opacity-70">
                      Recommendation
                    </p>
                    <div className="mt-3 flex flex-col justify-between gap-4 md:flex-row md:items-end">
                      <div>
                        <h2 className="text-5xl font-black tracking-tight">
                          {result.analysis.recommendation}
                        </h2>
                        <p className="mt-2 text-lg font-semibold opacity-80">
                          {result.company} · {result.role}
                        </p>
                      </div>
                      <span className={`w-fit rounded-full border px-4 py-2 text-sm font-black ${fitStyles[result.analysis.fit_category]}`}>
                        {result.analysis.fit_category} FIT
                      </span>
                    </div>
                  </div>

                  <div className="grid gap-4 p-6 md:grid-cols-2 xl:grid-cols-5">
                    <ScoreCard label="Confidence" score={result.analysis.confidence_score} hint="How certain the decision is." />
                    <ScoreCard label="Overall" score={result.analysis.overall_match_score} hint="Total job fit." />
                    <ScoreCard label="Skills" score={result.analysis.skills_match_score} hint="Technical match." />
                    <ScoreCard label="Experience" score={result.analysis.experience_match_score} hint="Similar work evidence." />
                    <ScoreCard label="Direction" score={result.analysis.career_direction_score} hint="Career alignment." />
                  </div>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="text-lg font-bold text-slate-900">Reasoning</h3>
                  <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-600">
                    {result.analysis.reasoning}
                  </p>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="text-lg font-bold text-slate-900">Role Alignment</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    {result.analysis.role_alignment}
                  </p>
                </div>

                <div className="grid gap-6 xl:grid-cols-2">
                  <Section title="Strong Matches" items={result.analysis.strong_matches} tone="good" />
                  <Section title="Transferable Matches" items={result.analysis.transferable_matches} tone="good" />
                  <Section title="Learnable Gaps" items={result.analysis.learnable_gaps} tone="warn" />
                  <Section title="Serious Gaps" items={result.analysis.serious_gaps} tone="bad" />
                  <Section title="Deal Breakers" items={result.analysis.deal_breakers} tone="bad" />
                  <Section title="Missing Skills" items={result.analysis.missing_skills} tone="warn" />
                </div>

                <div className="grid gap-6 xl:grid-cols-2">
                  <Section title="Matched Keywords" items={result.analysis.matched_keywords} tone="good" />
                  <Section title="Missing Keywords" items={result.analysis.missing_keywords} tone="warn" />
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

export default App;
