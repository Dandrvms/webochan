import { NextResponse } from "next/server";



export async function POST(request) {
 


  const { id, content, boardId } = await request.json()
  
  const res = await fetch(`${process.env.BOT_URL}/api/notify/post`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.BOT_TOKEN}`
     },
    body: JSON.stringify({
      id,
      content,
      boardId
    })
  });

  return NextResponse.json({ status: res.status });
}