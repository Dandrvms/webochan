import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from '@/libs/prisma'

export async function GET(request) {

    const cookieStore = await cookies()
    const csrfCookie = cookieStore.get('csrfToken')?.value
    const csrfHeader = request.headers.get('x-csrf-token')

    if (!csrfCookie || !csrfHeader || csrfCookie !== csrfHeader) {
        return NextResponse.json({ error: 'Invalid CSRF token' }, { status: 403 })
    }

    const id = request.headers.get('id')
    const messages = await prisma.versions.findMany({
        where: {
            messageId: Number(id)
        }
    })

    return NextResponse.json(messages)
}


export async function POST(request) {

    const cookieStore = await cookies()
    const csrfCookie = cookieStore.get('csrfToken')?.value
    const csrfHeader = request.headers.get('x-csrf-token')

    if (!csrfCookie || !csrfHeader || csrfCookie !== csrfHeader) {
        return NextResponse.json({ error: 'Invalid CSRF token' }, { status: 403 })
    }

    const { content, messageId } = await request.json()

    const newVersion = await prisma.versions.create({
        data: {
            content,
            messageId
        }
    });

    return NextResponse.json(newVersion);
}


export async function DELETE(request, { params }) {
    const cookieStore = await cookies()
    const csrfCookie = cookieStore.get('csrfToken')?.value
    const csrfHeader = request.headers.get('x-csrf-token')

    if (!csrfCookie || !csrfHeader || csrfCookie !== csrfHeader) {
        return NextResponse.json({ error: 'Invalid CSRF token' }, { status: 403 })
    }
    const { messageId } = await request.json();

    try {
        const deletedVersion = await prisma.versions.deleteMany({
            where: {
                messageId: Number(messageId)
            }
        });
        return NextResponse.json(deletedVersion);
    } catch (error) {
        return NextResponse.json(error);
    }
}