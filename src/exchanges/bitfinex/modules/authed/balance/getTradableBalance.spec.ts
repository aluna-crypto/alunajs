import { expect } from 'chai'
import {
  each,
  keys,
  omit,
} from 'lodash'

import { mockHttp } from '../../../../../../test/mocks/exchange/Http'
import { AlunaAccountEnum } from '../../../../../lib/enums/AlunaAccountEnum'
import { AlunaOrderSideEnum } from '../../../../../lib/enums/AlunaOrderSideEnum'
import { AlunaGenericErrorCodes } from '../../../../../lib/errors/AlunaGenericErrorCodes'
import { IAlunaBalanceGetTradableBalanceParams } from '../../../../../lib/modules/authed/IAlunaBalanceModule'
import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { IAlunaSettingsSchema } from '../../../../../lib/schemas/IAlunaSettingsSchema'
import { executeAndCatch } from '../../../../../utils/executeAndCatch'
import { BitfinexAuthed } from '../../../BitfinexAuthed'
import { BitfinexHttp } from '../../../BitfinexHttp'
import { getBitfinexEndpoints } from '../../../bitfinexSpecs'
import { translateToBitfinex } from '../../../enums/adapters/bitfinexAccountsAdapter'



describe(__filename, () => {

  const credentials: IAlunaCredentialsSchema = {
    key: 'key',
    secret: 'secret',
  }

  const params: IAlunaBalanceGetTradableBalanceParams = {
    rate: 50,
    side: AlunaOrderSideEnum.BUY,
    account: AlunaAccountEnum.SPOT,
    symbolPair: 'tBTCETH',
  }

  it('should get Bitfinex tradable balance just fine (BUY)', async () => {

    runTest({
      ...params,
      side: AlunaOrderSideEnum.BUY,
    })

  })

  it('should get Bitfinex tradable balance just fine (SELL)', async () => {

    runTest({
      ...params,
      side: AlunaOrderSideEnum.SELL,
    })

  })

  it('should ensure all params are required to get Bitfinex tradable balance', async () => {

    const getTradableBalanceKeys = keys(params)

    each(getTradableBalanceKeys, async (key) => {

      const {
        error,
        result,
      } = await executeAndCatch(() => runTest(omit(params, key) as any))

      expect(result).not.to.be.ok

      expect(error?.code).to.be.ok

      expect(error!.code).to.be.eq(AlunaGenericErrorCodes.PARAM_ERROR)
      expect(new RegExp(key).test(error!.message)).to.be.ok
      expect(error!.httpStatusCode).to.be.eq(400)

    })

  })



  const runTest = async (
    params: IAlunaBalanceGetTradableBalanceParams,
  ) => {

    // preparing data
    const mockedBalances = 50


    // mocking
    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: BitfinexHttp.prototype })

    authedRequest.returns(Promise.resolve([mockedBalances]))


    // executing
    const settings: IAlunaSettingsSchema = { affiliateCode: 'affiliateCode' }
    const exchange = new BitfinexAuthed({
      credentials,
      settings,
    })

    const { tradableBalance } = await exchange.balance.getTradableBalance!(params)


    // validating
    expect(tradableBalance).to.deep.eq(mockedBalances)

    const expectedTranslatedAccount = translateToBitfinex({
      from: params.account!,
    })

    const expectedDir = params.side === AlunaOrderSideEnum.BUY
      ? 1
      : -1

    expect(authedRequest.callCount).to.be.eq(1)
    expect(authedRequest.firstCall.args[0]).to.deep.eq({
      credentials,
      url: getBitfinexEndpoints(settings).balance.getTradableBalance,
      body: {
        dir: expectedDir,
        symbol: params.symbolPair,
        rate: params.rate!.toString(),
        type: expectedTranslatedAccount,
      },
    })

    expect(publicRequest.callCount).to.be.eq(0)

  }

})
