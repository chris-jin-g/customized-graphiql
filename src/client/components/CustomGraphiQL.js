import { Component, Fragment } from "react"
import { parse, print } from "graphql"

import Head from "next/head"

import GraphiQL, {
  Group,
  Logo,
  Menu,
  MenuItem,
  Select,
  SelectOption,
  Toolbar
} from "graphiql"

import { pick, pickBy } from "lodash"

const { version } = require("../../../package.json")
const codemirrorVersion = require("codemirror/package.json").version

// `undefined` is prefered over `null`, so that GraphiQL uses `defaultQuery`
const defaultState = {
  editorTheme: undefined,
  query: undefined,
  schema: undefined,
  variables: undefined
}

const stateFromURL = Array.from(
  new URLSearchParams(window.location.search)
).reduce(
  (acc, [key, value]) => ({
    ...acc,
    [key]: value
  }),
  {}
)

export default class CustomGraphiQL extends Component {
  ref = React.createRef()

  state = {
    ...defaultState,
    // Restrict state to only known keys
    ...pick(stateFromURL, Object.keys(defaultState))
  }

  handleEditQuery = (query) => {
    if (!query) {
      query = undefined
    }

    this.setState({ query })
  }

  handleEditVariables = (variables) => {
    if (!variables) {
      variables = undefined
    }

    this.setState({ variables })
  }

  // Prefer GraphiQL for the values of { operationName, query, variables }
  handleFetch = async (graphQLParams) => {
    // Send our custom state values (e.g. schema) as `req.query`
    const { query, variables, ...rest } = this.state
    const searchParams = new URLSearchParams(pickBy(rest))
    const url = `${window.location.origin}/graphql?${searchParams.toString()}`

    const res = await fetch(url, {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      // Send graphQLParams as `req.body`
      body: JSON.stringify(graphQLParams)
    })

    const payload = await res.json()

    // 400s are returned if query/variables are invalid
    if (res.ok && query) {
      try {
        const formatted = print(parse(query))

        // Format successful queries ONLY if not already formatted.
        // (Otherwise this could create a constant update loop)
        if (query !== formatted) {
          this.setState({ query: formatted })
        }
      } catch (error) {}
    }

    return payload
  }

  // Reflect (truthy) state values in the URL for copy/paste/reload
  componentDidUpdate(prevProps, prevState) {
    const { editorTheme = "graphiql" } = this.state
    const queryString = new URLSearchParams(pickBy(this.state)).toString()

    // Update GraphiQL's editor window themes without reloading
    const graphiql = this.ref.current
    graphiql.queryEditorComponent.editor.setOption("theme", editorTheme)
    graphiql.resultComponent.viewer.setOption("theme", editorTheme)
    graphiql.variableEditorComponent.editor.setOption("theme", editorTheme)

    window.history.replaceState(
      null,
      null,
      // Erase window.location.search if there's no query
      queryString ? `?${queryString}` : window.location.pathname
    )
  }

  render() {
    const { editorTheme, query, schema, variables } = this.state

    return (
      <Fragment>
        <Head>
          <link
            href={`https://cdnjs.cloudflare.com/ajax/libs/codemirror/${codemirrorVersion}/theme/solarized.css`}
            rel="stylesheet"
          />
          <link
            href={`https://cdnjs.cloudflare.com/ajax/libs/codemirror/${codemirrorVersion}/theme/paraiso-dark.css`}
            rel="stylesheet"
          />
          <link
            href={`https://cdnjs.cloudflare.com/ajax/libs/codemirror/${codemirrorVersion}/theme/dracula.css`}
            rel="stylesheet"
          />
          <link
            href={`https://cdnjs.cloudflare.com/ajax/libs/codemirror/${codemirrorVersion}/theme/oceanic-next.css`}
            rel="stylesheet"
          />
        </Head>

        <GraphiQL
          editorTheme={editorTheme}
          fetcher={this.handleFetch}
          query={query}
          variables={variables}
          onEditQuery={this.handleEditQuery}
          onEditVariables={this.handleEditVariables}
          ref={this.ref}
        >
          <Logo>
            <a href="https://github.com/ericclemmons/customized-graphiql">
              Customized GraphiQL <small>v{version}</small>
            </a>
          </Logo>

          <Toolbar>
            <Group>
              <Select onSelect={(schema) => this.setState({ schema })}>
                <SelectOption
                  label="Default Schema"
                  selected={!schema}
                  value={null}
                />
                <SelectOption
                  label="Mock Schema"
                  selected={schema === "mock"}
                  value="mock"
                />
              </Select>
            </Group>

            <Select onSelect={(editorTheme) => this.setState({ editorTheme })}>
              <SelectOption
                label="Default Theme"
                selected={!editorTheme}
                value={undefined}
              />
              <SelectOption
                label="Dracula"
                selected={editorTheme === "dracula"}
                value="dracula"
              />
              <SelectOption
                label="Oceanic Next"
                selected={editorTheme === "oceanic-next"}
                value="oceanic-next"
              />
              <SelectOption
                label="Paraiso Dark"
                selected={editorTheme === "paraiso-dark"}
                value="paraiso-dark"
              />
              <SelectOption
                label="Solarized Dark"
                selected={editorTheme === "solarized dark"}
                value="solarized dark"
              />
              <SelectOption
                label="Solarized Light"
                selected={editorTheme === "solarized light"}
                value="solarized light"
              />
            </Select>
          </Toolbar>
        </GraphiQL>
      </Fragment>
    )
  }
}
