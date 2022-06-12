import sleep from 'sleep-promise'

import { aluna } from '../../../src/aluna'
import { IAlunaCredentialsSchema } from '../../../src/lib/schemas/IAlunaCredentialsSchema'
import { IAlunaSettingsSchema } from '../../../src/lib/schemas/IAlunaSettingsSchema'
import { getConfig } from '../configs'
import { balance } from './authed/balance'
import { key } from './authed/key'
import { order } from './authed/order'
import { position } from './authed/position'
import { IAuthedParams } from './IAuthedParams'
import { IPublicParams } from './IPublicParams'
import { market } from './public/market'
import { symbol } from './public/symbol'



export const testExchange = (exchangeId: string) => {

  /*
    Preparing the ground.
  */
  const { config } = getConfig()
  const { liveData } = config

  const exchangeConfigs = config.exchanges[exchangeId]

  const { delayBetweenTests } = exchangeConfigs

  const credentials: IAlunaCredentialsSchema = {
    key: exchangeConfigs.key as string,
    secret: exchangeConfigs.secret as string,
    passphrase: exchangeConfigs.passphrase,
  }

  const settings: IAlunaSettingsSchema = { disableCache: true }

  const exchangePublic = aluna(exchangeId, { settings })
  const exchangeAuthed = aluna(exchangeId, { credentials })



  /*
    Flexible per-exchange delay to smooth things out.
  */
  beforeEach(async () => sleep(delayBetweenTests))



  /*
    Sets up all test for public methods.
  */
  describe('/public', () => {

    const publicParams: IPublicParams = {
      liveData,
      exchangePublic,
      exchangeConfigs,
    }

    describe('symbol', () => symbol(publicParams))
    describe('market', () => market(publicParams))

  })



  /*
    Sets up all test for private methods.
  */
  describe('/authed', () => {

    const authedParams: IAuthedParams = {
      liveData,
      exchangeAuthed,
      exchangeConfigs,
    }

    describe('key', () => key(authedParams))
    describe('balance', () => balance(authedParams))
    describe('order', () => order(authedParams))

    // only if position module is enabled for a given exchange
    if (exchangeAuthed.position) {
      describe('position', () => position(authedParams))
    }

  })

}
