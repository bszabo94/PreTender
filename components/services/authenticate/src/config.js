const convict = require('convict');

const config = convict({
    port: {
        doc: "The service will listen on this port.",
        format: 'port',
        default: '9032',
    },
    'tokener-url': {
        uri: {
            doc: 'The URI to the Tokener Microservice.',
            format: String,
            default: 'localhost:9011',
        }
    },
    'user-exists-check-url': {
        uri: {
            doc: 'The URI to the User Existence Check Microservice.',
            format: String,
            default: 'localhost:9010',
        }
    }
});

config.validate({ allowed: 'strinct' });
module.exports = config;