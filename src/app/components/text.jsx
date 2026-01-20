"use client"
import { useState, useEffect, useRef, useCallback } from "react"
export default function Text({
  reply,
  onClearReply,
  onCommentSent,
  onMessageSent,
  onHandleSent,
  color,
  isSubmitting = false
}) {
  const textareaRef = useRef(null)
  const [isSage, setIsSage] = useState(false)
  const [localIsSubmitting, setLocalIsSubmitting] = useState(false)

  const colors = {
    webo: "border-cyan-600",
    meta: "border-purple-400",
    polls: "border-pink-300"
  }

  const text = {
    webo: "text-blue-500",
    meta: "text-purple-500",
    polls: "text-fuchsia-400"
  }


  const pathSegments = typeof window !== 'undefined'
    ? window.location.pathname.split("/")
    : []
  const isCommentsPage = pathSegments[4] === "comments"
  const isPollComments = pathSegments[2] === "polls" && isCommentsPage

  const onSageChange = (e) => {
    setIsSage(e.target.checked)
  }

  useEffect(() => {
    if (reply && textareaRef.current) {
      const current = textareaRef.current.value
      const refText = `>>${reply}`
      // Solo agrega si no existe ya la referencia exacta
      if (!current.includes(refText)) {
        const newValue = current.length > 0 && !current.endsWith('\n')
          ? current + "\n" + refText + "\n"
          : current + refText + "\n"
        textareaRef.current.value = newValue
        textareaRef.current.focus()
      }
    }
  }, [reply])

  const onSub = async (e) => {
    e.preventDefault()
    const txt = e.target.chat.value.trim()

    if (txt.length === 0) return

    setLocalIsSubmitting(true)

    try {
      let result

      if (isCommentsPage) {

        if (onCommentSent && typeof onCommentSent === 'function') {
          const tempId = await onCommentSent(txt, reply, isSage)
          result = { id: tempId }
        } else {
          console.warn("onCommentSent no es una función válida")
          return
        }
        if (onClearReply) onClearReply()
      } else {

        if (onMessageSent && typeof onMessageSent === 'function') {
          const path = window.location.pathname.split("/");
          const boardId = path[2]
          result = await onMessageSent(txt, boardId)
        } else {
          console.warn("onMessageSent no es una función válida")
          return
        }
      }

      if (result && result.id && onHandleSent) {
        onHandleSent(result.id)
      }

      e.target.chat.value = "";
    } catch (error) {
      console.error("Error en onSub:", error)
    } finally {
      setLocalIsSubmitting(false)
    }
  }

  const isLoading = isSubmitting || localIsSubmitting

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

  return (
    <div className="flex justify-center py-4 sm:px-0 px-4">
      <form onSubmit={onSub}>
        <div className={`items-center px-3 py-2 border border-3 ${colors[color] || colors.webo} ${isLoading ? 'opacity-70' : ''}`}>
          <textarea
            id="chat"
            ref={textareaRef}
            rows="2"
            cols="50"
            className="resize p-2.5 w-full text-sm placeholder-gray-400 text-white outline-none bg-transparent"
            placeholder={isCommentsPage ? "Escribe una respuesta" : "Escribe un nuevo hilo"}
            disabled={isLoading}
          />

          <div className="flex items-center justify-between px-1 pb-2">
            {isCommentsPage ? (
              <div className="px-1 flex items-center">
                <input
                  type="checkbox"
                  className="accent-cyan-500/25 bg-black"
                  onChange={onSageChange}
                  checked={isSage}
                  disabled={isLoading}
                />
                <span className="px-2 mb-1 text-gray-400 text-sm">sage</span>
              </div>
            ) : <div></div>}

            <button
              type="submit"
              disabled={isLoading}
              className={`inline-flex justify-center p-2 cursor-pointer ${text[color] || text.webo} hover:bg-gray-300 hover:text-black active:bg-gray-300 active:text-black ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {/* {isLoading ? (
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 rotate-90 rtl:-rotate-90" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 20">
                      <path d="m17.914 18.594-8-18a1 1 0 0 0-1.828 0l-8 18a1 1 0 0 0 1.157 1.376L8 18.281V9a1 1 0 0 1 2 0v9.281l6.758 1.689a1 1 0 0 0 1.156-1.376Z" />
                    </svg>
                  )} */}
              Publicar
              <span className="sr-only">Send message</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}