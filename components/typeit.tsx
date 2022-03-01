import React from "react";

const TypeIt = require("typeit").default;
const shici = require("jinrishici");

interface Props {
  className?: string;
}

const TypeLine: React.FC<Props> = (props) => {
  const [type, setType] = React.useState<string>();
  const inst = React.useRef<any>();

  React.useEffect(() => {
    const load = () =>
      shici.load((result: any) => {
        const content = result?.data?.content;
        setType(content);
      });

    load();

    const timer = setInterval(() => {
      load();
    }, 10_000);

    return () => {
      clearInterval(timer);
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
