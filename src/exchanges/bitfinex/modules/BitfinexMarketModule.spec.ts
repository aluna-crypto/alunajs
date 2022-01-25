import { expect } from 'chai'
import { ImportMock } from 'ts-mock-imports'

import { BitfinexHttp } from '../BitfinexHttp'
import { BITFINEX_RAW_MARKETS } from '../test/fixtures/bitfinexMarkets'
import { BitfinexMarketModule } from './BitfinexMarketModule'



describe('BitfinexMarketModule', () => {

  it('should list Bitfinex raw markets just fine', async () => {

    const requestMock = ImportMock.mockFunction(
      BitfinexHttp,
      'publicRequest',
      Promise.resolve(BITFINEX_RAW_MARKETS),
    )

    const rawMarkets = await BitfinexMarketModule.listRaw()

    expect(rawMarkets.length).to.eq(BITFINEX_RAW_MARKETS.length)
    expect(rawMarkets).to.deep.eq(BITFINEX_RAW_MARKETS)

    expect(requestMock.callCount).to.be.eq(1)

  })

})
