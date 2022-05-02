import sleep from 'sleep-promise'

import { aluna } from '../../../src/aluna'
import { IAlunaCredentialsSchema } from '../../../src/lib/schemas/IAlunaCredentialsSchema'
import { getConfig } from '../configs'
import { balance } from './authed/balance'
import { key } from './authed/key'
import { order } from './authed/order'
import { position } from './authed/position'
import { market } from './public/market'
import { symbol } from './public/symbol'



export const testExchange = (exchangeId: string) => {

  /*
    Preparing the ground.
  */
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



  /*
    Flexible per-exchange delay to smooth things out.
  */
  beforeEach(async () => sleep(delayBetweenTests))



  /*
    Sets up all test for public methods.
  */
  describe('/public', () => {
    describe('symbol', () => symbol(publicExchange))
    describe('market', () => market(publicExchange))
  })



  /*
    Sets up all test for private methods.
  */
  describe('/authed', () => {
    describe('key', () => key(authedExchange))
    describe('balance', () => balance(authedExchange))
    describe('order', () => order(authedExchange))

    // only if position module is enabled for a given exchange
    if (authedExchange.position) {
      describe('position', () => position(authedExchange))
    }
  })



}
