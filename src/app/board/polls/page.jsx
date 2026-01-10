

import { prisma } from "@/libs/prisma"
import { cookies } from 'next/headers'
import MessageList from "@/app/components/MessageList"
// import Navbar from "@/app/components/Navbar"
import PollsList from "@/app/components/PollsList"

export const dynamic = 'force-dynamic'
export default async function PollsPage() {

    const cookieStore = await cookies()
    const userSecret = cookieStore.get('secretKey')?.value

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
                include: {userId: false, secretKey: false}
            },
            userId: false,
        }
    })
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
                    <p className="font-bold text-gray-300 leading-none mt-2">Tablón de solamente encuestas</p>

                </div>
            </div>
            

            <PollsList initialPolls={safePolls}/>

    </>
);
}