import { ls } from "./commands/ls";
import { cd } from "./commands/cd";
import { mkdir } from "./commands/mkdir"
import { help } from "./commands/help"
import { echo } from "./commands/echo"
import { cat } from "./commands/cat"
import { touch } from "./commands/touch"
import { login } from "./commands/login"
import { write } from "./commands/write"

const commands = {
  ls,
  cd,
  mkdir,
  help,
  echo,
  cat,
  touch,
  login,
  write
};

export async function executeCommand(
  cmd,
  session
) {
  const handler = commands[cmd.name];
  if (!handler) {
    throw new Error(`command not found: ${cmd.name}`);
  }

  return handler(cmd, session);
}
