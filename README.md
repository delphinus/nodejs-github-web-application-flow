# github-web-application-flow

[![Build Status](https://travis-ci.com/delphinus/nodejs-github-web-application-flow.svg?branch=master)](https://travis-ci.com/delphinus/nodejs-github-web-application-flow)
[![Coverage Status](https://coveralls.io/repos/github/delphinus/nodejs-github-web-application-flow/badge.svg?branch=master)](https://coveralls.io/github/delphinus/nodejs-github-web-application-flow?branch=master)

Implementation for GitHub OAuth Web Application Flow

## What's this?

This is an implementation for [GitHub Authorizing OAuth Apps by Web Application Flow][waf]. This package is intended to use in CLI for users to authenticate GitHub OAuth Apps. You can get Access Tokens from GitHub with scopes you requested.

[waf]: https://developer.github.com/apps/building-oauth-apps/authorizing-oauth-apps/#web-application-flow

## How to install

1. Create a new GitHub OAuth App (see [this instruction][ti]).

2. Copy your Client ID & Client Secret from the App's setting (see [Developer applications][da]).

3. Install from npm.

   ```sh
   npm i -S github-web-application-flow
   ```

4. Setup scripts (see full examples in `examples/` dir).

   ```javascript
   const { webAppFlow } = require('github-web-application-flow')

   const accessToken = await webAppFlow({
     clientId: 'fooClientId',
     clientSecret: 'fooClientSecret'
   })

   console.log(`token got: ${accessToken}`)
   ```

[ti]: https://developer.github.com/apps/building-oauth-apps/
[da]: https://github.com/settings/developers

## Configuration

```typescript
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
   * A timeout to wait for getting an Access Token from GitHub. (default: 60000
   * (= 1 minutes))
   */
  tokenTimeout?: number
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
```

## Troubleshooting

### What about GitHub Enterprise?

You can use your own domain for GitHub Enterprise by the `baseUrl` option.

```javascript
const accessToken = await webAppFlow({
 clientId: 'fooClientId',
 clientSecret: 'fooClientSecret',
 baseUrl: 'github.your-domain.com'
})
```

### Can I access to the Internet with proxies?

You can use the `httpsAgent` option for this. Set agents for this such as [socks-proxy-agent][], [https-proxy-agent][], etc.

[socks-proxy-agent]: https://www.npmjs.com/package/socks-proxy-agent
[https-proxy-agent]: https://www.npmjs.com/package/https-proxy-agent

```javascript
const SocksProxyAgent = require('socks-proxy-agent')

const accessToken = await webAppFlow({
 clientId: 'fooClientId',
 clientSecret: 'fooClientSecret',
 httpsAgent: new SocksProxyAgent('socks://localhost:1080')
})
```

### others?

Issue at [GitHub repo][].

[GitHub repo]: https://github.com/delphinus/nodejs-github-web-application-flow/issues

## LICENSE

MIT License

## Authors

* JINNOUCHI Yasushi &lt;me@delphinus.dev&gt;
