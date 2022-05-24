import { expect } from 'chai'
import { cloneDeep } from 'lodash'

import { PARSED_ORDERS } from '../../../../../../../test/fixtures/parsedOrders'
import { PARSED_POSITIONS } from '../../../../../../../test/fixtures/parsedPositions'
import { mockOrderPlace } from '../../../../../../../test/mocks/exchange/modules/order/mockOrderPlace'
import { AlunaOrderSideEnum } from '../../../../../../lib/enums/AlunaOrderSideEnum'
import { AlunaOrderTypesEnum } from '../../../../../../lib/enums/AlunaOrderTypesEnum'
import { AlunaPositionSideEnum } from '../../../../../../lib/enums/AlunaPositionSideEnum'
import { IAlunaCredentialsSchema } from '../../../../../../lib/schemas/IAlunaCredentialsSchema'
import { BitfinexAuthed } from '../../../../BitfinexAuthed'
import { BitfinexHttp } from '../../../../BitfinexHttp'
import * as placeMod from '../../order/place'
import { placeMarketOrderToClosePosition } from './placeMarketOrderToClosePosition'



describe(__filename, () => {

  const credentials: IAlunaCredentialsSchema = {
    key: 'key',
    secret: 'secret',
  }

  it('should place market order to close Bitfinex position just fine (LONG)', async () => {

    // preparing values
    const order = PARSED_ORDERS[0]

    const position = cloneDeep(PARSED_POSITIONS[0])
    position.side = AlunaPositionSideEnum.LONG


    // mocking
    const { place } = mockOrderPlace({ module: placeMod })
    place.returns(Promise.resolve({ order }))

    // executing
    const exchange = new BitfinexAuthed({ credentials })

    const http = new BitfinexHttp(exchange.settings)

    await placeMarketOrderToClosePosition({
      position,
      exchange,
      http,
    })


    // validating
    expect(place.callCount).to.be.eq(1)

    expect(place.firstCall.args[0]).to.deep.eq({
      http,
      account: position.account,
      side: AlunaOrderSideEnum.SELL,
      amount: position.amount,
      symbolPair: position.symbolPair,
      type: AlunaOrderTypesEnum.MARKET,
    })

  })

  it('should place market order to close Bitfinex position just fine (SHORT)', async () => {

    // preparing values
    const order = PARSED_ORDERS[0]

    const position = cloneDeep(PARSED_POSITIONS[0])
    position.side = AlunaPositionSideEnum.SHORT


    // mocking
    const { place } = mockOrderPlace({ module: placeMod })
    place.returns(Promise.resolve({ order }))


    // executing
    const exchange = new BitfinexAuthed({ credentials })

    const http = new BitfinexHttp(exchange.settings)

    await placeMarketOrderToClosePosition({
      position,
      exchange,
      http,
    })


    // validating
    expect(place.callCount).to.be.eq(1)

    expect(place.firstCall.args[0]).to.deep.eq({
      http,
      account: position.account,
      side: AlunaOrderSideEnum.BUY,
      amount: position.amount,
      symbolPair: position.symbolPair,
      type: AlunaOrderTypesEnum.MARKET,
    })

  })

})
