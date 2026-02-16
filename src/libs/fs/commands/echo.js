import { prisma } from "@/libs/prisma";
import { canWrite } from "../permissions";
import { getNodeById } from "../fsCore";

export async function echo(cmd, session) {
  const text = cmd.args.join(" ");


  if (!cmd.redirect) {
    return { output: text };
  }

  const { target, type } = cmd.redirect;



  const existing = await prisma.fSNode.findFirst({
    where: {
      parentId: session.cwdNodeId,
      name: target,
    },
  });


  if (!existing) {
    const node = await getNodeById(session.cwdNodeId)
    if (!canWrite(node, session)) {
      throw new Error("Permission denied")
    }
    await prisma.fSNode.create({
      data: {
        name: target,
        type: "FILE",
        parentId: session.cwdNodeId,
        content: text,
        permissions: 755
      },
    });
  } else {
    if (existing.type !== "FILE") {
      throw new Error("echo: target is not a file");
    }

    if (!canWrite(existing, session)) {
      throw new Error("Permission denied")
    }

    const newContent =
      type === "append"
        ? [(existing.content ?? ""), text]
        : text;

    await prisma.fSNode.update({
      where: { id: existing.id },
      data: { content: newContent.join("\n") },
    });
  }

  return { output: "" };
}
