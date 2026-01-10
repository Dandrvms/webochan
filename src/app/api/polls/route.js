import { NextResponse } from "next/server";

import { prisma } from '@/libs/prisma'
import crypto from "crypto";
import { cookies } from "next/headers";



export async function GET(request) {

    const cookieStore = await cookies()
    const csrfCookie = cookieStore.get('csrfToken')?.value
    const csrfHeader = request.headers.get('x-csrf-token')

    if (!csrfCookie || !csrfHeader || csrfCookie !== csrfHeader) {
        return NextResponse.json({ error: 'Invalid CSRF token' }, { status: 403 })
    }

    const cookie = request.headers.get('cookie') || ''
    const match = cookie.match(/(?:^|;\s*) secretKey=([^;]*)/)

    const raw_polls = await prisma.poll.findMany({

        include: {
            options: {
                include: {
                    votes: true
                }
            },
            _count: { select: { comments: true } }
            , comments: {
                take: 3,
                orderBy: { date: 'desc' },
                include: { userId: false, secretKey: false }
            },
            userId: false,
        }
    })


    const polls = raw_polls.map(poll => ({
        ...poll,
        closed: new Date(poll.expiresAt) < new Date(),

    }))

    const getRelevantDate = (poll) => poll.lastReply ? new Date(poll.lastReply) : new Date(poll.createdAt)

    const safePolls = polls.map(({ secretKey, _count, options, ...poll }) => {
        // Calcula el total de votos sumando los votos de todas las opciones
        const totalVotes = options?.reduce((sum, option) => sum + option.votes.length, 0) || 0;

        return {
            ...poll,
            options: options?.map(option => ({
                ...option,
                voteCount: option.votes.length
            })),
            totalVotes, // <-- Aquí lo agregas
            canEdit: secretKey === (match ? match[1] : null),
            comments: _count.comments,
            commentsContent: poll.comments.slice().reverse(),
            isComment: false,
        }
    }).sort((a, b) => {

        return getRelevantDate(b) - getRelevantDate(a)
    })

    // const pinnedPolls = safePolls.filter(poll => poll.isPinned)
    // const unpinnedPolls = safePolls.filter(poll => !poll.isPinned)
    // const sorted = [...pinnedPolls, ...unpinnedPolls]



    return NextResponse.json(safePolls)
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

    const { question, options, boardId } = await request.json()



    const newPoll = await prisma.poll.create({
        data: {
            question,
            options: {
                create: options.map(option => ({
                    option
                }))
            },
            boardId: boardId,
            userId: cookieStore.get('user')?.value,
            secretKey: cookieStore.get('secretKey')?.value,
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 días
        }
    });


    // response = await fetch("/api/bot/notify/posts", {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json", "x-csrf-token": csrfHeader },
    //     body: JSON.stringify({
    //         id: newPoll.id,
    //         content: newPoll.question,
    //         boardId: "polls",

    //     })
    // })



    return NextResponse.json(newPoll);
}

// export async function PUT(request) {
//     const { id, content } = await request.json()

//     const cookieStore = await cookies()
//     const secretKey = cookieStore.get('secretKey')?.value

//     if (!secretKey) {
//         return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
//     }

//     const updatedPoll = await prisma.poll.update({
//         where: {
//             id,
//             secretKey
//         },
//         data: {
//             content
//         }
//     })

//     return NextResponse.json(updatedPoll)
// }