"use client"


// import { useState } from 'react'
// import Link from 'next/link'

export default function Comment({ comment }) {




    return (
        <div className="flex w-full mt-2 space-x-3 max-w-lg">
            <div className="flex w-full mt-2 space-x-3 max-w-lg">
                <div>
                    <span className="text-xs font-bold text-gray-500 leading-none px-2">{comment.isComment ? comment.id : null} {comment.userId} </span>
                    <div className="flex break-word wrap-normal whitespace-pre-line justify-between bg-gray-800 text-white p-3 rounded-l-lg rounded-lg hover:bg-gray-600">
                        <p className="text-sm">{comment.content}</p>
                    </div>
                    <span className="text-xs text-gray-500 leading-none px-2">{new Date(comment.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    <span className="text-xs text-gray-500 leading-none px-2">{new Date(comment.date).toLocaleDateString('es-ES', { weekday: 'short' })}</span>
                    <span className="text-xs text-gray-500 leading-none px-2">{new Date(comment.date).toLocaleDateString('es-ES', { month: '2-digit', day: '2-digit', year: 'numeric' })}</span>


                </div>





            </div>




        </div>
    );
}
