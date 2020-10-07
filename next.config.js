const webpack = require("webpack")

module.exports = {
  webpack: (config) => {
    // Explicitly ignore `.flow` files because GraphiQL, for whatever
    // insane reason, ships `.flow` files that get picked up by Webpack
    // and Next.js
    //
    // > https://github.com/apollographql/apollo-client-devtools/pull/59/files
    config.plugins.push(new webpack.IgnorePlugin(/\.flow$/))

    return config
  }
}
