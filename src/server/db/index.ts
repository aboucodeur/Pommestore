/**
 * Pour la base de donne
 * - ORM : drizzle
 * - LOCAL  PROVIDER : POSTGRESQL
 * - HOSTED PROVIDER : XATA.IO
 *
 * Solutions :
 *  - Switch between LOCAL (DEV) AND HOSTED (PROD)
 *  - Lib : node-postgres (url,with config, with my driver) & postgres.js (lib postgres)
 */

import p from "postgres";
import { env } from "~/env.mjs";
import * as schema from "./schema";

// import { drizzle } from "drizzle-orm/node-postgres"; // xata driver
import { drizzle } from "drizzle-orm/postgres-js";

// ! Tromper typescript and remove global variable properties !
const globalForDb = globalThis as unknown as { conn: p.Sql | undefined };
const conn = globalForDb.conn ?? p(env.POSTGRES_URL);
if (env.NODE_ENV !== "production") globalForDb.conn = conn;

// HOSTED | PROVIDER WITH MY OWN DRIVER
// const xata = getXataClient();
// const xataClient = new Pool({
//   connectionString: xata.sql.connectionString,
// }) as NodePgClient;
// const hostedDB = drizzleXata(xataClient, { schema });

// drizzle(conn, { schema })
// hostedDB

export const db = drizzle(conn, { schema });
