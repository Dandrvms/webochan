import { cookies } from "next/headers"
import CommentList from "@/app/components/CommentList"
import { prisma } from "@/libs/prisma"
import MarkdownRenderer from "@/app/components/MarkDownRenderer"

async function getCommentsByMessageId({ id }) {

    const comments = await prisma.comment.findMany({
        where: {
            messageId: Number(id)
        },
        orderBy: {
            date: 'asc'
        },
        include: {
            _count: { select: { replies: true } }
        }
    })
    return comments
}

async function getMessageById({ id }) {
    const message = await prisma.message.findUnique({
        where: {
            id: Number(id)
        }
    })
    return message
}


export const dynamic = 'force-dynamic'

export default async function Comments({ params, searchParams }) {


    const { messageId } = await params
    const id = messageId
    const message = await getMessageById({ id })
    const comments = await getCommentsByMessageId({ id })


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
                
                <div className="flex flex-col flex-grow w-full max-w-4xl md:px-6 items-center border border-gray-600 mt-20 pb-10 ">

                    <div className="w-full h-full mt-5 p-5 mb-4 border-b border-gray-700">
                        <span className="text-gray-400 font-bold">wbn</span>
                        <span className="text-cyan-300 font-bold px-2">N. {message.id}</span>
                        <div className="mb-10 flex break-word wrap-normal whitespace-pre-line justify-between text-gray-300 ">
                            <div><MarkdownRenderer text={message.content}/></div>
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

                    <CommentList initialComments={commentsWithFlags} replyTo={(await searchParams)?.replyTo} messageId={id} boardId={message.boardId} />



                </div>


            </div>



        </section>
    );



}

