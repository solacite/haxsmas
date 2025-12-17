import { db } from "./index"
import { wishes } from "./schema"
import { eq, desc } from "drizzle-orm"

// List all wishes, newest first
export async function listWishes() {
  return db.select().from(wishes).orderBy(desc(wishes.id))
}

// Create a wish and return the new id
export async function createWish(item: string) {
  const createdAt = Math.floor(Date.now() / 1000)
  const [wish] = await db.insert(wishes).values({
    item,
    fulfilled: 0,
    createdAt,
  }).returning()
  return { id: wish?.id ?? null }
}

// Mark a wish as fulfilled
export async function fulfillWish(id: number) {
  const results = await db.update(wishes)
    .set({ fulfilled: 1 })
    .where(eq(wishes.id, id))
    .returning()
  return { changes: results.length }
}

// Delete a wish
export async function deleteWish(id: number) {
  const results = await db.delete(wishes)
    .where(eq(wishes.id, id))
    .returning()
  
  return { changes: results.length }
}