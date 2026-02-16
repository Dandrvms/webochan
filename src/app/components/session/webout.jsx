"use client"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function Webout({onClose, Logout}) {
    const [toast, setToast] = useState(null)
    const router = useRouter()

    const logout = async () => {
        setToast("[Cargando...]")
        try {
            const response = await fetch("/api/auth/webout", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
            })
            setToast("Sesión cerrada")
            Logout()
            onClose()
        } catch (e) {
            setToast("[Ocurrió un error]")
            setTimeout(() => setToast(null), 2500)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black">
            {toast && (
                <div className="fixed mt-20 top-6 left-1/2 -translate-x-1/2 text-lg text-white px-4 py-2 z-50">
                    {toast}
                </div>
            )}
            <div className="border border-gray-700 px-6 py-3 shadow-md w-full max-w-sm">
                <div className="flex">
                    <button
                        onClick={onClose}
                        className="ml-auto "

                    >✕</button>
                </div>
                <label className="block text-gray-400 mb-2 text-center">Actualmente tienes una sesión activa.</label>
                <div className="flex justify-center ">
                    <button
                        onClick={() => logout()}
                        className="text-gray-400 py-2 px-20 border border-gray-400 px-2 cursor-pointer hover:bg-white active:bg-white hover:text-black active:text-black">
                        Salir
                    </button>
                </div>
            </div>
        </div>
    )
}