import express from "express"
import graphql from "express-graphql"
import next from "next"
import path from "path"

import schema, { mockSchema } from "./schema"

const pages = next({
  dev: process.env.NODE_ENV !== "production",
  dir: path.join(__dirname, "../client")
})

const server = express()

// Nothing to see here...
server.get("/", (req, res) => {
  res.redirect(302, "/graphiql")
  res.end()
})

server.post(
  "/graphql",
  graphql((req, res, graphqlParams) => {
    const context = {
      schema
    }

    if (req.query.schema === "mock") {
      context.schema = mockSchema
    }

    return context
  })
)

// Next.js is in charge!
server.use(pages.getRequestHandler())

// Don't listen until Next.js is ready...
pages.prepare().then(() =>
  server.listen(3000, () => {
    console.info(`🚀 Listening on http://localhost:3000/`)
  })
)
