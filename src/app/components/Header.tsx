import Copy from './Copy';
import React from 'react';
import ToolbarHeader from './Photon/Toolbar/ToolbarHeader';

export default function Header(): JSX.Element {
  return (
    <ToolbarHeader>
      <div className="toolbar-actions">
        <div className="copy pull-right">
          {' '}
          <Copy />{' '}
        </div>
      </div>
    </ToolbarHeader>
  );
}
