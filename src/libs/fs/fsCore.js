import { prisma } from "@/libs/prisma";

export async function getNodeById(id) {
    try {
        const res = await prisma.fSNode.findUnique({
            where: { id },
            include: { children: true },
        });

        return res
    } catch (e) {
        return null
    }
}

export async function getChildByName(parentId, name) {
    return prisma.fSNode.findFirst({
        where: { parentId, name },
    });
}
