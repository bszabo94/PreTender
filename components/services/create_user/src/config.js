const convict = require('convict');

const config = convict({
    port: {
        doc: "The service will listen on this port.",
        format: 'port',
        default: '9030',
        ENV: 'CREATE_USER_PORT'
    },
    'database-url': {
        uri: {
            doc: 'The URI to the Database Url Service.',
            format: String,
            default: 'localhost:9001',
            env: 'USER_GET_DATABASE_URL_URI'
        }
    },
    'user-unique-check-url': {
        uri: {
            doc: 'The URI to the User Unique Check Microservice.',
            format: String,
            default: 'localhost:9010',
            env: 'CREATE_USER_USER_UNIQUE_CHECK_URI'
        }
    },
    'hasher-url': {
        uri: {
            doc: 'The URI to the Hasher Utility Service.',
            format: String,
            default: 'localhost:9050',
            env: 'CREATE_USER_HASHER_URI'
        }
    }
});

config.validate({ allowed: 'strinct' });
module.exports = config;