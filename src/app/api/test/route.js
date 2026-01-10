import { NextResponse } from "next/server"; 
import crypto from 'crypto'
import {prisma} from "@/libs/prisma"
import { reverse } from "dns";

export async function GET(request){

    const id = request.headers.get('id')
    console.log(id)
    return new NextResponse(request)
}

