"use client"
import { useState, useEffect, useRef } from "react";
export default function Text({ reply, onClearReply, onCommentSent, onMessageSent, onHandleSent, color }) {
  const textareaRef = useRef(null);


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

  const [isSage, setIsSage] = useState(false);
  const onSageChange = (e) => {
    setIsSage(e.target.checked);
    console.log("Sage status changed:", e.target.checked);
  };


  useEffect(() => {
    if (reply && textareaRef.current) {
      const current = textareaRef.current.value;
      const refText = `>>${reply}`;
      // Solo agrega si no existe ya la referencia exacta
      if (!current.split('\n').includes(refText)) {
        if (current.length > 0 && !current.endsWith('\n')) {
          textareaRef.current.value = current + "\n" + refText + "\n";
        } else {
          textareaRef.current.value = current + refText + "\n";
        }
        textareaRef.current.focus();
      }
    }
  }, [reply]);


  const onSub = async (e) => {
    e.preventDefault();



    const txt = e.target.chat.value;
    if (txt.length === 0) return;

    const path = window.location.pathname.split("/");

    if (path[4] === "comments") {

      const id = path[3];

      if (path[2] == "polls") {

        const pollcomm = await fetch('/api/poll_comments', {
          method: 'POST',
          body: JSON.stringify({
            content: txt,
            pollId: Number(id),


          }),
          headers: {
            'Content-Type': 'application/json',
            'Sage': isSage ? 'true' : 'false',
            "x-csrf-token": document.cookie
              .split('; ')
              .find(row => row.startsWith('csrfToken='))
              ?.split('=')[1]
          }
        })

        const pollcomver = await pollcomm.json()

        fetch(`/api/comment_versions`, {
          method: 'POST',
          body: JSON.stringify({
            content: txt,
            commentId: pollcomver.id
          }),
          headers: {
            "Content-Type": "application/json",
            "x-csrf-token": document.cookie
              .split('; ')
              .find(row => row.startsWith('csrfToken='))
              ?.split('=')[1]
          }
        })
        await onCommentSent()
        onHandleSent(pollcomver.id)
        onClearReply()
      } else {

        const comm = await fetch('/api/comments', {
          method: 'POST',
          body: JSON.stringify({
            content: txt,
            messageId: Number(id),
            boardId: path[2]

          }),
          headers: {
            'Content-Type': 'application/json',
            'Sage': isSage ? 'true' : 'false',
            "x-csrf-token": document.cookie
              .split('; ')
              .find(row => row.startsWith('csrfToken='))
              ?.split('=')[1]
          }
        })

        const comver = await comm.json()

        fetch(`/api/comment_versions`, {
          method: 'POST',
          body: JSON.stringify({
            content: txt,
            commentId: comver.id
          }),
          headers: {
            "Content-Type": "application/json",
            "x-csrf-token": document.cookie
              .split('; ')
              .find(row => row.startsWith('csrfToken='))
              ?.split('=')[1]
          }
        })
        await onCommentSent()
        onHandleSent(comver.id)
        onClearReply()
      }

    }
    else {

      const res = await fetch('/api/messages', {
        method: 'POST',
        body: JSON.stringify({
          content: txt,
          boardId: path[2]

        }),
        headers: {
          'Content-Type': 'application/json',
          "x-csrf-token": document.cookie
            .split('; ')
            .find(row => row.startsWith('csrfToken='))
            ?.split('=')[1]
        }
      })

      const ver = await res.json()





      fetch('/api/versions', {
        method: "POST",
        body: JSON.stringify({
          content: txt,
          messageId: ver.id
        }),
        headers: {
          'Content-Type': 'application/json',
          "x-csrf-token": document.cookie
            .split('; ')
            .find(row => row.startsWith('csrfToken='))
            ?.split('=')[1]
        }
      })
      // if(typeof onSent === 'function'){
      //   console.log("AAAAAAAA")
      //   await onSent()
      // }
      await onMessageSent()
      onHandleSent(ver.id)
    }

    e.target.chat.value = "";


  }


  return (
    <>

      <div className="flex justify-center py-4 sm:px-0 px-4">

        <form className="" onSubmit={onSub}>
          {/* {parentId && (
            <div className="reply-indicator">
              <span className="bg-blue-800 rounded-lg p-2 text-xs">{`>>> Respondiendo a ${parentId}`}</span>
              <button type="button" className="bg-blue-800 rounded-lg p-2 text-xs cursor-pointer active:bg-pink-900 hover:bg-pink-900" onClick={onClearReply}>X</button>
            </div>
          )} */}

          <div className={`items-center px-3 py-2 rounded-xl  border ${colors[color]}`}>

            <textarea id="chat" ref={textareaRef} rows="2" cols="50" className="resize  p-2.5 w-full text-sm placeholder-gray-400 text-white   outline-none" placeholder={window.location.pathname.split("/")[4] === "comments" ? "Escribe una respuesta" : "Escribe un nuevo hilo"}></textarea>

            <div className="flex items-center justify-between px-1 pb-2 ">
              {window.location.pathname.split("/")[4] === "comments" ? (

                <div className="px-1 flex items-center">

                  <input
                    type="checkbox"
                    className="accent-cyan-500/25 bg-black" // <-- Cambia el color de fondo aquí
                    onChange={onSageChange}
                    checked={isSage}
                  />
                  <span className="px-2 mb-1 text-gray-400 text-sm">sage</span>
                </div>

              ) : <div></div>}
              <button type="submit" className={`inline-flex justify-center p-2  rounded-full cursor-pointer ${text[color]} hover:bg-gray-600 active:bg-gray-600`}>
                <svg className="w-5 h-5 rotate-90 rtl:-rotate-90" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 20">
                  <path d="m17.914 18.594-8-18a1 1 0 0 0-1.828 0l-8 18a1 1 0 0 0 1.157 1.376L8 18.281V9a1 1 0 0 1 2 0v9.281l6.758 1.689a1 1 0 0 0 1.156-1.376Z" />
                </svg>
                <span className="sr-only">Send message</span>
              </button>


            </div>

          </div>


        </form>

      </div>

    </>
  );
}