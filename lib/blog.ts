import fs from "fs";
import path from "path";
import * as R from "ramda";
import matter from "gray-matter";
import { bundleMDX } from "mdx-bundler";

export interface MDXMatter {
  title: string;
  date: number;
  description: string;
  draft: boolean;
  fileName: string;
}

export const mdxDirectory = path.resolve(process.cwd(), "pages/blog/mdx");

export const getMDXNames = () => {
  const fileNames = fs.readdirSync(mdxDirectory);

  return fileNames.filter(R.endsWith(".mdx")).map(R.replace(/.mdx$/, ""));
};

export const getFilePath = (fileName: string) =>
  path.join(mdxDirectory, `${fileName}.mdx`);

export const getFileSourceByFileName = async (fileName: string) => {
  const filePath = getFilePath(fileName);

  if (fs.existsSync(filePath)) {
    const fileSource = fs.readFileSync(filePath, "utf-8");
    const { data: matterData } = matter(fileSource);

    const { code } = await bundleMDX({
      source: fileSource,
    });

    return {
      source: code,
    };
  }
};

export const getAllFilesFrontMatter = R.pipe<
  any,
  string[],
  Array<MDXMatter | undefined>,
  MDXMatter[],
  MDXMatter[],
  MDXMatter[]
>(
  getMDXNames,
  R.map((fileName) => {
    const filePath = getFilePath(fileName);

    if (fs.existsSync(filePath)) {
      const fileSource = fs.readFileSync(filePath, "utf-8");
      const { data: matterData } = matter(fileSource);

      if (!matterData.draft) {
        return {
          ...(matterData as MDXMatter),
          date: matterData.date.valueOf(),
          fileName,
        };
      }
    }

    return undefined;
  }),
  R.reject(R.isNil),
  R.sortBy(R.prop("date")),
  R.reverse
);
