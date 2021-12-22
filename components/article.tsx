import React from "react";
import { getMDXComponent, ComponentMap } from "mdx-bundler/client";
import moment from "moment";

import YouTube from "components/youtube";

const shortCodes: ComponentMap = { YouTube: (props) => <YouTube {...props} /> };

interface Props {
  matter: { [key: string]: any };
  content: string;
}
const Article: React.FC<Props> = (props) => {
  const { content, matter } = props;

  const Component = React.useMemo(() => {
    if (content) {
      return getMDXComponent(content);
    }
  }, [content]);

  return (
    <div className="container mx-auto py-4">
      <h1 className="text-xl bold">{matter.title}</h1>

      <div className="flex items-center text-sm mt-1">
        <span>{matter.date && moment(matter.date).format("YYYY-MM-DD")}</span>
      </div>

      <main className="mt-2">
        {Component && <Component components={shortCodes} />}
      </main>
    </div>
  );
};

export default Article;
