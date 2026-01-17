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

        const pollId = request.headers.get('pollId')

        if (!pollId) {
            return NextResponse.json({ error: 'pollId is required' }, { status: 400 })
        }

        const comments = await prisma.comment.findMany({
            where: {
                pollId: Number(pollId)
            },
            orderBy: {
                date: 'asc'
            }
        })

        const poll = await prisma.poll.findUnique({
            where: { id: Number(pollId) },
            select: { secretKey: true }
        })

        const opSecretKey = poll?.secretKey

        const safeComments = comments.map(({ secretKey, _count, ...cmt }) => ({
            ...cmt,
            canEdit: secretKey === userSecret,
            isComment: true,
            isOP: secretKey === opSecretKey,
            isEdited: false
        }))

        return NextResponse.json(safeComments)
    } catch (error) {
        console.error("Error en GET /api/poll_comments:", error)
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
};


export async function POST(request) {

    try {
        const csrfCookie = request.cookies.get('csrfToken')?.value
        const csrfHeader = request.headers.get('x-csrf-token')

        if (!csrfCookie || !csrfHeader || csrfCookie !== csrfHeader) {
            return NextResponse.json({ error: 'Invalid CSRF token' }, { status: 403 })
        }

        const sage = request.headers.get('sage') === 'true'


        const cookieHeader = request.headers.get('cookie') || ''
        let user = cookieHeader.match(/(?:^|;\s*)user=([^;]*)/)?.[1]
        let secretKey = cookieHeader.match(/(?:^|;\s*)secretKey=([^;]*)/)?.[1]

        let newCookies = []

        if (!user || !secretKey){
            const session = generateSession()
            secretKey = session.secretKey
            user = session.publicId
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

        const poll = await prisma.poll.findUnique({
            where: { id: Number(pollId) },
            select: { secretKey: true }
        })

        const isOP = poll?.secretKey === secretKey

        const newComment = await prisma.comment.create({
            data: {
                content,
                pollId: Number(pollId),
                userId: user,
                secretKey: secretKey,
                parentId: parentId ? Number(parentId) : null,
                isOP: isOP
            }
        });

        const response = NextResponse.json({
            ...newComment,
            canEdit: true,
            isOP: false,
            replies: 0,
            isEdited: false
        })

        if (newCookies.length > 0){
            newCookies.forEach(cookie => response.headers.append('Set-Cookie', cookie))
        }
        return response
    } catch (error) {
        console.error("Error en POST /api/poll_comments:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}