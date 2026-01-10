import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";


const BOT_TOKEN = process.env.BOT_TOKEN;

async function fetchPostById(id) {
  const m = await prisma.message.findUnique({
    where: { id: Number(id) },
    select: {
        content: true
    }
  });
  return m
}

export async function GET(request, { params }) {

    if (request.headers.get('Authorization')?.split(' ')[1] !== BOT_TOKEN) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

   
    const { id } = await params;

    // Fetch the post data from your database or API
    const post = await fetchPostById(id);

    if (!post) {
        return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json(post);
}   