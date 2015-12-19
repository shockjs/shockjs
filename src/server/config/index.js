/**
 * @file controls for configuration options.
 */
import merge from 'lodash/object/merge';
import main from './main.json';
import development from './development.json';
import staging from './staging.json';
import production from './production.json';
import command from './command.json';
import knex from 'knex';
import bookshelf from 'bookshelf';

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

    environment = merge(environment, main);

    // Adds console only commands.
    if (commandLine === true) {
        environment = merge(environment, command);
    }

    return environment;
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
    class Base extends bookshelf(getKnex(env, commandLine)).Model
    {
        constructor(attributes)
        {
            super(attributes);
            this.prefix = 'tbl_';
        }

        get tableName()
        {
            return this.prefix + this.constructor.name.toLowerCase();
        }

        static knex()
        {
            return getKnex(env=process.env.SHOCK_ENV, commandLine=false);
        }
    }
    return Base;
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
