import Clipboard from 'clipboard';

import React, { Component } from 'react';
import ConvertTxtToS3 from '../lib';
import CustomDraftEditor from './CustomDraftEditor';
import Prism from 'prismjs';


export default class TxtToS3Container extends Component {

  constructor(props){
    super(props);
    this.state = {output: ''};
    this.update = this.update.bind(this);
  }

  update(text){
    this.txtToS3 = new ConvertTxtToS3();
    let lines = text.split('\u000A').map((line) => line.trim());
    for (let line of lines) {
      try {
        this.txtToS3.convertLine(line);
      } catch(e) {
        console.log(e.message);  
      }
    }
    let output = this.txtToS3.toString();

    // replace spaces with Unicode non-breaking space character
    output = output.replace(/[^\S\n]/g, '\u00a0');

    // output = output.split('\n').map((item, i) => 
    //   <span key={i}>{item}<br/></span>
    // )
    output = Prism.highlight(output, Prism.languages.xml);
    this.setState({output: output});
  }

  componentDidMount() {
    let clipboard = new Clipboard('#copy');
    clipboard.on('error', function(e) {
        console.error('Action:', e.action);
        console.error('Trigger:', e.trigger);
    });
  }

  render() {
    return (
      <div className="row form-output">
        <div className="col-sm-6">
          <div className="form-control">  
            <CustomDraftEditor update={this.update}/>
          </div>
        </div>
        <div className="col-sm-6">
          <pre id='output'><code className='language-xml'>
          <span dangerouslySetInnerHTML={{__html: this.state.output}} />
          </code></pre>
        </div>
      </div>
    );
  }
}
