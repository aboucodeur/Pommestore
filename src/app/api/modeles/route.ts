import { NextResponse } from "next/server";
import { getModeles } from "~/server/queries";

export async function GET() {
  const modeles = await getModeles();
  return NextResponse.json(modeles);
}
