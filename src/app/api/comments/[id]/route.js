import { prisma } from '@/libs/prisma';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {

    const cookieStore = await cookies()
    const csrfCookie = cookieStore.get('csrfToken')?.value
    const csrfHeader = request.headers.get('x-csrf-token')

    if (!csrfCookie || !csrfHeader || csrfCookie !== csrfHeader) {
        return NextResponse.json({ error: 'Invalid CSRF token' }, { status: 403 })
    }

    const { id } = await params

    try {
        const getComment = await prisma.comment.findUnique({
            where: {
                id: Number(id)
            },
            include: {
                secretKey: false
            }
        });
        return NextResponse.json(getComment);
    } catch (error) {
        return NextResponse.json(error);
    }
}


export async function PUT(request, { params }) {

    const cookieStore = await cookies()
    const csrfCookie = cookieStore.get('csrfToken')?.value
    const csrfHeader = request.headers.get('x-csrf-token')

    if (!csrfCookie || !csrfHeader || csrfCookie !== csrfHeader) {
        return NextResponse.json({ error: 'Invalid CSRF token' }, { status: 403 })
    }

    const { id } = await params;
    const userSecret = cookieStore.get('secretKey')

    const comment = await prisma.comment.findUnique({ where: { id: Number(id) } })




    if (comment.secretKey != userSecret.value) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }

    const data = await request.json()
    const commentEdited = await prisma.comment.update({
        where: {
            id: Number(id)
        },
        data: {
            content: data.content,
            edited: data.edited,
            isEdited: true,
            date: data.date

        }

    })
    return NextResponse.json(commentEdited)
}

export async function DELETE(request, { params }) {

    const cookieStore = await cookies()
    const csrfCookie = cookieStore.get('csrfToken')?.value
    const csrfHeader = request.headers.get('x-csrf-token')

    if (!csrfCookie || !csrfHeader || csrfCookie !== csrfHeader) {
        return NextResponse.json({ error: 'Invalid CSRF token' }, { status: 403 })
    }

    const userSecret = cookieStore.get('secretKey')
    const { id } = await params;
    const comment = await prisma.comment.findUnique({ where: { id: Number(id) } })



    if (!comment || comment.secretKey !== userSecret.value) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }


    try {
        const deletedComment = await prisma.comment.delete({
            where: {
                id: Number(id)
            }
        })
        return NextResponse.json(deletedComment)
    } catch (error) {
        return NextResponse.json(error);
    }
}
