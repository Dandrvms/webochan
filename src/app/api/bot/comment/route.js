import { NextResponse } from "next/server";
import { prisma } from '@/libs/prisma'



export async function POST(request) {


    const { content, postId, derivedKey } = await request.json();
    
    const token = request.headers.get('Authorization')?.split(' ')[1]

    if (token !== process.env.BOT_TOKEN) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }


    const newComment = await prisma.comment.create({
        data: {
            content,
            messageId: Number(postId),
            userId: `wbn#${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
            secretKey: derivedKey,
        }
    });

    await prisma.comment_Versions.create({
        data: {
            content: newComment.content,
            commentId: newComment.id
        }
    });

    
    return NextResponse.json(newComment);
}
