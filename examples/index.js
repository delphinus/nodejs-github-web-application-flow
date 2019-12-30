#!/usr/bin/env node
const chalk = require('chalk')
const { webAppFlow } = require('github-web-application-flow')

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
    console.log(chalk`{yellow {bold A token is obtained:} ${token}}`)
  } catch (e) {
    console.error(chalk`{red ${e}}`)
    process.exit(1)
  }
})()
