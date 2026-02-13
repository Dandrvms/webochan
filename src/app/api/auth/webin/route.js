import { prisma } from "@/libs/prisma"
import { verifyPassword, verifyToken } from "@/utils/auth";
import jwt from 'jsonwebtoken'
import { NextResponse } from "next/server";
import { elevateSession, getOrCreateSession } from "@/libs/fs/session";

const SECRET = process.env.JWT_SECRET;

export async function GET(req) { 
    
    const token = req.cookies.get('auth_token')?.value
    
    const decoded = verifyToken(token)
    
    return NextResponse.json({success: decoded ? true : false})
}


export async function POST(req) {
    const { username, password } = await req.json();
    let user

    try {
        
        user = await prisma.users.findUnique({
        where: { username }
    });
    } catch (e) {
        user = null
    }

    if (!user) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        return NextResponse.json({ error: "Acceso denegado" }, { status: 401 });
    }


    const isValid = await verifyPassword(user.hashedPword, password);

    if (!isValid) {
        await new Promise(resolve => setTimeout(resolve, 10000));
        return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 });
    }

    const token = jwt.sign(
        { userId: user.id, username: user.username, level: user.level },
        SECRET,
        { expiresIn: '24h' }
    );
    

    const response = NextResponse.json({
        message: "Login exitoso",
        level: user.level
    })

    response.cookies.set('auth_token', token, {
        path: '/',
        maxAge: 24 * 60 * 60,
        httpOnly: true,
        sameSite: 'strict',
        secure: true
    })


    return response
}