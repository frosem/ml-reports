/**
 * Environment configuration loader.
 * Loads variables from .env file at project root.
 */
import dotenv from 'dotenv';
import { join } from 'path';

// Load .env from project root
dotenv.config({ path: join(process.cwd(), '.env') });

