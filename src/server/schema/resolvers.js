const { version } = require("../../../package.json")

export default {
  Query: {
    books() {
      return [
        {
          title: "Harry Potter and the Chamber of Secrets",
          author: "J.K. Rowling"
        },
        {
          title: "Jurassic Park",
          author: "Michael Crichton"
        }
      ]
    },

    version() {
      return version
    }
  }
}
