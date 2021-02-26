import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";
import React, { KeyboardEvent, useEffect, useRef, useState } from "react";
import useDebouncedFunction from "../../hooks/useDebouncedFunction";
import './styles.css';

type CodeEditorProps = {
  content: string;
  setContent: (value: string) => void;
  language: string;
};

const CodeEditor = (props: CodeEditorProps) => {
  const [content, _setContent] = useState(props.content);
  const editorContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log('editor content changing on editor', props.content);
    _setContent(props.content);
  }, [props.content]);

  const passContentUp = () => {
    console.log('passing content from editor', content);
    props.setContent(content);
  };
  useDebouncedFunction(passContentUp, content, 500);

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    let value = content,
      selStartPos = event.currentTarget.selectionStart;

    // handle 4-space indent on
    if (event.key === "Tab") {
      console.log('editor tab', value);
      value =
        value.substring(0, selStartPos) +
        " " +
        value.substring(selStartPos, value.length);
      event.currentTarget.selectionStart = selStartPos + 3;
      event.currentTarget.selectionEnd = selStartPos + 4;
      event.preventDefault();

      _setContent(value);
    }
    console.log('editor keyDown', value);

  };

  useEffect(() => {
    if (editorContainerRef.current) {
      Prism.highlightAllUnder(editorContainerRef.current as ParentNode, true);
    }
  }, []);

  useEffect(() => {
    if (editorContainerRef.current) {
      Prism.highlightAllUnder(editorContainerRef.current as ParentNode);
    }
  }, [props.language, content]);

  return (
    <div className="code-edit-container" ref={editorContainerRef}>
      <textarea
        className="code-input"
        value={content}
        onChange={evt => _setContent(evt.target.value)}
        onKeyDown={handleKeyDown}
      />
      <pre className="code-output">
        <code className={`language-${props.language}`}>{content}</code>
      </pre>
    </div>
  );
};

export default CodeEditor;
