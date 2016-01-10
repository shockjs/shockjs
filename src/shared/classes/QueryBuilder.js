"use strict";

import { fetch } from '../utils/IsoBridge';

export default class QueryBuilder
{
  constructor(endpoint, meta = {})
  {
    this.meta = meta;
    this.endpoint = endpoint;
    this.query = endpoint;
  }

  addParam(param, value)
  {
    this.query += (this.query.length == this.endpoint ? '&' : '?') + param + '=' + JSON.stringify(value);
    return this;
  }

  fetch()
  {
    return fetch(this.query, this.meta);
  }

}