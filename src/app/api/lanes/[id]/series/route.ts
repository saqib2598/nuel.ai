import { NextResponse } from "next/server";
import seriesData from "../../../../../../data/series.json";

/**
 * GET /api/lanes/[id]/series?from=&to=
 * Returns the 7-day series for the given lane id.
 */
export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params; // 👈 must await now
  const { searchParams } = new URL(request.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  const series = (seriesData as Record<string, any[]>)[id];

  if (!series)
    return NextResponse.json({ error: "Lane not found" }, { status: 404 });

  let filtered = series;
  if (from) filtered = filtered.filter((s) => new Date(s.date) >= new Date(from));
  if (to) filtered = filtered.filter((s) => new Date(s.date) <= new Date(to));

  return NextResponse.json(filtered);
}
