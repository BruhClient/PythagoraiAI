import { Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import * as schema from "@/db/schema";
import { env } from "@/data/env/server";

const pool = new Pool({ connectionString: env.AUTH_DRIZZLE_URL });
export const db = drizzle(pool, { schema });
