import BigNumber from 'bignumber.js'
import { expect } from 'chai'
import {
  cloneDeep,
  each,
} from 'lodash'

import { PARSED_BALANCES } from '../../../../../../test/fixtures/parsedBalances'
import { PARSED_MARKETS } from '../../../../../../test/fixtures/parsedMarkets'
import { mockGet } from '../../../../../../test/mocks/exchange/modules/mockGet'
import { mockGetLeverage } from '../../../../../../test/mocks/exchange/modules/mockGetLeverage'
import { mockList } from '../../../../../../test/mocks/exchange/modules/mockList'
import { IAlunaBalanceSchema } from '../../../../../lib/schemas/IAlunaBalanceSchema'
import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { mockTranslateSymbolId } from '../../../../../utils/mappings/translateSymbolId.mock'
import { BitmexAuthed } from '../../../BitmexAuthed'
import { BitmexHttp } from '../../../BitmexHttp'
import * as getMod from '../../public/market/get'
import * as getLeverageMod from '../position/getLeverage'
import * as listMod from './list'



describe(__filename, () => {

  const credentials: IAlunaCredentialsSchema = {
    key: 'key',
    secret: 'secret',
  }

  const testCasesParams = [
    ['(W/ LEVERAGE)', 10],
    ['(W/O LEVERAGE)', 0],
  ]

  each(testCasesParams, (params) => {

    const [testCase, leverage] = params

    it(`should get Bitmex tradable balance just fine ${testCase}`, async () => {

      // preparing data
      const market = PARSED_MARKETS[0]
      const symbolPair = 'XBTUSD'
      const translatedCurrency = 'BTC'
      const availableBalance = 20

      const parsedBalances = cloneDeep(PARSED_BALANCES)
      parsedBalances[0].symbolId = translatedCurrency
      parsedBalances[0].available = availableBalance


      // mocking
      const { get } = mockGet({ module: getMod })
      get.returns(Promise.resolve({ market }))

      const { translateSymbolId } = mockTranslateSymbolId()
      translateSymbolId.returns(translatedCurrency)

      const { list } = mockList({ module: listMod })
      list.returns(Promise.resolve({ balances: parsedBalances }))

      const { getLeverage } = mockGetLeverage({ module: getLeverageMod })
      getLeverage.returns(Promise.resolve({ leverage }))


      // executing
      const exchange = new BitmexAuthed({ credentials })

      const {
        tradableBalance,
      } = await exchange.balance.getTradableBalance!({ symbolPair })


      // validating
      const expectedTradable = new BigNumber(availableBalance)
        .times(leverage || 1)
        .toNumber()

      expect(tradableBalance).to.be.eq(expectedTradable)

      expect(get.callCount).to.be.eq(1)
      expect(get.firstCall.args[0]).to.deep.eq({
        symbolPair,
      })

      expect(translateSymbolId.callCount).to.be.eq(1)
      expect(translateSymbolId.firstCall.args[0]).to.deep.eq({
        exchangeSymbolId: market.instrument!.totalSymbolId,
        symbolMappings: exchange.settings.symbolMappings,
      })

      expect(list.callCount).to.be.eq(1)

      expect(getLeverage.callCount).to.be.eq(1)
      expect(getLeverage.firstCall.args[0]).to.deep.eq({
        symbolPair,
        http: new BitmexHttp({}),
      })

    })

  })

  it('should return 0 if no balance was found for the given asset', async () => {

    // preparing data
    const market = PARSED_MARKETS[0]
    const symbolPair = 'XBTUSD'
    const translatedCurrency = 'BTC'

    const parsedBalances: IAlunaBalanceSchema[] = []


    // mocking
    const { get } = mockGet({ module: getMod })
    get.returns(Promise.resolve({ market }))

    const { translateSymbolId } = mockTranslateSymbolId()
    translateSymbolId.returns(translatedCurrency)

    const { list } = mockList({ module: listMod })
    list.returns(Promise.resolve({ balances: parsedBalances }))

    const { getLeverage } = mockGetLeverage({ module: getLeverageMod })


    // executing
    const exchange = new BitmexAuthed({ credentials })

    const {
      tradableBalance,
    } = await exchange.balance.getTradableBalance!({ symbolPair })


    // validating
    expect(tradableBalance).to.be.eq(0)

    expect(get.callCount).to.be.eq(1)
    expect(get.firstCall.args[0]).to.deep.eq({
      symbolPair,
    })

    expect(translateSymbolId.callCount).to.be.eq(1)
    expect(translateSymbolId.firstCall.args[0]).to.deep.eq({
      exchangeSymbolId: market.instrument!.totalSymbolId,
      symbolMappings: exchange.settings.symbolMappings,
    })

    expect(list.callCount).to.be.eq(1)

    expect(getLeverage.callCount).to.be.eq(0)

  })

})
