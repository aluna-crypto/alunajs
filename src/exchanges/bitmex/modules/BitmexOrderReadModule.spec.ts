import { expect } from 'chai'
import { ImportMock } from 'ts-mock-imports'

import { IAlunaExchange } from '../../../lib/core/IAlunaExchange'
import { AlunaHttpVerbEnum } from '../../../lib/enums/AlunaHtttpVerbEnum'
import { BitmexHttp } from '../BitmexHttp'
import {
  BITMEX_PARSED_ORDERS,
  BITMEX_RAW_ORDERS,
} from '../test/bitmexOrders'
import { BitmexOrderReadModule } from './BitmexOrderReadModule'



describe.only('BitmexOrderReadModule', () => {

  const bitmexOrderReadModule = BitmexOrderReadModule.prototype

  const mockExchange = () => {

    const exchangeMock = ImportMock.mockOther(
      bitmexOrderReadModule,
      'exchange',
      {
        keySecret: {
          key: '',
          secret: '',
        },
      } as IAlunaExchange,
    )

    return { exchangeMock }

  }

  it('should list Bitmex raw orders just fine', async () => {

    const { exchangeMock } = mockExchange()

    const requestMock = ImportMock.mockFunction(
      BitmexHttp,
      'privateRequest',
      Promise.resolve(BITMEX_RAW_ORDERS),
    )

    const rawBalances = await bitmexOrderReadModule.listRaw()

    expect(requestMock.callCount).to.be.eq(1)
    expect(requestMock.args[0][0]).to.deep.eq({
      verb: AlunaHttpVerbEnum.GET,
      url: 'https://bitmex.com/api/v1/order',
      keySecret: exchangeMock.getValue().keySecret,
      body: { filter: { open: true } },
    })

    expect(rawBalances.length).to.be.eq(BITMEX_RAW_ORDERS.length)
    expect(rawBalances).to.deep.eq(BITMEX_RAW_ORDERS)

  })



  it('should list Bitmex parsed orders just fine', async () => {

    const rawOrders = BITMEX_RAW_ORDERS

    const listRawMock = ImportMock.mockFunction(
      bitmexOrderReadModule,
      'listRaw',
      Promise.resolve(rawOrders),
    )

    const parseManyMock = ImportMock.mockFunction(
      bitmexOrderReadModule,
      'parseMany',
      BITMEX_PARSED_ORDERS,
    )

    const parsedOrders = await bitmexOrderReadModule.list()

    expect(listRawMock.callCount).to.be.eq(1)

    expect(parseManyMock.callCount).to.be.eq(1)
    expect(parseManyMock.args[0][0]).to.deep.eq({
      rawOrders,
    })

    expect(parsedOrders.length).to.be.eq(BITMEX_PARSED_ORDERS.length)

  })

})
