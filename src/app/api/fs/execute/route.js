import { NextResponse } from "next/server";
import { parseCommand } from "@/libs/fs/commandParser"
import { executeCommand } from "@/libs/fs/commandRegistry"
import { getOrCreateSession } from "@/libs/fs/session"

export async function POST(req) {
  const { input } = await req.json();

  const cookieHeader = req.headers.get('cookie') || ''
  const secretKeyMatch = cookieHeader.match(/(?:^|;\s*)secretKey=([^;]*)/)
  let secretKey = secretKeyMatch ? secretKeyMatch[1] : null

  const session = await getOrCreateSession(secretKey);

  try {
    const parsed = parseCommand(input);
    console.log(parsed)
    const result = await executeCommand(parsed, session);
    // if (result.output) {
    //   return NextResponse.json({
    //     ok: true,
    //     output: result.output,
    //     cwd: result.cwd,
    //   });
    // } else {
    console.log("RESULT:",result)

    if (result.error) {
      return NextResponse.json({
        ok: false,
        ...result
      })
    }
    return NextResponse.json({
      ok: true,
      ...result,
    })
    // }
  } catch (err) {
    return NextResponse.json({
      ok: false,
      error: err.message,
    });
  }
}


