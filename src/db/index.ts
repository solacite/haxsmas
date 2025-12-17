import { drizzle } from "drizzle-orm/libsql"
import { createClient } from "@libsql/client"

// Create the client
const client = createClient({
  url: "file:my.db",
})
export const db = drizzle(client)