import { expect } from 'chai'
import { clone } from 'lodash'

import { mockListRaw } from '../../../../../../test/mocks/exchange/modules/mockListRaw'
import { AlunaMarketErrorCodes } from '../../../../../lib/errors/AlunaMarketErrorCodes'
import { executeAndCatch } from '../../../../../utils/executeAndCatch'
import { Huobi } from '../../../Huobi'
import { HuobiHttp } from '../../../HuobiHttp'
import { IHuobiMarketsSchema } from '../../../schemas/IHuobiMarketSchema'
import { HUOBI_RAW_MARKETS } from '../../../test/fixtures/huobiMarket'
import { HUOBI_RAW_SYMBOLS } from '../../../test/fixtures/huobiSymbols'
import * as listRawMod from './listRaw'



describe(__filename, () => {

  it('should get Huobi raw market just fine', async () => {

    // preparing data
    const symbolPair = 'btcusdt'

    const huobiMarket = {
      ...clone(HUOBI_RAW_MARKETS[0]),
      symbol: symbolPair,
    }
    const rawSymbol = {
      ...clone(HUOBI_RAW_SYMBOLS[0]),
      symbol: symbolPair,
    }

    const rawMarkets: IHuobiMarketsSchema = {
      huobiMarkets: [huobiMarket],
      rawSymbols: [rawSymbol],
    }


    // mocking
    const { listRaw } = mockListRaw({ module: listRawMod })
    listRaw.returns(Promise.resolve({
      rawMarkets,
    }))


    // executing
    const exchange = new Huobi({})

    const {
      rawMarket,
      requestWeight,
    } = await exchange.market.getRaw!({
      symbolPair,
    })


    // validating
    expect(rawMarket).to.deep.eq({
      huobiMarket,
      rawSymbol,
    })

    expect(listRaw.callCount).to.be.eq(1)
    expect(listRaw.firstCall.args[0]).to.deep.eq({
      http: new HuobiHttp({}),
    })

    expect(requestWeight).to.be.ok

  })

  it('should ensure Huobi market is found for given symbol pair', async () => {

    // preparing data
    const symbolPair = 'btcusdt'

    const huobiMarket = {
      ...clone(HUOBI_RAW_MARKETS[0]),
      symbol: '',
    }
    const rawSymbol = {
      ...clone(HUOBI_RAW_SYMBOLS[0]),
      symbol: symbolPair,
    }

    const rawMarkets: IHuobiMarketsSchema = {
      huobiMarkets: [huobiMarket],
      rawSymbols: [rawSymbol],
    }


    // mocking
    const { listRaw } = mockListRaw({ module: listRawMod })
    listRaw.returns(Promise.resolve({
      rawMarkets,
    }))


    // executing
    const exchange = new Huobi({})

    const {
      error,
      result,
    } = await executeAndCatch(() => exchange.market.getRaw!({
      symbolPair,
    }))


    // validating
    expect(result).not.to.be.ok

    expect(error!.code).to.be.eq(AlunaMarketErrorCodes.NOT_FOUND)
    expect(error!.message).to.be.eq(`Market not found for '${symbolPair}'.`)
    expect(error!.httpStatusCode).to.be.eq(200)

    expect(listRaw.callCount).to.be.eq(1)
    expect(listRaw.firstCall.args[0]).to.deep.eq({
      http: new HuobiHttp({}),
    })

  })

  it('should ensure Huobi symbol is found for given symbol pair', async () => {

    // preparing data
    const symbolPair = 'btcusdt'

    const huobiMarket = {
      ...clone(HUOBI_RAW_MARKETS[0]),
      symbol: symbolPair,
    }
    const rawSymbol = {
      ...clone(HUOBI_RAW_SYMBOLS[0]),
      symbol: '',
    }

    const rawMarkets: IHuobiMarketsSchema = {
      huobiMarkets: [huobiMarket],
      rawSymbols: [rawSymbol],
    }


    // mocking
    const { listRaw } = mockListRaw({ module: listRawMod })
    listRaw.returns(Promise.resolve({
      rawMarkets,
    }))


    // executing
    const exchange = new Huobi({})

    const {
      error,
      result,
    } = await executeAndCatch(() => exchange.market.getRaw!({
      symbolPair,
    }))


    // validating
    expect(result).not.to.be.ok

    expect(error!.code).to.be.eq(AlunaMarketErrorCodes.NOT_FOUND)
    expect(error!.message).to.be.eq(`Market not found for '${symbolPair}'.`)
    expect(error!.httpStatusCode).to.be.eq(200)

    expect(listRaw.callCount).to.be.eq(1)
    expect(listRaw.firstCall.args[0]).to.deep.eq({
      http: new HuobiHttp({}),
    })

  })

})
