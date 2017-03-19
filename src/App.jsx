import React, { Component } from 'react';

import TxtToS3Container from './components/TxtToS3Container';

const Header = () =>
  <header className='clearfix'>
    <h1 className='float-left text-uppercase'><strong>S3</strong> Routing Rules Builder</h1>
    <p className='float-right btn btn-custom'>About me</p>
  </header>


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
