import { getChildByName, getNodeById } from "./fsCore";

export async function resolvePath(
  cwdId,
  path
) {
  let current = await getNodeById(cwdId);
  if (!current) throw new Error("invalid cwd");

  const parts = path.split("/").filter(Boolean);

  for (const part of parts) {
    if (part === "..") {
      if (current.parentId) {
        current = await getNodeById(current.parentId);
      }
    } else if (part === ".") {
      continue;
    } else {
      const next = await getChildByName(current.id, part);
      if (!next) throw new Error(`no such file or directory: ${part}`);
      current = next;
    }
  }

  return current;
}
