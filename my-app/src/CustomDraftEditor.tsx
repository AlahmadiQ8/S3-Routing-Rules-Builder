import * as React from 'react';
import { Editor } from 'slate-react';
import { Value } from 'slate';

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
                text: 'A line of text in a paragraph.'
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

  const onKeyDown = (event, editor, next) => {
    const { value } = editor;
    const texts = value.document.getTexts();
    const decorations: any[] = [];
    texts.forEach(node => {
      const { key, text } = node;
      const splitted = text.split(/\s+/);
      splitted.forEach(word => {
        decorations.push({
          anchor: { key, offset: 0 },
          focus: { key, offset: word.length },
          mark: { type: 'custom' }
        });
      });
      console.log(splitted);
    });
    editor.withoutSaving(() => {
      editor.setDecorations(decorations)
    })
    return next();
  };

  const renderMark = (props, editor, next) => {
    const { children, mark, attributes } = props;

    switch (mark.type) {
      case 'custom':
        console.log('yaass')
        return (
          <span {...attributes} style={{ backgroundColor: '#ffeeba' }}>
            {children}
          </span>
        );
      default:
        return next();
    }
  };

  return <Editor value={value} onChange={setValue} onKeyDown={onKeyDown} renderMark={renderMark} />;
}

function useStateLegacy(initialValue) {
  const [value, setValue] = useState(initialValue);
  const setValueLegacy = ({ value }) => {
    setValue(value);
  };
  return [value, setValueLegacy];
}
