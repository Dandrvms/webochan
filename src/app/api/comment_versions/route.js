import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from '@/libs/prisma'

export async function GET(request) {

    const id = request.headers.get('id')
    const messages = await prisma.comment_Versions.findMany({
        where: {
            commentId: Number(id)
        },
        orderBy: {date: 'desc'}
    })

    return NextResponse.json(messages)
}





export async function DELETE(request, { params }) {
    const cookieStore = await cookies()
    const csrfCookie = cookieStore.get('csrfToken')?.value
    const csrfHeader = request.headers.get('X-CSRF-Token')

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