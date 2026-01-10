import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";
import { cookies } from "next/headers";
import crypto from "crypto";
export async function POST(request) {

    const cookieStore = await cookies()
    const csrfCookie = cookieStore.get('csrfToken')?.value
    const csrfHeader = request.headers.get('x-csrf-token')

    if (!csrfCookie || !csrfHeader || csrfCookie !== csrfHeader) {
        return NextResponse.json({ error: 'Invalid CSRF token' }, { status: 403 })
    }

    const userSecret = cookieStore.get('secretKey');

    if (!userSecret) {
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

    const { pollId, optionId } = await request.json();

    // Check if the vote already exists
    const existingVote = await prisma.poll_Votes.findFirst({
        where: {
            pollId: Number(pollId),
            userId: cookieStore.get('secretKey')?.value,
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
    const newVote = await prisma.poll_Votes.create({
        data: {
            pollId: Number(pollId),
            optionId: Number(optionId),
            userId: cookieStore.get('secretKey')?.value, // Use the secret key as userId
        },
    });

    return NextResponse.json(newVote);
}


export async function DELETE(request) {


    const cookieStore = await cookies()
    const csrfCookie = cookieStore.get('csrfToken')?.value
    const csrfHeader = request.headers.get('x-csrf-token')

    if (!csrfCookie || !csrfHeader || csrfCookie !== csrfHeader) {
        return NextResponse.json({ error: 'Invalid CSRF token' }, { status: 403 })
    }
    
    const userSecret = cookieStore.get('secretKey');

    if (!userSecret) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { pollId, optionId } = await request.json();

    // Check if the vote exists
    const existingVote = await prisma.poll_Votes.findFirst({
        where: {
            pollId: Number(pollId),
            optionId: Number(optionId),
            userId: cookieStore.get('secretKey')?.value,
        },
    });

    if (!existingVote) {
        return NextResponse.json({ error: 'Voto no encontrado' }, { status: 404 });
    }

    // Delete the vote
    await prisma.poll_Votes.delete({
        where: {
            id: existingVote.id,
        },
    });

    return NextResponse.json({ message: 'Voto eliminado correctamente' });
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
