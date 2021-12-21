import React from "react";

import * as Codemirror from "codemirror";
import "codemirror/lib/codemirror.css";
import "codemirror/mode/yaml/yaml";
import "codemirror/theme/neo.css";

interface Props<T> {
  value?: T;
  onChange?(v: T): void;
  loading?: boolean;
  error?: Error;
}

const Editor: React.FC<Props<string>> = (props) => {
  const { value = "", loading = false, error, onChange } = props;

  const el = React.useRef<HTMLTextAreaElement>(null);
  const editor = React.useRef<Codemirror.EditorFromTextArea>();

  React.useEffect(() => {
    if (el.current) {
      editor.current = Codemirror.fromTextArea(el.current, {
        mode: "text/yaml",
        theme: 'neo',
        lineNumbers: true,
        lineWrapping: true,
        tabSize: 2,
        gutters: ["CodeMirror-lint-markets"],
      });
    }
  }, []);

  React.useEffect(() => {
    const editorChange: Codemirror.EditorEventMap["change"] = (
      cm,
      { origin }
    ) => {
      if (origin !== "setValue") {
        onChange?.(cm.getValue());
      }
    };

    editor.current?.on("change", editorChange);
    return () => {
      editor.current?.off("change", editorChange);
    };
  }, [onChange]);

  React.useEffect(() => {
    editor.current?.setValue(value ?? "");
  }, [value]);

  return (
    <>
      <textarea ref={el}></textarea>
      <style jsx global>{`
        .CodeMirror {
          height: auto;
          min-height: 300px;
        }
        .CodeMirror-scroll {
          min-height: 300px;
        }
      `}</style>
    </>
  );
};

export default Editor;
