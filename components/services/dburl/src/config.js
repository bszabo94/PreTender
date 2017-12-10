const convict = require('convict');

const config = convict({
    port: {
        doc: "The service will listen on this port.",
        format: 'port',
        default: '9001',
        env: 'DBURL_PORT'
    },
    database: {
        uri: {
            doc: 'The URI of the database.',
            format: String,
            default: 'localhost:27017',
            env: 'DATABASE_URI'
        },
        'database-name': {
            doc: 'The name of the database.',
            format: String,
            default: 'pretender',
            env: 'DATABASE_NAME'
        },
        collections: {
            users: {
                doc: 'The collection of the database containing user data.',
                format: String,
                default: 'users',
                env: 'COLLECTION_USERS'
            },
            applications: {
                doc: 'The collection of the database containing applications data.',
                format: String,
                default: 'applications',
                env: 'COLLECTION_APPLICATIONS'
            },
            tenders: {
                doc: 'The collection of the database containing tenders data.',
                format: String,
                default: 'tenders',
                env: 'COLLECTION_TENDERS'
            }

        }
    }
});

config.validate({ allowed: 'strinct' });
module.exports = config;