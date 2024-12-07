import { NextResponse } from "next/server";
import { getFournisseurs } from "~/server/queries";

export async function GET() {
  const fournisseurs = await getFournisseurs();
  return NextResponse.json(fournisseurs);
}
