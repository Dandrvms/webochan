

export function help() {

    const lines = [
        "available commands:",
        "------------------",
        "fetch      system info",
        "ls         list directory",
        "cd         change directory",
        "cat        read file",
        "mkdir      create directory",
        "echo       print text or write to file",
        "touch      create file",
        "we         open file in editor",
        "rename     rename file or directory",
        "clear      clear buffer",
        "help       show this message",
        "exit       leave filesystem mode", 
    ];



    return { output: lines.join("\n") }
}