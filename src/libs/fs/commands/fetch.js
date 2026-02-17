import { prisma } from "@/libs/prisma"




export async function fetch() {


    const actual = new Date()
    const pasada = new Date(2025, 5, 9, 19, 59)
    const diferenciaMs = actual - pasada

    const segundos = Math.floor(diferenciaMs % (1000 * 60) / 1000)
    const horas = Math.floor(diferenciaMs / (1000 * 60 * 60))
    const minutos = Math.floor((diferenciaMs % (1000 * 60 * 60)) / (1000 * 60))

    const posts = await prisma.message.findMany({
        select: {
            id: true,
        }
    })

    const comments = await prisma.comment.findMany({
        select: {
            id: true
        }
    })

    const postCount = posts.length
    const commentsCount = comments.length




    return {
        mode: "SCREEN",
        ok: true,
        screen: {
            ascii: "....",
            sections: {
                identity: {
                    OS: "Webochan FS v0.1"
                },
                system: {
                    Kernel: "webo-kernel",
                    Shell: "wsh",
                },
                session: {
                    User: "anon",
                    Privilege: "user",
                },

                meta: {
                    Boards: 3,
                    Posts: posts.length,
                    Replies: comments.length,
                    Uptime: `${horas}:${minutos}:${segundos}`,
                    Entropy: "HIGH"
                }
            }
        }
    }

}