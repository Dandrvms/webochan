"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from 'next/navigation'
import WebinModal from "@/app/components/modals/WebinModal"
import Editor from "../components/display/Editor";
import Screen from "../components/display/Screen";

export default function Terminal() {




    const theme = {
        promptUser: "text-green-400",
        promptPath: "text-blue-400",
        command: "text-amber-200",
        error: "text-red-400",
        output: "text-gray-300",
        system: "text-gray-400"
    };


    const [lines, setLines] = useState([]);
    const [input, setInput] = useState("");
    const [cwd, setCwd] = useState("/fs");
    const [user, setUser] = useState('anon')
    const [sessionLoaded, setSessionLoaded] = useState(false)
    const [isPending, setIsPending] = useState(false)
    const [history, setHistory] = useState([]);
    const [historyIndex, setHistoryIndex] = useState(null);
    const [booting, setBooting] = useState(true);
    const [webin, setWebin] = useState(false)
    const hasBooted = useRef(false);

    const [mode, setMode] = useState("NORMAL"); // NORMAL | EDITOR
    const [access, setAccess] = useState("") //WRITE | READ
    const [editorFile, setEditorFile] = useState(null);
    const [editorContent, setEditorContent] = useState("");
    const [fileId, setFileId] = useState(null)

    const [screenData, setScreenData] = useState(null);

    const router = useRouter()


    const containerRef = useRef(null);
    const inputRef = useRef(null);

    // auto-scroll al fondo cuando hay nuevas líneas
    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTop =
                containerRef.current.scrollHeight;
        }
    }, [lines]);





    async function handleSubmit(e) {

        e.preventDefault();
        if (!input.trim() || isPending) return;

        setIsPending(true)

        const command = input;

        if (command === "clear") {
            setInput("")
            setLines([]);
            setHistory(prev => [...prev, command]);
            setHistoryIndex(null);
            setIsPending(false);
            return;
        }



        setLines(prev => [
            ...prev,
            {
                type: "prompt",
                user,
                cwd,
                command
            },
            { type: "pending", text: "" }
        ]);

        setHistory(prev => [...prev, command]);
        setHistoryIndex(null);

        setInput("");

        if (command === 'exit') {
            handleExit()
        } else {

            try {
                const res = await fetch("/api/fs/execute", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ input: command }),
                });

                const data = await res.json()
                console.log("COMMAND:", command)
                console.log("FS RESPONSE:", data);

                if (data.mode === "EDITOR") {

                    setLines(prev => prev.slice(0, -1));

                    setMode(data.mode)
                    setAccess(data.access)
                    setEditorFile(data.file.name)
                    setEditorContent(data.file.content)
                    setFileId(data.file.id)
                    return
                }

                if (data.mode === "SCREEN") {
                    setMode(data.mode)
                    setScreenData(data.screen.sections)
                    return
                }



                if (command === 'login') {
                    setWebin(true)
                }

                setLines(prev => {
                    // quitar el pending

                    const withoutPending = prev.slice(0, -1);

                    if (!data.ok) {
                        return [
                            ...withoutPending,
                            { type: "error", text: data.error, hint: data.hint }
                        ];
                    }



                    return [
                        ...withoutPending,
                        ...(data.output
                            ? [{ type: "output", text: data.output }]
                            : [])
                    ];
                });

                if (data.cwd) {
                    setCwd(data.cwd);
                }
            } catch {
                setLines(prev => [
                    ...prev.slice(0, -1),
                    { type: "error", text: "error: connection failed" }
                ]);
            } finally {
                setIsPending(false)
            }


        }
    }

    function handleExit() {
        setLines(prev => [
            ...prev,
            { type: "output", text: "[Process completed - routing back]" }
        ])
        setTimeout(() => router.push("/"), 2500)
    }



    function handleKeyDown(e) {



        if (e.ctrlKey && e.key == 'c') {
            setIsPending(true)
            e.preventDefault()
            setLines(prev => [
                ...prev,
                {
                    type: "prompt",
                    user,
                    cwd,
                    command: "^C",
                }
            ]);

            handleExit()
        }

        if (e.key === "ArrowUp") {
            e.preventDefault()

            setHistoryIndex(prev => {
                const newIndex =
                    prev === null
                        ? history.length - 1
                        : Math.max(prev - 1, 0)

                setInput(history[newIndex] ?? "")
                return newIndex
            })
        }

        if (e.key === "ArrowDown") {
            e.preventDefault()

            setHistoryIndex(prev => {
                if (prev === null) return null

                const newIndex = prev + 1

                if (newIndex >= history.length) {
                    setInput("")
                    return null
                }

                setInput(history[newIndex])
                return newIndex
            })
        }

        if (e.key === "Tab") {
            e.preventDefault()
        }
    }

    function handleQuit() {
        setMode("NORMAL")
        setAccess("")
        setEditorFile(null)
        setEditorContent("")
        setFileId(null)
    }

    async function handleSave() {
        await fetch("/api/fs/write", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id: fileId,
                content: editorContent
            })
        });

        setMode("NORMAL");
        setAccess("")
        setEditorFile(null)
        setEditorContent("")
        setFileId(null)

    }


    const bootLines = [
        "webochan fs v0.1",
        "kernel loaded.",
        "",
        "",
        "type 'help' for available commands.",
        ""
    ];

    const [bootIndex, setBootIndex] = useState(0);
    useEffect(() => {
        if (bootIndex >= bootLines.length) {
            setBooting(false);
            return;
        }

        const timer = setTimeout(() => {
            setLines(prev => [
                ...prev,
                { type: "system", text: bootLines[bootIndex] }
            ]);
            setBootIndex(i => i + 1);
        }, 400);

        return () => clearTimeout(timer);
    }, [bootIndex]);


    useEffect(() => {
        async function initSession() {
            try {
                const res = await fetch("/api/fs", {
                    method: "GET",
                    credentials: "include"
                })

                const { userSession } = await res.json()
                console.log(userSession)

                setUser(userSession.user)

                setCwd(userSession.cwd || "/fs")
            } catch (err) {
                console.error("session init failed")
            } finally {
                setSessionLoaded(true)
            }
        }

        initSession()
    }, [])


    useEffect(() => {
        if (!booting && inputRef.current) {
            inputRef.current.focus();
        }
    }, [booting]);

    const upGrade = async () => {
        await fetch("/api/fs", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "type": "up"
            }
        })
    }

    const downGrade = async () => {
        await fetch("/api/fs", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "type": "down"
            }
        })
    }



    useEffect(() => {
        function handleGlobalKey(e) {
            if (mode === "SCREEN") {
                if (e.key === "q" || e.key === "Escape") {
                    e.preventDefault()
                    setMode("NORMAL");
                    setInput("")
                }
            }
        }

        window.addEventListener("keydown", handleGlobalKey);
        return () => window.removeEventListener("keydown", handleGlobalKey);
    }, [mode]);



    return (
        <>
            <WebinModal
                isOpen={webin}
                onClose={() => setWebin(false)}
                Logged={() => {
                    setUser('root')
                    upGrade()
                }}
                Logout={() => {
                    setUser('anon')
                    downGrade()
                }}
            />


            <Screen
                mode={mode}
                sections={screenData}
                onQuit={handleQuit}
            />



            <Editor
                mode={mode}
                file={editorFile}
                access={access}
                content={editorContent}
                onChange={setEditorContent}
                onSave={handleSave}
                onQuit={handleQuit}
            />



            <div className="my-10 bg-black">
                <div
                    ref={containerRef}
                    className="h-[80vh] overflow-y-auto  font-mono p-5 border no-scrollbar text-gray-400 rounded-md my-10"
                    onClick={() => inputRef.current?.focus()}
                >

                    <>
                        {lines.map((line, i) => {
                            if (line.type === "prompt") {
                                return (
                                    <div key={i} className="whitespace-pre-wrap">
                                        <span className={`${theme.promptUser}`}>
                                            {line.user}@webochan
                                        </span>
                                        <span className={`${theme.promptPath}`}>
                                            :~{line.cwd}
                                        </span>
                                        <span className="text-gray-400">$</span>{" "}
                                        <span className={`${theme.command}`}>
                                            {line.command}
                                        </span>
                                    </div>
                                );
                            }




                            if (line.type === "error") {
                                return (
                                    <div key={i} className={` whitespace-pre-wrap`}>
                                        <span className={`${theme.error}`}>{line.text}</span>{"\n"}<span className={`${theme.system}`}>{line.hint}</span>
                                    </div>
                                );
                            }

                            if (line.type === "system") {
                                return (
                                    <div key={i} className="text-gray-500 whitespace-pre-wrap">
                                        {line.text}
                                    </div>
                                );
                            }


                            return (
                                <div key={i} className="whitespace-pre-wrap text-gray-300">
                                    {line.text}
                                </div>
                            );

                        })}
                        {!isPending && !booting && sessionLoaded && (

                            <form onSubmit={handleSubmit} className="flex">
                                <span className={`${theme.promptUser}`}>
                                    {user}@webochan
                                </span>
                                <span className={`${theme.promptPath}`}>
                                    :~{cwd}
                                </span>
                                <span className="mr-2">
                                    $
                                </span>
                                <input
                                    id={"terminal"}
                                    ref={inputRef}
                                    value={input}
                                    onChange={(e) => {
                                        setInput(e.target.value)
                                        setHistoryIndex(null)
                                    }}
                                    className={`bg-transparent ${theme.command} outline-none flex-1 min-w-0 overflow-hidden text-ellipsis [caret-shape:block]`}
                                    autoFocus
                                    onKeyDown={handleKeyDown}
                                    autoComplete="off"

                                />
                            </form>
                        )}
                    </>


                </div>
            </div>
        </>
    );
}
