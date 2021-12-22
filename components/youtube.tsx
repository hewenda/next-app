import { cx } from "@emotion/css";
import React from "react";
import * as R from "ramda";

import { ComponentMap } from "mdx-bundler/client";

interface Props {
  id: string;
  width?: number;
  height?: number;
  className?: string;
  autoplay?: boolean;
}

const YouTube: React.FC<Props> = (props) => {
  const { id, width = 560, height = 315, autoplay = false, className } = props;

  const allow = React.useMemo(
    () =>
      R.reject(R.isNil)([
        "accelerometer",
        "encrypted-media",
        "gyroscope",
        "picture-in-picture",
        autoplay ? "autoplay" : undefined,
      ]),
    [autoplay]
  );

  return (
    <iframe
      width={width}
      height={height}
      src={`https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1&autoplay=1`}
      className={cx(className, "mx-auto")}
      allow={R.join(",", allow)}
    ></iframe>
  );
};
export default YouTube;
