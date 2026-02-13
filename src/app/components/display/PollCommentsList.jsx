"use client"
import Link from 'next/link'
import { useRouter, useSearchParams } from "next/navigation"
import Text from "@/app/components/forms/text"
import EditModal from "@/app/components/modals/EditModal"
import DeleteModal from "@/app/components/modals/DeleteModal"
import VersionModal from "@/app/components/modals/VersionModal"
import { useState, useEffect, useCallback } from "react"
import Loader from "@/app/components/modals/Loader"
import MarkdownRenderer from '@/app/components/engines/MarkDownRenderer'
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
    const [editingComment, setEditingComment] = useState(null)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [commentToDelete, setCommentToDelete] = useState(null)
    const [versionModalConfig, setVersionModalConfig] = useState({ isOpen: false, commentId: null })
    const [toast, setToast] = useState(null)

    const openVersions = (id) => {
        setVersionModalConfig({ isOpen: true, commentId: id })
    }

    const {
        data: comments,
        setData,
        loading,
        addOptimistic,
        replaceTemp,
        removeTemp,
        updateOptimistic
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

        const { sage, ...dataWithoutSage } = commentData
        const res = await fetch('/api/poll_comments', {
            method: 'POST',
            body: JSON.stringify(dataWithoutSage),
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-Token': csrfToken,
                'sage': sage ? 'true' : 'false'
            }
        })

        if (!res.ok) {
            setToast('Error al enviar comentario')
            setTimeout(() => setToast(null), 2500)
        }
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

    const sendCommentOptimistic = useCallback(async (content, replyTo = null, isSage = false) => {
        const tempId = addOptimistic({
            content,
            parentId: replyTo,
            boardId: 'polls',
            isOP: false
        })

        const commentData = {
            content,
            pollId: Number(pollId),
            sage: isSage
        }

        try {
            const result = await handleCommentSubmit(commentData, tempId)
            return result?.id || tempId
        } catch (error) {
            console.error("Error enviando comentario:", error)
            return null
        }
    }, [addOptimistic, pollId, handleCommentSubmit, handleCommentSubmit])

    const updateComment = useCallback(async (id, newContent) => {
        const csrfToken = document.cookie
            .split("; ")
            .find(row => row.startsWith('csrfToken'))
            ?.split("=")[1]

        const res = await fetch(`/api/poll_comments/${id}`, {
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
            setToast('Error al actualizar comentario')
            setTimeout(() => setToast(null), 2500)
        }
        return await res.json()
    }, [])

    const deleteComment = useCallback(async (id) => {
        // if (!confirm("¿Estás seguro de eliminar este comentario?")) return;

        const csrfToken = document.cookie.split('; ').find(r => r.startsWith('csrfToken='))?.split('=')[1]

        const previousData = [...comments]
        removeTemp(id)

        const res = await fetch(`/api/poll_comments/${id}`, {
            method: 'DELETE',
            headers: { 'X-CSRF-Token': csrfToken }
        })

        if (!res.ok) {
            setToast("No se pudo eliminar")
            setData(previousData)
        }
        router.refresh()
    }, [comments, removeTemp, setData])

    const { handleSubmit: handleUpdateSubmit, isSubmitting: isUpdating } = useForm(
        (data) => updateComment(data.id, data.content),
        {
            onSuccess: (updatedItem) => {
                updateOptimistic(updatedItem.id, () => updatedItem)
                setEditingComment(null)
            }
        }
    )


    useEffect(() => {
        if (pendingScrollId && comments.some(m => m.id == pendingScrollId)) {
            handleReferenceClick(pendingScrollId)
            setPendingScrollId(null)
        }
    }, [comments, pendingScrollId, handleReferenceClick])

    const handleDeleteClick = (id) => {
        setCommentToDelete(id)
        setIsDeleteModalOpen(true)
    }

    const handleConfirmDelete = () => {
        if (commentToDelete) {
            deleteComment(commentToDelete)
            setCommentToDelete(null)
        }
    }

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

            <EditModal
                isOpen={!!editingComment}
                onClose={() => setEditingComment(null)}
                initialContent={editingComment?.content || ""}
                isSubmitting={isUpdating}
                onSave={(newContent) => handleUpdateSubmit({ id: editingComment.id, content: newContent })}
            />

            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={(handleConfirmDelete)}
            />

            <VersionModal
                isOpen={versionModalConfig.isOpen}
                onClose={() => setVersionModalConfig({ isOpen: false, commentId: null })}
                id={versionModalConfig.commentId}
                type='comment'
            />

            {/* Toast de error */}
            {toast && (
                <div className="fixed mt-20 top-6 left-1/2 -translate-x-1/2 bg-red-600 text-white px-4 py-2 rounded shadow-lg z-50">
                    {toast}
                </div>
            )}


            {comments.map(cmt => (
                <div id={cmt.id} key={cmt.id} className="flex w-full border mt-1 justify-between border-pink-800 border-3 space-x-3">
                    <div>
                        <span className="text-xs font-bold text-gray-500 leading-none px-2"> wbn</span>
                        {cmt.isOP && <span className="text-xs font-bold text-gray-300 leading-none pr-2">OP</span>}
                        <span className="text-xs font-bold text-pink-300 leading-none">N. {cmt.id}</span>
                        <span className="text-xs hover:underline hover:text-blue-300 active:underline active:text-blue-300 text-blue-500 cursor-pointer px-4">
                            {cmt.parentId ? (`R >>> ${cmt.parentId}`) : null}
                        </span>
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
                            <span
                                onClick={() => openVersions(cmt.id)}
                                className="text-xs hover:underline text-gray-500 active:text-gray-300 active:underline leading-none px-2 cursor-pointer">
                                editado
                            </span>
                        )}
                    </div>
                    <div className="flex items-center space-x-2">
                        {cmt.canEdit && (
                            <>
                                {/* Botón Editar */}
                                <button onClick={() => setEditingComment(cmt)}>
                                    <svg className="text-gray-500 hover:text-cyan-400 cursor-pointer" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                    </svg>
                                </button>

                                {/* Botón Eliminar */}
                                <button onClick={() => handleDeleteClick(cmt.id)}>
                                    <svg className="text-gray-500 hover:text-red-500 cursor-pointer" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <polyline points="3 6 5 6 21 6"></polyline>
                                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                    </svg>
                                </button>
                            </>
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