import { randomBytes } from 'crypto'
import open from 'open'

import { Config } from './config'

// for DI
interface Browser {
  open(url: URL): Promise<void>
}

const realBrowser = {
  async open(url: URL) {
    await open(url.toString())
  }
}

export const openBrowser = async (config: Config, browser: Browser = realBrowser) => {
  const state = randomBytes(32).toString('hex')
  const url = config.authorizeUrl()
  const params = new URLSearchParams({
    allow_signup: 'false',
    client_id: config.clientId,
    redirect_uri: config.redirectUri().toString(),
    scope: config.scope,
    state
  })
  url.search = params.toString()
  if (config.verbose) {
    console.log(`Accessing GitHub to authenticate. If the browser does not open automaticcaly, copy this URL below to the browser.
${url}`)
  }
  await browser.open(url)
  return state
}
