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
import { BitmexAuthed } from '../../../BitmexAuthed'
import { BitmexHttp } from '../../../BitmexHttp'
import { BITMEX_RAW_ORDERS } from '../../../test/fixtures/bitmexOrders'
import * as cancelMod from './cancel'
import * as placeMod from './place'



describe(__filename, () => {

  const credentials: IAlunaCredentialsSchema = {
    key: 'key',
    secret: 'secret',
  }

  it('should edit a Bitmex order just fine', async () => {

    // preparing data
    const http = new BitmexHttp({})

    const mockedRawOrder = BITMEX_RAW_ORDERS[0]
    const mockedParsedOrder = PARSED_ORDERS[0]

    const { id } = mockedRawOrder


    // mocking
    mockHttp({ classPrototype: BitmexHttp.prototype })

    const { cancel } = mockOrderCancel({ module: cancelMod })

    const { place } = mockOrderPlace({ module: placeMod })

    place.returns({ order: mockedParsedOrder })

    mockValidateParams()

    // executing
    const exchange = new BitmexAuthed({ credentials })

    const params: IAlunaOrderEditParams = {
      id,
      symbolPair: '',
      account: AlunaAccountEnum.EXCHANGE,
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
    })

  })

})
