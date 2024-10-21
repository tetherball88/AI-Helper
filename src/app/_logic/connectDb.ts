import { Pool } from "pg";

let pool: Pool | null = null

export const connectDb = () => {
    if (pool) {
        return pool
    }

    return pool = new Pool({
        user: 'dwemer',
        host: 'localhost',
        database: 'dwemer',
        password: 'dwemer',
        port: 5432, // default PostgreSQL port
    });
}