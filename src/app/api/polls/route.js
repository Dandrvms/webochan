import { NextResponse } from "next/server";
import { prisma } from '@/libs/prisma'
import crypto from "crypto";

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

        const polls = await prisma.poll.findMany({
            include: {
                options: {
                    include: {
                        votes: true
                    }
                },
                _count: { select: { comments: true } },
                comments: {
                    take: 3,
                    orderBy: { date: 'desc' },
                    select: {
                        id: true,
                        content: true,
                        date: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        })
        const getRelevantDate = (poll) => poll.lastReply ? new Date(poll.lastReply) : new Date(poll.createdAt)

        const safePolls = polls.map(({ secretKey, _count, options, ...poll }) => {
            // Calcula el total de votos sumando los votos de todas las opciones
            const totalVotes = options?.reduce((sum, option) => sum + option.votes.length, 0) || 0

            return {
                ...poll,
                options: options?.map(option => ({
                    ...option,
                    voteCount: option.votes.length,
                    votes: []
                })),
                totalVotes,
                canEdit: secretKey === userSecret,
                comments: _count.comments,
                commentsContent: poll.comments.slice().reverse(),
                isComment: false,
                closed: new Date(poll.expiresAt) < new Date(Date.now())
            }
        })
        // const pinnedPolls = safePolls.filter(poll => poll.isPinned)
        // const unpinnedPolls = safePolls.filter(poll => !poll.isPinned)
        // const sorted = [...pinnedPolls, ...unpinnedPolls]



        return NextResponse.json(safePolls)
    } catch (error) {
        console.error("Error en GET /api/polls:", error)
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
        const csrfHeader = request.headers.get('X-CSRF-Token')

        if (!csrfCookie || !csrfHeader || csrfCookie !== csrfHeader) {
            return NextResponse.json({ error: 'Invalid CSRF token' }, { status: 403 })
        }

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


        const { question, options } = await request.json()


        const newPoll = await prisma.poll.create({
            data: {
                question,
                userId: user,
                secretKey: secretKey,
                options: {
                    create: options.map(option => ({
                        option: option
                    }))
                },
                expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 días
            },
            include: {
                options: {
                    include: {
                        votes: true
                    }
                }
            }
        })

        const response = NextResponse.json({
            ...newPoll,
            options: newPoll.options.map(option => ({
                ...option,
                voteCount: 0,
                votes: []
            })),
            totalVotes: 0,
            comments: 0,
            commentsContent: [],
            closed: false
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

        return response 
    } catch (error) {
        console.error("Error en POST /api/polls:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}