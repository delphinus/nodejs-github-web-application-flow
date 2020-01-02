import axios from 'axios'
import express from 'express'

import { Config } from './config'
import { getCode } from './get_code'

const config = new Config({
  clientId: 'fooClientId',
  clientSecret: 'fooClientSecret'
})

describe('getCode', () => {
  describe('when already the port is used', () => {
    it('throws an error', async () => {
      let dummy: { close(): void } | undefined = undefined
      try {
        dummy = express().listen(config.port)
        expect.assertions(1)
        await expect(getCode(config, 'fooState')).rejects.toThrowError(/EADDRINUSE/)
      } finally {
        if (dummy) {
          dummy.close()
        }
      }
    })
  })

  describe('when the port is open', () => {
    describe('when GitHub has requested with an error', () => {
      it('returns 400: error from GitHub', async () => {
        expect.assertions(2)
        const err = getCode(config, 'fooState').catch((err) => err.toString())
        await expect(
          axios
            .get('http://localhost:8080', {
              params: {
                error: 'fooError',
                error_description: 'fooDescription',
                error_uri: 'http://example.com'
              }
            })
            .catch((err) => err.response.status)
        ).resolves.toBe(400)
        await expect(err).resolves.toMatch(/error from GitHub/)
      })
    })

    describe('when GitHub has requested with an invalid struct', () => {
      it('returns 400: invalid params from GitHub', async () => {
        expect.assertions(2)
        const err = getCode(config, 'fooState').catch((err) => err.toString())
        await expect(
          axios
            .get('http://localhost:8080', { params: { foo: 'bar' } })
            .catch((err) => err.response.status)
        ).resolves.toBe(400)
        await expect(err).resolves.toMatch(/invalid params from GitHub/)
      })
    })

    describe('when GitHub has requested with a different state from the requested one', () => {
      it('returns 400: invalid state', async () => {
        expect.assertions(2)
        const err = getCode(config, 'fooState').catch((err) => err.toString())
        await expect(
          axios
            .get('http://localhost:8080', { params: { state: 'barState', code: 'fooBar' } })
            .catch((err) => err.response.status)
        ).resolves.toBe(400)
        await expect(err).resolves.toMatch(/invalid state/)
      })
    })

    describe('when GitHub has requested validly', () => {
      it('returns 200', async () => {
        expect.assertions(2)
        const code = getCode(config, 'fooState')
        await expect(
          axios
            .get('http://localhost:8080', { params: { state: 'fooState', code: 'fooBar' } })
            .then((res) => res.status)
        ).resolves.toBe(200)
        await expect(code).resolves.toBe('fooBar')
      })
    })
  })
})
