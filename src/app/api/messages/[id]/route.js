import { NextResponse } from "next/server";

import { prisma } from '@/libs/prisma'

import { cookies } from "next/headers";

export async function GET(request, { params }) {

    const cookieStore = await cookies()
    const csrfCookie = cookieStore.get('csrfToken')?.value
    const csrfHeader = request.headers.get('x-csrf-token')
    
    if(!csrfCookie || !csrfHeader || csrfCookie !== csrfHeader){
        return NextResponse.json({ error: 'Invalid CSRF token' }, { status: 403 })
    }

    const { id } = await params
    const message = await prisma.message.findUnique({
        where: {
            id: Number(id)
        },
        include: {
            secretKey: false,
            userId: false,
        }
    })

    return NextResponse.json(message)
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

    const message = await prisma.message.findUnique({ where: { id: Number(id) } })
    if (!message || message.secretKey !== userSecret.value) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }

    const data = await request.json()
    const messageEdited = await prisma.message.update({
        where: {
            id: Number(id)
        },
        data: {
            content: data.content,
            edited: data.edited,
            isEdited: data.isEdited,
            date: data.date,
        }

    })
    return NextResponse.json(messageEdited)
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
    const message = await prisma.message.findUnique({ where: { id: Number(id) } })
    if (!message || message.secretKey !== userSecret.value) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }




    try {
        const deletedMessage = await prisma.message.delete({
            where: {
                id: Number(id)
            }
        })
        return NextResponse.json(deletedMessage)
    } catch (error) {
        return NextResponse.json(error);
    }
}