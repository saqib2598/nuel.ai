import { NextResponse } from "next/server";
import lanes from "@/data/lanes.json";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const origin = searchParams.get("origin");
  const destination = searchParams.get("destination");

  let filtered = lanes;

  if (origin) filtered = filtered.filter(l => l.origin.toLowerCase().includes(origin.toLowerCase()));
  if (destination) filtered = filtered.filter(l => l.destination.toLowerCase().includes(destination.toLowerCase()));

  return NextResponse.json(filtered);
}
