"use client"

import * as React from 'react'
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";


export default function Edit({ params }) {

    const { boardId, messageId } = React.use(params)
    const router = useRouter()
    const [content, setContent] = useState("");



    const { id } = React.use(params)


    useEffect(() => {
        fetch(`/api/comments/${id}`, {
            headers: {
                "x-csrf-token": document.cookie
                    .split('; ')
                    .find(row => row.startsWith('csrfToken='))
                    ?.split('=')[1]
            }
        })
            .then((res) => res.json())
            .then(data => {

                setContent(data.content)

            });


    }, []);




    const onSubmit = async (e) => {
        e.preventDefault();




        if (!content) {

            return
        }
        const edited = new Date()
        edited.setHours(edited.getHours())

        const res = await fetch(`/api/comments/${id}`, {
            method: "PUT",
            body: JSON.stringify({ content, edited: new Date().toUTCString, isEdited: true }),
            headers: {
                "Content-Type": "application/json",
                "x-csrf-token": document.cookie
                    .split('; ')
                    .find(row => row.startsWith('csrfToken='))
                    ?.split('=')[1]
            },
        })

        const data = await res.json()

        if (data.error) {
            router.back()
            return
        }

        const ver = await fetch(`/api/comment_versions`, {

            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                "x-csrf-token": document.cookie
                    .split('; ')
                    .find(row => row.startsWith('csrfToken='))
                    ?.split('=')[1]
            },
            body: JSON.stringify({
                content: data.content,
                commentId: data.id,
            }),



        })




        router.back()
    }

    return (
        <form onSubmit={onSubmit}>
            <div className=" flex flex-col items-center h-screen w-screen px-2 bg-gray-900 text-white">
                <div className="flex w-full h-full items-center mt-2 space-x-3 max-w-lg">

                    <div className="flex border text-white p-3 rounded-l-lg rounded-lg">

                        <textarea id="edit" rows="10" cols="30" onChange={(e) => setContent(e.target.value)} value={content} className="resize-none outline-none">

                        </textarea>


                    </div>
                    <div className="p-2">

                        <button type="submit" className="w-full bg-green-900 flex p-2 rounded-lg cursor-pointer hover:bg-green-700 active:bg-green-700">Guardar</button>


                        <button type="button" className="w-full mt-4 bg-pink-900 flex p-2 rounded-lg cursor-pointer hover:bg-pink-700 active:bg-pink-700"
                            onClick={async () => {

                                const res = await fetch(`/api/comments/${id}`, {
                                    method: 'PUT',
                                    body: JSON.stringify({
                                        date: new Date()
                                    }),
                                    headers: {
                                        "Content-Type": "application/json",
                                        "x-csrf-token": document.cookie
                                            .split('; ')
                                            .find(row => row.startsWith('csrfToken='))
                                            ?.split('=')[1]
                                    }
                                })


                                const data = await res.json()
                                if (data.error) {
                                    router.back()
                                    return
                                }

                                await fetch(`/api/comment_versions`, {
                                    method: 'DELETE',
                                    body: JSON.stringify({
                                        commentId: id
                                    }),
                                    headers: {
                                        "Content-Type": "application/json",
                                        "x-csrf-token": document.cookie
                                            .split('; ')
                                            .find(row => row.startsWith('csrfToken='))
                                            ?.split('=')[1]
                                    }
                                })

                                fetch(`/api/comments/${id}`, {
                                    method: 'DELETE',
                                    headers: {
                                        "x-csrf-token": document.cookie
                                            .split('; ')
                                            .find(row => row.startsWith('csrfToken='))
                                            ?.split('=')[1]
                                    }
                                })

                                router.push(`/board/${boardId}/${messageId}/comments`);
                            }}

                        >Eliminar</button>

                        <button type="button" className="w-full justify-center mt-4 bg-blue-900 flex p-2 rounded-lg cursor-pointer hover:bg-blue-700 active:bg-blue-gray"
                            onClick={() => {
                                router.back()
                            }}
                        >Volver</button>


                    </div>
                </div>

            </div>
        </form>

    )
}