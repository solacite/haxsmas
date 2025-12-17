import { Hono } from "hono"
import { serveStatic } from "hono/bun"
import { createWish, deleteWish, fulfillWish, listWishes } from "./db/queries"

const app = new Hono()

app.use("/*", serveStatic({ root: "./public" }))

app.get("/", (c) => c.json({ 
  message: "Wishes API",
  endpoints: {
    "GET /api/wishes": "List all wishes",
    "POST /api/wishes": "Create a wish",
    "PATCH /api/wishes/:id/fulfill": "Mark wish as fulfilled",
    "DELETE /api/wishes/:id": "Delete a wish"
  }
}))

app.get("/api/wishes", async (c) => c.json(await listWishes()))

app.post("/api/wishes", async (c) => {
  const body = await c.req.json().catch(() => null)
  const item = (body?.item ?? "").toString().trim()
  if (!item) return c.json({ error: "item is required" }, 400)
    return c.json(await createWish(item), 201)
})

app.patch("/api/wishes/:id/fulfill", async (c) => {
  const id = Number(c.req.param("id"))
  if (!Number.isFinite(id)) return c.json({ error: "bad id" }, 400)
    const res = await fulfillWish(id)
  if (res.changes === 0) return c.json({ error: "not found" }, 404)
    return c.json({ ok: true })
})

app.delete("/api/wishes/:id", async (c) => {
  const id = Number(c.req.param("id"))
  if (!Number.isFinite(id)) return c.json({ error: "bad id" }, 400)
    const res = await deleteWish(id)
  if (res.changes === 0) return c.json({ error: "not found" }, 404)
    return c.json({ ok: true })
})

const port = Number(process.env.PORT) || 3000

export default app