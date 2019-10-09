const { Client } = require('pg');
const db = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.ENVIORAMENT == 'production',
});

const DDL_CREATE_USER_TABLE = ` 
CREATE TABLE IF NOT EXISTS USERS (
    UID VARCHAR(50),
    EMAIL VARCHAR(100),
    PASSWORD VARCHAR(100),
    SALT VARCHAR(100)
)
`;

module.exports = async function() {
    await db.connect();
    console.log('Checking tables in database...');
    await db.query(DDL_CREATE_USER_TABLE);
    await db.end();
}

module.exports.getClient = function() {
    return new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: process.env.ENVIORAMENT == 'production',
    });
}