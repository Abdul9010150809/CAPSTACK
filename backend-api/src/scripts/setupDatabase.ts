import { query } from '../config/db';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const setupDatabase = async () => {
  try {
    console.log('Setting up database...');

    // Reset database to ensure clean state
    try {
      await query('DROP SCHEMA public CASCADE; CREATE SCHEMA public;');
      await query('GRANT ALL ON SCHEMA public TO public;'); // Ensure permissions
      console.log('Database reset successfully.');
    } catch (err: any) {
      console.error('Error resetting database:', err);
    }

    // Read and execute initial schema
    const initialSchema = readFileSync(join(__dirname, '../../../database/migrations/001_initial_schema.sql'), 'utf8');
    try {
      await query(initialSchema);
      console.log('Initial schema applied');
    } catch (err: any) {
      if (err.code === '42P07') {
        console.log('Initial schema already exists, skipping...');
      } else {
        throw err;
      }
    }

    // Read and execute asset allocation schema
    const assetSchema = readFileSync(join(__dirname, '../../../database/migrations/002_asset_allocation_schema.sql'), 'utf8');
    try {
      await query(assetSchema);
      console.log('Asset allocation schema applied');
    } catch (err: any) {
      if (err.code === '42P07') {
        console.log('Asset allocation schema already exists, skipping...');
      } else {
        throw err;
      }
    }

    // Read and execute PIN authentication migration
    const pinMigration = readFileSync(join(__dirname, '../../../database/migrations/003_add_pin_authentication.sql'), 'utf8');
    await query(pinMigration);
    console.log('PIN authentication migration applied');

    // Read and execute password reset migration
    const passwordReset = readFileSync(join(__dirname, '../../../database/migrations/003_password_reset.sql'), 'utf8');
    await query(passwordReset);
    console.log('Password reset migration applied');

    console.log('Database setup complete!');
  } catch (error) {
    console.error('Database setup failed:', error);
    process.exit(1);
  }
}

setupDatabase();