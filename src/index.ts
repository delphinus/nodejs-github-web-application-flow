import { Config, WebAppFlowOptions } from './config'
import { getCode } from './get_code'
import { getToken } from './get_token'
import { openBrowser } from './open_browser'

/**
 * webAppFlow starts the Web Application Flow
 */
export const webAppFlow = async (options: WebAppFlowOptions) => {
  const config = new Config(options)
  const state = await openBrowser(config)
  const code = await getCode(config, state)
  return getToken(config, state, code)
}
