import { prisma } from "@/libs/prisma";
import { resolvePath } from "../pathResolver";
import { canWrite } from "../permissions";

export async function rename(cmd, session) {
    if (!cmd.args[0] || !cmd.args[1]) {
        throw new Error("rename: missing operand");
    }


    const name = cmd.args[0]
    const newName = cmd.args[1]

    if(name === newName) {
        return { output: ""}
    }

    const existing = await resolvePath(session.cwdNodeId, cmd.args[0])

    if (!canWrite(existing, session)) {
        throw new Error("Permission denied")
    }
    

    await prisma.fSNode.update({
        where: {
            id: existing.id
        },
        data: {
            name: newName
        }
    })

    return { output: `${existing.type} '${name}' renamed to '${newName}'` }


}