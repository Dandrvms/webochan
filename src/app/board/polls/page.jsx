

import { prisma } from "@/libs/prisma"
import { cookies } from 'next/headers'
import PollsList from "@/app/components/display/PollsList"


async function getPolls() {
    try {
        const polls = await prisma.poll.findMany({

            include: {
                options: {
                    include: {
                        votes: true
                    }
                },
                _count: { select: { comments: true } }
                , comments: {
                    take: 3,
                    orderBy: { date: 'desc' },
                    include: { userId: false, secretKey: false }
                },
                userId: false,
            }
        })
        return polls
    } catch (error) {
        return null
    }
}

export const dynamic = 'force-dynamic'
export default async function PollsPage() {

    const cookieStore = await cookies()
    const userSecret = cookieStore.get('secretKey')?.value
    const polls = await getPolls()

    if (!polls) {
        return (
            <section>
                <div className="flex flex-col items-center w-full h-full pb-20">
                    <div className=" text-center flex flex-col flex-grow w-full max-w-4xl md:px-6 items-center border border-dotted border-4 border-gray-400 mt-20 pb-10 ">
                        <h1 className="text-md font-bold text-gray-500 mt-10">Ocurrió un error.</h1>
                        <h1 className="text-2xl font-bold text-gray-500 mt-5">Revisa tu conexión a internet.</h1>
                    </div>
                </div>
            </section>
        );

    }
    const getRelevantDate = (poll) => poll.lastReply ? new Date(poll.lastReply) : new Date(poll.createdAt)

    const safePolls = polls.map(({ secretKey, _count, options, ...poll }) => {
        // Calcula el total de votos sumando los votos de todas las opciones
        const totalVotes = options?.reduce((sum, option) => sum + option.votes.length, 0) || 0;

        return {
            ...poll,
            options: options?.map(option => ({
                ...option,
                voteCount: option.votes.length
            })),
            totalVotes, // <-- Aquí lo agregas
            canEdit: secretKey === userSecret,
            comments: _count.comments,
            commentsContent: poll.comments.slice().reverse(),
            isComment: false,
            closed: new Date(poll.expiresAt) < new Date(Date.now())
        }
    }).sort((a, b) => {
        return getRelevantDate(b) - getRelevantDate(a)
    })





    return (

        <>
            {/* <Navbar/> */}

            <div className=" flex-col flex items-center w-full h-full pt-10">
                <div className="flex flex-col flex-grow w-full max-w-xl  border-gray-800 rounded-full items-center p-5 ">


                    <p className="text-4xl font-bold text-pink-500 leading-none">/polls/</p>
                    <p className="font-bold text-gray-500 leading-none mt-2">Solo encuestas</p>

                </div>
            </div>


            <PollsList initialPolls={safePolls} />

        </>
    );
}