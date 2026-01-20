import { NextResponse } from 'next/server';
import * as React from 'react'
import { prisma } from "@/libs/prisma"
export async function GET({ params }) {

    const cookieStore = await cookies()
    const csrfCookie = cookieStore.get('csrfToken')?.value
    const csrfHeader = request.headers.get('X-CSRF-Token')

    if (!csrfCookie || !csrfHeader || csrfCookie !== csrfHeader) {
        return NextResponse.json({ error: 'Invalid CSRF token' }, { status: 403 })
    }

    const { id } = await params

    try {
        const getVersion = await prisma.comment_Versions.findMany({
            where: {
                commentId: Number(id)
            }
        });
        return NextResponse.json(getVersion);
    } catch (error) {
        return NextResponse.json(error);
    }
}