import React from "react";
import { useInterval, useAsync } from "react-use";

const TypeIt = require("typeit").default;
const shici = require("jinrishici");
const lifeCycle = require("page-lifecycle").default;

interface Props {
  className?: string;
}

const queryShici = () =>
  new Promise<string>((resolve, reject) => {
    shici.load((result: any) => {
      const content = result?.data?.content;
      resolve(content as string);
    });
  });

const TypeLine: React.FC<Props> = (props) => {
  const [type, setType] = React.useState<string>();
  const [timer, setTimer] = React.useState<number | null>(10e3);
  const inst = React.useRef<any>();

  useInterval(async () => {
    const content = await queryShici();

    if (content) {
      setType(content);
    }
  }, timer);

  useAsync(async () => {
    setType(await queryShici());

    const changes = (event: any) => {
      if (event.newState === "hidden") {
        setTimer(null);
      } else {
        setTimer(10e3);
      }
    };

    lifeCycle.addEventListener("statechange", changes);

    return () => {
      lifeCycle.removeEventListener("statechange", changes);
    };
  }, []);

  React.useEffect(() => {
    if (type) {
      inst.current = new TypeIt("#type-it").type(type).go();
    }

    return () => {
      inst.current?.distroy?.();
    };
  }, [type]);

  return <span id="type-it" key={type} className={props.className}></span>;
};

export default TypeLine;
