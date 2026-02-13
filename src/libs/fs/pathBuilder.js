import { prisma } from "@/libs/prisma";

export async function buildPath(nodeId) {
  let parts = [];
  let current = await prisma.fSNode.findUnique({
    where: { id: nodeId },
  });

  while (current) {
    parts.unshift(current.name);
    if (!current.parentId) break;

    current = await prisma.fSNode.findUnique({
      where: { id: current.parentId },
    });
  }

  return "/" + parts.join("/");
}

