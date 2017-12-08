const convict = require('convict');

const config = convict({
    port: {
        doc: "The service will listen on this port.",
        format: 'port',
        default: '9002',
        ENV: 'USER_PORT'
    },
    'database-url': {
        uri: {
            doc: 'The URI to the Database Url Service.',
            format: String,
            default: 'localhost:9001',
            env: 'USER_GET_DATABASE_URL_URI'
        }
    }
});

config.validate({ allowed: 'strinct' });
module.exports = config;