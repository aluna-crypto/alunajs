import { expect } from 'chai'
import { cloneDeep } from 'lodash'
import { ImportMock } from 'ts-mock-imports'

import { PARSED_ORDERS } from '../../../../../../test/fixtures/parsedOrders'
import { PARSED_POSITIONS } from '../../../../../../test/fixtures/parsedPositions'
import { mockGet } from '../../../../../../test/mocks/exchange/modules/mockGet'
import { AlunaPositionStatusEnum } from '../../../../../lib/enums/AlunaPositionStatusEnum'
import { AlunaPositionErrorCodes } from '../../../../../lib/errors/AlunaPositionErrorCodes'
import { IAlunaPositionCloseParams } from '../../../../../lib/modules/authed/IAlunaPositionModule'
import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { executeAndCatch } from '../../../../../utils/executeAndCatch'
import { mockPlaceMarketOrderToClosePosition } from '../../../../../utils/positions/placeMarketOrderToClosePosition.mock'
import { FtxAuthed } from '../../../FtxAuthed'
import { FtxHttp } from '../../../FtxHttp'
import * as getMod from './get'



describe(__filename, () => {

  const credentials: IAlunaCredentialsSchema = {
    key: 'key',
    secret: 'secret',
  }

  it('should close position just fine', async () => {

    // preparing data
    const position = cloneDeep(PARSED_POSITIONS[0])
    position.status = AlunaPositionStatusEnum.OPEN

    const order = PARSED_ORDERS[0]

    const { symbolPair } = position


    // mocking
    const { get } = mockGet({ module: getMod })
    get.returns(Promise.resolve({ position }))

    const { placeMarketOrderToClosePosition } = mockPlaceMarketOrderToClosePosition()
    placeMarketOrderToClosePosition.returns({ order })

    const mockedDate = new Date()

    ImportMock.mockFunction(
      global,
      'Date',
      mockedDate,
    )


    // executing
    const exchange = new FtxAuthed({ credentials })

    const params: IAlunaPositionCloseParams = {
      symbolPair,
    }

    const { position: closedPosition } = await exchange.position!.close(params)


    // validating

    expect(closedPosition).to.deep.eq({
      ...position,
      status: AlunaPositionStatusEnum.CLOSED,
      closedAt: new Date(),
      closePrice: order.rate!,
    })


    expect(get.callCount).to.be.eq(1)
    expect(get.firstCall.args[0]).to.deep.eq({
      symbolPair: params.symbolPair,
      http: new FtxHttp(exchange.settings),
    })

  })

  it('should throw error if position is already closed', async () => {

    // preparing data
    const position = cloneDeep(PARSED_POSITIONS[0])
    position.status = AlunaPositionStatusEnum.CLOSED

    const order = PARSED_ORDERS[0]

    const { symbolPair } = position


    // mocking
    const { get } = mockGet({ module: getMod })
    get.returns(Promise.resolve({ position }))

    const { placeMarketOrderToClosePosition } = mockPlaceMarketOrderToClosePosition()
    placeMarketOrderToClosePosition.returns({ order })


    // executing
    const exchange = new FtxAuthed({ credentials })

    const params: IAlunaPositionCloseParams = {
      symbolPair,
    }

    const {
      error,
      result,
    } = await executeAndCatch(() => exchange.position!.close(params))


    // validating
    expect(result).not.to.be.ok

    expect(error!.code).to.be.eq(AlunaPositionErrorCodes.ALREADY_CLOSED)
    expect(error!.message).to.be.eq('Position is already closed')
    expect(error!.httpStatusCode).to.be.eq(200)

    expect(get.callCount).to.be.eq(1)
    expect(get.firstCall.args[0]).to.deep.eq({
      symbolPair: params.symbolPair,
      http: new FtxHttp(exchange.settings),
    })

  })

})
