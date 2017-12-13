const convict = require('convict');

const config = convict({
    port: {
        doc: "The service will listen on this port.",
        format: 'port',
        default: '9033',
        ENV: 'APPLY_TENDER_PORT'
    },
    'user-url': {
        uri: {
            doc: 'The URI to the User Entity Service.',
            format: String,
            default: 'localhost:9002',
            env: 'APPLY_TENDER_USER_URI'
        }
    },
    'tender-type-url': {
        uri: {
            doc: 'The URI to the Tender Entity Service.',
            format: String,
            default: 'localhost:9003',
            env: 'APPLY_TENDER_TENDER_TYPE_URI'
        }
    },
    'issued-tender-url': {
        uri: {
            doc: 'The URI to the Tender Entity Service.',
            format: String,
            default: 'localhost:9004',
            env: 'APPLY_TENDER_ISSUED_TENDER_URI'
        }
    },
    'save-application-url': {
        uri: {
            doc: 'The URI to the Save Application Microservice.',
            format: String,
            default: 'localhost:9012',
            env: 'APPLY_TENDER_SAVE_APPLICATION_URI'
        }
    }
});

config.validate({ allowed: 'strinct' });
module.exports = config;