import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({
  workflows: defineTable({
    slug: v.string(),
    name: v.string(),
    description: v.string(),
    longDescription: v.optional(v.string()),
    author: v.string(),
    authorUrl: v.optional(v.string()),
    yaml: v.string(),
    requiredSkills: v.array(v.string()),
    category: v.union(
      v.literal('productivity'),
      v.literal('communication'),
      v.literal('automation'),
      v.literal('devtools'),
      v.literal('other')
    ),
    tags: v.array(v.string()),
    downloads: v.number(),
    featured: v.optional(v.boolean()),
    createdAt: v.number(),
  })
    .index('by_slug', ['slug'])
    .index('by_category', ['category'])
    .index('by_featured', ['featured'])
    .index('by_downloads', ['downloads'])
    .index('by_createdAt', ['createdAt']),
})
