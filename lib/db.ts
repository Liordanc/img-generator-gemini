import { PrismaClient } from '@prisma/client';

declare global {
  // allow global `var` declarations
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    log: ['query'],
  });

if (process.env.NODE_ENV !== 'production') global.prisma = prisma;

/*
 * --- IN-MEMORY FALLBACK (Conceptual) ---
 * In an environment where a persistent database is not available (like a serverless function cold start
 * or a restricted environment), we could implement a fallback mechanism.
 *
 * 1.  Detect DB Connection Failure: Wrap the initial PrismaClient connection in a try-catch block.
 * 2.  Initialize In-Memory Store: If the connection fails, initialize a set of in-memory arrays
 *     (e.g., `let inMemoryArtifacts = []`).
 * 3.  Create Mock ORM: Create an object with the same function signatures as Prisma
 *     (e.g., `db.artifact.create`, `db.artifact.findMany`) that operates on these arrays.
 * 4.  (Optional) Persist to JSON: On process exit or at intervals, serialize the in-memory arrays
 *     to a JSON file in `/artifacts/data/` to provide some persistence between sessions.
 * 5.  Export the real Prisma client or the mock ORM based on the connection status.
 *
 * This approach ensures the application can still run for demonstration purposes even without a DB.
 */
