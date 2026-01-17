import { NextResponse } from "next/server";
import { prisma } from '@/libs/prisma'
import crypto from 'crypto'

export async function GET(request) {
    try {   
        const csrfCookie = request.cookies.get('csrfToken')?.value
        const csrfHeader = request.headers.get('x-csrf-token')

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
            isOP: secretKey === opSecretKey, // Añadir isOP
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
        const csrfHeader = request.headers.get('x-csrf-token')
    
        if(!csrfCookie || !csrfHeader || csrfCookie !== csrfHeader){
            return NextResponse.json({ error: 'Invalid CSRF token' }, { status: 403 })
        }

        const sage = request.headers.get('sage') === 'true'

        const cookieHeader = request.headers.get('cookie') || ''
        let user = cookieHeader.match(/(?:^|;\s*)user=([^;]*)/)?.[1]
        let secretKey = cookieHeader.match(/(?:^|;\s*)secretKey=([^;]*)/)?.[1]
        if (!user || !secretKey) {
            const session = generateSession()
            user = session.publicId
            secretKey = session.secretKey
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
                secretKey: secretKey,
                parentId: parentId ? Number(parentId) : null,
                isOP: isOP
            }
        })

        const processedComment = {
            ...newComment,
            canEdit: true,
            isOP: isOP,
            replies: 0,
            isEdited: false
        }
        const origin = request.headers.get('origin') || 'http://localhost:3000'
        
        fetch(`${origin}/api/bot/notify/comments`, {
            method: "POST",
            headers: { "Content-Type": "application/json", "x-csrf-token": csrfHeader },
            body: JSON.stringify({
                id: newComment.id,
                content: newComment.content,
                postId: Number(messageId),
                boardId: boardId,
            })
        }).catch(console.error)

        return NextResponse.json(processedComment)
    } catch (error) {
        console.error("Error in POST /api/comments:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }

    // export async function DELETE(request, { params }) {

    //     const cookieStore = await cookies()
    //     const csrfCookie = cookieStore.get('csrfToken')?.value
    //     const csrfHeader = request.headers.get('x-csrf-token')
        
    //     if(!csrfCookie || !csrfHeader || csrfCookie !== csrfHeader){
    //         return NextResponse.json({ error: 'Invalid CSRF token' }, { status: 403 })
    //     }

    //     const { messageId } = await request.json();

    //     const userSecret = cookieStore.get('secretKey')

    //     const message = await prisma.message.findUnique({ where: { id: Number(messageId) } })
    //     if (!message || message.secretKey !== userSecret) {
    //         return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    //     }

    //     try {
    //         const deletedComment = await prisma.comment.deleteMany({
    //             where: {
    //                 messageId: Number(messageId)
    //             }
    //         });
    //         return NextResponse.json(deletedComment);
    //     } catch (error) {
    //         return NextResponse.json(error);
    //     }
}