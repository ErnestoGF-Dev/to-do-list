import { Pool } from 'pg';
require('dotenv').config();

class NewClient {
    constructor() {
        if(!NewClient.instance) {
            this.pool = new Pool({
            user: process.env.DB_USER,
            host: process.env.DB_HOST,
            database: process.env.DB_NAME,
            password: process.env.DB_PASSWORD,
            port: process.env.DB_PORT,
            min: process.env.DB_MIN_POOL_SIZE || 5,
            max: process.env.DB_MAX_POOL_SIZE || 20,
            idleTimeoutMillis: process.env.DB_IDLE_TIMEOUT || 30000,
            connectionTimeoutMillis: process.env.DB_CONNECTION_TIMEOUT || 2000,
        });
        
        this.pool.on('connect', () => {
            console.log('Connected to PostgreSQL database');    
        });
        
        this.pool.on('error', (err) => {
            console.error('Connection error', err.stack);   
        });

        NewClient.instance = this;
        }
        return NewClient.instance;
    }

    async query(text, params) {
        return await this.pool.query(text, params);
    }
}

export default new NewClient().pool;