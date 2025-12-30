// import { drizzle } from 'drizzle-orm/neon-http';

// export const db = drizzle(process.env.DATABASE_URL);

import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

// Configure neon client with a 25s timeout
const pg = neon(process.env.DATABASE_URL, {
  fetchOptions: {
    // Note: Signal/AbortController is the standard way to handle timeouts in fetch
    // We'll use a signal that aborts after 25 seconds
    signal: AbortSignal.timeout(25000)
  }
});

export const db = drizzle(pg);
