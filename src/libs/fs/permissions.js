function decodePermissions(perm) {
  const str = String(perm).padStart(3, "0");
  return {
    owner: Number(str[0]),
    group: Number(str[1]),
    other: Number(str[2]),
  };
}

function has(bitmask, flag) {
  return (bitmask & flag) === flag;
}

function isOwner(node, session) {
  console.log(session)
  return session.user === "root" || node.owner === session.user;
}

export function canRead(node, session) {
  const { owner, other } = decodePermissions(node.permissions);
  const perm = isOwner(node, session) ? owner : other;
  return has(perm, 4);
}

export function canWrite(node, session) {
  const { owner, other } = decodePermissions(node.permissions);
  const perm = isOwner(node, session) ? owner : other;
  return has(perm, 2);
}

export function canExecute(node, session) {
  const { owner, other } = decodePermissions(node.permissions);
  const perm = isOwner(node, session) ? owner : other;
  return has(perm, 1);
}




