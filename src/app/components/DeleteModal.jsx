import { useState, useEffect } from "react"

export default function DeleteModal({ isOpen, onClose, onConfirm}) {
    
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray/70 backdrop-blur-xs p-4">
            <div className="border border-gray-700 border-dotted border-4 p-6 w-full max-w-lg shadow-2xl">
                <h3 className="text-gray-300 font-bold mb-4 text-center">¿Estás seguro de que deseas borrar el mensaje?</h3>
                <div className="flex justify-center mt-4">
                    
                    <button
                       
                        className="bg-red-700 hover:bg-white hover:text-black text-white px-6 py-2 mx-1 font-semibold transition-all disabled:opacity-50 cursor-pointer"
                        onClick={() => {
                            onConfirm()
                            onClose()
                        }}
                    >
                        Borrar
                    </button>

                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:bg-white hover:text-black border rounded mx-1 transition-colors px-4 py-2 cursor-pointer"
                        
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    );
}