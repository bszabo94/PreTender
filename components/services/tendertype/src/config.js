const convict = require('convict');

const config = convict({
    port: {
        doc: "The service will listen on this port.",
        format: 'port',
        default: '9003',
        ENV: 'USER_PORT'
    },
    'database': {
        url: {
            doc: 'Address of the database.',
            format: String,
            default: 'mongodb://127.0.0.1:27017/pretender',
        }
    }
});

config.validate({ allowed: 'strinct' });
module.exports = config;