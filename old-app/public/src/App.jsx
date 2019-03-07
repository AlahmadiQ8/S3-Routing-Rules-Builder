import React, { Component } from 'react';

import TxtToS3Container from './components/TxtToS3Container';

class App extends Component {
  
  render() {
    return (
      <div>
          <div className="clearfix">
            <p id='copy' data-clipboard-target="#output" className='float-right btn btn-custom'>Copy to Clipboard</p>
          </div>
          <TxtToS3Container/>
      </div>
    );
  }
}

export default App;
