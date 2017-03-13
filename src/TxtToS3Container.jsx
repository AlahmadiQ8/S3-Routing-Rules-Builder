import React, { Component } from 'react';

export default class TxtToS3Container extends Component {

  constructor(){
    super();
    this.state = {output: ''};
    this.update = this.update.bind(this);
  }

  update(e){
    let input = e.target.value;
    let lines = input.split('\n');
    let output = lines.join('<br/>');
    console.log(output);
    this.setState({output: output});
  }

  render() {
    return (
      <div className="row form-output">
        <div className="col-sm-6">
          <textarea onChange={this.update} className="form-control" id="exampleTextarea"></textarea>
        </div>
        <div className="col-sm-6">
          <pre dangerouslySetInnerHTML={{__html: this.state.output}} />
        </div>
      </div>
    );
  }
}
