const convict = require('convict');

const config = convict({
    port: {
        doc: "The service will listen on this port.",
        format: 'port',
        default: '9050',
        ENV: 'HASHER_UTILITY_PORT'
    }
});

config.validate({ allowed: 'strinct' });
module.exports = config;