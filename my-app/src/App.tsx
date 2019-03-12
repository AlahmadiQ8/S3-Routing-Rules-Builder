import * as React from 'react';
import { CustomEditor } from './CustomDraftEditor';

export default function App() {
  return (
    <>
      <section className="container-fluid">
        <header className="row">
          <div className="col">
            <h1>
              <strong>S3</strong> ROUTING RULES BUILDER
            </h1>
          </div>
        </header>
      </section>
      <section className="container">
        <article className="row">
          <div className="col">
            <CustomEditor />
          </div>
          <div className="col">OMG OMG</div>
        </article>
      </section>
    </>
  );
}

// <CustomEditor />
// <div class="container-fluid">
// ...
// </div>
