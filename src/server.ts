import fastify from "fastify"
import { z } from "zod"
import { sql } from "./lib/postgres"
import postgres from "postgres"

const app = fastify()

app.get("/test", () => {
  return { message: "Hello World" }
})
app.get("/api/links", async () => {
  const result = await sql/*sql*/ `
  SELECT * FROM short_links
  ORDER BY created_at DESC
  `
  return result
})
app.post("/api/links", async (request, reply) => {
  const createLinkSchema = z.object({
    code: z.string().min(3),
    url: z.string().url(),
  })

  const { code, url } = createLinkSchema.parse(request.body)

  try {
    const result = await sql/*sql*/ `
  INSERT INTO short_links (code, original_url)
  VALUES (${code}, ${url})
  RETURNING id
  `

    const link = result[0]

    return reply.status(201).send({ shortLinkId: link.id })
  } catch (error) {
    if (error instanceof postgres.PostgresError) {
      if (error.code === "23505") {
        return reply.status(400).send({ error: "Code already in use" })
      }
    }

    console.log(error)
  }
})

app
  .listen({
    port: 3000,
  })
  .then(() => {
    console.log("Server is running on port 3000")
  })
