import { NextResponse } from "next/server";
import { cookies } from 'next/headers';
import crypto from 'crypto';

function generateCsrfToken() {
    return crypto.randomBytes(32).toString('hex');
}

export async function GET(request) {
    const cookieStore = await cookies();
    let csrfToken = cookieStore.get('csrfToken')?.value;

    if (!csrfToken) {
        csrfToken = generateCsrfToken();
        cookieStore.set({
            name: 'csrfToken',
            value: csrfToken,
            path: '/',
            sameSite: 'strict',
            secure: true,
            httpOnly: false
        });
    }

    return NextResponse.json({ csrfToken });
}