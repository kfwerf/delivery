import Progress from './Progress';
import Send from './Request/Send';
import Reset from './Request/Reset';
import React from 'react';
import Copy from './Copy';
import { useAppSelector } from '../utils/hooks';

export default function Footer(): JSX.Element {
  const progressLoading: number = useAppSelector((state) => {
    return state?.request?.progressLoading;
  });
  return (
    <footer className="toolbar toolbar-footer">
      <div className="toolbar-actions request-footer">
        <div className="footer-left">
          <div className="send">
            {' '}
            <Send />{' '}
          </div>
          <div className="reset">
            {' '}
            <Reset />{' '}
          </div>
          <div className="copy">
            {' '}
            <Copy />{' '}
          </div>
        </div>
        <div className="footer-right">
          <Progress amount={progressLoading}></Progress>
        </div>
      </div>
    </footer>
  );
}
