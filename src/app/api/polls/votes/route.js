import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";
import crypto from "crypto";

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

        const { pollId, optionId } = await request.json();

        // Check if the vote already exists
        const existingVote = await prisma.poll_Votes.findFirst({
            where: {
                pollId: Number(pollId),
                userId: user,
            },
        });

        if (existingVote) {
            return NextResponse.json({ error: 'Ya has votado en esta encuesta' }, { status: 400 });
        }

        // Check if the poll is closed
        const pollClosed = await prisma.poll.findFirst({
            where: {
                id: Number(pollId),
            }
        })

        if (new Date(pollClosed.expiresAt) < new Date()) {
            return NextResponse.json({ error: 'La encuesta está cerrada' }, { status: 400 });
        }


        // Create a new vote
        await prisma.poll_Votes.create({
            data: {
                pollId: Number(pollId),
                optionId: Number(optionId),
                userId: user // Use the secret key as userId
            },
        });

        const updatedPoll = await prisma.poll.findUnique({
            where: { id: pollId },
            include: {
                options: { include: { votes: true } },
                _count: { select: { comments: true } }
            }
        })

        const response = NextResponse.json({
            ...updatedPoll,
            totalVotes: updatedPoll.options.reduce((sum, opt) => sum + opt.votes.length, 0),
            options: updatedPoll.options.map(opt => ({
                ...opt,
                voteCount: opt.votes.length,
                votes: []
            })),
            comments: updatedPoll._count.comments
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

        
        return response;
    } catch (error) {
        console.error("Error voting:", error)
        return NextResponse.json({ error: "Error al registrar voto" }, { status: 500 })
    }
}


// export async function DELETE(request) {


//     const cookieStore = await cookies()
//     const csrfCookie = cookieStore.get('csrfToken')?.value
//     const csrfHeader = request.headers.get('X-CSRF-Token')

//     if (!csrfCookie || !csrfHeader || csrfCookie !== csrfHeader) {
//         return NextResponse.json({ error: 'Invalid CSRF token' }, { status: 403 })
//     }

//     const userSecret = cookieStore.get('secretKey');

//     if (!userSecret) {
//         return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//     }

//     const { pollId, optionId } = await request.json();

//     // Check if the vote exists
//     const existingVote = await prisma.poll_Votes.findFirst({
//         where: {
//             pollId: Number(pollId),
//             optionId: Number(optionId),
//             userId: cookieStore.get('secretKey')?.value,
//         },
//     });

//     if (!existingVote) {
//         return NextResponse.json({ error: 'Voto no encontrado' }, { status: 404 });
//     }

//     // Delete the vote
//     await prisma.poll_Votes.delete({
//         where: {
//             id: existingVote.id,
//         },
//     });

//     return NextResponse.json({ message: 'Voto eliminado correctamente' });
// }


function generateSession() {
    const publicId = `wbn#${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
    const secretKey = crypto.randomBytes(16).toString('hex');

    return {
        publicId,
        secretKey,
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 1 mes
    };
};
