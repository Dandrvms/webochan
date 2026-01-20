// app/components/VersionModal.js
import { useState, useEffect } from "react"
import Loader from "./Loader"

export default function VersionModal({ isOpen, onClose, id, boardId, type }) {
    const [versions, setVersions] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (isOpen && id) {
            setLoading(true)
            fetch(type === 'message' ? `/api/versions` : '/api/comment_versions', {
                headers: {
                    // 'Content-Type': 'application/json',
                    // 'X-CSRF-Token': csrfToken,
                    'id': id
                }
            }) // Ajusta a tu endpoint real
                .then(res => res.json())
                .then(data => {
                    setVersions(data)
                    setLoading(false)
                })
                .catch(() => setLoading(false))
        }
    }, [isOpen, id])

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray/70 backdrop-blur-xs p-4">
            <div className=" border border-gray-700 w-full max-w-lg overflow-hidden flex flex-col max-h-[80vh]">
                <div className="p-4 border-b border-gray-800 flex justify-between items-center">
                    <h3 className="text-white font-bold">Historial de ediciones</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
                </div>

                <div className="p-4 overflow-y-auto">
                    {loading ? (
                        <div className="flex justify-center py-10">Cargando...</div>
                    ) : versions.length > 0 ? (
                        versions.map((v, index) => (
                            <div key={v.id} className="mb-4 p-3 border-l-4 border border-gray-700 bg-gray-950">
                                <p className="text-xs text-gray-500 mb-1">
                                    {index === 0 ? "Versión actual" : `Versión anterior`} - {new Date(v.date).toLocaleString()}
                                </p>
                                <p className="text-sm text-gray-300 italic">"{v.content}"</p>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 text-center py-4">No hay versiones guardadas.</p>
                    )}
                </div>
            </div>
        </div>
    )
}