import React from "react";
import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { GetStaticProps, GetStaticPaths } from "next";
import { getMDXComponent } from "mdx-bundler/client";
import {
  getAllFilesFrontMatter,
  getFileSourceByFileName,
  MDXMatter,
} from "lib/blog";
import * as R from "ramda";
import { useRouter } from "next/router";

export const matterTitleToUrl = R.pipe(R.toLower, R.replace(/\s/g, "-"));

interface Props {
  blogs: Array<MDXMatter>;
  source: string | null;
}

const Blog: NextPage<Props> = (props) => {
  const { blogs = [], source } = props;

  const Component = React.useMemo(() => {
    if (source) {
      return getMDXComponent(source);
    }
  }, [source]);

  return (
    <div>
      <Head>
        <title>Blog</title>
      </Head>
      <div className="container mx-auto py-4">
        {Component && <Component />}

        {blogs.map((blog) => (
          <div key={blog.title}>
            <Link href={`/blog/${matterTitleToUrl(blog.title)}`}>
              <a>{blog.title}</a>
            </Link>
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

export const getStaticProps: GetStaticProps = async (ctx) => {
  const blogs = getAllFilesFrontMatter();

  const title = ctx.params?.slug?.[0];
  let source: string | null = null;

  if (title) {
    const blog = R.find(
      R.pipe<any, string, string, boolean>(
        R.prop("title"),
        matterTitleToUrl,
        R.equals(title)
      )
    )(blogs);
    source = (await getFileSourceByFileName(blog.fileName))?.source ?? null;
  }

  return {
    props: {
      blogs,
      source,
    },
  };
};

export default Blog;
