import { cookies } from "next/headers"
import CommentList from "@/app/components/display/CommentList"
import { prisma } from "@/libs/prisma"
import MarkdownRenderer from "@/app/components/engines/MarkDownRenderer"

async function getCommentsByMessageId({ id }) {

    try {
        const comments = await prisma.comment.findMany({
            where: {
                messageId: Number(id)
            },
            orderBy: {
                date: 'asc'
            },
            include: {
                _count: { select: { replies: true } }
                ,
                author: {
                    select: {
                        username: true,
                    },
                },
            }
        })
        return comments
    } catch (error) {
        return null
    }
}

async function getMessageById({ id, boardId }) {
    try {
        const message = await prisma.message.findUnique({
            where: {
                id: Number(id)
            },
            include: {
                author: {
                    select: {
                        username: true,
                    },
                },
            }
        })
        if (boardId === message.boardId) {
            return message
        } else {
            return null
        }
    } catch (error) {
        return null
    }
}


export const dynamic = 'force-dynamic'

export default async function Comments({ params, searchParams }) {

    const { messageId, boardId } = await params
    const boards = ["webo", "meta", "test"]

    if (!boards.includes(boardId)) {
        return (
            <div className=" flex-col flex items-center w-full h-full pt-10">
                <div className="flex flex-col flex-grow w-full max-w-xl  border-gray-800 rounded-full items-center p-5 ">

                    <div className=" text-center flex flex-col flex-grow w-full max-w-4xl md:px-6 items-center border border-dotted border-4 border-gray-400 mt-20 p-10 ">
                        <p className="text-2xl font-bold text-gray-500 leading-none">Tablón no encontrado</p>
                    </div>
                </div>
            </div>
        )
    }



    const id = messageId
    const message = await getMessageById({ id, boardId })

    if (!message) {
        return (
            <section>
                <div className="flex flex-col items-center w-full h-full pb-20">
                    <div className=" text-center flex flex-col flex-grow w-full max-w-4xl md:px-6 items-center border border-dotted border-4 border-gray-400 mt-20 pb-10 ">
                        <h1 className="text-md font-bold text-gray-500 mt-10">Ocurrió un error.</h1>
                        <h1 className="text-2xl font-bold text-gray-500 mt-5">El mensaje que buscas no está disponible.</h1>
                    </div>
                </div>
            </section>
        );
    }

    const comments = await getCommentsByMessageId({ id })

    if (!comments) {
        return (
            <section>
                <div className="flex flex-col items-center w-full h-full pb-20">
                    <div className=" text-center flex flex-col flex-grow w-full max-w-4xl md:px-6 items-center border border-dotted border-4 border-gray-400 mt-20 pb-10 ">
                        <h1 className="text-md font-bold text-gray-500 mt-10">Ocurrió un error al recuperar comentarios.</h1>
                        <h1 className="text-2xl font-bold text-gray-500 mt-5">Revisa tu conexión e intenta de nuevo.</h1>
                    </div>
                </div>
            </section>
        );
    }

    const cookieStore = await cookies()
    const userSecret = cookieStore.get('secretKey')?.value

    const commentsWithFlags = comments
        .map(({ secretKey, _count, ...cmt }) => ({
            ...cmt,
            canEdit: secretKey === userSecret,
            isComment: true,
            replies: _count.replies
        }))



    return (
        <section>

            <div className=" flex flex-col items-center w-full h-full pb-20">

                <div className="flex flex-col flex-grow w-full max-w-4xl md:px-6 items-center border border-2 border-gray-400 mt-20 pb-10 ">

                    <div className="w-full h-full mt-5 p-5 mb-4 border-b border-gray-700">
                        <span className={`${message.author ? "text-green-500" : "text-gray-400"} font-bold`}>{message.author? message.author.username : "wbn"}</span>
                        <span className="text-cyan-300 font-bold px-2">N. {message.id}</span>
                        <div className="mb-10 flex break-word wrap-normal whitespace-pre-line justify-between text-gray-300 ">
                            <div><MarkdownRenderer text={message.content} /></div>
                        </div>
                        <span className="text-xs text-gray-500 leading-none ">{new Date(message.date).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</span>
                        <span className="text-xs text-gray-500 leading-none px-2">{new Date(message.date).toLocaleDateString('es-ES', { weekday: 'short' })}</span>
                        <span className="text-xs text-gray-500 leading-none px-2">{new Date(message.date).toLocaleDateString('es-ES', { month: '2-digit', day: '2-digit', year: 'numeric' })}</span>
                    </div>

                    {
                        comments.length === 0 ? (
                            <div className="mt-20 flex flex-col items-center justify-center w-full h-full">
                                <h1 className="text-2xl font-bold">No hay comentarios aún</h1>
                            </div>
                        ) : null}

                    <CommentList initialComments={commentsWithFlags} replyTo={(await searchParams)?.replyTo} messageId={id} boardId={boardId} />



                </div>


            </div>



        </section>
    );



}

