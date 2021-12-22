import React from "react";
import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { GetStaticProps, GetStaticPaths } from "next";
import {
  getAllFilesFrontMatter,
  getFileSourceByFileName,
  MDXMatter,
} from "lib/blog";
import * as R from "ramda";
import moment from "moment";

import Article from "components/article";

export const matterTitleToUrl = R.pipe(R.toLower, R.replace(/\s/g, "-"));

interface Props {
  blogs: Array<MDXMatter>;
  source: { code?: string; frontmatter?: { [key: string]: any } };
}

const Blog: NextPage<Props> = (props) => {
  const {
    blogs = [],
    source: { code, frontmatter },
  } = props;

  if (code && frontmatter) {
    return (
      <>
        <Head>
          <title>{frontmatter?.title}</title>
        </Head>
        <Article matter={frontmatter} content={code} />
      </>
    );
  }

  return (
    <div>
      <Head>
        <title>Blogs</title>
      </Head>
      <div className="container mx-auto py-4">
        {blogs.map((blog) => (
          <div key={blog.title} className="flex flex-col">
            <Link href={`/blog/${matterTitleToUrl(blog.title)}`}>
              <a className="text-bold">{blog.title}</a>
            </Link>
            <div className="flex items-center text-sm mt-1">
              <span>{blog.date && moment(blog.date).format("YYYY-MM-DD")}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const matters = getAllFilesFrontMatter();

  const paths = matters.reduce<any[]>(
    (acc, data) => {
      acc.push({
        params: {
          slug: [matterTitleToUrl(data.title)],
        },
      });
      return acc;
    },
    [{ params: { slug: [] } }]
  );

  return {
    paths,
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps<Props> = async (ctx) => {
  const blogs = getAllFilesFrontMatter();

  const title = ctx.params?.slug?.[0];
  let source: Props["source"] = {};

  if (title) {
    const blog = R.find(
      R.pipe<any, string, string, boolean>(
        R.prop("title"),
        matterTitleToUrl,
        R.equals(title)
      )
    )(blogs);

    source = (await getFileSourceByFileName(blog.fileName)) ?? {};
  }

  return {
    props: {
      blogs,
      source,
    },
  };
};

export default Blog;
