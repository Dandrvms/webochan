import { prisma } from "@/libs/prisma";
import { canWrite } from "../permissions";

export async function write(cmd, session) {


    if (cmd.args.length > 1) {
        throw new Error("write: too many arguments")
    }

    const target = cmd.args.join(" ");



    const existing = await prisma.fSNode.findFirst({
        where: {
            parentId: session.cwdNodeId,
            name: target,
        },
    });


      if (!existing) {
        throw new Error("write: no such file")
      } else {
        if (existing.type !== "FILE") {
          throw new Error("write: target is not a file");
        }

        if (!canWrite(existing, session)) {
          throw new Error("Permission denied")
        }

        return {
            ok: true,
            mode: 'WRITE',
            file: {
                name: existing.name,
                content: existing.content
            }
        }
      }

}