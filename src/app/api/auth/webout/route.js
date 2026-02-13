import { NextResponse } from "next/server";

export async function POST() {
    const response = NextResponse.json({ message: "Sesión cerrada correctamente" });

  
    response.cookies.set("auth_token", "", {
        path: "/",
        expires: new Date(0), 
        httpOnly: true,
        sameSite: "strict",
        secure: true
    });

    return response;
}