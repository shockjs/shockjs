"use strict";

import { fetch } from '../utils/IsoBridge';

export default class QueryBuilder
{
  constructor(endpoint, meta = { headers: {}, method: 'GET' })
  {
    this._meta = meta;
    this._endpoint = endpoint;
    this._params = {};
  }

  /**
   * Adds header to request.
   *
   * @param {string} key
   * @param {string} value
   * @returns {QueryBuilder}
   */
  addHeader(key, value)
  {
    this._meta.headers = this._meta.headers || {};
    this._meta.headers[key] = value;
    return this;
  }

  /**
   *
   * @param {object} headers
   * @returns {QueryBuilder}
   */
  addHeaders(headers)
  {
    this._meta.headers = Object.assign({}, this._meta.headers || {}, headers);
    return this;
  }

  /**
   * Adds to query string if method is get or body otherwise.
   *
   * @param {string} param
   * @param {*} value
   * @returns {QueryBuilder}
   */
  addParam(param, value)
  {
    this._params[param] = value;
    return this;
  }

  /**
   * Adds a group of params.
   *
   * @param {object} params
   * @returns {QueryBuilder}
   */
  addParams(params)
  {
    this._params = Object.assign({}, this._params, params);
    return this;
  }

  /**
   * Set the method
   *
   * @param {string} method
   * @returns {QueryBuilder}
   */
  setMethod(method)
  {
    this._meta.method = method;
    return this;
  }

  /**
   * Shortcut for get and execute.
   * @returns {*}
   */
  fetch()
  {
    this.setMethod('GET');
    return this.execute();
  }

  /**
   * Fetches data for a list, expects pagination in headers.
   * @returns {Promise}
   */
  fetchList()
  {
    this.setMethod('GET');
    return this.execute(false)
      .then((req) => {
        return new Promise((resolve) => {
          req.json()
            .then((data) => {
              resolve({
                meta: {
                  totalCount: req.headers.get("X-Pagination-Total-Count"),
                  perPage: req.headers.get("X-Pagination-Per-Page"),
                  currentPage: req.headers.get("X-Pagination-Current-Page")
                },
                payload: data
              });
            });
        });
      });
  }

  /**
   * Shortcut for post and execute.
   * @returns {*}
   */
  create()
  {
    this.setMethod('POST');
    return this.execute();
  }

  /**
   * Shortcut for put and execute.
   * @returns {*}
   */
  update()
  {
    this.setMethod('PUT');
    return this.execute();
  }

  /**
   * Shortcut for delete and execute.
   * @returns {*}
   */
  remove()
  {
    this.setMethod('DELETE');
    return this.execute();
  }

  /**
   * Run the query.
   * @param {boolean} returnJSON true to return json data or false to return the Response object.
   */
  execute(returnJSON = true)
  {
    const params = Object.keys(this._params).map((value, index) => {
      return `${value}=${JSON.stringify(this._params[value])}`;
    }).join('&');

    switch (this._meta.method.toLowerCase()) {
      case 'get':
        return fetch(this._endpoint + '?' + params, this._meta)
          .then((req) => {
            if (returnJSON) {
              return req.json();
            } else {
              return req;
            }
          });
        break;
      case 'post':
      case 'put':
      case 'delete':
        return fetch(this._endpoint, {
          ...this._meta,
          body: params
        })
          .then((req) => {
            if (returnJSON) {
              return req.json();
            } else {
              return req;
            }
          });
        break;
      default:
        throw new Error(`Unknown method ${this._method}`);
    }

  }

}

