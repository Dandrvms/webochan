"use client"

import { useState, useRef, useEffect } from "react"

export default function Poll_Form({ refreshPolls, onHandleSent, isSubmitting }) {
    const [options, setOptions] = useState([])
    const [focusLast, setFocusLast] = useState(false)
    const inputRefs = useRef([])
    const questionRef = useRef(null)

    const handleAddOption = () => {
        if (options.length == 12) return
        setOptions(prev => [...prev, ""])
        setFocusLast(true)
    }

    useEffect(() => {
        if (focusLast && inputRefs.current.length > 0) {
            inputRefs.current[inputRefs.current.length - 1]?.focus()
            setFocusLast(false)
        }
    }, [options.length, focusLast])

    const handleOptionChange = (index, value) => {
        const newOptions = [...options]
        newOptions[index] = value
        setOptions(newOptions)
    }

    const onSub = async (e) => {
        e.preventDefault()
        const question = e.target.question.value
        const optionsData = options.filter(opt => opt.trim() !== "")

        if (question.trim() === "" || optionsData.length < 2) {
            return
        }

        const pollId = await refreshPolls(question, optionsData)

        if (pollId) {
            e.target.reset()
            setOptions([])
            setOpen(false)
            onHandleSent(pollId)
        } else {
            alert("Error al crear la encuesta")
        }
    }

    const [open, setOpen] = useState(false)

    const openModal = () => {
        inputRefs.current = []
        setOpen(true)
        setOptions([]);
    }

    const closeModal = () => {
        inputRefs.current = []
        setOpen(false)
    }

   
    const handleKeyDown = (e, index) => {
        if (e.key === "Enter") {
            e.preventDefault()
            if (index === -1) {
                
                handleAddOption()
            } else if (index === options.length - 1) {
                
                handleAddOption()
            } else if (inputRefs.current[index + 1]) {
              
                inputRefs.current[index + 1].focus()
            }
        }
    }

    return (
        <>
            <div className="relative flex flex-col items-center justify-center">
                {!open && (
                <button
                    
                    onClick={openModal}
                    className="border text-green-400 border-gray-300 rounded font-semibold py-2 px-4 hover:bg-white hover:text-black active:text-black active:bg-white my-5 cursor-pointer active:bg-white active:text-black"
                >
                    Crear Encuesta
                </button>
                )}
                {open && (
                    <>
                        <form onSubmit={onSub} autoFocus autoComplete="off" className="border p-6 rounded shadow-md w-full max-w-sm">
                            <div className="">
                                <div className="mb-4">
                                    <label className="block text-green-400 font-semibold mb-2" htmlFor="question">Pregunta</label>
                                    <input
                                        type="text"
                                        id="question"
                                        name="question"
                                        className="w-full py-2 outline-none placeholder-gray-400"
                                        placeholder="Haz una pregunta"
                                        required
                                        autoComplete="off"
                                        autoFocus
                                        ref={questionRef}
                                        onKeyDown={e => handleKeyDown(e, -1)}
                                        maxLength={255}
                                        disabled={isSubmitting}
                                    />
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="block text-green-400 font-semibold mb-2" htmlFor="options">Opciones de respuesta</label>
                            </div>
                            {options.map((option, index) => (
                                <div key={index} className="flex">
                                    <input
                                        key={index}
                                        ref={el => inputRefs.current[index] = el}
                                        type="text"
                                        id={`option-${index}`}
                                        name="options"
                                        value={option}
                                        className="w-full py-2 outline-none placeholder-gray-400"
                                        placeholder="Opción"
                                        required
                                        autoComplete="off"
                                        onChange={e => handleOptionChange(index, e.target.value)}
                                        maxLength={100}
                                        onKeyDown={e => handleKeyDown(e, index)}
                                        disabled={isSubmitting}
                                    />

                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="mt-2 h-5 w-6 justify-center text-gray-400 rotate-45 rounded-xl hover:text-gray-200 cursor-pointer transition duration-200"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        onClick={() => {
                                            const newOptions = options.filter((_, i) => i !== index)
                                            setOptions(newOptions)
                                        }}
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                </div>
                            ))}
                            <div
                                className="group flex hover:bg-white active:bg-white py-4 cursor-pointer"
                                onClick={handleAddOption}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10" className="fill-green-600 group-hover:fill-black group-active:fill-black" />
                                    <line x1="12" y1="8" x2="12" y2="16" stroke="white" />
                                    <line x1="8" y1="12" x2="16" y2="12" stroke="white" />
                                </svg>
                                <span className="group-hover:text-black group-active:text-black mx-5 text-green-400">Añadir una opción...</span>
                            </div>
                            <div className="text-xs text-gray-500">
                                {options.length < 11 ? (
                                    <p>Puedes añadir {12 - options.length} opciones más.</p>
                                ) : options.length < 12 ? (
                                    <p>Puedes añadir 1 opción más </p>
                                ) : (
                                    <p>Has añadido el número máximo de opciones</p>
                                )}
                            </div>
                            <div className="flex justify-between">
                                <div></div>
                                <div>
                                    <button
                                        type="button"
                                        className="font-semibold text-green-400 py-2 px-2 mx-2 cursor-pointer align-left  hover:bg-white hover:text-black active:text-black active:bg-white"
                                        onClick={closeModal}
                                        disabled={isSubmitting}
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        className="font-semibold text-green-400 py-2 px-2 cursor-pointer align-left hover:bg-white hover:text-black active:text-black active:bg-white"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? 'Creando...' : 'Crear'}
                                    </button>
                                </div>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Lee las <a href="/faq" className="text-green-400 hover:bg-white hover:text-black">faq</a> antes de hacer una encuesta por primera vez</p>
                            </div>
                        </form>
                    </>
                )}
            </div>
        </>
    )
}