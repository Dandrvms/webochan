import { prisma } from "@/libs/prisma";
import { canWrite, canRead } from "../permissions";
import { resolvePath } from "../pathResolver";

export async function we(cmd, session) {

    if (!cmd.args[0]) {
        throw new Error("we: missing operand");
    }

    const existing = await resolvePath(session.cwdNodeId, cmd.args[0]);
    let access
    if (cmd.flags.r) {
        access = "READ"
    } else {
        access = "WRITE"
    }

    if (!existing) {
        return { error: "we: no such file" }
    } else {
        if (existing.type !== "FILE") {
            throw new Error("we: target is not a file");
        }
        if (access === "WRITE" && !canWrite(existing, session)) {
            return { error: "Permission denied", hint: "Use -r to open in read-only mode" }
        }

        if (access === "READ" && !canRead(existing, session)) {
            throw new Error("Permision denied")
        }

        return {
            ok: true,

            mode: "EDITOR",
            access: access,
            file: {
                name: existing.name,
                content: existing.content,
                id: existing.id
            }

        }


    }

}