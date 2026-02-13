import { NextResponse } from "next/server"
import { elevateSession, getOrCreateSession, downGrade } from "@/libs/fs/session"
import crypto from 'crypto'

export async function GET(req) {
    const cookieHeader = req.headers.get('cookie') || ''
    const secretKeyMatch = cookieHeader.match(/(?:^|;\s*)secretKey=([^;]*)/)
    let secretKey = secretKeyMatch ? secretKeyMatch[1] : null
    let user = cookieHeader.match(/(?:^|;\s*)user=([^;]*)/)?.[1]
    const authTokenMatch = cookieHeader.match(/(?:^|;\s*)auth_token=([^;]*)/)
    const authToken = authTokenMatch ? authTokenMatch[1] : null
    let isNewSession = false
    if (!user || !secretKey) {
        const session = generateSession()
        secretKey = session.secretKey
        user = session.publicId
        isNewSession = true
    }

    const userSession = await getOrCreateSession(secretKey)

    if (authToken) {
        await elevateSession(userSession.id)
    }

    console.log(userSession)


    const response = NextResponse.json({ userSession })

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

    return response


}


export async function POST(req) {
    

    const type = req.headers.get('type')
    console.log(type)

    const cookieHeader = req.headers.get('cookie') || ''
    const secretKeyMatch = cookieHeader.match(/(?:^|;\s*)secretKey=([^;]*)/)
    let secretKey = secretKeyMatch ? secretKeyMatch[1] : null

    const userSession = await getOrCreateSession(secretKey)



    if (type === 'down') {
        await downGrade(userSession.id)
    } else if (type === 'up') {
        await elevateSession(userSession.id)
    }

    return NextResponse.json({success: true})
}

function generateSession() {
    const publicId = `wbn#${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
    const secretKey = crypto.randomBytes(16).toString('hex');

    return {
        publicId,
        secretKey,
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 1 mes
    };
}