import React from 'react';

// Exported from redux-devtools
import { createDevTools } from 'redux-devtools';

// Monitors are separate packages, and you can make a custom one
import LogMonitor from 'redux-devtools-log-monitor';
import DockMonitor from 'redux-devtools-dock-monitor';

let DevTools = (<div></div>);

// Only show if we are in development mode.

if (process.env.SHOCK_ENV === 'development') {
  // createDevTools takes a monitor and produces a DevTools component
  DevTools = createDevTools(
      <DockMonitor defaultIsVisible={false} toggleVisibilityKey='ctrl-o' changePositionKey='ctrl-q'>
          <LogMonitor theme='tomorrow' />
      </DockMonitor>
  );
}

export default DevTools;
