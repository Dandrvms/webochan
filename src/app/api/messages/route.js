import { NextResponse } from "next/server";
import { prisma } from '@/libs/prisma'
import crypto from 'crypto'
import { verifyToken } from "@/utils/auth";

export async function GET(request) {
    try {
        const csrfCookie = request.cookies.get('csrfToken')?.value
        const csrfHeader = request.headers.get('X-CSRF-Token')

        if (!csrfCookie || !csrfHeader || csrfCookie !== csrfHeader) {
            return NextResponse.json({ error: 'Invalid CSRF token' }, { status: 403 })
        }

        const path = request.headers.get('path')
        const board = path?.split("/") || []
        const boardId = board[2] || "webo"

        const cookieHeader = request.headers.get('cookie') || ''
        const secretKeyMatch = cookieHeader.match(/(?:^|;\s*)secretKey=([^;]*)/)
        const userSecret = secretKeyMatch ? secretKeyMatch[1] : null

        const messages = await prisma.message.findMany({
            where: {
            
                boardId: boardId
            },
            include: {
                _count: { select: { comments: true } },
                comments: {
                    take: 3,
                    orderBy: { date: 'desc' },
                    select: {
                        id: true,
                        content: true,
                        date: true,
                    }
                },
                author: {
                    select: {
                        username: true, 
                    },
                },
                userId: false,
            }
        })
        const getRelevantDate = (msg) => msg.lastReply ? new Date(msg.lastReply) : new Date(msg.date)

        const safeMessages = messages.map(({ secretKey, _count, ...msg }) => ({
            ...msg,
            canEdit: secretKey === userSecret,
            comments: _count.comments,
            commentsContent: msg.comments.slice().reverse(),
            isComment: false,
            isPinned: msg.id === 72,
            isEdited: msg.versions && msg.versions.length > 1
        })).sort((a, b) => {
            const aDate = getRelevantDate(a)
            const bDate = getRelevantDate(b)
            return bDate - aDate
        })

        const pinnedMessages = safeMessages.filter(msg => msg.isPinned)
        const unpinnedMessages = safeMessages.filter(msg => !msg.isPinned)
        const sorted = [...pinnedMessages, ...unpinnedMessages]

        return NextResponse.json(sorted)
    } catch (error) {
        console.error('Error en GET /api/messages:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

function generateSession() {
    const publicId = `wbn#${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
    const secretKey = crypto.randomBytes(16).toString('hex');

    return {
        publicId,
        secretKey,
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 1 mes
    };
}

export async function POST(request) {
    try {
        const csrfCookie = request.cookies.get('csrfToken')?.value
        const csrfHeader = request.headers.get('X-CSRF-Token')
        const token = request.cookies.get('auth_token')?.value

        

        if (!csrfCookie || !csrfHeader || csrfCookie !== csrfHeader) {
            return NextResponse.json({ error: 'Invalid CSRF token' }, { status: 403 })
        }

        const decoded = verifyToken(token)
        const origin = request.headers.get('origin') || 'http://localhost:3000';

        const cookieHeader = request.headers.get('cookie') || ''
        let user = cookieHeader.match(/(?:^|;\s*)user=([^;]*)/)?.[1]
        let secretKey = cookieHeader.match(/(?:^|;\s*)secretKey=([^;]*)/)?.[1]

        let isNewSession = false
        if (!user || !secretKey) {
            const session = generateSession()
            secretKey = session.secretKey
            user = session.publicId
            isNewSession = true
        }

        const { content, boardId } = await request.json()

        const newMessage = await prisma.message.create({
            data: {
                content,
                boardId: boardId,
                userId: user,
                authorId: decoded ? decoded.userId : null,
                secretKey: secretKey,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 días
            }
        });

        await prisma.versions.create({
            data: {
                content: newMessage.content,
                messageId: newMessage.id
            }
        });



        const response = NextResponse.json({
            ...newMessage,
            canEdit: true,
            comments: 0,
            commentsContent: [],
            isComment: false,
            isPinned: false,
            isEdited: false
        },)

        if (isNewSession) {
            response.cookies.set('user', user, {
                path: '/',
                maxAge: 30 * 24 * 60 * 60,
                sameSite: 'lax'
            });
            response.cookies.set('secretKey', secretKey, {
                path: '/',
                maxAge: 30 * 24 * 60 * 60,
                httpOnly: true,
                sameSite: 'lax'
            });
        }

        fetch(`${origin}/api/bot/notify/posts`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-Token": csrfHeader
            },
            body: JSON.stringify({
                id: newMessage.id,
                content: newMessage.content,
                boardId: newMessage.boardId,
            })
        }).catch(console.error)


        return response;
    } catch (error) {
        console.error("Error en POST /api/messages:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }

}