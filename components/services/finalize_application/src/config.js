const convict = require('convict');

const config = convict({
    port: {
        doc: "The service will listen on this port.",
        format: 'port',
        default: '9034',
        ENV: 'FINALIZE_APPLICATION_PORT'
    },
    'application-url': {
        uri: {
            doc: 'The URI to the Application Entity Service.',
            format: String,
            default: 'localhost:9005',
            env: 'FINALIZE_APPLICATION_APPLICATION_URL_URI'
        }
    },
    'validate-application-url': {
        uri: {
            doc: 'The URI to the Validate Application Microservice.',
            format: String,
            default: 'localhost:9013',
            env: 'FINALIZE_APPLICATION_VALIDATE_APPLICATION_URL_URI'
        }
    }
});

config.validate({ allowed: 'strinct' });
module.exports = config;