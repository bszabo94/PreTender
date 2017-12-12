const convict = require('convict');

const config = convict({
    port: {
        doc: "The service will listen on this port.",
        format: 'port',
        default: '9002',
        ENV: 'USER_PORT'
    },
    'database': {
        url: {
            doc: 'Address of the database.',
            format: String,
            default: 'mongodb://127.0.0.1:27017/pretender',
        }
    },
    'user-exists-check-url': {
        uri: {
            doc: 'The URI to the User Existence Check Microservice.',
            format: String,
            default: 'localhost:9010',
            env: 'USER_USER_EXISTS_CHECK_URI'
        }
    }
});

config.validate({ allowed: 'strinct' });
module.exports = config;