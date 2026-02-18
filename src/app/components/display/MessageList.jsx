"use client"

import Loader from "@/app/components/modals/Loader"
import { useState, useEffect, useCallback } from "react"
import Text from "@/app/components/forms/text"
import EditModal from "@/app/components/modals/EditModal"
import DeleteModal from "@/app/components/modals/DeleteModal"
import VersionModal from "@/app/components/modals/VersionModal"
import { useRouter } from "next/navigation"
import MarkdownRenderer from "@/app/components/engines/MarkDownRenderer"
import { ExpandableMarkdown } from "@/app/components/engines/ExpandableContent"
import { useBoardData } from "@/app/hooks/useBoardData"
import { useForm } from "@/app/hooks/useForm"

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
    const [editingMessage, setEditingMessage] = useState(null)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [messageToDelete, setMessageToDelete] = useState(null)
    const [toast, setToast] = useState(null)
    const [versionModalConfig, setVersionModalConfig] = useState({ isOpen: false, messageId: null });

    const openVersions = (id) => {
        setVersionModalConfig({ isOpen: true, messageId: id });
    };

    const {
        data: messages,
        loading,
        addOptimistic,
        replaceTemp,
        removeTemp,
        setData,
        updateOptimistic
    } = useBoardData('messages', initialMessages)


    const submitMessage = useCallback(async (messageData) => {
        const csrfToken = document.cookie
            .split('; ')
            .find(row => row.startsWith('csrfToken='))
            ?.split('=')[1]

        const res = await fetch('/api/messages', {
            method: 'POST',
            body: JSON.stringify(messageData),
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-Token': csrfToken
            }
        })

        if (!res.ok) {
            setToast('Error al enviar mensaje')
            setTimeout(() => setToast(null), 2500)
        }
        return await res.json()
    }, [])


    const { handleSubmit: handleMessageSubmit, isSubmitting } = useForm(
        submitMessage,
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


    const sendMessageOptimistic = useCallback(async (content, boardId) => {
        const path = window.location.pathname.split("/")
        const actualBoardId = boardId || path[2]

        const tempId = addOptimistic({
            content,
            boardId: actualBoardId,
            comments: 0,
            commentsContent: [],
            isPinned: false
        })


        try {
            const result = await handleMessageSubmit(
                { content, boardId: actualBoardId },
                tempId
            )

            if (result && result.id) {
                setPendingScrollId(result.id)
            }

            return result
        } catch (error) {
            console.error("Error sending message:", error)
            return null
        }
    }, [addOptimistic, handleMessageSubmit])

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


    const updateMessage = useCallback(async (id, newContent) => {
        const csrfToken = document.cookie
            .split("; ")
            .find(row => row.startsWith('csrfToken='))
            ?.split("=")[1]

        const res = await fetch(`/api/messages/${id}`, {
            method: 'PUT',
            body: JSON.stringify({
                content: newContent,
                isEdited: true,
                date: new Date().toISOString()
            }),
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-Token': csrfToken
            }
        })

        if (!res.ok) {
            setToast('Error al actualizar mensaje')
            setTimeout(() => setToast(null), 2500)
        }
        return await res.json()
    }, [])

    const deleteMessage = useCallback(async (id) => {

        const csrfToken = document.cookie.split('; ').find(r => r.startsWith('csrfToken='))?.split('=')[1];


        const previousData = [...messages];
        removeTemp(id);

        const res = await fetch(`/api/messages/${id}`, {
            method: 'DELETE',
            headers: { 'X-CSRF-Token': csrfToken }
        });

        if (!res.ok) {
            setToast("No se pudo eliminar");
            setData(previousData);
            setTimeout(() => setToast(null), 2500)
        }
        router.refresh()
    }, [messages, removeTemp, setData]);

    const { handleSubmit: handleUpdateSubmit, isSubmitting: isUpdating } = useForm(
        (data) => updateMessage(data.id, data.content),
        {
            onSuccess: (updatedItem) => {

                updateOptimistic(updatedItem.id, () => updatedItem);
                setEditingMessage(null);
            }
        }
    );



    useEffect(() => {
        if (pendingScrollId && messages.some(m => m.id == pendingScrollId)) {
            handleReferenceSent(pendingScrollId)
            setPendingScrollId(null)
        }
    }, [messages, pendingScrollId, handleReferenceSent])

    useEffect(() => {
        if (!loading && messages && window.location.hash) {
            const id = window.location.hash.replace("#", "")
            const el = document.getElementById(id)
            if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'center' })
                el.classList.add('bg-gray-800')
                setTimeout(() => {
                    el.classList.remove('bg-gray-800')
                }, 1000)
                router.refresh()
                history.replaceState(null, '', ' ')
            } else {
                setToast("El mensaje no existe")
                setTimeout(() => setToast(null), 2500)
            }


        }
    }, [loading, messages])

    const handleDeleteClick = (id) => {
        setMessageToDelete(id)
        setIsDeleteModalOpen(true)
    }

    const handleConfirmDelete = () => {
        if (messageToDelete) {
            deleteMessage(messageToDelete)
            setMessageToDelete(null)
        }
    }

    if (loading) return <Loader />

    return (
        <>
            <Text
                color={messages[0]?.boardId}
                onMessageSent={sendMessageOptimistic}
                onHandleSent={setPendingScrollId}
                isSubmitting={isSubmitting}
            />


            <EditModal
                isOpen={!!editingMessage}
                onClose={() => setEditingMessage(null)}
                initialContent={editingMessage?.content || ""}
                isSubmitting={isUpdating}
                onSave={(newContent) => handleUpdateSubmit({ id: editingMessage.id, content: newContent })}
            />

            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
            />


            <VersionModal
                isOpen={versionModalConfig.isOpen}
                onClose={() => setVersionModalConfig({ isOpen: false, messageId: null })}
                id={versionModalConfig.messageId}
                boardId={messages[0]?.boardId}
                type='message'
            />


            {toast && (
                <div className="fixed mt-20 top-6 left-1/2 -translate-x-1/2 bg-red-600 text-white px-4 py-2 rounded shadow-lg z-50">
                    {toast}
                </div>
            )}


            <div className="flex-col flex items-center w-full h-full">
                <div className="flex flex-col flex-grow w-full max-w-xl pt-10 items-center">
                    {messages && messages.map((message) => (
                        <div id={message.id} key={message.id} className={`md:w-10/7 w-screen border border-b-0 border-2 pb-4 ${borderColors[message.boardId]}`}>
                            <div className="flex space-x-3 w-full mb">
                                <div className="flex w-full mt-2">
                                    <div>
                                        <span className={`text-xs font-bold ${message.author? "text-green-500" : "text-gray-500"} leading-none px-2`}>{message.author? message.author.username : "wbn"}</span>
                                        <span className={`text-xs font-bold leading-none px-2 ${textColors[message.boardId]}`}>{`Th. ${message.id}`}</span>
                                        {message.isPinned && (
                                            <span className="text-xs text-gray-500">pinned</span>
                                        )}
                                        <div className="flex justify-between text-gray-300 p-3 rounded-l-lg rounded-lg">
                                            <div className="break-word wrap-normal text-sm overflow-hidden text-ellipsis line-clamp-10">
                                                <ExpandableMarkdown
                                                    text={message.content}
                                                    boardId={message.boardId}
                                                    limit={500}
                                                    onReferenceClick={handleReferenceSent}
                                                    comments={message.commentsContent}
                                                />
                                            </div>
                                        </div>
                                        <span className="text-xs text-gray-500 leading-none px-2">
                                            {new Date(message.date).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                        <span className="text-xs text-gray-500 leading-none px-2">
                                            {new Date(message.date).toLocaleDateString('es-ES', { weekday: 'short' })}
                                        </span>
                                        <span className="text-xs text-gray-500 leading-none px-2">
                                            {new Date(message.date).toLocaleDateString('es-ES', { month: '2-digit', day: '2-digit', year: 'numeric' })}
                                        </span>
                                        {message.isEdited && (
                                            <span
                                                onClick={() => openVersions(message.id)}
                                                className="text-xs hover:underline active:text-gray-300 active:underline text-gray-500 leading-none px-2 cursor-pointer">
                                                editado
                                            </span>

                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2 mx-auto">
                                    {message.canEdit && (
                                        <>
                      
                                            <button onClick={() => setEditingMessage(message)}>
                                                <svg className="text-gray-500 hover:text-cyan-400 cursor-pointer" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                                </svg>
                                            </button>

                                      
                                            <button onClick={() => handleDeleteClick(message.id)}>
                                                <svg className="text-gray-500 hover:text-red-500 cursor-pointer" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <polyline points="3 6 5 6 21 6"></polyline>
                                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                                </svg>
                                            </button>
                                        </>
                                    )}

                                    <button
                                        title="Copiar enlace"
                                        onClick={() => {
                                            const url = `${window.location.origin}/board/${message.boardId}#${message.id}`
                                            navigator.clipboard.writeText(url)
                                            setCopiedId(message.id)
                                            setTimeout(() => setCopiedId(null), 1200)
                                        }}
                                        className="mt-2 text-gray-500 hover:text-white active:text-gray-300 cursor-pointer"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-1">
                                            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                                            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                                        </svg>
                                        {copiedId === message.id && (
                                            <span className="fixed mt-20 top-6 left-1/2 -translate-x-1/2 bg-green-600 text-white px-4 py-2 rounded shadow-lg z-50">
                                                Enlace copiado
                                            </span>
                                        )}
                                    </button>

                                    <button onClick={() => router.push(`/board/${message.boardId}/${message.id}/comments?from=${message.id}`)} className="pr-2">
                                        <span className="ml-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 cursor-pointer active:text-gray-300 text-gray-500 hover:text-white mt-1" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd" />
                                            </svg>
                                        </span>
                                        <span className="text-xs text-gray-500 px-1">{message.comments}</span>
                                    </button>
                                </div>
                            </div>
                            {message.comments > 0 && (
                                Array.isArray(message.commentsContent) && message.commentsContent.map((c) => (
                                    <div key={c["id"]} className={`h-full break-word wrap-normal mx-10 h-10 border border-2 ${subBorderColors[message.boardId]} mt-1 text-xs p-3 hover:bg-gray-950`}>
                                        <span className={`font-bold ${c.author? "text-green-500" : "text-gray-600"} leading-none`}>{c.author ? c.author.username : "wbn"}</span>
                                        <span className={`text-xs font-bold leading-none px-2 ${textColors[message.boardId]}`}>{`N. ${c["id"]}`}</span>
                                        <p className='mb-2 text-gray-400'><MarkdownRenderer text={c["content"]} boardId={message.boardId} /></p>
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

  
        </>
    )
}