import { NextResponse } from "next/server";
import { prisma } from '@/libs/prisma'

export async function POST(request) {


    const { postId } = await request.json();

    const token = request.headers.get('Authorization')?.split(' ')[1]

    if (token !== process.env.BOT_TOKEN) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }


    try {
        const response = await prisma.message.delete({
            where: {
                id: Number(postId)
            }
        });
        return NextResponse.json({status: 200});
    } catch (error) {
        console.log(error)
        return NextResponse.json("Error en api", { status: 500 })
    }

    
}
