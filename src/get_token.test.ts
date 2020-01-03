import express from 'express'

import { Config } from './config'
import { getToken, isValidScope } from './get_token'

describe('getToken', () => {
  describe('when it meets the timeout', () => {
    const config = new Config({
      clientId: 'fooClientId',
      clientSecret: 'fooClientSecret',
      baseUrl: 'http://localhost:9080',
      tokenTimeout: 10
    })

    it('throws an error', async () => {
      const github = express()
        .post(/.*/, async (_, res) => {
          await new Promise((resolve) => setTimeout(resolve, 200))
          res.status(200).json({})
        })
        .listen(9080)
      expect.assertions(1)
      await expect(getToken(config, 'fooState', 'fooCode')).rejects.toThrowError(
        /timeout of \d+ms exceeded/
      )
      github.close()
    })
  })

  describe('when it does not meet the timeout', () => {
    const config = new Config({
      clientId: 'fooClientId',
      clientSecret: 'fooClientSecret',
      baseUrl: 'http://localhost:9080'
    })

    describe('when GitHub returns an error response', () => {
      it('throws an error', async () => {
        const github = express()
          .post(/.*/, (_, res) =>
            res.status(200).json({
              error: 'fooError',
              error_description: 'fooDescription',
              error_uri: 'http://example.com'
            })
          )
          .listen(9080)
        expect.assertions(1)
        await expect(getToken(config, 'fooState', 'fooCode')).rejects.toThrowError(
          /error from GitHub/
        )
        github.close()
      })
    })

    describe('when GitHub returns an invalid struct', () => {
      it('throws an error', async () => {
        const github = express()
          .post(/.*/, (_, res) =>
            res.status(200).json({
              foo: 'bar'
            })
          )
          .listen(9080)
        expect.assertions(1)
        await expect(getToken(config, 'fooState', 'fooCode')).rejects.toThrowError(
          /response body corrupted/
        )
        github.close()
      })
    })

    describe('when GitHub returns a valid response', () => {
      describe('when GitHub returns with lesser scopes', () => {
        it('throws an error', async () => {
          const github = express()
            .post(/.*/, (_, res) =>
              res.status(200).json({
                access_token: 'fooAccessToken',
                scope: 'repo',
                token_type: 'Bearer'
              })
            )
            .listen(9080)
          expect.assertions(1)
          await expect(getToken(config, 'fooState', 'fooCode')).rejects.toThrowError(
            /invalid scope:/
          )
          github.close()
        })
      })

      describe('when GitHub returns with enough scopes', () => {
        it('returns the Access Token', async () => {
          const github = express()
            .post(/.*/, (_, res) =>
              res.status(200).json({
                access_token: 'fooAccessToken',
                scope: 'repo,user',
                token_type: 'Bearer'
              })
            )
            .listen(9080)
          expect.assertions(1)
          await expect(getToken(config, 'fooState', 'fooCode')).resolves.toBe('fooAccessToken')
          github.close()
        })
      })
    })
  })
})

interface IsValidScopeArgs {
  expected: string
  actual: string
  result: boolean
}

describe('isValidScope', () => {
  describe.each`
    expected       | actual              | result
    ${'repo'}      | ${''}               | ${false}
    ${'repo'}      | ${'user'}           | ${false}
    ${'repo'}      | ${'repo'}           | ${true}
    ${'repo'}      | ${'repo,user'}      | ${true}
    ${'repo user'} | ${''}               | ${false}
    ${'repo user'} | ${'repo user'}      | ${false}
    ${'repo user'} | ${'repo'}           | ${false}
    ${'repo user'} | ${'repo,user'}      | ${true}
    ${'repo user'} | ${'repo,user,gist'} | ${true}
  `('expected: $expected, actual: $actual', ({ expected, actual, result }: IsValidScopeArgs) => {
    it('returns ${result}', () => {
      const config = new Config({
        clientId: 'fooClientId',
        clientSecret: 'fooClientSecret',
        scope: expected
      })
      expect.assertions(1)
      expect(isValidScope(config, actual)).toBe(result)
    })
  })
})
