import { expect } from 'chai'

import { mockHttp } from '../../../../../../../test/mocks/exchange/Http'
import { AlunaHttpVerbEnum } from '../../../../../../lib/enums/AlunaHtttpVerbEnum'
import { AlunaOrderErrorCodes } from '../../../../../../lib/errors/AlunaOrderErrorCodes'
import { IAlunaCredentialsSchema } from '../../../../../../lib/schemas/IAlunaCredentialsSchema'
import { executeAndCatch } from '../../../../../../utils/executeAndCatch'
import { FtxAuthed } from '../../../../FtxAuthed'
import { FtxHttp } from '../../../../FtxHttp'
import { getFtxEndpoints } from '../../../../ftxSpecs'
import { FTX_RAW_ORDERS } from '../../../../test/fixtures/ftxOrders'
import { getFtxTriggerOrder } from './getFtxTriggerOrder'



describe(__filename, () => {

  const credentials: IAlunaCredentialsSchema = {
    key: 'key',
    secret: 'secret',
  }

  it('should get FTX trigger order just fine', async () => {

    // preparing data
    const mockedRawOrders = FTX_RAW_ORDERS
    const mockedRawOrder = mockedRawOrders[0]
    const {
      id,
      market,
    } = mockedRawOrder


    // mocking
    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: FtxHttp.prototype })
    authedRequest.returns(Promise.resolve(mockedRawOrders))


    // executing
    const exchange = new FtxAuthed({ credentials })

    const http = new FtxHttp({})

    const rawOrder = await getFtxTriggerOrder({
      symbolPair: market,
      id: id.toString(),
      exchange,
      http,
    })


    // validating
    expect(rawOrder).to.deep.eq(mockedRawOrder)

    expect(authedRequest.callCount).to.be.eq(1)

    expect(authedRequest.firstCall.args[0]).to.deep.eq({
      verb: AlunaHttpVerbEnum.GET,
      credentials,
      body: { market },
      url: getFtxEndpoints(exchange.settings).order.listTriggerOrdersHistory,
    })

    expect(publicRequest.callCount).to.be.eq(0)

  })

  it('should throw error if order is not found', async () => {

    // preparing data
    const mockedRawOrders = FTX_RAW_ORDERS

    const id = 'id'
    const symbolPair = 'BTC/USD'


    // mocking
    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: FtxHttp.prototype })
    authedRequest.returns(Promise.resolve(mockedRawOrders))


    // executing
    const exchange = new FtxAuthed({ credentials })

    const http = new FtxHttp({})

    const {
      error,
      result,
    } = await executeAndCatch(() => getFtxTriggerOrder({
      symbolPair,
      id: id.toString(),
      exchange,
      http,
    }))


    // validating
    expect(result).not.to.be.ok

    expect(error!.code).to.deep.eq(AlunaOrderErrorCodes.NOT_FOUND)
    expect(error!.message).to.deep.eq('Order not found')

    expect(authedRequest.callCount).to.be.eq(1)
    expect(authedRequest.firstCall.args[0]).to.deep.eq({
      verb: AlunaHttpVerbEnum.GET,
      credentials,
      body: { market: symbolPair },
      url: getFtxEndpoints(exchange.settings).order.listTriggerOrdersHistory,
    })

    expect(publicRequest.callCount).to.be.eq(0)

  })

})
