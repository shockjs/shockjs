import React from 'react';
import Application from '../../classes/Application';

export function renderDevTools(store) {
  if (!Application.isServer()) {
    let {DevTools, DebugPanel, LogMonitor} = require('redux-devtools/lib/react');
    return (
      <DebugPanel top right bottom>
        <DevTools store={store} monitor={LogMonitor} />
      </DebugPanel>
    );
  }

  return null;
}
