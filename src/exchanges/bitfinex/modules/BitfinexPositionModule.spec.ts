import { expect } from 'chai'
import { ImportMock } from 'ts-mock-imports'

import {
  IAlunaExchange,
  IAlunaKeySecretSchema,
} from '../../..'
import { BitfinexHttp } from '../BitfinexHttp'
import { BITFINEX_RAW_POSITIONS } from '../test/fixtures/bitfinexPosition'
import { BitfinexPositionModule } from './BitfinexPositionModule'



describe('BitfinexPositionModule', () => {

  const bitfinexPositionModule = BitfinexPositionModule.prototype

  const keySecret: IAlunaKeySecretSchema = {
    key: '',
    secret: '',
  }

  const mockKeySecret = () => {

    const exchangeMock = ImportMock.mockOther(
      bitfinexPositionModule,
      'exchange',
      { keySecret } as IAlunaExchange,
    )

    return { exchangeMock }

  }

  it('should properly list Bitfinex raw positions', async () => {

    const { exchangeMock } = mockKeySecret()

    const requestMock = ImportMock.mockFunction(
      BitfinexHttp,
      'privateRequest',
      Promise.resolve(BITFINEX_RAW_POSITIONS),
    )

    const rawOrders = await bitfinexPositionModule.listRaw()

    expect(rawOrders).to.deep.eq(BITFINEX_RAW_POSITIONS)
    expect(requestMock.callCount).to.be.eq(1)
    expect(requestMock.calledWithExactly({
      url: 'https://api.bitfinex.com/v2/auth/r/positions',
      keySecret: exchangeMock.getValue().keySecret,
    })).to.be.ok

  })

})
