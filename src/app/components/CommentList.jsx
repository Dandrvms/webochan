"use client"
import Link from 'next/link'
import { useRouter, useSearchParams } from "next/navigation"
import Text from "@/app/components/text"
import { useState, useEffect, useCallback } from "react"
import Loader from "@/app/components/Loader"
import MarkdownRenderer from './MarkDownRenderer'
import { useBoardData } from "@/app/hooks/useBoardData"
import { useForm } from "@/app/hooks/useForm"

export default function CommentList({ initialComments, messageId, boardId }) {
    const searchParams = useSearchParams()
    const from = searchParams.get('from') || null

    const borderColors = {
        webo: "border-sky-800",
        meta: "border-purple-900",
        test: "border-pink-950"
    }

    const textColors = {
        webo: "text-cyan-600",
        meta: "text-purple-400",
        test: "text-pink-600"
    }

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
    } = useBoardData('comments', initialComments, { boardId, messageId })

    const handleReferenceClick = useCallback((commentId) => {
        const targetElement = document.getElementById(commentId)
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            })
            targetElement.classList.add('bg-blue-950')
            setTimeout(() => {
                targetElement.classList.remove('bg-blue-950')
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

        const endpoint = boardId === 'polls' ? '/api/poll_comments' : '/api/comments'
        const { sage, ...dataWithoutSage } = commentData

        const res = await fetch(endpoint, {
            method: 'POST',
            body: JSON.stringify(dataWithoutSage),
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-Token': csrfToken,
                'sage': sage ? 'true' : 'false'
            }
        })

        if (!res.ok) throw new Error('Error al enviar comentario')
        return await res.json()
    }, [boardId])

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

    const sendCommentOptimistic = useCallback(async (content, replyTo = null, isSage = false) => {
        const tempId = addOptimistic({
            content,
            parentId: replyTo,
            boardId,
            isOP: false
        })

        const commentData = {
            content,
            [boardId === 'polls' ? 'pollId' : 'messageId']: Number(messageId),
            sage: isSage
        }

        if (boardId !== 'polls') {
            commentData.boardId = boardId
        }


        try {
            const result = await handleCommentSubmit(commentData, tempId)
            return result?.id || tempId
        } catch (error) {
            console.error("Error enviando comentario:", error)
            return null
        }
    }, [addOptimistic, boardId, messageId, handleCommentSubmit])
    // const [comments, setComments] = useState(initialComments)
    // const [loading, setLoading] = useState(true)
    // const refreshComments = async () => {
    //     setLoading(true)
    //     const csrfToken = document.cookie
    //         .split('; ')
    //         .find(row => row.startsWith('csrfToken='))
    //         ?.split('=')[1]

    //     const res = await fetch('/api/comments', {
    //         headers: {
    //             'Content-Type': 'application/json',
    //             'messageId': messageId,
    //             'X-CSRF-Token': csrfToken
    //         }
    //     })

    //     const data = await res.json()
    //     setComments(data)
    //     setLoading(false)



    // }

    // useEffect(() => {
    //     refreshComments()
    // }, [])

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
                reply={reply} 
                onClearReply={clearReply} 
                onCommentSent={sendCommentOptimistic} 
                onHandleSent={setPendingScrollId} 
                color={boardId}
                isSubmitting={isSubmitting}
            />

            {comments.map(cmt => (
                <div id={cmt.id} key={cmt.id} className={`flex w-full border mt-1 justify-between rounded-b-xl space-x-3 ${borderColors[boardId]}`}>
                    <div>
                        <span className="text-xs font-bold text-gray-500 leading-none px-2"> wbn</span>
                        {cmt.isOP && <span className="text-xs font-bold text-gray-300 leading-none pr-2">OP</span>}
                        <span className={`text-xs font-bold leading-none ${textColors[boardId]}`}>N. {cmt.id}</span>
                        <span className="text-xs hover:underline hover:text-blue-300 active:underline active:text-blue-300 text-blue-500 cursor-pointer px-4"> 
                            {cmt.parentId ? (`R >>> ${cmt.parentId}`) : null} 
                        </span>
                        <div className="flex break-word wrap-normal justify-between text-gray-300 p-3">
                            <div className="text-sm">
                                <MarkdownRenderer 
                                text={cmt.content} 
                                onReferenceClick={handleReferenceClick} 
                                boardId={cmt.boardId} 
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
                            <Link href={`/board/${boardId}/${messageId}/comments/versions/${cmt.id}`}>
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
                            onClick={() => router.push(`/board/${boardId}/${messageId}/comments/edit/${cmt.id}`)}
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

            <div className={`max-w-3xl mx-auto border-t my-5 ${borderColors[boardId]}`}>
                <div className="flex justify-center items-center">
                    <a className={`border px-2 ${textColors[boardId]} ${borderColors[boardId]}`} href="/">home</a>
                    <a className={`border px-2 ${textColors[boardId]} ${borderColors[boardId]}`} href="/board/webo">webo</a>
                    <a className={`border px-2 ${textColors[boardId]} ${borderColors[boardId]}`} href="/board/meta">meta</a>
                    <a className={`border px-2 ${textColors[boardId]} ${borderColors[boardId]}`} href="/board/polls">polls</a>
                </div>
            </div>
        </>
    )
}