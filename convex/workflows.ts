import { v } from 'convex/values'
import { query, mutation } from './_generated/server'

export const list = query({
  args: {
    limit: v.optional(v.number()),
    category: v.optional(v.string()),
    featured: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 20

    if (args.featured) {
      return await ctx.db
        .query('workflows')
        .withIndex('by_featured', (q) => q.eq('featured', true))
        .order('desc')
        .take(limit)
    }

    if (args.category) {
      return await ctx.db
        .query('workflows')
        .withIndex('by_category', (q) => q.eq('category', args.category as any))
        .order('desc')
        .take(limit)
    }

    return await ctx.db
      .query('workflows')
      .withIndex('by_createdAt')
      .order('desc')
      .take(limit)
  },
})

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('workflows')
      .withIndex('by_slug', (q) => q.eq('slug', args.slug))
      .first()
  },
})

export const search = query({
  args: { query: v.string() },
  handler: async (ctx, args) => {
    const searchLower = args.query.toLowerCase()

    const allWorkflows = await ctx.db.query('workflows').collect()

    return allWorkflows.filter((workflow) => {
      return (
        workflow.name.toLowerCase().includes(searchLower) ||
        workflow.description.toLowerCase().includes(searchLower) ||
        workflow.tags.some((tag) => tag.toLowerCase().includes(searchLower)) ||
        workflow.requiredSkills.some((skill) => skill.toLowerCase().includes(searchLower))
      )
    })
  },
})

export const create = mutation({
  args: {
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
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query('workflows')
      .withIndex('by_slug', (q) => q.eq('slug', args.slug))
      .first()

    if (existing) {
      throw new Error(`Workflow with slug "${args.slug}" already exists`)
    }

    return await ctx.db.insert('workflows', {
      ...args,
      downloads: 0,
      featured: false,
      createdAt: Date.now(),
    })
  },
})

export const incrementDownloads = mutation({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const workflow = await ctx.db
      .query('workflows')
      .withIndex('by_slug', (q) => q.eq('slug', args.slug))
      .first()

    if (!workflow) {
      throw new Error(`Workflow not found: ${args.slug}`)
    }

    await ctx.db.patch(workflow._id, {
      downloads: workflow.downloads + 1,
    })
  },
})

export const getCategories = query({
  args: {},
  handler: async () => {
    return [
      { id: 'productivity', name: 'Productivity', icon: '📊' },
      { id: 'communication', name: 'Communication', icon: '💬' },
      { id: 'automation', name: 'Automation', icon: '⚡' },
      { id: 'devtools', name: 'DevTools', icon: '🛠️' },
      { id: 'other', name: 'Other', icon: '📦' },
    ]
  },
})
