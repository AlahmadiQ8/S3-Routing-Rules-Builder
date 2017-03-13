import React, { Component } from 'react';

import TxtToS3Container from './TxtToS3Container';

const Header = () =>
  <header>
    <h1 className='text-uppercase'>Text to S3 Redirect Rules</h1>
    <h2>A simple tool to easily generate S3 redirect rules</h2>
  </header>


class App extends Component {
  
  render() {
    return (
      <div>
        <Header/>

        <section className="container mt-5">

          <TxtToS3Container/>

        </section>
      </div>
    );
  }
}

export default App;
