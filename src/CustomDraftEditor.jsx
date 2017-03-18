import React from 'react';
import ReactDOM from 'react-dom';
import Draft from 'draft-js';
const {CompositeDecorator, Editor, EditorState, Modifier, SelectionState, ContentState, EditorChangeType} = Draft;
import { VALID_LINE } from './lib';
import 'draft-js/dist/Draft.css';

export default class CustomDraftEditor extends React.Component {
  constructor() {
    super();
    const compositeDecorator = new CompositeDecorator([
      {
        strategy: handleStrategy,
        component: HandleSpan,
      },
    ]);

    this.state = {
      editorState: EditorState.createEmpty(compositeDecorator),
    };

    this.focus = (e) => {
      e.preventDefault();
      this.refs.editor.focus();
    }
    this.onChange = (editorState) => {
      this.setState({editorState});
      const currentState = editorState.getCurrentContent();
      const text = currentState.getPlainText();
      this.props.update(text);
    }
  }

  render() {
    return (
        <div className='editor' onClick={this.focus}>
          <Editor
            editorState={this.state.editorState}
            onChange={this.onChange}
            ref="editor"
            spellCheck={false}
            placeholder="Start typing..."
          />
        </div>
    );
  }
}

function handleStrategy(contentBlock, callback, contentState) {
  const text = contentBlock.getText();
  if (!text || !text.match(VALID_LINE)) {
    return;
  }
  text.match(VALID_LINE).forEach( (match) => callback(0, match.length));
}

const HandleSpan = (props) => {
  return (
    <span
      className='valid-input'
      data-offset-key={props.offsetKey}
    >
      {props.children}
    </span>
  );
};



const styles = {
  handle: {
    color: '#FF1744',
  },
};
