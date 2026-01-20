

import { prisma } from "@/libs/prisma"
import { cookies } from 'next/headers'
import MessageList from "@/app/components/MessageList"
// import Navbar from "@/app/components/Navbar"

async function getMessagesByBoard(boardId) {
    try {
        const messages = await prisma.message.findMany({
            where: {
                // expiresAt: {
                //     gt: new Date()
                // },
                boardId: boardId,
            },
            include: {
                _count: { select: { comments: true } }
                , comments: {
                    take: 3,
                    orderBy: { date: 'desc' },
                    include: { userId: false, secretKey: false }
                },
                userId: false,
            }
        })

        return messages
    } catch (error) {
        return null
    }
}


export const dynamic = 'force-dynamic'
export default async function Board({ params }) {

    const { boardId } = await params


    const cookieStore = await cookies()
    const userSecret = cookieStore.get('secretKey')?.value


    const messages = await getMessagesByBoard(boardId)

    if (!messages) {
        return (
            <section>
                <div className="flex flex-col items-center w-full h-full pb-20">
                    <div className=" text-center flex flex-col flex-grow w-full max-w-4xl md:px-6 items-center border border-dotted border-4 border-gray-400 mt-20 pb-10 ">
                        <h1 className="text-md font-bold text-gray-500 mt-10">No se han podido recuperar los mensajes.</h1>
                        <h1 className="text-2xl font-bold text-gray-500 mt-5">Revisa tu conexión a internet.</h1>
                    </div>
                </div>
            </section>
        );
    }


    const messagesWithFlags = messages
        .map(({ secretKey, _count, ...msg }) => ({
            ...msg,
            canEdit: secretKey === userSecret,
            comments: _count.comments,
            commentsContent: msg.comments.slice().reverse(),
            isComment: false,
            isPinned: msg.id === 72,
        }))

    const getRelevantDate = (msg) => msg.lastReply ? new Date(msg.lastReply) : new Date(msg.date)

    const sortedMessages = messagesWithFlags.sort((a, b) => {
        const aDate = getRelevantDate(a)
        const bDate = getRelevantDate(b)
        return bDate - aDate
    })
    const pinnedMessages = sortedMessages.filter(msg => msg.isPinned)
    const unpinnedMessages = sortedMessages.filter(msg => !msg.isPinned)
    const sorted = [...pinnedMessages, ...unpinnedMessages]
    const boards = ["webo", "meta", "test"]
    const colors = {
        webo: "blue-400",
        meta: "purple-400",
        test: "pink-400"
    }


    return (

        <>
            {/* <Navbar/> */}
            <div className=" flex-col flex items-center w-full h-full pt-10">
                <div className="flex flex-col flex-grow w-full max-w-xl  border-gray-800 rounded-full items-center p-5 ">

                    {boards.includes(boardId) ? (
                        <>
                            <p className={`text-4xl font-bold text-${colors[boardId]} leading-none`}>{`/${boardId}/`}</p>
                            <p className="font-bold text-gray-500 leading-none mt-2 text-center">{boardId === "webo" ? "Cosas de webo" : boardId === "meta" ? "Sugerencias, Mejoras y Reporte de errores" : boardId === "test" ? "Tablón de pruebas del dev" : null}</p>
                        </>
                    ) : (
                        <div className=" text-center flex flex-col flex-grow w-full max-w-4xl md:px-6 items-center border border-dotted border-4 border-gray-400 mt-20 p-10 ">
                            <p className="text-2xl font-bold text-gray-500 leading-none">Tablón no encontrado</p>
                        </div>
                    )}

                </div>
            </div>
            {boards.includes(boardId) ? (
                <MessageList initialMessages={sorted} />
            ) : null}


        </>
    );
}