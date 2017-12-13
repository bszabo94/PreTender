const convict = require('convict');

const config = convict({
    port: {
        doc: "The service will listen on this port.",
        format: 'port',
        default: '9034'
    },
    'application': {
        url: {
            doc: 'The URI to the Application Entity Service.',
            format: String,
            default: 'localhost:9005'
        }
    },
    'validate-application': {
        url: {
            doc: 'The URI to the Validate Application Microservice.',
            format: String,
            default: 'localhost:9013'
        }
    }
});

config.validate({ allowed: 'strinct' });
module.exports = config;
