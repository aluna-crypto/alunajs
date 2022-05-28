import { expect } from 'chai'

import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { FtxAuthed } from '../../../FtxAuthed'
import { FtxHttp } from '../../../FtxHttp'
import {
  FTX_RAW_ORDERS,
  FTX_TRIGGER_RAW_ORDERS,
} from '../../../test/fixtures/ftxOrders'
import { mockGetFtxOrdinaryOrder } from './helpers/getFtxOrdinaryOrder.mock'
import { mockGetFtxTriggerOrder } from './helpers/getFtxTriggerOrder.mock'



describe(__filename, () => {

  const credentials: IAlunaCredentialsSchema = {
    key: 'key',
    secret: 'secret',
  }

  it('should get a Ftx ordinary raw order just fine', async () => {

    // preparing data
    const mockedOrdinaryOrder = FTX_RAW_ORDERS[0]
    const mockedTriggerOrders = FTX_TRIGGER_RAW_ORDERS

    const {
      id,
      market,
    } = mockedOrdinaryOrder


    // mocking
    const { getFtxOrdinaryOrder } = mockGetFtxOrdinaryOrder()
    const { getFtxTriggerOrder } = mockGetFtxTriggerOrder()

    getFtxOrdinaryOrder.returns(Promise.resolve(mockedOrdinaryOrder))
    getFtxTriggerOrder.returns(Promise.resolve(mockedTriggerOrders))


    // executing
    const exchange = new FtxAuthed({ credentials })

    const { rawOrder } = await exchange.order.getRaw({
      id: id.toString(),
      symbolPair: market,
    })


    // validating
    expect(rawOrder).to.deep.eq(mockedOrdinaryOrder)

    expect(getFtxOrdinaryOrder.callCount).to.be.eq(1)
    expect(getFtxOrdinaryOrder.firstCall.args[0]).to.deep.eq({
      exchange,
      http: new FtxHttp({}),
      id: id.toString(),
    })

    expect(getFtxTriggerOrder.callCount).to.be.eq(0)

  })

  it('should get a Ftx trigger raw order just fine', async () => {

    // preparing data
    const mockedTriggerOrder = FTX_TRIGGER_RAW_ORDERS[0]

    const {
      id,
      market,
    } = mockedTriggerOrder


    // mocking
    const { getFtxOrdinaryOrder } = mockGetFtxOrdinaryOrder()
    const { getFtxTriggerOrder } = mockGetFtxTriggerOrder()

    getFtxOrdinaryOrder.returns(Promise.resolve())
    getFtxTriggerOrder.returns(Promise.resolve(mockedTriggerOrder))


    // executing
    const exchange = new FtxAuthed({ credentials })

    const { rawOrder } = await exchange.order.getRaw({
      id: id.toString(),
      symbolPair: market,
    })


    // validating
    expect(rawOrder).to.deep.eq(mockedTriggerOrder)

    expect(getFtxOrdinaryOrder.callCount).to.be.eq(1)
    expect(getFtxOrdinaryOrder.firstCall.args[0]).to.deep.eq({
      exchange,
      http: new FtxHttp({}),
      id: id.toString(),
    })

    expect(getFtxTriggerOrder.callCount).to.be.eq(1)
    expect(getFtxTriggerOrder.firstCall.args[0]).to.deep.eq({
      exchange,
      http: new FtxHttp({}),
      id: id.toString(),
      symbolPair: market,
    })

  })

})
