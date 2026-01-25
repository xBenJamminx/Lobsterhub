import { httpRouter } from 'convex/server'
import { httpAction } from './_generated/server'
import { api } from './_generated/api'

const http = httpRouter()

// GET /api/workflows - List all workflows
http.route({
  path: '/api/workflows',
  method: 'GET',
  handler: httpAction(async (ctx, request) => {
    const url = new URL(request.url)
    const category = url.searchParams.get('category') || undefined
    const limit = url.searchParams.get('limit')
      ? parseInt(url.searchParams.get('limit')!)
      : undefined

    const workflows = await ctx.runQuery(api.workflows.list, {
      category,
      limit,
    })

    return new Response(JSON.stringify(workflows), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    })
  }),
})

// GET /api/workflows/:slug - Get single workflow by slug
http.route({
  path: '/api/workflows/:slug',
  method: 'GET',
  handler: httpAction(async (ctx, request) => {
    const url = new URL(request.url)
    const slug = url.pathname.split('/').pop()!

    const workflow = await ctx.runQuery(api.workflows.getBySlug, { slug })

    if (!workflow) {
      return new Response(JSON.stringify({ error: 'Workflow not found' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      })
    }

    // Increment download count
    await ctx.runMutation(api.workflows.incrementDownloads, { slug })

    return new Response(JSON.stringify(workflow), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    })
  }),
})

// GET /api/search - Search workflows
http.route({
  path: '/api/search',
  method: 'GET',
  handler: httpAction(async (ctx, request) => {
    const url = new URL(request.url)
    const query = url.searchParams.get('q') || ''

    const workflows = await ctx.runQuery(api.workflows.search, { query })

    return new Response(JSON.stringify(workflows), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    })
  }),
})

// CORS preflight
http.route({
  path: '/api/workflows',
  method: 'OPTIONS',
  handler: httpAction(async () => {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    })
  }),
})

http.route({
  path: '/api/search',
  method: 'OPTIONS',
  handler: httpAction(async () => {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    })
  }),
})

export default http
