import { NextResponse } from "next/server";
import { getClients } from "~/server/queries";

export async function GET() {
  const clients = await getClients();
  return NextResponse.json(clients);
}
