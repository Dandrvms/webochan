import { prisma } from "@/libs/prisma"
import { resolvePath } from "../pathResolver"
import { canWrite } from "../permissions"

export async function chmod(cmd, session) {

    if (session.user !== 'root') {
        throw new Error("Permission denied")
    }

    if (!cmd.args[0] || !cmd.args[1]) {
        throw new Error("chmod: missing operand")
    }

    const permissions = Number(cmd.args[0])
    const name = cmd.args[1]


    if (!isValidPermissions(permissions)) {
        throw new Error("chmod: invalid permissions");
    }

    const existing = await resolvePath(session.cwdNodeId, name);

    if (!existing) {
        throw new Error(`no such file or directory`)
    } else {
        if (!canWrite(existing, session)) {
            throw new Error("Permission denied")
        }

        await prisma.fSNode.update({
            where: { id: existing.id },
            data: { permissions: permissions },
        });
    }

    return { output: "" };

}



function isValidPermissions(value) {
    if (!Number.isInteger(value)) return false;

    const str = String(value);

    if (str.length !== 3) return false;

    return [...str].every(d => d >= '0' && d <= '7');
}
