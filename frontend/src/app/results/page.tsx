import ResultsClient from "@/components/ResultsClient";

export const dynamic = "force-dynamic";

interface ResultsPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function ResultsPage({ searchParams }: ResultsPageProps) {
  const params = await searchParams;
  return <ResultsClient key={params.q ?? ""} initialQuery={params.q ?? ""} />;
}
