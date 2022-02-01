import { expect } from 'chai'
import { ImportMock } from 'ts-mock-imports'

import {
  IAlunaExchange,
  IAlunaKeySecretSchema,
} from '../../..'
import { BitfinexHttp } from '../BitfinexHttp'
import { BITFINEX_RAW_ORDERS } from '../test/fixtures/bitfinexOrders'
import { BitfinexOrderReadModule } from './BitfinexOrderReadModule'



describe.only('BitfinexOrderReadModule', () => {

  const bitfinexOrderReadModule = BitfinexOrderReadModule.prototype

  const keySecret: IAlunaKeySecretSchema = {
    key: '',
    secret: '',
  }

  const mockKeySecret = () => {

    const exchangeMock = ImportMock.mockOther(
      bitfinexOrderReadModule,
      'exchange',
      { keySecret } as IAlunaExchange,
    )

    return { exchangeMock }

  }

  it('should list Bitfinex raw orders just fine', async () => {

    const { exchangeMock } = mockKeySecret()

    const requestMock = ImportMock.mockFunction(
      BitfinexHttp,
      'privateRequest',
      BITFINEX_RAW_ORDERS,
    )

    const rawOrders = await bitfinexOrderReadModule.listRaw()

    expect(rawOrders).to.deep.eq(BITFINEX_RAW_ORDERS)
    expect(requestMock.callCount).to.be.eq(1)
    expect(requestMock.calledWithExactly({
      url: 'https://api.bitfinex.com/v2/auth/r/orders',
      keySecret: exchangeMock.getValue().keySecret,
    })).to.be.ok

  })

})
