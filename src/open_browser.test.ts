import { Config } from './config'
import { openBrowser } from './open_browser'

describe('openBrowser', () => {
  it('opens valid URL', async () => {
    let opened = new URL('http://localhost')
    const fakeBrowser = {
      async open(url: URL) {
        opened = url
      }
    }
    const config = new Config({
      clientId: 'fooClientId',
      clientSecret: 'fooClientSecret'
    })
    expect.assertions(3)
    await expect(openBrowser(config, fakeBrowser)).resolves.not.toThrow()
    expect(opened.origin).toBe('https://github.com')
    expect(Object.fromEntries(opened.searchParams)).toEqual(
      expect.objectContaining({
        allow_signup: expect.any(String),
        client_id: expect.any(String),
        redirect_uri: expect.any(String),
        scope: expect.any(String),
        state: expect.any(String)
      })
    )
  })
})
