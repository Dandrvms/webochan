"use client"


import Loader from "@/app/components/Loader"
import { useState, useEffect, useCallback } from "react"
import Text from "@/app/components/text"
import Link from "next/link"
import { useRouter } from "next/navigation"
import MarkdownRenderer from "./MarkDownRenderer"


export default function MessageList({ initialMessages }) {
    const borderColors = {
        webo: "border-cyan-800",
        meta: "border-purple-700",
        test: "border-pink-950"
    }

    const subBorderColors = {
        webo: "border-cyan-950",
        meta: "border-purple-950",
        test: "border-pink-800"
    }

    const textColors = {
        webo: "text-cyan-600",
        meta: "text-purple-400",
        test: "text-pink-600"
    }
    const [copiedId, setCopiedId] = useState(null)

    const router = useRouter()
    const [pendingScrollId, setPendingScrollId] = useState(null)

    const handleReferenceSent = useCallback((id) => {
        const targetElement = document.getElementById(id)
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

    const [messages, setMessages] = useState(initialMessages)

    const [loading, setLoading] = useState(true)

    const refreshMessages = async () => {
        
        const path = window.location.pathname
        setLoading(true)
        const csrfToken = document.cookie
        .split('; ')
        .find(row => row.startsWith('csrfToken='))
        ?.split('=')[1]

        if(!csrfToken) return;
        
        const res = await fetch("/api/messages", {
            headers: {
                path,

                'X-CSRF-Token': csrfToken
            }
        })
        
        const data = await res.json()
       
        setMessages(data)
        setLoading(false)
    }

    useEffect(() => {
        refreshMessages();
    }, [])

    useEffect(() => {
        if (pendingScrollId && messages.some(m => m.id == pendingScrollId)) {
            handleReferenceSent(pendingScrollId)
            setPendingScrollId(null)
        }
    }, [messages, pendingScrollId])

    useEffect(() => {
        if (!loading && messages && window.location.hash) {
            const id = window.location.hash.replace("#", "");
            const el = document.getElementById(id);
            if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                el.classList.add('bg-blue-950');
                setTimeout(() => {
                    el.classList.remove('bg-blue-950');
                }, 1000);
            }
        }
    }, [loading, messages]);

    if (loading) return <Loader />
    return (

        <>

            <Text color={messages[0]?.boardId} onMessageSent={refreshMessages} onHandleSent={setPendingScrollId} />

            <div className=" flex-col flex items-center w-full h-full ">
                <div className="flex flex-col flex-grow w-full max-w-xl  pt-10 items-center ">

                    {

                        messages && messages.map((message) => (

                            <div id={message.id} key={message.id} className={` md:w-10/8 w-screen border pb-4 ${borderColors[message.boardId]}`}>
                                <div className="flex space-x-3 w-full mb">
                                    <div className="flex w-full mt-2  ">
                                        <div>
                                            <span className="text-xs font-bold text-gray-500 leading-none px-2">wbn</span>
                                            <span className={`text-xs font-bold leading-none px-2 ${textColors[message.boardId]}`}>{`Th. ${message.id}`}</span>
                                            {message.isPinned && (
                                                <span className="text-xs text-gray-500">pinned</span>)}
                                            <div className="flex  justify-between  text-gray-300 p-3 rounded-l-lg rounded-lg ">
                                                <div className="break-word wrap-normal text-sm overflow-hidden text-ellipsis line-clamp-10"><MarkdownRenderer text={message.content} boardId={message.boardId} /></div>
                                            </div>
                                            <span className="text-xs text-gray-500 leading-none px-2">{new Date(message.date).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</span>
                                            <span className="text-xs text-gray-500 leading-none px-2">{new Date(message.date).toLocaleDateString('es-ES', { weekday: 'short' })}</span>
                                            <span className="text-xs text-gray-500 leading-none px-2">{new Date(message.date).toLocaleDateString('es-ES', { month: '2-digit', day: '2-digit', year: 'numeric' })}</span>
                                            {message.isEdited ? (
                                                <Link href={`/board/${message.boardId}/versions/${message.id}`}>
                                                    <span className="text-xs hover:underline active:text-gray-300 active:underline text-gray-500 leading-none px-2">
                                                        editado
                                                    </span>
                                                </Link>) : null
                                            }
                                        </div>

                                    </div>
                                    <div className="flex items-center space-x-2 mx-auto">
                                        {message.canEdit ? (
                                            <button className="mb-4" onClick={() => router.push(`/board/${message.boardId}/edit/${message.id}`)}>
                                                <span className="ml-6 cursor-pointer text-gray-500 hover:text-white active:text-gray-300">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                                    </svg>
                                                </span>
                                            </button>
                                        ) : null
                                        }


                                        <button
                                            title="Copiar enlace"
                                            onClick={() => {
                                                const url = `${window.location.origin}/board/${message.boardId}#${message.id}`;
                                                navigator.clipboard.writeText(url);
                                                setCopiedId(message.id)
                                                setTimeout(() => setCopiedId(null), 1200)
                                            }}
                                            className=" mt-2 text-gray-500 hover:text-white active:text-gray-300 cursor-pointer"
                                        >
                                            {/* SVG de cadena */}
                                            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                                                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                                            </svg>
                                            {copiedId === message.id && (
                                                <span className="fixed top-6 left-1/2 -translate-x-1/2 bg-blue-800 bg-opacity-80 pointer-events-none transition-opacity duration-200 text-white text-sm rounded px-2 py-1 shadow z-10">
                                                    Enlace copiado
                                                </span>
                                            )}
                                        </button>

                                        <button onClick={() => router.push(`/board/${message.boardId}/${message.id}/comments?from=${message.id}`)} className="px-2">
                                            <span className="ml-2">
                                               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 cursor-pointer active:text-gray-300 text-gray-500 hover:text-white mt-2" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd" />
                                            </svg>
                                            </span>
                                            <span className="text-xs text-gray-500 px-1">{message.comments}</span>

                                        </button>
                                    </div>
                                </div>
                                {

                                    message.comments > 0 ? (

                                        Array.isArray(message.commentsContent) && message.commentsContent.map((c) => (

                                            <div key={c["id"]} className={`h-full break-word wrap-normal mx-10 h-10 border ${subBorderColors[message.boardId]} mt-1 rounded-b-xl text-xs p-3 hover:bg-gray-900`}>
                                                <span className='font-bold text-gray-600 leading-none '>wbn</span>
                                                <span className={`text-xs font-bold leading-none px-2 ${textColors[message.boardId]}`}>{`N. ${c["id"]}`}</span>
                                                <p className='mb-2 text-gray-400'><MarkdownRenderer text={c["content"]} boardId={message.boardId} /></p>
                                                <span className=' text-gray-600 leading-none '>{new Date(c["date"]).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</span>
                                                <span className=' text-gray-600 leading-none px-2'>{new Date(c["date"]).toLocaleDateString('es-ES', { weekday: 'short' })}</span>
                                                <span className=' text-gray-600 leading-none px-2'>{new Date(c["date"]).toLocaleDateString('es-ES', { month: '2-digit', day: '2-digit', year: 'numeric' })}</span>
                                            </div>

                                        ))



                                    ) : null

                                }
                            </div>
                        ))


                    }
                </div>


            </div>

            <div className={`max-w-3xl mx-auto border-t my-5 ${borderColors[messages[0]?.boardId || 'webo']}`}>
                <div className="flex justify-center items-center ">
                    <a className={` border px-2 ${textColors[messages[0]?.boardId || 'webo']} ${borderColors[messages[0]?.boardId || 'webo']}`} href="/">home</a>
                    <a className={` border px-2 ${textColors[messages[0]?.boardId || 'webo']} ${borderColors[messages[0]?.boardId || 'webo']}`} href="/board/webo">webo</a>
                    <a className={` border px-2 ${textColors[messages[0]?.boardId || 'webo']} ${borderColors[messages[0]?.boardId || 'webo']}`} href="/board/meta">meta</a>
                    <a className={` border px-2 ${textColors[messages[0]?.boardId || 'webo']} ${borderColors[messages[0]?.boardId || 'webo']}`} href="/board/polls">polls</a>
                </div>
            </div>

        </>
    );
}