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
    const messages = await prisma.comment_Versions.findMany({
        where: {
            commentId: Number(id)
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
    const response = await request.json()

    const newVersion = await prisma.comment_Versions.create({
        data: {
            content: response.content,
            commentId: response.commentId
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
    const { commentId } = await request.json();

    try {
        const deletedVersion = await prisma.comment_Versions.deleteMany({
            where: {
                commentId: Number(commentId)
            }
        });
        return NextResponse.json(deletedVersion);
    } catch (error) {
        return NextResponse.json(error);
    }
}