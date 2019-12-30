import express from 'express'
import { Server } from 'http'

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
  let server: Server
  return new Promise<string>((resolve, reject) => {
    server = express()
      .set('view engine', 'pug')
      .get(/.*/, (req, res): void => {
        const params = req.query
        if (isErrorResponse(params)) {
          res.status(400).render('error', { ...params, ...config.toJSON() })
          reject(new Error(`error from GitHub: ${params.error_description}`))
        } else if (!isCodeParams(params)) {
          const error = 'invalid params for GitHub'
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
  }).finally(() => server.close())
}