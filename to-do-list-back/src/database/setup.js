const db = require('../config/db').default;

async function setupDatabase() {
    try {
        await db.query('CREATE EXTENSION IF NOT EXISTS "pgcrypto";');

        await db.query(`
            CREATE TABLE IF NOT EXISTS users (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                email VARCHAR(255) UNIQUE NOT NULL
            );
        `); 

        await db.query(`
            CREATE TABLE IF NOT EXISTS tasks (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                user_id UUID NOT NULL,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                status VARCHAR(50) NOT NULL,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            );
        `);

        console.log('Database setup completed successfully');
    } catch (error) {
        console.error('Error setting up the database:', error);
    }
}

setupDatabase();