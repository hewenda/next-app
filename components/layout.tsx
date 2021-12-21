import React from "react";
import { NextPage } from "next";
import { cx } from "@emotion/css";

interface Props {
  className?: string;
}

const Layout: NextPage<Props> = (props) => {
  const { className = "", children } = props;
  return (
    <div className="bg-slate-50">
      <div
        className={cx("container mx-auto min-h-screen py-4 flex", className)}
      >
        {children}
      </div>
    </div>
  );
};

export default Layout;
