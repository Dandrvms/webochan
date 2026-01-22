import { NextResponse } from "next/server";
import { prisma } from '@/libs/prisma'

export async function POST(request) {


    const { content, postId } = await request.json();

    const token = request.headers.get('Authorization')?.split(' ')[1]

    if (token !== process.env.BOT_TOKEN) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }


    const messageEdited = await prisma.message.update({
        where: {
            id: Number(postId)
        },
        data: {
            content,
            isEdited: true,
            date: new Date().toISOString()
        }
    });

    await prisma.versions.create({
        data: {
            content: messageEdited.content,
            messageId: messageEdited.id
        }
    });


    return NextResponse.json(messageEdited);
}
