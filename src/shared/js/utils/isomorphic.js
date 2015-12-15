/**
 * Checks if the data is meant for the server or client. Webpack has a special APP_ENV set for this purpose.
 *
 * @returns {boolean}
   */
export function isServer() {
  return process.env.APP_ENV !== 'browser';
}

/**
 * parses the data from the DOM if exists and places it into state.
 *
 * @param component The component to check for.
 * @param state The current state.
 * @returns {*}
   */
export function parseServerData(component, state)
{
  if (!isServer()) {
    // Gets the data from the script component then adds to state.
    let serverRenderedDataElement = document.getElementById('serverRenderedData');
    if (serverRenderedDataElement) {
      var serverRenderedData = JSON.parse(serverRenderedDataElement.textContent);
      if (serverRenderedData[component] !== undefined) {
        serverRenderedData[component].renderedServer = true;
        return serverRenderedData[component];
      }
    }
  }
  return state;
}

