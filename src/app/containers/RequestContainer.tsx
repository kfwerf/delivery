import React from 'react';
import UrlInput from '../components/Request/UrlInput';
import MethodInput from '../components/Request/MethodInput';
import Body from '../components/Request/Body';
import Result from '../components/Request/Result';
import Footer from '../components/Footer';

export default function RequestContainer(): JSX.Element {
  return (
    <section className="window">
      <div className="window-content">
        <div className="pane-group">
          <div className="pane main-pane">
            <div className="request">
              <div className="selectors">
                <UrlInput />
                <MethodInput />
              </div>
              <Body />
            </div>
          </div>
          <div className="pane">
            <div className="response">
              <Result />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </section>
  );
}
