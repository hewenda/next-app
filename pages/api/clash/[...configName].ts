import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import * as R from "ramda";
import { getSession } from "next-auth/react";

import { getFilePath } from "lib/clash";
import { equalsAdminEmail } from "hooks/useAdmin";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { configName } = req.query;
  const [fileName, token] = configName as string[];
  const session = await getSession({ req });

  if (token) {
    if (token !== process.env.CLASH_DIRECT_SECRET) {
      return res.status(404).end();
    }
  } else if (!equalsAdminEmail(session)) {
    return res.status(404).end();
  }

  const configPath = getFilePath(fileName as string);

  if (fs.existsSync(configPath)) {
    const filecontent = fs.readFileSync(configPath, { encoding: "utf-8" });

    res.setHeader("Accept", "application/x-yaml");
    return res.send(filecontent);
  }

  return res.status(404).end();
}
