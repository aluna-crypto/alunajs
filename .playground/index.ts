import compression from 'compression'
import express, { Request, Response } from 'express'

import { aluna } from '../src/aluna'



export function main() {

  const port = 9000

  const app = express()

  app.use(express.urlencoded({ extended: false }))
  app.use(express.json())

  app.use(compression({ level: 9 }))

  app.use(catchAll)

  app.listen(port)

  console.info('Playground running at:', port)

}



export const catchAll = async (req: Request, res: Response) => {

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

    let exchange = aluna(exchangeId)

    if (key && secret) {
      exchange = await exchange.auth({ key, secret, passphrase })
    }

    const response = await exchange[scope][method](params)

    console.info(response)

    res.status(200).json(response)

  } catch (error) {
    res.status(200).json(error)
  }

}

main()
