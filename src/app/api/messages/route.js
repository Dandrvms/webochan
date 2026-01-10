import { NextResponse } from "next/server";

import { prisma } from '@/libs/prisma'

import { cookies } from 'next/headers'
import crypto from 'crypto'

const BOT_TOKEN = process.env.BOT_TOKEN





export async function GET(request) {

    

    const cookieStore = await cookies()
    const csrfCookie = cookieStore.get('csrfToken')?.value
    const csrfHeader = request.headers.get('x-csrf-token')

    if (!csrfCookie || !csrfHeader || csrfCookie !== csrfHeader) {
        return NextResponse.json({ error: 'Invalid CSRF token' }, { status: 403 })
    }

    const path = request.headers.get('path')
    const board = path.split("/")
    const cookie = request.headers.get('cookie') || ''
    const match = cookie.match(/(?:^|;\s*) secretKey=([^;]*)/)



    const messages = await prisma.message.findMany({
        where: {
            // expiresAt: {
            //     gt: new Date()
            // },

            boardId: board[2] || "webo" // Asegurarse de que boardId sea null si no se proporciona

        },
        include: {
            _count: { select: { comments: true } }
            , comments: {
                take: 3,
                orderBy: { date: 'desc' },
                include: { userId: false, secretKey: false }
            },
            userId: false,
        }
    })
    const getRelevantDate = (msg) => msg.lastReply ? new Date(msg.lastReply) : new Date(msg.date)

    const safeMessages = messages.map(({ secretKey, _count, ...msg }) => ({
        ...msg,
        canEdit: secretKey === (match ? match[1] : null),
        comments: _count.comments,
        commentsContent: msg.comments.slice().reverse(),
        isComment: false,
        isPinned: msg.id === 72
    })).sort((a, b) => {
        const aDate = getRelevantDate(a)
        const bDate = getRelevantDate(b)
        return bDate - aDate
    })

    const pinnedMessages = safeMessages.filter(msg => msg.isPinned)
    const unpinnedMessages = safeMessages.filter(msg => !msg.isPinned)
    const sorted = [...pinnedMessages, ...unpinnedMessages]




    return NextResponse.json(sorted)

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

    const origin = request.headers.get('origin') || 'http://localhost:3000'; // Usa un valor por defecto si no hay origin

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

    const { content, boardId } = await request.json()



    const newMessage = await prisma.message.create({
        data: {
            content,
            boardId: boardId,
            userId: cookieStore.get('user')?.value,
            secretKey: cookieStore.get('secretKey')?.value,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 días
        }
    });

 
    const response = await fetch(`${origin}/api/bot/notify/posts`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-csrf-token": csrfHeader
        },
        body: JSON.stringify({
            id: newMessage.id,
            content: newMessage.content,
            boardId: newMessage.boardId,
        })
    })


    return NextResponse.json(newMessage, { headers: { 'X-Origin': origin } });
}

