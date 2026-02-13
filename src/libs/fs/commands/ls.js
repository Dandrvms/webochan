import { prisma } from "@/libs/prisma";
import { resolvePath } from "../pathResolver";

export async function ls(cmd, session) {
  let targetNode;
  console.log("LS SESSION:",session)
  if (cmd.args[0]) {
    targetNode = await resolvePath(session.cwdNodeId, cmd.args[0]);
  } else {
    targetNode = await prisma.fSNode.findUnique({
      where: { id: session.cwdNodeId },
    });
  }

  if (!targetNode) {
    throw new Error("ls: invalid path");
  }

  if (targetNode.type !== "DIR") {
    return { output: targetNode.name };
  }

  const children = await prisma.fSNode.findMany({
    where: { parentId: targetNode.id },
    orderBy: { name: "asc" },
  });

  if (children.length === 0) {
    return { output: "" };
  }

  const output = children
    .map((node) =>
      node.type === "DIR" ? `${node.name}/` : node.name
    )
    .join("\n");

  return { output };
}
