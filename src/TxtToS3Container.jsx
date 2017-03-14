import React, { Component } from 'react';
import ConvertTxtToS3 from './lib';

export default class TxtToS3Container extends Component {

  constructor(props){
    super(props);
    this.state = {output: ''};
    this.update = this.update.bind(this);
  }

  update(e){
    let input = e.target.value;
    this.txtToS3 = new ConvertTxtToS3();
    let lines = input.split('\n');
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

    output = output.split('\n').map((item, i) => 
      <span key={i}>{item}<br/></span>
    )
    this.setState({output: output});
  }

  componentDidMount() {
    
  }

  render() {
    return (
      <div className="row form-output">
        <div className="col-sm-6">
          <textarea onChange={this.update} className="form-control" id="exampleTextarea"></textarea>
        </div>
        <div className="col-sm-6">
          
          <pre>{this.state.output}</pre>
        </div>
      </div>
    );
  }
}
