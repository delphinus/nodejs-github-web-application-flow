import express from 'express'
import path from 'path'

import { Config } from './config'
import { isErrorResponse } from './error'

interface CodeParams {
  code: string
  state: string
}

const isCodeParams = (params: any): params is CodeParams =>
  params !== null &&
  params !== undefined &&
  typeof params.code === 'string' &&
  typeof params.state === 'string'

export const getCode = (config: Config, state: string) => {
  let s = { close() {} }
  return Promise.race([
    new Promise<never>((_, reject) =>
      setTimeout(reject, config.codeTimeout, new Error('timeout to wait for user interaction'))
    ),
    new Promise<string>((resolve, reject) => {
      s = server(config, state, resolve, reject)
    })
  ]).finally(s.close.bind(s))
}

const server = (
  config: Config,
  state: string,
  resolve: (code: string) => void,
  reject: (err: Error) => void
) =>
  express()
    .set('view engine', 'pug')
    .set('views', path.resolve(__dirname, '../views'))
    .get(/.*/, (req, res): void => {
      const params = req.query
      if (isErrorResponse(params)) {
        res.status(400).render('error', { ...params, ...config.toJSON() })
        reject(new Error(`error from GitHub: ${params.error_description}`))
      } else if (!isCodeParams(params)) {
        const error = 'invalid params from GitHub'
        res.status(400).render('error', { error, ...config.toJSON() })
        reject(new Error(error))
      } else if (params.state !== state) {
        const error = 'invalid state'
        res.status(400).render('error', { error, ...config.toJSON() })
        reject(new Error(error))
      } else {
        res.status(200).render('ok', config.toJSON())
        resolve(params.code)
      }
    })
    .listen(config.port)
    .on('error', reject)
