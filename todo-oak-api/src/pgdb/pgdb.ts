
import {Pool, PoolClient, QueryResult, QueryConfig} from "../deps.ts"
import getEnv from "../utils/getEnv.ts"

const POOL_CONNECTIONS = parseInt(getEnv("PG_POOL_MAX_SIZE","20"))

export const dbPool = new Pool({
  hostname: getEnv("PG_HOST","localhost"),
  port: 5432,
  user: "postgres",
  password: "changeme",
  database: "todo_db",
}, POOL_CONNECTIONS);

export async function runQuery (query: string | QueryConfig):Promise<QueryResult>{
  const client: PoolClient = await dbPool.connect();
  const dbResult: QueryResult = await client.query(query);
  client.release();
  return dbResult
}
