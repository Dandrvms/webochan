"use client"
import { useState } from "react"


export default function Webin({onClose, isLogged}) {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [errorToast, setErrorToast] = useState(null)
    const [toast, setToast] = useState(null)


    const onSub = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)
        setToast("[Cargando...]")

        const response = await fetch("/api/auth/webin", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username,
                password
            })
        })
        setToast(null)
        const { message, error } = await response.json()
        if (response.status != 200) {
            setErrorToast(`[${error}]`)
            setTimeout(() => setErrorToast(null), 2500)
            setUsername("")
            setPassword("")
            setIsSubmitting(false)
        } else {
            setToast(`[${message}]`)
            setUsername("")
            setPassword("")
            setIsSubmitting(false)
            isLogged()
            onClose()
        }



    }


 

    return (

        <div className="fixed inset-0 z-50  flex flex-col items-center justify-center bg-black">
            {errorToast && (
                <div className="fixed mt-20 top-6 left-1/2 -translate-x-1/2 text-lg text-red-500 px-4 py-2 z-50">
                    {errorToast}
                </div>
            )}
            {toast && (
                <div className="fixed mt-20 top-6 left-1/2 -translate-x-1/2 text-lg text-white px-4 py-2 z-50">
                    {toast}
                </div>
            )}
            <form onSubmit={onSub} autoFocus autoComplete="off" className="border border-gray-700 p-3 w-full max-w-sm">
                <div className="">
                    <div className="mb-4">
                        <div className="flex">
                            <button 
                            onClick={onClose}
                            className="ml-auto "
                            
                            >✕</button>
                        </div>
                        <label className="block text-gray-400 mb-2 text-center">Hola, demuestra que eres admin.</label>
                        <div className="flex">
                            <label className="text-gray-400 font-extrabold mt-2 mr-1" >{"~/user$"}</label>
                            <input
                                type="text"
                                className="w-full py-2 outline-none text-gray-400 [caret-shape:block] caret-gray-400"
                                value={username}
                                required
                                autoComplete="off"
                                autoFocus
                                maxLength={50}
                                onChange={(e) => setUsername(e.target.value)}
                                disabled={isSubmitting}
                            />
                        </div>

                        <div className="flex">
                            <label className="text-gray-400 font-extrabold mt-2 mr-1" >{"~/user/pass$"}</label>
                            <input
                                type="password"
                                className="w-full py-2 outline-none text-gray-400 [caret-shape:block] caret-gray-400"
                                value={password}
                                required
                                autoComplete="off"
                                maxLength={50}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={isSubmitting}
                            />
                        </div>
                    </div>
                </div>
                <div className="flex justify-center">
                    <button
                        type="submit"
                        className="text-gray-400 py-2 px-2 cursor-pointer align-left hover:bg-white hover:text-black active:text-black active:bg-white"
                        disabled={isSubmitting}
                    >
                        ok
                    </button>
                </div>
            </form>
        </div>
    );
}