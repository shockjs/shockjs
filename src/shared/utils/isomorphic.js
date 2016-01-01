/**
 * @file handles isomorphic operations
 */

"use strict";

import isoFetch from 'isomorphic-fetch';
import merge from 'lodash/object/merge';
import { browserHistory } from '../store/configureStore';

let staticReply;
let staticRequest;
let environment;

/**
 * Checks if the data is meant for the server or client. Webpack has a special APP_ENV set for this purpose.
 *
 * @returns {boolean}
   */
export function isServer() {
  return process.env.ISO_ENV !== 'browser';
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
      let serverRenderedData = JSON.parse(serverRenderedDataElement.textContent);
      if (serverRenderedData[component] !== undefined) {
        serverRenderedData[component].renderedServer = true;
        return serverRenderedData[component];
      }
    }
  }
  return state;
}

/**
 * wrapper function for fetch to add an absolute url if data is pre-fetched server side.
 *
 * @param url
 * @param options
 */
export function fetch(url, options={}) {

  options = merge({ credentials: 'same-origin' }, options);

  if (isServer()) {
    url = process.env.SHOCK_URI + url; // Use full url for request.
    options = merge(options, { headers: { Cookie: staticRequest.headers.cookie } }); // Make sure we are using the cookie from the request.
  }

  return isoFetch(url, options);
}

/**
 * Sets the reply from server for server side operations.
 * @param reply
 */
export function setReply(reply) {
  staticReply = reply;
}

/**
 * Sets the request from server for server side operations.
 * @param request
 */
export function setRequest(request) {
  staticRequest = request;
}

/**
 * Tries the handle redirect for both server and client.
 *
 * @param path
 */
export function redirect(path) {
  if (!isServer()) {
    let history = browserHistory();
    history.replaceState(null, path); // Only route if client side.
  } else {
    staticReply && staticReply.redirect(path); // Attempt to redirect using reply from server.
  }
}
