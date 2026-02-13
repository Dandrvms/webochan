"use client"
import { useState, useEffect, useRef, useCallback } from "react"

import MarkdownRenderer from "@/app/components/engines/MarkDownRenderer"

export default function Text({
  reply,
  onClearReply,
  onCommentSent,
  onMessageSent,
  onHandleSent,
  color,
  isSubmitting = false,
  comments = []
}) {
  const textareaRef = useRef(null)
  const [content, setContent] = useState("")
  const [isSage, setIsSage] = useState(false)
  const [localIsSubmitting, setLocalIsSubmitting] = useState(false)


  const colors = { webo: "border-cyan-600", meta: "border-purple-400", polls: "border-pink-300" }
  const textCol = { webo: "text-blue-500", meta: "text-purple-500", polls: "text-fuchsia-400" }
  const caret = { webo: "caret-cyan-400", meta: "caret-purple-400", polls: "caret-fuchsia-400" }
  const accent = { webo: "accent-cyan-400", meta: "accent-purple-400", polls: "accent-fuchsia-400" }

  const isCommentsPage = !!onCommentSent


  useEffect(() => {
    if (reply) {
      const refText = `>>${reply}`
      if (!content.includes(refText)) {
        const newValue = content.length > 0 && !content.endsWith('\n')
          ? content + "\n" + refText + "\n"
          : content + refText + "\n"
        setContent(newValue)
        textareaRef.current?.focus()
      }
    }
  }, [reply])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === 'Enter' && document.activeElement === textareaRef.current) {
        e.preventDefault();
        textareaRef.current.form.requestSubmit();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const onSub = async (e) => {
    e.preventDefault()
    const txt = content.trim()

    if (txt.length === 0) return
    setLocalIsSubmitting(true)

    try {
      let result
      if (isCommentsPage) {
        if (onCommentSent) {
          const tempId = await onCommentSent(txt, reply, isSage)
          result = { id: tempId }
          if (onClearReply) onClearReply()
        }
      } else if (onMessageSent) {
        const path = window.location.pathname.split("/");
        const boardId = path[2]
        result = await onMessageSent(txt, boardId)
      }

      if (result?.id && onHandleSent) onHandleSent(result.id)
      setContent("")
    } catch (error) {
      console.error("Error en onSub:", error)
    } finally {
      setLocalIsSubmitting(false)
    }
  }

  const isLoading = isSubmitting || localIsSubmitting

  return (
    <div className="flex flex-col items-center py-4 sm:px-0 px-4 w-full max-w-xl mx-auto">
      <form onSubmit={onSub} className="w-full">
        <div className={`px-3 py-2 border border-3 ${colors[color] || colors.webo} ${isLoading ? 'opacity-70' : ''}`}>

          {/* Label de la terminal */}
          <div className="text-[10px] text-gray-500 mb-1 font-mono uppercase ml-2">
            [ INPUT_BUFFER_{color?.toUpperCase() || 'SYS'} ]
          </div>

          <textarea
            id="chat"
            ref={textareaRef}
            rows="3"
            className={`resize-y p-2.5 w-full text-sm placeholder-gray-600 text-white outline-none bg-transparent ${caret[color]} [caret-shape:block] font-mono`}
            placeholder={isCommentsPage ? "Escribe una respuesta..." : "Escribe un nuevo hilo..."}
            disabled={isLoading}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          <div className="flex items-center justify-between px-1 pb-2 border-t border-gray-800 pt-2">
            {isCommentsPage ? (
              <div className="flex items-center">
                <input
                  type="checkbox"
                  className={`${accent[color]} bg-black`}
                  onChange={(e) => setIsSage(e.target.checked)}
                  checked={isSage}
                  disabled={isLoading}
                />
                <span className="px-2 text-gray-500 text-[10px] uppercase font-mono">sage</span>
              </div>
            ) : <div />}

            <button
              type="submit"
              disabled={isLoading}
              className={`text-xs font-mono uppercase px-3 py-1 border border-transparent hover:border-current ${textCol[color] || textCol.webo} ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isLoading ? "> PROCESANDO..." : "> PUBLICAR"}
            </button>
          </div>
        </div>
      </form>


      {content.trim().length > 0 && (
        <div className={`mt-4 w-full p-4 border border-dashed ${colors[color] || colors.webo} bg-black/50 opacity-80 animate-pulse-subtle`}>
          <div className="text-[10px] text-gray-500 mb-3 font-mono uppercase flex justify-between">
            <span>[ LIVE_RENDER_OUTPUT ]</span>
            {/* <span className="animate-pulse">●</span> */}
          </div>
          <div className="text-sm break-words overflow-hidden text-gray-300">
            <MarkdownRenderer
              text={content}
              comments={comments}
              boardId={color}
            />
          </div>
        </div>
      )}
    </div>
  )
}