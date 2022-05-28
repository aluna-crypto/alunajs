import { expect } from 'chai'

import { mockHttp } from '../../../../../../../test/mocks/exchange/Http'
import { AlunaError } from '../../../../../../lib/core/AlunaError'
import { AlunaHttpVerbEnum } from '../../../../../../lib/enums/AlunaHtttpVerbEnum'
import { AlunaHttpErrorCodes } from '../../../../../../lib/errors/AlunaHttpErrorCodes'
import { IAlunaCredentialsSchema } from '../../../../../../lib/schemas/IAlunaCredentialsSchema'
import { executeAndCatch } from '../../../../../../utils/executeAndCatch'
import { FtxAuthed } from '../../../../FtxAuthed'
import { FtxHttp } from '../../../../FtxHttp'
import { getFtxEndpoints } from '../../../../ftxSpecs'
import { FTX_RAW_ORDERS } from '../../../../test/fixtures/ftxOrders'
import { getFtxOrdinaryOrder } from './getFtxOrdinaryOrder'



describe(__filename, () => {

  const credentials: IAlunaCredentialsSchema = {
    key: 'key',
    secret: 'secret',
  }

  it('should get FTX ordinary order just fine', async () => {

    // preparing data
    const mockedRawOrder = FTX_RAW_ORDERS[0]
    const { id } = mockedRawOrder


    // mocking
    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: FtxHttp.prototype })
    authedRequest.returns(Promise.resolve(mockedRawOrder))


    // executing
    const exchange = new FtxAuthed({ credentials })

    const http = new FtxHttp({})

    const rawOrder = await getFtxOrdinaryOrder({
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
      url: getFtxEndpoints(exchange.settings).order.get(id.toString()),
    })

    expect(publicRequest.callCount).to.be.eq(0)

  })

  it('should simply return undefined if exchange throw order not found error', async () => {

    // preparing data
    const id = 'id'

    const error = new AlunaError({
      code: AlunaHttpErrorCodes.REQUEST_ERROR,
      message: 'Order not found',
    })


    // mocking
    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: FtxHttp.prototype })
    authedRequest.returns(Promise.reject(error))


    // executing
    const exchange = new FtxAuthed({ credentials })

    const http = new FtxHttp({})

    const rawOrder = await getFtxOrdinaryOrder({
      id: id.toString(),
      exchange,
      http,
    })


    // validating
    expect(rawOrder).not.to.be.ok

    expect(authedRequest.callCount).to.be.eq(1)
    expect(authedRequest.firstCall.args[0]).to.deep.eq({
      verb: AlunaHttpVerbEnum.GET,
      credentials,
      url: getFtxEndpoints(exchange.settings).order.get(id.toString()),
    })

    expect(publicRequest.callCount).to.be.eq(0)

  })

  it(
    'should throw error if is not related to order not found',
    async () => {

      // preparing data
      const id = 'id'

      const alunaError = new AlunaError({
        code: AlunaHttpErrorCodes.REQUEST_ERROR,
        message: 'strange error',
      })


      // mocking
      const {
        publicRequest,
        authedRequest,
      } = mockHttp({ classPrototype: FtxHttp.prototype })
      authedRequest.returns(Promise.reject(alunaError))


      // executing
      const exchange = new FtxAuthed({ credentials })

      const http = new FtxHttp({})

      const {
        error,
        result,
      } = await executeAndCatch(() => getFtxOrdinaryOrder({
        id: id.toString(),
        exchange,
        http,
      }))


      // validating
      expect(result).not.to.be.ok

      expect(error).deep.eq(alunaError)

      expect(authedRequest.callCount).to.be.eq(1)
      expect(authedRequest.firstCall.args[0]).to.deep.eq({
        verb: AlunaHttpVerbEnum.GET,
        credentials,
        url: getFtxEndpoints(exchange.settings).order.get(id.toString()),
      })

      expect(publicRequest.callCount).to.be.eq(0)

    },
  )

})
