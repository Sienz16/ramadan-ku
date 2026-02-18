import { Pool, type PoolClient, type QueryResult } from "pg";

let pool: Pool | null = null;

function getDatabaseUrl(): string {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is required");
  }
  return url;
}

export function getDbPool(): Pool {
  if (!pool) {
    pool = new Pool({
      connectionString: getDatabaseUrl(),
    });
  }

  return pool;
}

export async function withDbClient<T>(run: (client: PoolClient) => Promise<T>): Promise<T> {
  const client = await getDbPool().connect();
  try {
    return await run(client);
  } finally {
    client.release();
  }
}

export type DatabaseQueryable = {
  query: (text: string, params?: unknown[]) => Promise<QueryResult>;
};
