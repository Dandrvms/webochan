import { prisma } from "@/libs/prisma";
import { canExecute, canWrite } from "../permissions";
import { getNodeById } from "../fsCore";


export async function touch(cmd, session) {


    if (!cmd.args[0]) {
        throw new Error("touch: missing operand");
    }

    const node = await getNodeById(session.cwdNodeId)

    if (!canWrite(node, session)) {
        throw new Error("Permission denied")
    }



    for (const name of cmd.args) {

        const existing = await prisma.fSNode.findFirst({
            where: {
                parentId: session.cwdNodeId,
                name,
            },
        });


        if (existing) {
            if (existing.type !== "FILE") {
                throw new Error("touch: target is not a file");
            }
            continue
        }

        await prisma.fSNode.create({
            data: {
                name,
                type: "FILE",
                parentId: session.cwdNodeId,
                content: ""
            },
        });
    }

    return { output: "" };
}
