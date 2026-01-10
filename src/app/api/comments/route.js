import { NextResponse } from "next/server";
import { cookies } from "next/headers"
import { prisma } from '@/libs/prisma'
import crypto from 'crypto'




export async function GET(request) {

   

    const cookieStore = await cookies()
    const csrfCookie = cookieStore.get('csrfToken')?.value
    const csrfHeader = request.headers.get('x-csrf-token')

    if (!csrfCookie || !csrfHeader || csrfCookie !== csrfHeader) {
        return NextResponse.json({ error: 'Invalid CSRF token' }, { status: 403 })
    }


    const cookie = request.headers.get('cookie') || ''
    const match = cookie.match(/(?:^|;\s*) secretKey=([^;]*)/)

    const id = request.headers.get('messageId')

    const comments = await prisma.comment.findMany({
        where: {
            messageId: Number(id)
        },
        orderBy: {
            date: 'asc'
        }
    })

    

    const safeComments = comments.map(({ secretKey, _count, ...cmt }) => ({
        ...cmt,
        canEdit: secretKey === (match ? match[1] : null),
        isComment: true
    }))

    return NextResponse.json(safeComments)
}


function generateSession() {
    const publicId = `wbn#${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
    const secretKey = crypto.randomBytes(16).toString('hex');

    return {
        publicId,
        secretKey,
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 1 mes
    };
};


export async function POST(request) {

    const cookieStore = await cookies()
    const csrfCookie = cookieStore.get('csrfToken')?.value
    const csrfHeader = request.headers.get('x-csrf-token')
    
    if(!csrfCookie || !csrfHeader || csrfCookie !== csrfHeader){
        return NextResponse.json({ error: 'Invalid CSRF token' }, { status: 403 })
    }


    const sage = request.headers.get('sage') === 'true'

    const user = cookieStore.get('user')
    if (!user) {
        const session = generateSession()
        cookieStore.set({
            name: 'user',
            value: session.publicId,
            expires: session.expires,

        })
        cookieStore.set({
            name: 'secretKey',
            value: session.secretKey,
            expires: session.expires,
            httpOnly: true,
        })

    }

    const { content, messageId, parentId, boardId } = await request.json()


    if (!sage) {
        await prisma.message.update({
            where: {
                id: Number(messageId)
            },
            data: {
                lastReply: new Date()
            }
        })
    }

    const op = await prisma.message.findUnique({
        where: {
            id: Number(messageId)
        },
        select: {
            userId: true
        }
    });

    const newComment = await prisma.comment.create({
        data: {
            content,
            messageId,
            userId: cookieStore.get('user')?.value,
            secretKey: cookieStore.get('secretKey')?.value,
            parentId,
            isOP: op?.userId === cookieStore.get('user')?.value
        }
    });
    const origin = request.headers.get('origin') || 'http://localhost:3000'; 
    const response = await fetch(`${origin}/api/bot/notify/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-csrf-token": csrfHeader },
        body: JSON.stringify({
            id: newComment.id,
            content: newComment.content,
            postId: Number(messageId),
            boardId: boardId,

        })
    })

    return NextResponse.json(newComment);
}

export async function DELETE(request, { params }) {

    const cookieStore = await cookies()
    const csrfCookie = cookieStore.get('csrfToken')?.value
    const csrfHeader = request.headers.get('x-csrf-token')
    
    if(!csrfCookie || !csrfHeader || csrfCookie !== csrfHeader){
        return NextResponse.json({ error: 'Invalid CSRF token' }, { status: 403 })
    }

    const { messageId } = await request.json();

    const userSecret = cookieStore.get('secretKey')

    const message = await prisma.message.findUnique({ where: { id: Number(messageId) } })
    if (!message || message.secretKey !== userSecret) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }

    try {
        const deletedComment = await prisma.comment.deleteMany({
            where: {
                messageId: Number(messageId)
            }
        });
        return NextResponse.json(deletedComment);
    } catch (error) {
        return NextResponse.json(error);
    }
}