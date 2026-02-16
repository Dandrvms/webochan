export function fetch() {
    return {
        mode: "SCREEN",
        ok: true,
        screen: {
            ascii: "....",
            sections: {
                identity: {
                    OS: "Webochan FS v0.1"
                },
                system: {
                    Kernel: "webo-kernel",
                    Shell: "wsh",
                },
                session: {
                    User: "anon",
                    Privilege: "user",
                },
                
                meta: {
                    Boards: 3,
                    Threads: 128,
                    Posts: 2041,
                    Uptime: "240:14:32",
                    Entropy: "HIGH"
                }
            }
        }
    }

}