export default `
  type Book {
    title: String
    author: String
  }

  type Query {
    version: String!
  }

  extend type Query {
    books: [Book]
  }
`
