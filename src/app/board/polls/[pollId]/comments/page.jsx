import { cookies } from "next/headers"
import PollCommentsList from "@/app/components/display/PollCommentsList"
import { prisma } from "@/libs/prisma"

async function getCommentsByPollId({ id }) {

    try {
        const comments = await prisma.comment.findMany({
            where: {
                pollId: Number(id)
            },
            orderBy: {
                date: 'asc'
            },
            include: {
                _count: { select: { replies: true } }
            }
        })
        return comments
    } catch (error) {
        return null
    }
}

async function getPollById({ id }) {
    try {
        const poll = await prisma.poll.findUnique({
            where: {
                id: Number(id)
            },
            include: {
                options: {
                    include: {
                        votes: true
                    }
                },
            }
        })
        return poll
    } catch (error) {
        return null
    }
}


export const dynamic = 'force-dynamic'

export default async function PollsComments({ params, searchParams }) {


    const { pollId } = await params
    const id = pollId
    const poll = await getPollById({ id })

    if (!poll) {
        return (
            <section>
                <div className="flex flex-col items-center w-full h-full pb-20">
                    <div className=" text-center flex flex-col flex-grow w-full max-w-4xl md:px-6 items-center border border-dotted border-4 border-gray-400 mt-20 pb-10 ">
                        <h1 className="text-md font-bold text-gray-500 mt-10">Ocurrió un error.</h1>
                        <h1 className="text-2xl font-bold text-gray-500 mt-5">La encuesta que buscas no está disponible.</h1>
                    </div>
                </div>
            </section>
        );
    }

    const comments = await getCommentsByPollId({ id })

    if (!comments) {
        return (
            <section>
                <div className="flex flex-col items-center w-full h-full pb-20">
                    <div className=" text-center flex flex-col flex-grow w-full max-w-4xl md:px-6 items-center border border-dotted border-4 border-gray-400 mt-20 pb-10 ">
                        <h1 className="text-md font-bold text-gray-500 mt-10">Ocurrió un error al recuperar comentarios.</h1>
                        <h1 className="text-2xl font-bold text-gray-500 mt-5">Revisa tu conexión a internet.</h1>
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


    const totalVotes = poll.options.reduce((sum, option) => sum + option.votes.length, 0)

    return (
        <section>
            <div className=" flex flex-col items-center w-full h-full pb-20">

                <div className="flex flex-col flex-grow w-full max-w-4xl md:px-6 items-center border border border-2 border-gray-400 mt-20 pb-10 ">

                    <div className="flex flex-col w-full max-w-3xl p-5 space-y-2">
                        <span className="text-xs font-bold text-gray-500 leading-none px-2">wbn</span>
                        <span className="text-xs font-bold text-pink-400 leading-none px-2">{`P. ${poll.id}`}</span>
                        <div className=" text-gray-300 p-3 rounded-l-lg rounded-lg ">
                            <p className="text-sm font-bold">{poll.question}</p>
                            <div className="p-2 mt-5 w-full max-w-3xl">
                                <ul className="list-none px-4">
                                    {poll.options.map(option => {
                                        const voteCount = option.votes.length;
                                        const percent = totalVotes > 0 ? (voteCount / totalVotes) * 100 : 0;
                                        return (
                                            <li key={option.id} className="cursor-pointer text-gray-300 mb-4 active:bg-gray-700 hover:bg-gray-700 rounded-lg px-3"
                                            >
                                                {option.option} <span className="text-xs text-gray-500">({voteCount} votos)</span>
                                     

                                                <div className=" w-full h-2 mt-1">

                                                    <div
                                                        className=" h-2 bg-pink-400 transition-all duration-300"
                                                        style={{ width: `${voteCount == 0 && totalVotes == 0 ? 5 : Math.max(percent, 5)}%` }}

                                                    ></div>
                                                </div>
                                                <span className="text-xs text-green-500">{percent.toFixed(1)}%</span>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        </div>
                        <span className="text-xs text-gray-500 leading-none px-2">{new Date(poll.createdAt).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</span>
                        <span className="text-xs text-gray-500 leading-none px-2">{new Date(poll.createdAt).toLocaleDateString('es-ES', { weekday: 'short' })}</span>
                        <span className="text-xs text-gray-500 leading-none px-2">{new Date(poll.createdAt).toLocaleDateString('es-ES', { month: '2-digit', day: '2-digit', year: 'numeric' })}</span>

                    </div>

                    {
                        comments.length === 0 ? (
                            <div className="mt-20 flex flex-col items-center justify-center w-full h-full">
                                <h1 className="text-2xl font-bold">No hay comentarios aún</h1>
                            </div>
                        ) : null}

                    <PollCommentsList initialComments={commentsWithFlags} replyTo={(await searchParams)?.replyTo} pollId={id} boardId={"polls"} />



                </div>


            </div>



        </section>
    );



}

