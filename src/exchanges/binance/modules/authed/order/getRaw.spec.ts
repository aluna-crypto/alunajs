import { expect } from 'chai'

import { mockHttp } from '../../../../../../test/mocks/exchange/Http'
import { mockListRaw } from '../../../../../../test/mocks/exchange/modules/mockListRaw'
import { AlunaAccountEnum } from '../../../../../lib/enums/AlunaAccountEnum'
import { AlunaHttpVerbEnum } from '../../../../../lib/enums/AlunaHtttpVerbEnum'
import { AlunaGenericErrorCodes } from '../../../../../lib/errors/AlunaGenericErrorCodes'
import { IAlunaOrderCancelParams } from '../../../../../lib/modules/authed/IAlunaOrderModule'
import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { executeAndCatch } from '../../../../../utils/executeAndCatch'
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

  it('should get a Binance raw order just fine (SPOT)', async () => {

    // preparing data
    const binanceOrder = BINANCE_RAW_ORDERS[0]
    const rawSymbol = BINANCE_RAW_SYMBOLS[0]

    const { orderId, symbol } = binanceOrder

    const params: IAlunaOrderCancelParams = {
      id: orderId.toString(),
      account: AlunaAccountEnum.SPOT,
      symbolPair: symbol,
    }

    const query = new URLSearchParams()
    query.append('orderId', params.id)
    query.append('symbol', params.symbolPair)



    // mocking
    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: BinanceHttp.prototype })
    authedRequest.returns(Promise.resolve(binanceOrder))

    const { listRaw } = mockListRaw({ module: listRawMod })
    listRaw.returns(Promise.resolve({ rawSymbols: [rawSymbol] }))


    // executing
    const exchange = new BinanceAuthed({ credentials })

    const { rawOrder } = await exchange.order.getRaw(params)


    // validating
    expect(rawOrder).to.deep.eq({
      binanceOrder,
      rawSymbol,
    })

    expect(authedRequest.callCount).to.be.eq(1)

    expect(authedRequest.firstCall.args[0]).to.deep.eq({
      verb: AlunaHttpVerbEnum.GET,
      credentials,
      query,
      url: getBinanceEndpoints(exchange.settings).order.spot,
      weight: 2,
    })

    expect(publicRequest.callCount).to.be.eq(0)

  })

  it('should get a Binance raw order just fine (MARGIN)', async () => {

    // preparing data
    const binanceOrder = BINANCE_RAW_ORDERS[0]
    const rawSymbol = BINANCE_RAW_SYMBOLS[0]

    const { orderId, symbol } = binanceOrder

    const params: IAlunaOrderCancelParams = {
      id: orderId.toString(),
      account: AlunaAccountEnum.MARGIN,
      symbolPair: symbol,
    }

    const query = new URLSearchParams()
    query.append('orderId', params.id)
    query.append('symbol', params.symbolPair)



    // mocking
    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: BinanceHttp.prototype })
    authedRequest.returns(Promise.resolve(binanceOrder))

    const { listRaw } = mockListRaw({ module: listRawMod })
    listRaw.returns(Promise.resolve({ rawSymbols: [rawSymbol] }))


    // executing
    const exchange = new BinanceAuthed({ credentials })

    const { rawOrder } = await exchange.order.getRaw(params)


    // validating
    expect(rawOrder).to.deep.eq({
      binanceOrder,
      rawSymbol,
    })

    expect(authedRequest.callCount).to.be.eq(1)

    expect(authedRequest.firstCall.args[0]).to.deep.eq({
      verb: AlunaHttpVerbEnum.GET,
      credentials,
      query,
      url: getBinanceEndpoints(exchange.settings).order.margin,
      weight: 10,
    })

    expect(publicRequest.callCount).to.be.eq(0)

  })

  it('should ensure order account is required to get a binance order', async () => {

    // preparing data
    const params: IAlunaOrderCancelParams = {
      id: 'id',
      symbolPair: 'symbolPair',
    }


    // mocking
    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: BinanceHttp.prototype })
    authedRequest.returns(Promise.resolve())


    // executing
    const exchange = new BinanceAuthed({ credentials })

    const { error } = await executeAndCatch(() => exchange.order.getRaw(params))


    // validating
    const msg = 'Order account is required to cancel Binance orders'

    expect(error!.code).to.deep.eq(AlunaGenericErrorCodes.PARAM_ERROR)
    expect(error!.message).to.deep.eq(msg)
    expect(error!.httpStatusCode).to.deep.eq(400)

    expect(authedRequest.callCount).to.be.eq(0)
    expect(publicRequest.callCount).to.be.eq(0)

  })

})
