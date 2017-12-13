const convict = require('convict');

const config = convict({
    port: {
        doc: "The service will listen on this port.",
        format: 'port',
        default: '9030',
        ENV: 'CREATE_USER_PORT'
    },
    'database': {
        url: {
            doc: 'Address of the database.',
            format: String,
            default: 'mongodb://127.0.0.1:27017/pretender',
        }
    },
    'hasher-url': {
        uri: {
            doc: 'The URI to the Hasher Utility Service.',
            format: String,
            default: 'localhost:9050',
        }
    },
    'user-url': {
        uri: {
            doc: 'The URI to the User Entity Service.',
            format: String,
            default: 'localhost:9002'
        }
    }
});

config.validate({ allowed: 'strinct' });
module.exports = config;