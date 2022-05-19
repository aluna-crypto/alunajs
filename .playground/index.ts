import compression from 'compression'
import express, {
  Request,
  Response,
} from 'express'

import { aluna } from '../src/aluna'
import {
  IAlunaExchangeAuthed,
  IAlunaExchangePublic,
} from '../src/lib/core/IAlunaExchange'



export function main() {

  const port = 9090

  const app = express()

  app.use(express.urlencoded({ extended: false }))
  app.use(express.json())

  app.use(compression({ level: 9 }))

  app.get('/exchanges', handleExchangeCommands)
  app.get('/web3', handleWeb3Commands)

  app.listen(port)

  console.info('Playground running at:', port)

}



export const handleExchangeCommands = async (req: Request, res: Response) => {

  const {
    exchangeId,
    key,
    secret,
    passphrase,
    method: scopeMethod,
    ...params
  } = req.body

  const [scope, method] = scopeMethod.split('.')

  try {

    let exchange: IAlunaExchangePublic | IAlunaExchangeAuthed

    if (key && secret) {
      const credentials = { key, secret, passphrase }
      exchange = aluna(exchangeId, { credentials })
    } else {
      exchange = aluna(exchangeId)
    }

    const response = await exchange[scope][method](params)

    console.info(response)

    res.status(200).json(response)

  } catch (error) {
    res.status(200).json(error)
  }

}



export const handleWeb3Commands = async (req: Request, res: Response) => {

  const {
    method: scopeMethod,
    ...params
  } = req.body

  const [scope, method] = scopeMethod.split('.')

  try {

    const web3 = aluna.web3()

    const response = await web3[scope][method](params)

    console.info(response)

    res.status(200).json(response)

  } catch (error) {
    res.status(200).json(error)
  }

}



main()
