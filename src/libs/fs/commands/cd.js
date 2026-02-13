import { resolvePath } from "../pathResolver";
import { buildPath } from "../pathBuilder";
import { changeDirectory } from "../session";
import { canExecute } from "../permissions";

export async function cd(cmd, session) {
  if (!cmd.args[0]) {
    throw new Error("cd: missing operand");
  }

  const node = await resolvePath(session.cwdNodeId, cmd.args[0]);
  
  if (node.type !== "DIR") {
    throw new Error("not a directory");
  }

  if (!canExecute(node, session))
    throw new Error("Access denied")

  await changeDirectory(session.id, node.id)

  const path = await buildPath(node.id);

  return {
    output: "",
    cwd: path,
  };
}
