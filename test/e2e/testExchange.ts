import sleep from 'sleep-promise'

import { aluna } from '../../src/aluna'
import { IAlunaCredentialsSchema } from '../../src/lib/schemas/IAlunaCredentialsSchema'
import { getConfig } from './configs'
import { balance } from './modules/authed/balance'
import { key } from './modules/authed/key'
import { order } from './modules/authed/order'
import { position } from './modules/authed/position'
import { market } from './modules/public/market'
import { symbol } from './modules/public/symbol'



export const testExchange = async (exchangeId: string) => {

  const {
    // liveData,
    config,
  } = getConfig()

  const exchangeConfig = config.exchanges[exchangeId]

  const { delayBetweenTests } = exchangeConfig

  const credentials: IAlunaCredentialsSchema = {
    key: exchangeConfig.key as string,
    secret: exchangeConfig.secret as string,
    passphrase: exchangeConfig.passphrase,
  }

  const publicExchange = aluna(exchangeId)
  const authedExchange = aluna(exchangeId, { credentials })


  beforeEach(async () => sleep(delayBetweenTests))



  describe('/public', () => {
    describe('symbol', () => symbol(publicExchange))
    describe('market', () => market(publicExchange))
  })

  describe('/authed', () => {
    describe('key', () => key(authedExchange))
    describe('balance', () => balance(authedExchange))
    describe('order', () => order(authedExchange))
    describe('position', () => position(authedExchange))
  })

}
