import { Fragment } from "react"
import Head from "next/head"
import dynamic from "next/dynamic"

// GraphiQL cannot be rendered on the server (because of `window`),
// So lazy-load it...
const DynamicGraphiQL = dynamic(import("../../components/CustomGraphiQL"), {
  ssr: false
})

// Next.js (or it's plugins) don't work well with:
// `import "graphiql/graphiql.css"`
// So, it's easier to use the CDN version for this release.
const graphiqlVersion = require("graphiql/package.json").version

// We're largely replicating:
// > https://github.com/graphql/express-graphql/blob/master/src/renderGraphiQL.js
export default () => (
  <Fragment>
    <Head>
      <link
        href={`//cdn.jsdelivr.net/npm/graphiql@${graphiqlVersion}/graphiql.css`}
        rel="stylesheet"
      />
      <style>
        {`
          body {
            margin: 0;
            overflow: hidden;
          }

          #__next {
            height: 100vh;
          }
      `}
      </style>
    </Head>

    <DynamicGraphiQL />
  </Fragment>
)
