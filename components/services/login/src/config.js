const convict = require('convict');

const config = convict({
    port: {
        doc: "The service will listen on this port.",
        format: 'port',
        default: '9031',
        ENV: 'LOGIN_PORT'
    },
    'user-exists-check-url': {
        uri: {
            doc: 'The URI to the User Existence Check Microservice.',
            format: String,
            default: 'localhost:9010',
            env: 'LOGIN_USER_EXISTS_CHECK_URI'
        }
    },
    'hasher-url': {
        uri: {
            doc: 'The URI to the Hasher Utility Service.',
            format: String,
            default: 'localhost:9050',
            env: 'LOGIN_HASHER_URI'
        }
    },
    'user-url': {
        uri: {
            doc: 'The URI to the User Entity Service.',
            format: String,
            default: 'localhost:9002',
            env: 'LOGIN_USER_URI'
        }
    },
    'baker-url': {
        uri: {
            doc: 'The URI to the Baker Utility Service.',
            format: String,
            default: 'localhost:9051',
            env: 'LOGIN_BAKER_URI'
        }
    },
    'tokener-url': {
        uri: {
            doc: 'The URI to the Tokener Microservice.',
            format: String,
            default: 'localhost:9011',
            env: 'LOGIN_TOKENER_URI'
        }
    }
});

config.validate({ allowed: 'strinct' });
module.exports = config;