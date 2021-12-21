import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import yaml from "js-yaml";

import { getFilePath } from "lib/clash";
import { getSession } from "next-auth/react";
import { equalsAdminEmail } from "hooks/useAdmin";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { configName } = req.query;
  const session = await getSession({ req });

  if (!equalsAdminEmail(session)) {
    return res.status(404).end();
  }

  const content = req.body;
  const configPath = getFilePath(configName as string);

  try {
    yaml.load(content);

    if (fs.existsSync(configPath)) {
      fs.writeFileSync(configPath, content, {
        encoding: "utf-8",
      });
    } else {
      return res.status(404).end();
    }
  } catch (error) {
    return res.status(500).send({ error });
  }

  res.status(200).end();
}
