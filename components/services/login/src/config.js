const convict = require('convict');

const config = convict({
    port: {
        doc: "The service will listen on this port.",
        format: 'port',
        default: '9031'
    },
    'hasher': {
        url: {
            doc: 'The URI to the Hasher Utility Service.',
            format: String,
            default: 'localhost:9050'
        }
    },
    'user': {
        url: {
            doc: 'The URI to the User Entity Service.',
            format: String,
            default: 'localhost:9002'
        }
    },
    'baker': {
        url: {
            doc: 'The URI to the Baker Utility Service.',
            format: String,
            default: 'localhost:9051'
        }
    },
    'tokener': {
        url: {
            doc: 'The URI to the Utility Microservice.',
            format: String,
            default: 'localhost:9011'
        }
    }
});

config.validate({ allowed: 'strinct' });
module.exports = config;
