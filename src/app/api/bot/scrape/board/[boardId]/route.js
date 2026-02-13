import { prisma } from '@/libs/prisma'
import { NextResponse } from "next/server";

const BOT_TOKEN = process.env.BOT_TOKEN

export async function GET(request, { params }) {

    const token = request.headers.get('Authorization')?.split(' ')[1]
    if (token !== BOT_TOKEN) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { boardId } = await params;

    const posts = await prisma.message.findMany({
        where: {
            boardId: boardId,
        },
        select: {
            id: true,
            boardId: true,
            content: true,
            _count: {
                select: { comments: true }
            },
            comments: {
                orderBy: { date: 'asc' },
                select: {
                    content: true,
                    id: true,
                    messageId: true
                }
            }
        },
        orderBy: {
            date: 'desc'
        }
    })

    const addPinnedProperty = posts.map(({ ...post }) => ({
        ...post,
        isPinned: post.id === 72
    }))
    const pinnedPosts = addPinnedProperty.filter(post => post.isPinned)
    const unpinnedPosts = addPinnedProperty.filter(post => !post.isPinned)
    const sorted = [...pinnedPosts, ...unpinnedPosts]



    return NextResponse.json(sorted, { status: 200 })
}