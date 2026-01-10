"use client"

import * as React from 'react'
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";



export default function Edit({ params }) {


    const router = useRouter()
    const [content, setContent] = useState("");



    const { id, boardId } = React.use(params)


    useEffect(() => {
        const csrfToken = document.cookie
        .split('; ')
        .find(row => row.startsWith('csrfToken='))
        ?.split('=')[1]
        fetch(`/api/messages/${id}`, {
            method: "GET",
            headers: {
                "x-csrf-token": csrfToken
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


        const res = await fetch(`/api/messages/${id}`, {
            method: "PUT",
            body: JSON.stringify({ content, edited: new Date().toUTCString, isEdited: true, date: new Date().toUTCString }),
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
            return
        }

        const ver = await fetch(`/api/versions`, {

            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                content: data.content,
                messageId: data.id,
            }),



        })




        router.back()
    }

    return (
        <form onSubmit={onSubmit}>
            <div className=" flex flex-col items-center h-screen w-screen px-2">
                <div className="flex w-full h-full items-center mt-2 space-x-3 max-w-lg">

                    <div className="flex border text-white p-3 rounded-l-lg rounded-lg">

                        <textarea id="edit" rows="10" cols="30" onChange={(e) => setContent(e.target.value)} value={content} className="resize-none outline-none">

                        </textarea>


                    </div>
                    <div className="p-2">

                        <button type="submit" className="w-full bg-green-900 flex p-2 rounded-lg cursor-pointer hover:bg-green-700 active:bg-green-700">Guardar</button>


                        <button type="button" className="w-full mt-4 bg-pink-900 flex p-2 rounded-lg cursor-pointer hover:bg-pink-700 active:bg-pink-700"
                            onClick={async () => {
                                // const res = await fetch(`/api/comments/`, {
                                //     method: "DELETE",
                                //     body: JSON.stringify({
                                //         messageId: id
                                //     }),
                                // })
                                // const data = await res.json()
                                // if(data.error){
                                //     router.push("/")
                                //     return
                                // }
                                // await fetch(`/api/versions`, {
                                //     method: "DELETE",
                                //     body: JSON.stringify({
                                //         messageId: id
                                //     }),
                                //     headers: {
                                //         "Content-Type": "application/json",
                                //     },
                                // })



                                fetch(`/api/messages/${id}`, {
                                    method: "DELETE",
                                    headers: {
                                        "x-csrf-token": document.cookie
                                            .split('; ')
                                            .find(row => row.startsWith('csrfToken='))
                                            ?.split('=')[1]
                                    }
                                })

                                router.push(`/board/${boardId}`);
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