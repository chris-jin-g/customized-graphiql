import { makeExecutableSchema } from "graphql-tools"
import { merge } from "lodash"

import mocks from "./mocks"
import resolvers from "./resolvers"
import typeDefs from "./typeDefs"

export const mockSchema = makeExecutableSchema({
  // graphql-tools' addMockFunctionsToSchema is worthless,
  // as it doesn't override resolvers with mocks.
  // _.merge does, though!
  resolvers: merge({}, resolvers, mocks),
  typeDefs
})

export default makeExecutableSchema({
  resolvers,
  typeDefs
})
