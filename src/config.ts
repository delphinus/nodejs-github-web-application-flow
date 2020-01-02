/**
 * WebAppFlowOptions is used to initialize the main func: webAppFlow().
 */
export interface WebAppFlowOptions {
  /**
   * Client ID of the App you set on GitHub.
   */
  clientId: string
  /**
   * Client Secret of the App you set on GitHub.
   */
  clientSecret: string
  /**
   * The name of this application. (default: 'My App')
   */
  name?: string
  /**
   * The base URL of GitHub API v3. You should set this for GitHub Enterprise.
   * (ex. 'https://github.example.com') (default: 'https://github.com')
   */
  baseUrl?: string
  /**
   * A port number used for a server in local to obtain the Authorization Code
   * for requests from GitHub. (default: 8080)
   */
  port?: number
  /**
   * A space-separated value that represents scopes you want to give to access
   * tokens. (default: "repo user")
   */
  scope?: string
  /**
   * A timeout to wait for getting an Authorization Code from GitHub. This
   * includes the user's interaction (sign-in, authentication, etc.), and so
   * takes a bit long. (default: 600000 (= 10 minutes))
   */
  codeTimeout?: number
  /**
   * Show logs verbosely. For example, it shows the URL to open with messages.
   * If false, it works silently. (default: true)
   */
  verbose?: boolean
  /**
   * An instance like https.Agent. This is the same as the option in
   * AxiosRequestConfig. By this, you can use a http/https/socks proxy to
   * exchange an Authorization Code to an access token (see examples in
   * examples/ dir or README).
   */
  httpsAgent?: any
}

export class Config {
  clientId: string
  clientSecret: string
  httpsAgent: any
  name = 'My App'
  baseUrl = new URL('https://github.com')
  port = 8080
  scope = 'repo user'
  verbose = true
  codeTimeout = 600000

  constructor(options: WebAppFlowOptions) {
    this.clientId = options.clientId
    this.clientSecret = options.clientSecret
    this.httpsAgent = options.httpsAgent
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
    if (options.codeTimeout) {
      this.codeTimeout = options.codeTimeout
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
