export function login(cmd) {

    if(cmd.args[0]) {
        return {output: "command not found: login", error: true}
    }

    const lines = [
        "auth subsystem available",
        "redirecting to secure interface..."
    ]

    return {output: lines.join("\n")}
}