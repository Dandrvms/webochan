import { prisma } from '@/libs/prisma'
import { NextResponse } from "next/server";

const BOT_TOKEN = process.env.BOT_TOKEN

export async function GET(request) {

    const token = request.headers.get('Authorization')?.split(' ')[1]
    if (token !== BOT_TOKEN) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const posts = await prisma.message.findMany({
        where: {
            boardId: 'webo',
            date: {
                gte: new Date(Date.now() - 120 * 60 * 60 * 1000), // last 24 hours
            },
        },

        select:{
            id: true,
            boardId: true,
            content: true,
        }
    })

    return NextResponse.json(posts, { status: 200 })
}