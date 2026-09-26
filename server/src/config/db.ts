import "dotenv/config";
import {Pool} from 'pg';


const pool = new Pool({
    // Database connection configuration
    user:process.env.DB_USER || 'postgres', // Replace with your actual username
    database: process.env.DB_NAME || 'postgres', // Replace with your actual database name
    port:parseInt(process.env.DB_PORT || '5432'), // Replace with your actual port number
    host:process.env.DB_HOST || 'localhost', // Replace with your actual host
    password:  process.env.DB_PASSWORD // Replace with your actual password
})
export default pool;