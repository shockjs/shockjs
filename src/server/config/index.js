"use strict";

if (process.env.SHOCK_ENV === 'browser') {
  throw new Error('config should not be included on the client...');
}

/**
 * @file controls for configuration options.
 */
import main from './main.json';
import development from './development.json';
import staging from './staging.json';
import production from './production.json';
import command from './command.json';
import client from './client.json';
import knex from 'knex';
import bookshelf from 'bookshelf';
import getBase from '../models/Base';
import fs from 'fs';

process.env.SHOCK_ENV = process.env.SHOCK_ENV || 'development';

/**
 * Gets the configuration for the currently set environment defaults to development.
 *
 * @param env The environment.
 * @param commandLine Whether this is purposed for the command line.
 * @returns {*} The config
 */
export function getConfig(env=process.env.SHOCK_ENV, commandLine=false) {
  let environment;
  switch (env) {
  case 'staging':
    environment = staging;
    break;
  case 'production':
    environment = production;
    break;
  case 'development':
  default:
    environment = development;
    break;
  }

  environment = Object.assign({}, environment, main);

  try {
    let localMain = fs.readFileSync(__dirname + '/main-local.json', 'utf8');
    localMain = JSON.parse(localMain);
    environment = Object.assign({}, environment, localMain);
  } catch (e) {
    //Do nothing as file does not exist.
  }

  // Adds console only commands.
  if (commandLine === true) {
    environment = Object.assign({}, environment, command);
  }

  return environment;
}

/**
 * Get the configuration that the client is allowed to see (this script should not be included directly)
 * @param env
 */
export function getClientConfig(env=process.env.SHOCK_ENV) {
  let serverConfig = getConfig(env);
  let allowed = {
    "recaptcha": {
      "siteKey": serverConfig.recaptcha.siteKey
    }
  };
  return Object.assign({}, allowed, client);
}

/**
 * Shortcut to knex direct connection.
 *
 * @param env
 * @param commandLine
 */
export function getKnex(env=process.env.SHOCK_ENV, commandLine=false) {
  return knex(getConfig(env, commandLine).database);
}

/**
 * Shortcut to just getting the bookshelf base model.
 *
 * @param env The environment.
 * @param commandLine Whether this is purposed for the command line.
 * @returns {*} The config
 */
export function getServerModel(env=process.env.SHOCK_ENV, commandLine=false) {
  let connection = getKnex(env, commandLine);
  const bookshelfInstance = bookshelf(connection);
  bookshelfInstance.plugin('virtuals');
  return getBase(bookshelfInstance.Model);
}

/**
 * Exposes the current url set in current config to expose url to shared data.
 *
 * @returns {string} The url
 */
export function exposeUrl() {
  let { ssl=false, host='localhost', port=80 } = getConfig();
  return (ssl ? 'https' : 'http') + `://${host}` + (port !== 80 ? `:${port}` : '');
}
