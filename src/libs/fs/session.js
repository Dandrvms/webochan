import { prisma } from "@/libs/prisma"
import { buildPath } from "./pathBuilder"

export async function getOrCreateSession(sessionId) {


  let session = await prisma.session.findFirst({
    where: {
      sessionId: sessionId
    },
    select: {
      id: true,
      user: true,
      cwdNodeId: true
    }
  })

  if (!session) {
    session = await prisma.session.create({
      data: {
        sessionId: sessionId,
        cwdNodeId: 1,
        user: 'anon'
      }
    })
  }

  const data = {
    ...session,
    cwd: await buildPath(session.cwdNodeId)
  }

  return data;
}

export async function changeDirectory(id, node) {
  await prisma.session.update({
    where: {
      id: id
    },
    data: {
      cwdNodeId: node
    }
  })
}

export async function downGrade(id) {
  await prisma.session.update({
    where: { id: id },
    data: { user: 'anon' }
  })
}

export async function elevateSession(id) {
  await prisma.session.update({
    where: { id: id },
    data: { user: 'root' }
  })
}
