
import {Pool, PoolClient, QueryResult, QueryConfig} from "../deps.ts"
import getEnv from "../utils/getEnv.ts"

const PG_HOST = getEnv("PG_HOST","localhost")
const PG_PORT = parseInt(getEnv("PG_PORT","5432"))
const PG_USER = getEnv("PG_USER","postgres")
const PG_PASS = getEnv("PG_PASS","changeme")
const PG_DB = getEnv("PG_DB","todo_db")
const PG_POOL_MAX_SIZE = parseInt(getEnv("PG_POOL_MAX_SIZE","20"))

let dbPool:Pool

export function initDBPool():Pool{
  dbPool = new Pool({
    hostname: PG_HOST,
    port: PG_PORT,
    user: PG_USER,
    password: PG_PASS,
    database: PG_DB,
  }, PG_POOL_MAX_SIZE);
  return dbPool
}

export async function getClient():Promise<PoolClient>{
  return dbPool.connect()
}

export async function runQuery (query: string | QueryConfig):Promise<QueryResult>{
  const client: PoolClient = await getClient();
  const dbResult: QueryResult = await client.query(query);
  client.release();
  return dbResult
}
