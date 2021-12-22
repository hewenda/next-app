import React from "react";
import type { NextPage } from "next";
import type { GetServerSideProps } from "next";
import router from "next/router";
import dynamic from "next/dynamic";
import Head from "next/head";
import { getSession } from "next-auth/react";
import { useAsyncFn, useEffectOnce, useCopyToClipboard } from "react-use";
import { cx } from "@emotion/css";
import debounce from "lodash/debounce";
import * as Icon from "react-feather";
import * as R from "ramda";

const Editor = dynamic(() => import("components/editor"), { ssr: false });

import { equalsAdminEmail } from "hooks/useAdmin";
import Layout from "components/layout";
import { getConfigNames } from "lib/clash";

interface Props<T = string> {
  configName: T | null;
  configNames: T[];
  directSecret?: string;
}

const ClashHome: NextPage<Props> = (props) => {
  const configName = React.useRef<string | null>(props.configName);
  const { configNames = [], directSecret = "" } = props;

  const [changedValue, setChangedValue] = React.useState<string>();
  const [configState, doFetch] = useAsyncFn(async () => {
    if (!configName.current) {
      return;
    }

    const res = await fetch(`/api/clash/${configName.current}`);
    const result = await res.text();

    setChangedValue(undefined);
    return result;
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const editorChange = React.useCallback(
    debounce((value: string) => {
      if (!configName.current) {
        return;
      }

      setChangedValue(value);
    }, 500),
    []
  );

  const [, copyToClipboard] = useCopyToClipboard();

  const onSave = async () => {
    if (changedValue) {
      const res = await fetch(`/api/clash/save/${configName.current}`, {
        method: "POST",
        body: changedValue,
      });

      if (res.status === 200) {
        setChangedValue(undefined);
      }
    }
  };

  useEffectOnce(() => {
    if (configName.current) {
      doFetch();
    }
  });

  return (
    <Layout className="flex">
      <Head>
        <title>Clash - {configName.current ?? ""}</title>
      </Head>
      <div className="flex flex-auto relative">
        <div
          className={cx(
            "fixed top-5 right-1/2 -mr-14 w-28 -ml-14 flex justify-around z-50",
            !Boolean(changedValue) ? "hidden" : ""
          )}
        >
          <Icon.Save className="cursor-pointer" onClick={onSave} />
        </div>
        <div className="flex flex-col flex-none w-40 self-start sticky top-2">
          {configNames.map((val, idx) => (
            <div
              key={val}
              className={cx(
                "relative group shadow-md px-2 py-2 rounded transition-all bg-white border-b",
                idx !== 0 ? "mt-3" : "",
                configName.current === val ? "border-green-600" : ""
              )}
            >
              <div className="group-hover:opacity-30 w-full flex items-center">
                {configName.current === val ? (
                  <Icon.ArrowRight className="inline-block mr-2" size={12} />
                ) : (
                  ""
                )}
                <p className="flex-1 truncate">{val}</p>
              </div>
              <div className="absolute inset-y-0 w-full bg-gray-100/[.4] flex items-center justify-around opacity-0 pointer-none left-full group-hover:left-0 group-hover:opacity-100 transition-all">
                <Icon.Edit
                  size={18}
                  className="cursor-pointer"
                  onClick={() => {
                    configName.current = val;
                    router.replace(`/clash/${val}`, undefined, {
                      shallow: true,
                    });
                    doFetch();
                  }}
                />
                <Icon.Copy
                  size={18}
                  className="cursor-pointer"
                  onClick={() => {
                    copyToClipboard(
                      `${location.origin}/api/clash/${configName.current}/${directSecret}`
                    );
                  }}
                />
              </div>
            </div>
          ))}
        </div>
        <div className={cx("flex-1 ml-3")}>
          <Editor
            value={configState.value}
            loading={configState.loading}
            onChange={editorChange}
          />
        </div>
      </div>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const configNames = getConfigNames();
  const session = await getSession(context);

  if (!equalsAdminEmail(session)) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      configName: R.pathOr(
        configNames?.[0] ?? null,
        ["params", "configName", 0],
        context
      ),
      configNames,
      directSecret: process.env.CLASH_DIRECT_SECRET!,
    },
  };
};

export default ClashHome;
