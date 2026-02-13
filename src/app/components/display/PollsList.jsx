"use client"

import Loader from "@/app/components/modals/Loader"
import { useState, useEffect, useCallback } from "react"
import Poll_Form from "@/app/components/forms/poll_form"
import { useRouter } from "next/navigation"
import MarkdownRenderer from "@/app/components/engines/MarkDownRenderer"
import { useBoardData } from "@/app/hooks/useBoardData"
import { useForm } from "@/app/hooks/useForm"

export default function PollsList({ initialPolls }) {
    const [copiedId, setCopiedId] = useState(null)
    const router = useRouter()
    const [pendingScrollId, setPendingScrollId] = useState(null)

    const {
        data: polls,
        setData,
        loading,
        addOptimistic,
        replaceTemp,
        removeTemp,
        updateOptimistic
    } = useBoardData('polls', initialPolls)

    const handleReferenceSent = useCallback((id) => {
        const targetElement = document.getElementById(id)
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            })
            targetElement.classList.add('bg-gray-950')
            setTimeout(() => {
                targetElement.classList.remove('bg-gray-950')
            }, 1000)
        }
    }, [])

    const submitPoll = useCallback(async (pollData) => {
        const csrfToken = document.cookie
            .split('; ')
            .find(row => row.startsWith('csrfToken='))
            ?.split('=')[1]

        const res = await fetch('/api/polls', {
            method: 'POST',
            body: JSON.stringify(pollData),
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-Token': csrfToken
            }
        })

        if (!res.ok) {
            setToast('Error al crear encuesta')
            setTimeout(() => setToast(null), 2500)
        }

        return await res.json()
    }, [])


    const { handleSubmit: handlePollSubmit, isSubmitting } = useForm(
        submitPoll,
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


    const createPollOptimistic = useCallback(async (question, options) => {
        const tempId = addOptimistic({
            question,
            options: options.map(opt => ({
                id: `opt-temp-${Date.now()}-${Math.random()}`,
                option: opt,
                voteCount: 0,
                votes: []
            })),
            totalVotes: 0,
            closed: false,
            boardId: 'polls',
            comments: 0,
            commentsContent: []
        })

        try {
            const result = await handlePollSubmit({ question, options }, tempId)
            return result?.id || tempId
        } catch (error) {
            console.error("Error creando encuesta", error)
            return null
        }
    }, [addOptimistic, handlePollSubmit])

    const [toast, setToast] = useState(null)
    const [isVoting, setIsVoting] = useState(false)

    const handleVote = async (pollId, optionId) => {
        if (isVoting) return

        setIsVoting(true)

        const previousPolls = [...polls];


        updateOptimistic(pollId, (oldPoll) => ({
            ...oldPoll,
            totalVotes: (oldPoll.totalVotes || 0) + 1,
            options: oldPoll.options.map(opt =>
                opt.id === optionId
                    ? { ...opt, voteCount: (opt.voteCount || 0) + 1 }
                    : opt
            )
        }));

        try {
            const csrfToken = document.cookie
                .split('; ')
                .find(row => row.startsWith('csrfToken='))
                ?.split('=')[1];

            const res = await fetch('/api/polls/votes', {
                method: 'POST',
                body: JSON.stringify({ pollId, optionId }),
                headers: {
                    'Content-Type': 'application/json',
                    "X-CSRF-Token": csrfToken
                }
            });

            const r = await res.json();

            if (r.error) {
                throw new Error(r.error);
            }


            if (r.poll) {
                replaceTemp(pollId, r.poll);
            }

        } catch (error) {

            setData(previousPolls);
            setToast(error.message || "Error al registrar el voto");
            setTimeout(() => setToast(null), 2500);
        } finally {
            setIsVoting(false)
        }
    }


    useEffect(() => {
        if (pendingScrollId && polls.some(m => m.id == pendingScrollId)) {
            handleReferenceSent(pendingScrollId)
            setPendingScrollId(null)
        }
    }, [polls, pendingScrollId, handleReferenceSent])

    useEffect(() => {
        if (!loading && polls && window.location.hash) {
            const id = window.location.hash.replace("#", "")
            const el = document.getElementById(id)
            if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'center' })
                el.classList.add('bg-gray-800')
                setTimeout(() => {
                    el.classList.remove('bg-gray-800')
                }, 1000)

                history.replaceState(null, '', ' ')
            }
        }
    }, [loading, polls])

    if (loading) return <Loader />

    return (
        <>
            {/* Toast de error */}
            {toast && (
                <div className="fixed mt-20 top-6 left-1/2 -translate-x-1/2 bg-red-600 text-white px-4 py-2 rounded shadow-lg z-50">
                    {toast}
                </div>
            )}

            <Poll_Form
                refreshPolls={createPollOptimistic}
                onHandleSent={setPendingScrollId}
                isSubmitting={isSubmitting}
            />

            <div className="flex-col flex items-center w-full h-full">
                <div className="flex flex-col flex-grow w-full max-w-xl pt-10 items-center">
                    {polls && polls.map((poll) => (
                        <div id={poll.id} key={poll.id} className="md:w-10/8 w-screen border border-b-0 border-2  border-pink-600 pb-4">
                            <div className="flex w-full">
                                <div className="w-full mt-2">
                                    <div>
                                        <span className="text-xs font-bold text-gray-500 leading-none px-2">wbn</span>
                                        <span className="text-xs font-bold text-pink-400 leading-none px-2">{`P. ${poll.id}`}</span>
                                        {poll.closed && (
                                            <span className="text-xs text-gray-400">cerrada</span>
                                        )}
                                        <div className="text-gray-300 p-3 rounded-l-lg rounded-lg">
                                            <p className="text-sm font-bold">{poll.question}</p>
                                            <div className="p-2 mt-5 w-full max-w-3xl">
                                                <ul className="list-disc pl-5 list-none">
                                                    {poll.options.map(option => {
                                                        // Calcula el porcentaje de votos para esta opción
                                                        const percent = poll.totalVotes > 0 ? (option.voteCount / poll.totalVotes) * 100 : 0
                                                        return (
                                                            <li
                                                                key={option.id}
                                                                className="cursor-pointer text-gray-300 mb-4 active:bg-gray-700 hover:bg-gray-700 rounded-lg px-3"
                                                                onClick={() => handleVote(poll.id, option.id)}
                                                            >
                                                                {option.option} <span className="text-xs text-gray-500">({option.voteCount} votos)</span>
                                                                {/* Barra de progreso */}
                                                                <div className="w-full h-2 mt-1">
                                                                    <div
                                                                        className="h-2 bg-pink-400 transition-all duration-300"
                                                                        style={{ width: `${option.voteCount == 0 && poll.totalVotes == 0 ? 5 : Math.max(percent, 5)}%` }}
                                                                    ></div>
                                                                </div>
                                                                <span className="text-xs text-green-500">{percent.toFixed(1)}%</span>
                                                            </li>
                                                        )
                                                    })}
                                                </ul>
                                            </div>
                                        </div>
                                        <span className="text-xs text-gray-500 leading-none px-2">
                                            {new Date(poll.createdAt).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                        <span className="text-xs text-gray-500 leading-none px-2">
                                            {new Date(poll.createdAt).toLocaleDateString('es-ES', { weekday: 'short' })}
                                        </span>
                                        <span className="text-xs text-gray-500 leading-none px-2">
                                            {new Date(poll.createdAt).toLocaleDateString('es-ES', { month: '2-digit', day: '2-digit', year: 'numeric' })}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2 mx-auto">
                                    <button
                                        title="Copiar enlace"
                                        onClick={() => {
                                            const url = `${window.location.origin}/board/polls#${poll.id}`
                                            navigator.clipboard.writeText(url)
                                            setCopiedId(poll.id)
                                            setTimeout(() => setCopiedId(null), 1200)
                                        }}
                                        className="mt-2 text-gray-500 hover:text-white active:text-gray-300 cursor-pointer"
                                    >
                                        {/* SVG de cadena */}
                                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                                            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                                        </svg>
                                        {copiedId === poll.id && (
                                            <span className="mt-20 fixed top-6 left-1/2 -translate-x-1/2 bg-blue-800 bg-opacity-80 pointer-events-none transition-opacity duration-200 text-white text-sm rounded px-2 py-1 shadow z-10">
                                                Enlace copiado
                                            </span>
                                        )}
                                    </button>

                                    <button onClick={() => router.push(`/board/polls/${poll.id}/comments?from=${poll.id}`)} className="px-2">
                                        <span className="ml-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 cursor-pointer active:text-gray-300 text-gray-500 hover:text-white mt-2" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd" />
                                            </svg>
                                        </span>
                                        <span className="text-xs text-gray-500 px-1">{poll.comments}</span>
                                    </button>
                                </div>
                            </div>
                            {poll.comments > 0 && (
                                Array.isArray(poll.commentsContent) && poll.commentsContent.map((c) => (
                                    <div key={c["id"]} className="h-full break-word wrap-normal mx-10 h-10 border border-2 border-pink-800 mt-1  text-xs p-3 hover:bg-gray-900">
                                        <span className='font-bold text-gray-600 leading-none'>wbn</span>
                                        <span className='text-xs font-bold text-pink-300 leading-none px-2'>{`N. ${c["id"]}`}</span>
                                        <p className='mb-2 text-gray-400'><MarkdownRenderer text={c["content"]} boardId={poll.boardId} /></p>
                                        <span className='text-gray-600 leading-none'>
                                            {new Date(c["date"]).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                        <span className='text-gray-600 leading-none px-2'>
                                            {new Date(c["date"]).toLocaleDateString('es-ES', { weekday: 'short' })}
                                        </span>
                                        <span className='text-gray-600 leading-none px-2'>
                                            {new Date(c["date"]).toLocaleDateString('es-ES', { month: '2-digit', day: '2-digit', year: 'numeric' })}
                                        </span>
                                    </div>
                                ))
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* <div className="max-w-3xl mx-auto border-t border-pink-300 my-5">
                <div className="flex justify-center items-center">
                    <a className="font-bold text-fuchsia-600 border-fuchsia-900 border px-2" href="/">home</a>
                    <a className="font-bold text-fuchsia-600 border-fuchsia-900 border px-2" href="/board/webo">webo</a>
                    <a className="font-bold text-fuchsia-600 border-fuchsia-900 border px-2" href="/board/meta">meta</a>
                    <a className="font-bold text-fuchsia-600 border-fuchsia-900 border px-2" href="/board/polls">polls</a>
                </div>
            </div> */}
        </>
    )
}