import { NextRequest, NextResponse } from "next/server";

export default async function GET(request: NextRequest) {
  return NextResponse.json({ message: "Hello, world!" });
}
