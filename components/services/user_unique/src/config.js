const convict = require('convict');

const config = convict({
    port: {
        doc: "The service will listen on this port.",
        format: 'port',
        default: '9010',
        ENV: 'USER_UNIQUE_CHECK_PORT'
    },
    'user-url': {
        uri: {
            doc: 'The URI to the User Entity Service.',
            format: String,
            default: 'localhost:9002',
            env: 'USER_URI'
        }
    }
});

config.validate({ allowed: 'strinct' });
module.exports = config;