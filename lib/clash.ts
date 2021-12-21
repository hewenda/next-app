import fs from "fs";
import path from "path";
import * as R from "ramda";

export const configgDirectory = path.resolve(
  process.cwd(),
  "pages/clash/configs"
);

export const getConfigNames = () => {
  const fileNames = fs.readdirSync(configgDirectory);

  return fileNames.filter(R.endsWith(".yml")).map(R.replace(/.yml$/, ""));
};

export const getFilePath = (fileName: string) =>
  path.join(configgDirectory, `${fileName}.yml`);
