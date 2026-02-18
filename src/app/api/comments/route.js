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


        const cookieHeader = request.headers.get('cookie') || ''
        const secretKeyMatch = cookieHeader.match(/(?:^|;\s*)secretKey=([^;]*)/)
        const userSecret = secretKeyMatch ? secretKeyMatch[1] : null

        const messageId = request.headers.get('messageId')

        if (!messageId) {
            return NextResponse.json({ error: 'messageId header is required' }, { status: 400 })
        }

        const comments = await prisma.comment.findMany({
            where: {
                messageId: Number(messageId)
            },
            include: {
                author: {
                    select: {
                        username: true, 
                    },
                }
            },
            orderBy: {
                date: 'asc'
            },
        })

        const message = await prisma.message.findUnique({
            where: { id: Number(messageId) },
            select: { secretKey: true }
        })

        const opSecretKey = message?.secretKey

        const safeComments = comments.map(({ secretKey, _count, ...cmt }) => ({
            ...cmt,
            canEdit: secretKey === userSecret,
            isComment: true,
            isOP: secretKey === opSecretKey, 
            isEdited: false
        }))

        return NextResponse.json(safeComments)
    } catch (error) {
        console.error("Error in GET /api/comments:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
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
        const sage = request.headers.get('sage') === 'true'

        const cookieHeader = request.headers.get('cookie') || ''
        let user = cookieHeader.match(/(?:^|;\s*)user=([^;]*)/)?.[1]
        let secretKey = cookieHeader.match(/(?:^|;\s*)secretKey=([^;]*)/)?.[1]
        
        let isNewSession = false

        if (!user || !secretKey) {
            const session = generateSession()
            user = session.publicId
            secretKey = session.secretKey
            isNewSession = true
        }

        const { content, messageId, parentId, boardId } = await request.json()
        console.log(boardId)
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

        const message = await prisma.message.findUnique({
            where: { id: Number(messageId) },
            select: { secretKey: true }
        })

        const isOP = message?.secretKey === secretKey

        const newComment = await prisma.comment.create({
            data: {
                content,
                messageId: Number(messageId),
                userId: user,
                authorId: decoded ? decoded.userId : null,
                secretKey: secretKey,
                parentId: parentId ? Number(parentId) : null,
                isOP: isOP
            }
        })

        await prisma.comment_Versions.create({
            data: {
                content: newComment.content,
                commentId: newComment.id
            }
        });


        const response = NextResponse.json({
            ...newComment,
            canEdit: true,
            isOP: isOP,
            replies: 0,
            isEdited: false
        })

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


        const origin = request.headers.get('origin') || 'http://localhost:3000'

        fetch(`${origin}/api/bot/notify/comments`, {
            method: "POST",
            headers: { "Content-Type": "application/json", "X-CSRF-Token": csrfHeader },
            body: JSON.stringify({
                id: newComment.id,
                content: newComment.content,
                postId: Number(messageId),
                boardId: boardId,
            })
        }).catch(console.error)

        return response
    } catch (error) {
        console.error("Error in POST /api/comments:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }

}