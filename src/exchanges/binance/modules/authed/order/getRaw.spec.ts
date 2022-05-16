import { expect } from 'chai'

import { mockHttp } from '../../../../../../test/mocks/exchange/Http'
import { mockListRaw } from '../../../../../../test/mocks/exchange/modules/mockListRaw'
import { AlunaHttpVerbEnum } from '../../../../../lib/enums/AlunaHtttpVerbEnum'
import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { BinanceAuthed } from '../../../BinanceAuthed'
import { BinanceHttp } from '../../../BinanceHttp'
import { getBinanceEndpoints } from '../../../binanceSpecs'
import { BINANCE_RAW_ORDERS } from '../../../test/fixtures/binanceOrders'
import { BINANCE_RAW_SYMBOLS } from '../../../test/fixtures/binanceSymbols'
import * as listRawMod from '../../public/symbol/listRaw'



describe(__filename, () => {

  const credentials: IAlunaCredentialsSchema = {
    key: 'key',
    secret: 'secret',
  }

  it('should get a Binance raw order just fine', async () => {

    // preparing data
    const mockedRawOrder = BINANCE_RAW_ORDERS[0]
    const mockedRawSymbol = BINANCE_RAW_SYMBOLS[0]

    const { orderId, symbol } = mockedRawOrder

    const id = orderId.toString()
    const symbolPair = symbol

    const query = new URLSearchParams()

    query.append('orderId', id)
    query.append('symbol', symbolPair)

    // mocking
    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: BinanceHttp.prototype })

    const { listRaw } = mockListRaw({ module: listRawMod })

    listRaw.returns(Promise.resolve({ rawSymbols: [mockedRawSymbol] }))

    authedRequest.returns(Promise.resolve(mockedRawOrder))

    // executing
    const exchange = new BinanceAuthed({ credentials })

    const { rawOrder } = await exchange.order.getRaw({
      id,
      symbolPair,
    })


    // validating
    expect(rawOrder).to.deep.eq({
      rawOrder: mockedRawOrder,
      rawSymbol: mockedRawSymbol,
    })

    expect(authedRequest.callCount).to.be.eq(1)

    expect(authedRequest.firstCall.args[0]).to.deep.eq({
      verb: AlunaHttpVerbEnum.GET,
      credentials,
      query: `&${query.toString()}`,
      url: getBinanceEndpoints(exchange.settings).order.get,
      weight: 2,
    })

    expect(publicRequest.callCount).to.be.eq(0)

  })

})
