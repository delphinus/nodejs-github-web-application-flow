import { AgentByProtocol } from 'got'
import http from 'http'
import https from 'https'

/**
 * GotAgent is the type of GotOptions.agent.
 */
type GotAgent = http.Agent | https.Agent | boolean | AgentByProtocol

/**
 * WebAppFlowOptions is used to initialize the main func: webAppFlow().
 */
export interface WebAppFlowOptions {
  /**
   * clientId of the App you set on GitHub.
   */
  clientId: string
  /**
   * clientSecret of the App you set on GitHub.
   */
  clientSecret: string
  /**
   * name is the name of this application. (default: 'My App')
   */
  name?: string
  /**
   * agent is an instance like http.Agent. By this, you can use a
   * http/https/socks proxy to exchange an Authorization Code to an access
   * token.
   */
  agent?: GotAgent
  /**
   * baseUrl is the base URL of GitHub API v3. You should set this for GitHub
   * Enterprise. (ex. https://github.example.com/api/v3) (default:
   * 'https://github.com')
   */
  baseUrl?: string
  /**
   * port is used for a server in local to obtain the Authorization Code from
   * requests from GitHub. (default: 8080)
   */
  port?: number
  /**
   * scope is a space-separated value that represents scopes you want to give
   * to access tokens. (default: "repo user")
   */
  scope?: string
  /**
   * verbose means it shows the URL to open with messages. If false, it works
   * silently. (default: true)
   */
  verbose?: boolean
}

export class Config {
  clientId: string
  clientSecret: string
  agent: GotAgent | undefined = undefined
  name = 'My App'
  baseUrl = new URL('https://github.com')
  port = 8080
  scope = 'repo user'
  verbose = true

  constructor(options: WebAppFlowOptions) {
    this.clientId = options.clientId
    this.clientSecret = options.clientSecret
    this.agent = options.agent
    if (options.name) {
      this.name = options.name
    }
    if (options.baseUrl) {
      this.baseUrl = new URL(options.baseUrl)
    }
    if (options.port) {
      this.port = options.port
    }
    if (options.scope) {
      this.scope = options.scope
    }
    if (options.verbose) {
      this.verbose = options.verbose
    }
  }

  authorizeUrl() {
    return new URL('/login/oauth/authorize', this.baseUrl)
  }

  accessTokenUrl() {
    return new URL('/login/oauth/access_token', this.baseUrl)
  }

  redirectUri() {
    return new URL(`http://localhost:${this.port}`)
  }

  toJSON() {
    return {
      clientId: this.clientId,
      clientSecret: '[censored]',
      name: this.name,
      baseUrl: this.baseUrl,
      port: this.port,
      scope: this.scope
    }
  }
}
