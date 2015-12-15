import React from 'react';

export function renderDevTools(store) {
  let {DevTools, DebugPanel, LogMonitor} = require('redux-devtools/lib/react');
  return (
    <DebugPanel top right bottom>
      <DevTools store={store} monitor={LogMonitor} />
    </DebugPanel>
  );
}
