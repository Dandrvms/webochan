import { prisma } from "@/libs/prisma";
import { resolvePath } from "../pathResolver";
import { canRead, canWrite, canExecute } from "../permissions"
import { getNodeById } from "../fsCore";

export async function cat(cmd, session) {
  if (!cmd.args[0]) {
    throw new Error("cat: missing operand");
  }

  const node = await resolvePath(session.cwdNodeId, cmd.args[0]);

  if (node.type !== "FILE") {
    throw new Error(`cat: ${node.name}: not a file`);
  }

  

  

  if(!canRead(node, session)){
    throw new Error('Permission denied')
  }
  


  const firstLine = "------ " + node.name + " -------"
  let lastLine = ""
  for(let i = 0; i < firstLine.length; i++) {
      lastLine += "-"
  }

  const text = [
    firstLine,
    "created: " + node.createdAt.toLocaleDateString({month: 'numeric', day: 'numeric', year: 'numeric'}),
    "",
    node.content,
    lastLine
  ]

  return {
    output: text.join("\n") ?? ""
  };
}
