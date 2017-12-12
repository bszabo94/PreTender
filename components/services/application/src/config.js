const convict = require('convict');

const config = convict({
    port: {
        doc: "The service will listen on this port.",
        format: 'port',
        default: '9005',
        ENV: 'APPLICATION_PORT'
    },
    'database-url': {
        uri: {
            doc: 'The URI to the Database Url Service.',
            format: String,
            default: 'localhost:9001',
            env: 'APPLICATION_GET_DATABASE_URL_URI'
        }
    }
});

config.validate({ allowed: 'strinct' });
module.exports = config;