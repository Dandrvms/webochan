"use client"
import Link from 'next/link'
import { useRouter, useSearchParams } from "next/navigation"
import Text from "@/app/components/text"
import { useState, useEffect, useCallback } from "react"
import Loader from "@/app/components/Loader"
import MarkdownRenderer from './MarkDownRenderer'
import { useBoardData } from "@/app/hooks/useBoardData"
import { useForm } from "@/app/hooks/useForm"

export default function PollCommentsList({ initialComments, pollId }) {
    const searchParams = useSearchParams()
    const from = searchParams.get('from') || null

    useEffect(() => {
        return () => {
            if (from) {
                history.replaceState(null, "", `#${from}`)
            }
        }
    }, [from])

    const [pendingScrollId, setPendingScrollId] = useState(null)
    const router = useRouter()
    const [reply, setReply] = useState(null)

    const {
        data: comments,
        loading,
        addOptimistic,
        replaceTemp,
        removeTemp
    } = useBoardData('comments', initialComments, { boardId: 'polls', messageId: pollId, pollId })

    const handleReferenceClick = useCallback((commentId) => {
        const targetElement = document.getElementById(commentId)
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            })
            targetElement.classList.add('bg-pink-950')
            setTimeout(() => {
                targetElement.classList.remove('bg-pink-950')
            }, 1000)
        }
    }, [])
    
    const handleReply = (commentId) => {
        setReply(commentId)
    }

    const clearReply = () => {
        reply && setReply(null)
    }
const submitComment = useCallback(async (commentData) => {
    const csrfToken = document.cookie
        .split('; ')
        .find(row => row.startsWith('csrfToken='))
        ?.split('=')[1]

    const res = await fetch('/api/poll_comments', {
        method: 'POST',
        body: JSON.stringify(commentData),
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': csrfToken
        }
    })

    if (!res.ok) throw new Error('Error al enviar comentario')
    return await res.json()
}, [])
   
    const { handleSubmit: handleCommentSubmit, isSubmitting } = useForm(
        submitComment,
        {
            onSuccess: (result, tempId) => {
                if (tempId) {
                    replaceTemp(tempId, result)
                }
                router.refresh()
                return result.id
            },
            onError: (error, tempId) => {
                if (tempId) {
                    removeTemp(tempId)
                }
            }
        }
    )

    const sendCommentOptimistic = useCallback(async (content, replyTo = null) => {
        const tempId = addOptimistic({
            content,
            parentId: replyTo,
            boardId: 'polls'
        })

        const commentData = {
            content,
            pollId: Number(pollId)
        }

        try {
            const result = await handleCommentSubmit(commentData, tempId)
            return result?.id || tempId
        } catch (error) {
            console.error("Error sending comment:", error)
            return null
        }
    }, [addOptimistic, pollId, handleCommentSubmit])

    useEffect(() => {
        if (pendingScrollId && comments.some(m => m.id == pendingScrollId)) {
            handleReferenceClick(pendingScrollId)
            setPendingScrollId(null)
        }
    }, [comments, pendingScrollId, handleReferenceClick])

    if (loading) return <Loader />

    return (
        <>
            <Text 
            color="polls"
            reply={reply} 
            onClearReply={clearReply} 
            onCommentSent={sendCommentOptimistic} 
            onHandleSent={setPendingScrollId} 
            isSubmitting={isSubmitting}
            />

            {comments.map(cmt => (
                <div id={cmt.id} key={cmt.id} className="flex w-full border mt-1 justify-between rounded-b-xl border-fuchsia-800 space-x-3">
                    <div>
                        <span className="text-xs font-bold text-gray-500 leading-none px-2"> wbn</span>
                        <span className="text-xs font-bold text-pink-300 leading-none">N. {cmt.id}</span>
                        <div className="flex break-word wrap-normal justify-between text-gray-300 p-3">
                            <div className="text-sm">
                                <MarkdownRenderer 
                                    text={cmt.content} 
                                    onReferenceClick={handleReferenceClick} 
                                    boardId={"polls"} 
                                    comments={comments} 
                                />
                            </div>
                        </div>
                        <span className="text-xs text-gray-500 leading-none px-2">
                            {new Date(cmt.date).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <span className="text-xs text-gray-500 leading-none px-2">
                            {new Date(cmt.date).toLocaleDateString('es-ES', { weekday: 'short' })}
                        </span>
                        <span className="text-xs text-gray-500 leading-none px-2">
                            {new Date(cmt.date).toLocaleDateString('es-ES', { month: '2-digit', day: '2-digit', year: 'numeric' })}
                        </span>
                        {cmt.isEdited && (
                            <Link href={`/board/polls/${pollId}/comments/versions/${cmt.id}`}>
                                <span className="text-xs hover:underline text-gray-500 active:text-gray-300 active:underline leading-none px-2">
                                    editado
                                </span>
                            </Link>
                        )}
                    </div>
                    <div className="flex items-center space-x-2">
                        {cmt.canEdit && (
                            <button 
                            className="mb-4" 
                            onClick={() => router.push(`/board/polls/${pollId}/comments/edit/${cmt.id}`)}
                        >
                                <span className="ml-6 cursor-pointer text-gray-500 hover:text-white active:text-gray-300">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                    </svg>
                                </span>
                            </button>
                        )}
                        <button 
                        className="cursor-pointer rounded-full px-2" 
                            onClick={() => handleReply(cmt.id)}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                                className="w-4 h-4 text-gray-500 active:text-gray-300 hover:text-gray-300 mt-1"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M10 19l-7-7 7-7"
                                />
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M3 12 H18 Q21 12 21 15"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            ))}

            <div className="max-w-3xl mx-auto border-t border-pink-300 my-5">
                <div className="flex justify-center items-center">
                    <a className="font-bold text-fuchsia-600 border-fuchsia-900 border px-2" href="/">home</a>
                    <a className="font-bold text-fuchsia-600 border-fuchsia-900 border px-2" href="/board/webo">webo</a>
                    <a className="font-bold text-fuchsia-600 border-fuchsia-900 border px-2" href="/board/meta">meta</a>
                    <a className="font-bold text-fuchsia-600 border-fuchsia-900 border px-2" href="/board/polls">polls</a>
                </div>
            </div>
        </>
    )
}