const convict = require('convict');

const config = convict({
    port: {
        doc: "The service will listen on this port.",
        format: 'port',
        default: '9032'
    },
    'tokener': {
        url: {
            doc: 'The URI to the Tokener Microservice.',
            format: String,
            default: 'localhost:9011'
        }
    },
    'user': {
        url: {
            doc: 'The URI to the User Entity Service.',
            format: String,
            default: 'localhost:9002'
        }
    }
});

config.validate({ allowed: 'strinct' });
module.exports = config;