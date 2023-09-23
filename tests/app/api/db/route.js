// Next 13 new api handlers
// see https://nextjs.org/docs/app/building-your-application/routing/route-handlers
import { NextResponse } from 'next/server'
import getFiles from "../../../utils/getFiles"

export async function GET() {
  const files = await getFiles("./report")
  const jsonDb = files.filter(item => item.type === "json")

  return NextResponse.json(jsonDb)
}