"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from 'next/navigation'
import WebinModal from "@/app/components/modals/WebinModal"

export default function Terminal() {
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

    const [mode, setMode] = useState("NORMAL"); // NORMAL | WRITE

    const [editorFile, setEditorFile] = useState(null);
    const [editorContent, setEditorContent] = useState("");



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
        const prompt = `${user}@webochan:~${cwd}$ ${command}`;

        setLines(prev => [
            ...prev,
            { type: "prompt", text: prompt },
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

                const data = await res.json();

                if (command === 'login') {
                    setWebin(true)
                }

                setLines(prev => {
                    // quitar el pending

                    const withoutPending = prev.slice(0, -1);

                    if (!data.ok) {
                        return [
                            ...withoutPending,
                            { type: "output", text: data.error }
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
                    { type: "output", text: "error: connection failed" }
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
                { type: "prompt", text: `${user}@webochan:~${cwd}$ ^C` },
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
    }


    useEffect(() => {
        if (hasBooted.current) return;
        hasBooted.current = true;

        const bootLines = [
            "webochan fs v0.1",
            "kernel loaded.",
            "kernel loaded.",
            "type 'help' for available commands.",
            ""
        ];

        let i = 0;
        let timer

        function nextLine() {
            if (i >= bootLines.length) {
                setBooting(false);
                return;
            }

            setLines(prev => [
                ...prev,
                { type: "system", text: bootLines[i] }
            ]);

            i++;
            timer = setTimeout(nextLine, 400); // velocidad del boot
        }

        nextLine();

        return () => {
            if (timer) clearTimeout(timer);
        };
    }, []);

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

            <div
                ref={containerRef}
                className="h-full overflow-y-auto bg-black text-green-400 font-mono p-3"
                onClick={() => inputRef.current?.focus()}
            >

                {lines.map((line, i) => (
                    <div key={i} className="whitespace-pre-wrap">
                        {line.text}
                    </div>
                ))}
                {!booting && sessionLoaded && !isPending && (
                    <form onSubmit={handleSubmit} className="flex">
                        <span className="mr-2">
                            {user}@webochan:~{cwd}$
                        </span>
                        <input
                            id={"terminal"}
                            ref={inputRef}
                            value={input}
                            onChange={(e) => {
                                setInput(e.target.value)
                                setHistoryIndex(null)
                            }}
                            className="bg-transparent outline-none flex-1 [caret-shape:block]"
                            autoFocus
                            onKeyDown={handleKeyDown}
                            autoComplete="off"

                        />
                    </form>
                )}
            </div>
        </>
    );
}
