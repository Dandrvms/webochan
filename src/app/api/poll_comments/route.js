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

    const id = request.headers.get('pollId')

    const comments = await prisma.comment.findMany({
        where: {
            pollId: Number(id)
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

    if (!csrfCookie || !csrfHeader || csrfCookie !== csrfHeader) {
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

    const { content, pollId, parentId } = await request.json()


    if (!sage) {
        await prisma.poll.update({
            where: {
                id: Number(pollId)
            },
            data: {
                lastReply: new Date()
            }
        })
    }


    const newComment = await prisma.comment.create({
        data: {
            content,
            pollId,
            userId: cookieStore.get('user')?.value,
            secretKey: cookieStore.get('secretKey')?.value,
            parentId
        }
    });


    // response = await fetch("/api/bot/notify/comments", {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json", "x-csrf-token": csrfHeader },
    //     body: JSON.stringify({
    //         id: newComment.id,
    //         content: newComment.content,
    //         postId: Number(messageId),
    //         boardId: newComment.boardId,

    //     })
    // })

    return NextResponse.json(newComment);
}

export async function DELETE(request, { params }) {
    const cookieStore = await cookies()
    const csrfCookie = cookieStore.get('csrfToken')?.value
    const csrfHeader = request.headers.get('x-csrf-token')
    
    if(!csrfCookie || !csrfHeader || csrfCookie !== csrfHeader){
        return NextResponse.json({ error: 'Invalid CSRF token' }, { status: 403 })
    }

    const { pollId } = await request.json();

    const userSecret = cookieStore.get('secretKey')

    const poll = await prisma.poll.findUnique({ where: { id: Number(pollId) } })
    if (!poll || poll.secretKey !== userSecret) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }

    try {
        const deletedComment = await prisma.comment.deleteMany({
            where: {
                pollId: Number(pollId)
            }
        });
        return NextResponse.json(deletedComment);
    } catch (error) {
        return NextResponse.json(error);
    }
}