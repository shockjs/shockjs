import merge from 'lodash/object/merge';
import main from './main.json';
import development from './development.json';
import staging from './staging.json';
import production from './production.json';
import command from './command.json';

process.env.SHOCK_ENV = process.env.SHOCK_ENV || 'development';

// Extra manipulation to environment data can be done here.

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

export function getDatabase(env=process.env.SHOCK_ENV, consoleEnv=false) {

    let environment = getConfig(env, consoleEnv);
    return environment.database;
}

export function exposeUrl() {
    let { ssl=false, host='localhost', port=80 } = getConfig();
    return (ssl ? 'https' : 'http') + `://${host}` + (port !== 80 ? `:${port}` : '');
}
