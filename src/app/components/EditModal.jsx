import { useState, useEffect } from "react"

export default function EditModal({ isOpen, onClose, initialContent, onSave, isSubmitting }) {
    const [content, setContent] = useState(initialContent);
    useEffect(() => {
        setContent(initialContent);
    }, [initialContent]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray/70 backdrop-blur-xs p-4">
            <div className="border border-gray-600 border-dotted border-4 p-6 w-full max-w-lg shadow-2xl">
                <h3 className="text-gray-400 font-bold mb-4">Editar mensaje</h3>
                <textarea
                    autoFocus
                    className="w-full bg-black/70 backdrop-blur-xs text-white border border-3 border-gray-700 p-3 outline-none focus:border-gray-400 transition-colors resize-none"
                    rows="8"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    disabled={isSubmitting}
                />
                
                <div className="flex justify-between mt-4">
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:bg-white hover:text-black transition-colors cursor-pointer px-4 py-2"
                        disabled={isSubmitting}
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={() => onSave(content)}
                        className="bg-green-700 hover:bg-white hover:text-black cursor-pointer text-white px-6 py-2 font-semibold transition-all disabled:opacity-50"
                        disabled={isSubmitting || !content.trim()}
                    >
                        {isSubmitting ? "Guardando..." : "Guardar cambios"}
                    </button>
                </div>
            </div>
        </div>
    );
}