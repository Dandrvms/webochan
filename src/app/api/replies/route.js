import { prisma } from "@/libs/prisma";
import { NextResponse } from "next/server";

export async function POST(request){

    const {comment, reply} = await request.json()

    const newReply = await prisma.reply.create({
        data:{
            comment,
            reply
        }
    });

    return NextResponse.json(newReply);
}