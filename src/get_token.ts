import got from 'got'

import { Config } from './config'
import { isErrorResponse } from './error'

interface AccessTokenResponse {
  access_token: string
  scope: string
  token_type: string
}

const isAccessTokenResponse = (body: any): body is AccessTokenResponse =>
  body !== null &&
  body !== undefined &&
  typeof body.access_token === 'string' &&
  typeof body.scope === 'string' &&
  typeof body.token_type === 'string'

export const getToken = async (config: Config, state: string, code: string) => {
  const body = new URLSearchParams({
    code,
    state,
    client_id: config.clientId,
    client_secret: config.clientSecret
  }).toString()
  const agentIfNeeded = typeof config.agent === 'undefined' ? {} : { agent: config.agent }
  const res = await got.post(config.accessTokenUrl(), {
    ...agentIfNeeded,
    body,
    headers: {
      Accept: 'application/json'
    },
    timeout: 60000
  })
  let obj: any
  try {
    obj = JSON.parse(res.body)
  } catch (e) {
    throw new Error(`response has invalid JSON strings: ${e}`)
  }
  if (isErrorResponse(obj)) {
    throw new Error(`error from GitHub:
  error: ${obj.error}
  error_description: ${obj.error_description}
  error_uri: ${obj.error_uri}`)
  }
  if (!isAccessTokenResponse(obj)) {
    throw new Error('response body corrupted')
  }
  if (!isValidScope(config, obj.scope)) {
    throw new Error(`invalid scope: expected => ${config.scope}, actual => ${obj.scope}`)
  }
  return obj.access_token
}

/**
 * isValidScope inspects the scope that satisfies the requested one. The
 * GitHub's spec says we should use a space-separated string (ex. 'repo user'),
 * but the received one should be a comma-separated one (ex. 'repo,user').
 */
const isValidScope = (config: Config, scope: string) => {
  const scopeSet = scope.split(',').reduce<Set<string>>((a, b) => {
    a.add(b)
    return a
  }, new Set())
  return config.scope.split(/\s+/).every((i) => scopeSet.has(i))
}
