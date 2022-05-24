import { expect } from 'chai'

import { PARSED_ORDERS } from '../../../../../../test/fixtures/parsedOrders'
import { mockHttp } from '../../../../../../test/mocks/exchange/Http'
import { mockParse } from '../../../../../../test/mocks/exchange/modules/mockParse'
import { AlunaAccountEnum } from '../../../../../lib/enums/AlunaAccountEnum'
import { AlunaOrderSideEnum } from '../../../../../lib/enums/AlunaOrderSideEnum'
import { AlunaOrderTypesEnum } from '../../../../../lib/enums/AlunaOrderTypesEnum'
import { IAlunaOrderEditParams } from '../../../../../lib/modules/authed/IAlunaOrderModule'
import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { editOrderParamsSchema } from '../../../../../utils/validation/schemas/editOrderParamsSchema'
import { mockValidateParams } from '../../../../../utils/validation/validateParams.mock'
import { FtxAuthed } from '../../../FtxAuthed'
import { FtxHttp } from '../../../FtxHttp'
import { getFtxEndpoints } from '../../../ftxSpecs'
import { FTX_RAW_ORDERS } from '../../../test/fixtures/ftxOrders'
import * as parseMod from './parse'



describe(__filename, () => {

  const credentials: IAlunaCredentialsSchema = {
    key: 'key',
    secret: 'secret',
  }

  it('should edit a Ftx order just fine', async () => {

    // preparing data
    const http = new FtxHttp({})

    const mockedRawOrder = FTX_RAW_ORDERS[0]
    const mockedParsedOrder = PARSED_ORDERS[0]

    const { id } = mockedRawOrder


    // mocking
    const {
      authedRequest,
      publicRequest,
    } = mockHttp({ classPrototype: FtxHttp.prototype })

    authedRequest.returns(Promise.resolve(mockedRawOrder))

    const { parse } = mockParse({ module: parseMod })

    parse.returns({ order: mockedParsedOrder })

    const { validateParamsMock } = mockValidateParams()

    // executing
    const exchange = new FtxAuthed({ credentials })

    const params: IAlunaOrderEditParams = {
      id: id.toString(),
      symbolPair: '',
      account: AlunaAccountEnum.SPOT,
      amount: 0.01,
      side: AlunaOrderSideEnum.BUY,
      type: AlunaOrderTypesEnum.LIMIT,
      rate: 0,
    }

    const {
      order,
      requestWeight,
    } = await exchange.order.edit(params)


    // validating
    expect(order).to.deep.eq(mockedParsedOrder)

    expect(requestWeight).to.deep.eq(http.requestWeight)

    expect(authedRequest.callCount).to.be.eq(1)
    expect(authedRequest.firstCall.args[0]).to.deep.eq({
      url: getFtxEndpoints(exchange.settings).order.edit(id.toString()),
      credentials,
      body: {
        price: 0,
        size: 0.01,
      },
    })

    expect(validateParamsMock.callCount).to.be.eq(1)
    expect(validateParamsMock.firstCall.args[0]).to.deep.eq({
      params,
      schema: editOrderParamsSchema,
    })

    expect(publicRequest.callCount).to.be.eq(0)

  })

})
