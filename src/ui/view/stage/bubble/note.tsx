import React, {
  useMemo,
  useCallback,
  useRef,
  useEffect,
  useState,
  useContext
} from "react";
import ReactDOM from "react-dom";
import { Editor, Transforms, Range, createEditor, Point, Node } from "slate";
import { withHistory } from "slate-history";
import {
  Slate,
  Editable,
  ReactEditor,
  withReact,
  useSelected,
  useFocused,
  useEditor
} from "slate-react";
import Frame from "./Frame";
import { dependencyGraphStore } from "ui/store";
import { observer } from "mobx-react-lite";
import Code from "./symbol";
import { Instance, clone } from "mobx-state-tree";
import { Note as NoteModel } from "ui/store/models/Note";
import { Flex } from "@chakra-ui/core";
import { Global, css } from "@emotion/core";

const Portal = ({ children }: any) => {
  return ReactDOM.createPortal(children, document.body);
};

interface Props {
  note: Instance<typeof NoteModel>;
}

const SHORTCUTS = {
  "*": "list-item",
  "-": "list-item",
  "+": "list-item",
  ">": "block-quote",
  "#": "heading-one",
  "##": "heading-two",
  "###": "heading-three",
  "####": "heading-four",
  "#####": "heading-five",
  "######": "heading-six"
};

const withShortcuts = (editor: Editor) => {
  const { deleteBackward, insertText } = editor;

  editor.insertText = text => {
    const { selection } = editor;

    if (text === " " && selection && Range.isCollapsed(selection)) {
      const { anchor } = selection;
      const block = Editor.above(editor, {
        match: n => Editor.isBlock(editor, n)
      });
      const path = block ? block[1] : [];
      const start = Editor.start(editor, path);
      const range = { anchor, focus: start };
      const beforeText = Editor.string(editor, range);
      const type = (SHORTCUTS as any)[beforeText];

      if (type) {
        Transforms.select(editor, range);
        Transforms.delete(editor);
        Transforms.setNodes(
          editor,
          { type },
          { match: n => Editor.isBlock(editor, n) }
        );

        if (type === "list-item") {
          const list = { type: "bulleted-list", children: [] };
          Transforms.wrapNodes(editor, list, {
            match: n => n.type === "list-item"
          });
        }

        return;
      }
    }

    insertText(text);
  };

  editor.deleteBackward = (args: any) => {
    const { selection } = editor;

    if (selection && Range.isCollapsed(selection)) {
      const match = Editor.above(editor, {
        match: n => Editor.isBlock(editor, n)
      });

      if (match) {
        const [block, path] = match;
        const start = Editor.start(editor, path);

        if (
          block.type !== "paragraph" &&
          Point.equals(selection.anchor, start)
        ) {
          Transforms.setNodes(editor, { type: "paragraph" });

          if (block.type === "list-item") {
            Transforms.unwrapNodes(editor, {
              match: n => n.type === "bulleted-list"
            });
          }

          return;
        }
      }

      deleteBackward(args);
    }
  };

  return editor;
};

const Note = ({ note }: Props) => {
  const ref = useRef(null);
  const [value, setValue] = useState(initialValue);
  const store = useContext(dependencyGraphStore);
  const [target, setTarget] = useState();
  const [index, setIndex] = useState(0);
  const [search, setSearch] = useState("");
  const renderElement = useCallback(
    props => <Element {...props} note={note} />,
    []
  );
  const editor = useMemo(
    () => withShortcuts(withMentions(withReact(withHistory(createEditor())))),
    []
  );

  const symbols = [...store.symbols.entries()].map(([id, symbol]) => ({
    name: symbol.name,
    id: symbol.id
  }));

  const onKeyDown = useCallback(
    event => {
      if (target) {
        switch (event.key) {
          case "ArrowDown":
            event.preventDefault();
            const prevIndex = index >= symbols.length - 1 ? 0 : index + 1;
            setIndex(prevIndex);
            break;
          case "ArrowUp":
            event.preventDefault();
            const nextIndex = index <= 0 ? symbols.length - 1 : index - 1;
            setIndex(nextIndex);
            break;
          case "Tab":
          case "Enter":
            event.preventDefault();
            Transforms.select(editor, target);
            const symbol = store.symbols.get(symbols[index].id);
            if (symbol) {
              note.setSymbol(clone(symbol));
            }
            insertMention(editor, symbols[index]);
            setTarget(null);
            break;
          case "Escape":
            event.preventDefault();
            setTarget(null);
            break;
        }
      }
    },
    [index, search, target]
  );

  useEffect(() => {
    if (target && symbols.length > 0) {
      const el: any = ref.current;
      const domRange = ReactEditor.toDOMRange(editor as any, target);
      const rect = domRange.getBoundingClientRect();
      el.style.top = `${rect.top + window.pageYOffset + 24}px`;
      el.style.left = `${rect.left + window.pageXOffset}px`;
    }
  }, [symbols.length, editor, index, search, target]);

  return (
    <Frame
      title="Note"
      x={note.x}
      y={note.y}
      headerColor="rgba(0, 0, 0, 0.028)"
      onEnd={() => {
        store.setIsBubbleDragging(false);
      }}
      onStart={() => store.setIsBubbleDragging(true)}
      onRemove={() => {
        store.removeNote(note.id);
      }}
      setPosition={note.setPosition}
      setRef={note.setRef}
      height={note.height || 500}
      width={note.width || 600}
      zIndex={2}
      scroll
      onResize={(resizedHeight, resizedWidth) =>
        note.setDimensions(resizedHeight, resizedWidth)
      }
    >
      <Global
        styles={css`
          .note {
            h1 {
              font-size: 25px;
            }

            h2 {
              font-size: 20px;
            }

            ul {
              margin: 15px;
            }

            blockquote {
              border-left: 2px solid #ddd;
              margin-left: 0;
              margin-right: 0;
              padding-left: 10px;
              color: #aaa;
              font-style: italic;
            }
          }
        `}
      />
      <Flex padding="15px" className="note" cursor="initial">
        <Slate
          editor={editor as any}
          value={value}
          onChange={value => {
            setValue(value as any);
            const { selection } = editor;

            if (selection && Range.isCollapsed(selection)) {
              const [start] = Range.edges(selection);
              const wordBefore = Editor.before(editor, start, { unit: "word" });
              const before = wordBefore && Editor.before(editor, wordBefore);
              const beforeRange = before && Editor.range(editor, before, start);
              const beforeText =
                beforeRange && Editor.string(editor, beforeRange);
              const beforeMatch = beforeText && beforeText.match(/^@(\w+)$/);
              const after = Editor.after(editor, start);
              const afterRange = Editor.range(editor, start, after);
              const afterText = Editor.string(editor, afterRange);
              const afterMatch = afterText.match(/^(\s|$)/);

              if (beforeMatch && afterMatch) {
                setTarget(beforeRange);
                setSearch(beforeMatch[1]);
                setIndex(0);
                return;
              }
            }

            setTarget(null);
          }}
        >
          <Editable
            style={{ height: "100%", minWidth: "500px" }}
            renderElement={renderElement}
            onKeyDown={onKeyDown}
            placeholder="Start typing... You can @mention other symbols on the stage..."
          />
          {target && symbols.length > 0 && (
            <Portal>
              <div
                ref={ref}
                style={{
                  top: "-9999px",
                  left: "-9999px",
                  position: "absolute",
                  zIndex: 4,
                  padding: "3px",
                  background: "white",
                  borderRadius: "4px",
                  boxShadow: "0 1px 5px rgba(0,0,0,.2)"
                }}
              >
                {symbols.map((char, i) => (
                  <div
                    key={char.id}
                    style={{
                      padding: "1px 3px",
                      borderRadius: "3px",
                      background: i === index ? "#B4D5FF" : "transparent"
                    }}
                  >
                    {char.name}
                  </div>
                ))}
              </div>
            </Portal>
          )}
        </Slate>
      </Flex>
    </Frame>
  );
};

const withMentions = (editor: Editor) => {
  const { isInline, isVoid } = editor;

  editor.isInline = element => {
    return element.type === "symbol" ? true : isInline(element);
  };

  editor.isVoid = element => {
    return element.type === "symbol" ? true : isVoid(element);
  };

  return editor;
};

const insertMention = (editor: Editor, symbol: any) => {
  const mention = { type: "symbol", symbol, children: [{ text: "" }] };
  Transforms.insertNodes(editor, mention);
  Transforms.move(editor);
};

const Element = (props: any) => {
  const { attributes, children, element } = props;

  switch (element.type) {
    case "symbol":
      return <MentionElement {...props} />;
    case "block-quote":
      return <blockquote {...attributes}>{children}</blockquote>;
    case "bulleted-list":
      return <ul {...attributes}>{children}</ul>;
    case "heading-one":
      return <h1 {...attributes}>{children}</h1>;
    case "heading-two":
      return <h2 {...attributes}>{children}</h2>;
    case "heading-three":
      return <h3 {...attributes}>{children}</h3>;
    case "heading-four":
      return <h4 {...attributes}>{children}</h4>;
    case "heading-five":
      return <h5 {...attributes}>{children}</h5>;
    case "heading-six":
      return <h6 {...attributes}>{children}</h6>;
    case "list-item":
      return <li {...attributes}>{children}</li>;
    default:
      return <p {...attributes}>{children}</p>;
  }
};

const MentionElement = observer(
  ({ attributes, children, element, note }: any) => {
    const editor = useEditor();
    const symbol = note.symbols.get(element.symbol.id);

    return (
      <div {...attributes} contentEditable={false}>
        {symbol && (
          <Flex
            flexDirection="column"
            position="relative"
            border="rgba(0, 0, 0, 0.028)"
            borderStyle="solid"
            borderRadius="5px"
          >
            <Flex
              cursor="pointer"
              fontSize="12px"
              padding="5px"
              backgroundColor="rgba(0, 0, 0, 0.028)"
              onClick={() => {
                const path = ReactEditor.findPath(editor, element);
                Transforms.setNodes(
                  editor,
                  { collapsed: !element.collapsed },
                  { at: path }
                );
              }}
            >
              {symbol.name}
            </Flex>
            {!element.collapsed && <Code symbol={symbol} />}
          </Flex>
        )}
        {children}
      </div>
    );
  }
);

const initialValue = [
  {
    type: "paragraph",
    children: [
      {
        text: ""
      }
    ]
  }
];

export default observer(Note);
