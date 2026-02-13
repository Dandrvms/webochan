

export function help() {

    const lines = [
        "available commands:",
        "ls     list directory",
        "cd     change directory",
        "cat    read file",
        "mkdir  create directory",
        "echo   print text or write to file",
        "touch  create file",
        "help   show this message",
        "exit   leave filesystem mode", 
    ];



    return { output: lines.join("\n") }
}