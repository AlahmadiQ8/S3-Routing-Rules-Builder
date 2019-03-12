import * as React from 'react';
import { Editor } from 'slate-react';
import { Value } from 'slate';
import { WordsIterator, wordLength } from './wordsIterator';

const { useState } = React;

const initialValue = Value.fromJSON({
  document: {
    nodes: [
      {
        object: 'block',
        type: 'paragraph',
        nodes: [
          {
            object: 'text',
            leaves: [
              {
                text: ''
              }
            ]
          }
        ]
      }
    ]
  }
});

export function CustomEditor() {
  const [value, setValue] = useStateLegacy(initialValue);

  return <Editor value={value} onChange={setValue} plugins={[plugin]} />;
}

function useStateLegacy(initialValue) {
  const [value, setValue] = useState(initialValue);
  const setValueLegacy = ({ value }) => {
    setValue(value);
  };
  return [value, setValueLegacy];
}

function renderMark(props, editor, next) {
  const { children, mark, attributes } = props;
  switch (mark.type) {
    case 'custom':
      return (
        <span {...attributes} style={{ color: 'blue' }}>
          {children}
        </span>
      );
    default:
      return next();
  }
}

function handler(event, editor, next) {
  const { value } = editor;
  const texts = value.document.getTexts();
  const decorations: any[] = [];
  texts.forEach(node => {
    const { key, text } = node;
    const wordsIter = new WordsIterator(text);
    for (const offset of wordsIter) {
      decorations.push({
        anchor: { key, offset },
        focus: { key, offset: offset + wordLength(text, offset) },
        mark: { type: 'custom' }
      });
    }
  });
  editor.withoutSaving(() => {
    editor.setDecorations(decorations);
  });
  return next();
}

const plugin = {
  renderMark,
  onKeyDown: handler,
  onCopyPaste: handler
};
