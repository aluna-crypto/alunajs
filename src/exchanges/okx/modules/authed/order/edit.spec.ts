import { expect } from 'chai'

import { PARSED_ORDERS } from '../../../../../../test/fixtures/parsedOrders'
import { mockHttp } from '../../../../../../test/mocks/exchange/Http'
import { mockOrderCancel } from '../../../../../../test/mocks/exchange/modules/order/mockOrderCancel'
import { mockOrderPlace } from '../../../../../../test/mocks/exchange/modules/order/mockOrderPlace'
import { AlunaAccountEnum } from '../../../../../lib/enums/AlunaAccountEnum'
import { AlunaOrderSideEnum } from '../../../../../lib/enums/AlunaOrderSideEnum'
import { AlunaOrderTypesEnum } from '../../../../../lib/enums/AlunaOrderTypesEnum'
import { IAlunaOrderEditParams } from '../../../../../lib/modules/authed/IAlunaOrderModule'
import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { mockValidateParams } from '../../../../../utils/validation/validateParams.mock'
import { OkxAuthed } from '../../../OkxAuthed'
import { OkxHttp } from '../../../OkxHttp'
import { OKX_RAW_ORDERS } from '../../../test/fixtures/okxOrders'
import * as cancelMod from './cancel'
import * as placeMod from './place'



describe(__filename, () => {

  const credentials: IAlunaCredentialsSchema = {
    key: 'key',
    secret: 'secret',
  }

  it('should edit a Okx order just fine', async () => {

    // preparing data
    const http = new OkxHttp({})

    const mockedRawOrder = OKX_RAW_ORDERS[0]
    const mockedParsedOrder = PARSED_ORDERS[0]

    const { ordId: id } = mockedRawOrder


    // mocking
    mockHttp({ classPrototype: OkxHttp.prototype })

    const { cancel } = mockOrderCancel({ module: cancelMod })

    const { place } = mockOrderPlace({ module: placeMod })

    place.returns({ order: mockedParsedOrder })

    mockValidateParams()

    // executing
    const exchange = new OkxAuthed({ credentials })

    const params: IAlunaOrderEditParams = {
      id,
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

    expect(cancel.callCount).to.be.eq(1)

    expect(cancel.firstCall.args[0]).to.deep.eq({
      http,
      id,
      type: params.type,
      symbolPair: params.symbolPair,
    })

    expect(place.callCount).to.be.eq(1)

    expect(place.firstCall.args[0]).to.deep.eq({
      http,
      rate: params.rate,
      side: params.side,
      type: params.type,
      amount: params.amount,
      account: params.account,
      symbolPair: params.symbolPair,
      stopRate: undefined,
      limitRate: undefined,
    })

  })

})
