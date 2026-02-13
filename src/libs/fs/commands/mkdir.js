import { getNodeById } from "../fsCore";
import { prisma } from "@/libs/prisma";
import { canWrite } from "../permissions";

export async function mkdir(cmd, session) {
  if (!cmd.args[0]) {
    throw new Error("mkdir: missing operand");
  }
  console.log(session.cwdNodeId)
  const node = await getNodeById(session.cwdNodeId)
  if (!canWrite(node, session)) {
    throw new Error("Permission denied")
  }

  const path = cmd.args[0];
  const parts = path.split("/").filter(Boolean);
  const recursive = cmd.flags.p;

  let currentNodeId = session.cwdNodeId;

  for (let i = 0; i < parts.length; i++) {
    const name = parts[i];

    const existing = await prisma.fSNode.findFirst({
      where: {
        parentId: currentNodeId,
        name,
      },
    });

    if (existing) {
      if (existing.type !== "DIR") {
        throw new Error(`mkdir: ${name}: not a directory`);
      }

      currentNodeId = existing.id;
      continue;
    }

    if (!recursive && i < parts.length - 1) {
      throw new Error(`mkdir: cannot create directory '${path}'`);
    }

    const created = await prisma.fSNode.create({
      data: {
        name,
        type: "DIR",
        parentId: currentNodeId,
      },
    });

    currentNodeId = created.id;
  }

  return { output: "" };
}
