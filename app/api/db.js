import pkg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Pool } = pkg;

export const pool = new Pool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'mhasla_wheels',
  user: process.env.DB_USER || 'mhasla_admin',
  password: process.env.DB_PASSWORD,
  ssl: process.env.DB_SSL === 'true'
});
