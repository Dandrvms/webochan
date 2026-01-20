import { NextResponse } from "next/server";
// import { cookies } from 'next/headers'


export async function POST(request) {


  // const cookieStore = await cookies()
  // const csrfCookie = cookieStore.get('csrfToken')?.value
  // const csrfHeader = request.headers.get('X-CSRF-Token')

  // if (!csrfCookie || !csrfHeader || csrfCookie !== csrfHeader) {
  //   return NextResponse.json({ error: 'Invalid CSRF token' }, { status: 403 })
  // }

  const { id, content, postId, boardId } = await request.json()

  const res = await fetch(`${process.env.BOT_URL}/api/track`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id,
      content,
      postId,
      boardId
    })
  });

  return NextResponse.json({ status: 200 });
}