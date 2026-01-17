import { prisma } from '@/libs/prisma'
import { NextResponse } from "next/server";

const BOT_TOKEN = process.env.BOT_TOKEN

export async function POST(request) {

    const req = await request.json();
    const { secretKey } = req;
    const token = request.headers.get('Authorization')?.split(' ')[1]
    if (token !== BOT_TOKEN) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log(req)
    console.log("Received secretKey:", secretKey);
    const posts = await prisma.message.findMany({
        where: {
            secretKey: secretKey,
        },

        select:{
            id: true,
            boardId: true,
            content: true,
        }
    })

    console.log(posts);

    return NextResponse.json(posts)
}