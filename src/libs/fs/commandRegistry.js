import { ls } from "./commands/ls";
import { cd } from "./commands/cd";
import { mkdir } from "./commands/mkdir"
import { help } from "./commands/help"
import { echo } from "./commands/echo"
import { cat } from "./commands/cat"
import { touch } from "./commands/touch"
import { login } from "./commands/login"
import { we } from "./commands/we"
import { chmod } from "./commands/chmod";
import { fetch } from "./commands/fetch";
import { rename } from "./commands/rename";

const commands = {
  ls,
  cd,
  mkdir,
  help,
  echo,
  cat,
  touch,
  login,
  we,
  chmod,
  fetch,
  rename
};

export async function executeCommand(
  cmd,
  session
) {
  const handler = commands[cmd.name];
  if (!handler) {
    return {error: `command not found: ${cmd.name}`};
  }

  return handler(cmd, session);
}
