import { expect } from 'chai'
import { ImportMock } from 'ts-mock-imports'

import { BitfinexHttp } from '../BitfinexHttp'
import {
  BITFINEX_MARGIN_ENABLED_CURRENCIES,
  BITFINEX_RAW_TICKERS,
} from '../test/fixtures/bitfinexMarkets'
import { BITFINEX_CURRENCIES_SYMS } from '../test/fixtures/bitfinexSymbols'
import { BitfinexMarketModule } from './BitfinexMarketModule'



describe('BitfinexMarketModule', () => {

  it('should list Bitfinex raw markets just fine', async () => {

    const requestMock = ImportMock.mockFunction(
      BitfinexHttp,
      'publicRequest',
    )

    requestMock.onFirstCall().returns(Promise.resolve(BITFINEX_RAW_TICKERS))
    requestMock.onSecondCall().returns(Promise.resolve([
      BITFINEX_MARGIN_ENABLED_CURRENCIES,
      BITFINEX_CURRENCIES_SYMS,
    ]))

    const rawMarkets = await BitfinexMarketModule.listRaw()

    expect(rawMarkets.length).to.eq(3)

    expect(rawMarkets).to.deep.eq([
      BITFINEX_RAW_TICKERS,
      BITFINEX_MARGIN_ENABLED_CURRENCIES,
      BITFINEX_CURRENCIES_SYMS,
    ])

    expect(requestMock.calledWithExactly({
      url: 'https://api-pub.bitfinex.com/v2/tickers?symbols=ALL',
    }))

    const secondCallUrl = 'https://api-pub.bitfinex.com/v2/conf/'
      .concat('pub:list:pair:margin')
      .concat(',pub:map:currency:sym')

    expect(requestMock.calledWithExactly({
      url: secondCallUrl,
    }))

    expect(requestMock.callCount).to.be.eq(2)

  })

})
