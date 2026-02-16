import { resolvePath } from "@/libs/fs/pathResolver"
import { prisma } from "@/libs/prisma"
import { NextResponse } from "next/server"
import { getOrCreateSession } from "@/libs/fs/session"

export async function POST(req) {

    const cookieHeader = req.headers.get('cookie') || ''
    const secretKeyMatch = cookieHeader.match(/(?:^|;\s*)secretKey=([^;]*)/)
    let secretKey = secretKeyMatch ? secretKeyMatch[1] : null

    const session = await getOrCreateSession(secretKey);
    console.log("SESION: ",session)

    const data = await req.json()

    await prisma.fSNode.update({
        where: {
            id: data.id
        },
        data: {
            content: data.content
        }
    })



    return NextResponse.json({ success: true })
}
