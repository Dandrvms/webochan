import { NextResponse } from "next/server";
import { prisma } from '@/libs/prisma'
import { cookies } from 'next/headers'



export async function POST(request) {


    const { content, board, derivedKey } = await request.json();
    
    const token = request.headers.get('Authorization')?.split(' ')[1]

    if (token !== process.env.BOT_TOKEN) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }


    const newMessage = await prisma.message.create({
        data: {
            content,
            boardId: board,
            userId: `wbn#${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
            secretKey: derivedKey,
        }
    });

    
    return NextResponse.json(newMessage);
}
