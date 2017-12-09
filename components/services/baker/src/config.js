const convict = require('convict');

const config = convict({
    port: {
        doc: "The service will listen on this port.",
        format: 'port',
        default: '9051',
        ENV: 'BAKER_UTILITY_PORT'
    }
});

config.validate({ allowed: 'strinct' });
module.exports = config;