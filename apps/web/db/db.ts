import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env' });

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set in environment variables');
}

// Disable prepared statements for Supabase
const client = postgres(process.env.DATABASE_URL, { prepare: false });

export const db = drizzle(client);
