const convict = require('convict');

const config = convict({
    port: {
        doc: "The service will listen on this port.",
        format: 'port',
        default: '9033'
    },
    'user': {
        url: {
            doc: 'The URI to the User Entity Service.',
            format: String,
            default: 'localhost:9002'
        }
    },
    'tender-type': {
        url: {
            doc: 'The URI to the Tender Type Entity Service.',
            format: String,
            default: 'localhost:9003'
        }
    },
    'issued-tender': {
        url: {
            doc: 'The URI to the Issued Tender Entity Service.',
            format: String,
            default: 'localhost:9004'
        }
    },
    'save-application': {
        url: {
            doc: 'The URI to the Save Application Microservice.',
            format: String,
            default: 'localhost:9012'
        }
    }
});

config.validate({ allowed: 'strinct' });
module.exports = config;