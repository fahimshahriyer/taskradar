import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private client;
  public db;

  constructor() {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL is not defined in environment variables');
    }

    // Create the database connection
    this.client = postgres(process.env.DATABASE_URL, {
      ssl: process.env.NODE_ENV === 'production' ? 'require' : false,
      max: 10, // Maximum number of connections
      idle_timeout: 20, // Max idle time in seconds
      max_lifetime: 60 * 30, // Max connection lifetime in seconds (30 minutes)
    });

    // Initialize Drizzle with the PostgreSQL client
    this.db = drizzle(this.client);
  }

  async onModuleInit() {
    // Test the connection
    try {
      await this.client`SELECT 1`;
    } catch (error) {
      console.error('Failed to connect to the database:', error);
      throw error;
    }
  }

  async onModuleDestroy() {
    // Cleanup if needed
    if (this.client) {
      await this.client.close();
    }
  }
}
