
export function parseCommand(input) {
  let tokens = input.trim().split(/\s+/);
  const name = tokens.shift() || "";

  const args = []
  const flags = {};


  const redirectIndex = tokens.findIndex(t => t === ">" || t === ">>");

  let redirect = null;

  if (redirectIndex !== -1) {
    redirect = {
      type: tokens[redirectIndex] === ">>" ? "append" : "overwrite",
      target: tokens[redirectIndex + 1]
    };

    tokens = tokens.slice(0, redirectIndex);
  }


  for (const token of tokens) {
    if (token.startsWith("-")) {
      if (token.length === 2) {
        flags[token[1]] = true;
      } else if (token.startsWith("--")) {
        const [k, v] = token.slice(2).split("=");
        flags[k] = v ?? true;
      }
    } else {
      args.push(token);
    }
  }

  return { name, args, flags, redirect };
}
