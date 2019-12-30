#!/usr/bin/env npx ts-node
import chalk from 'chalk'

import { webAppFlow } from '../src/index'

const main = async () => {
  const clientId = process.env['CLIENT_ID']
  const clientSecret = process.env['CLIENT_SECRET']
  if (!clientId || !clientSecret) {
    throw new Error('CLIENT_ID & CLIENT_SECRET are needed')
  }
  return webAppFlow({
    clientId,
    clientSecret
  })
}
;(async () => {
  try {
    const token = await main()
    console.log(chalk.yellow`{bold A token is obtained:} ${token}`)
  } catch (e) {
    console.error(chalk.red(e))
    process.exit(1)
  }
})()
