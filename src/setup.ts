import { sql } from "./lib/postgres"

async function setup() {
  await sql/*sql*/ `CREATE TABLE IF NOT EXISTS links short_links`
}

setup().catch((err) => {
  console.error(err)
  process.exit(1)
})
