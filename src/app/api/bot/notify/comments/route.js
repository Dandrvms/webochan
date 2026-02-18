import { NextResponse } from "next/server";



export async function POST(request) {


  const { id, content, postId, boardId } = await request.json()
  console.log(boardId)
  const res = await fetch(`${process.env.BOT_URL}/api/notify/comment`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.BOT_TOKEN}`
    },
    body: JSON.stringify({
      id,
      content,
      postId,
      boardId
    })
  });

  return NextResponse.json({ status: res.status });
}