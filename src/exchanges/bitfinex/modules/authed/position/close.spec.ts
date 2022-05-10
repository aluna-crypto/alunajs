import { expect } from 'chai'
import { cloneDeep } from 'lodash'
import { ImportMock } from 'ts-mock-imports'

import { PARSED_POSITIONS } from '../../../../../../test/fixtures/parsedPositions'
import { mockGet } from '../../../../../../test/mocks/exchange/modules/mockGet'
import { AlunaPositionStatusEnum } from '../../../../../lib/enums/AlunaPositionStatusEnum'
import { AlunaPositionErrorCodes } from '../../../../../lib/errors/AlunaPositionErrorCodes'
import { IAlunaPositionCloseParams } from '../../../../../lib/modules/authed/IAlunaPositionModule'
import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { executeAndCatch } from '../../../../../utils/executeAndCatch'
import { BitfinexAuthed } from '../../../BitfinexAuthed'
import { BitfinexHttp } from '../../../BitfinexHttp'
import * as getMod from './get'
import { mockPlaceMarketOrderToClosePosition } from './helpers/placeMarketOrderToClosePosition.mock'



describe(__filename, () => {

  const credentials: IAlunaCredentialsSchema = {
    key: 'key',
    secret: 'secret',
  }

  it('should close position just fine', async () => {

    // preparing data
    const mockedPosition = cloneDeep(PARSED_POSITIONS[0])
    mockedPosition.status = AlunaPositionStatusEnum.OPEN
    const {
      id,
      symbolPair,
    } = mockedPosition


    // mocking
    const { get } = mockGet({ module: getMod })
    get.returns(Promise.resolve({ position: mockedPosition }))

    const {
      placeMarketOrderToClosePosition,
    } = mockPlaceMarketOrderToClosePosition()

    const mockedDate = new Date()

    ImportMock.mockFunction(
      global,
      'Date',
      mockedDate,
    )


    // executing
    const exchange = new BitfinexAuthed({ credentials })

    const params: IAlunaPositionCloseParams = {
      id,
      symbolPair,
    }

    const { position } = await exchange.position!.close(params)


    // validating
    expect(position).to.deep.eq({
      ...position,
      status: AlunaPositionStatusEnum.CLOSED,
      closedAt: mockedDate,
    })

    expect(get.callCount).to.be.eq(1)
    expect(get.firstCall.args[0]).to.deep.eq({
      id: params.id,
      http: new BitfinexHttp(exchange.settings),
    })

    expect(placeMarketOrderToClosePosition.callCount).to.be.eq(1)
    expect(placeMarketOrderToClosePosition.firstCall.args[0]).to.deep.eq({
      http: new BitfinexHttp(exchange.settings),
      exchange,
      position: mockedPosition,
    })

  })

  it('should throw error if position id is not informed', async () => {

    // preparing data
    const mockedPosition = cloneDeep(PARSED_POSITIONS[0])
    mockedPosition.status = AlunaPositionStatusEnum.CLOSED
    const { symbolPair } = mockedPosition


    // mocking
    const { get } = mockGet({ module: getMod })
    get.returns(Promise.resolve({ position: mockedPosition }))

    const {
      placeMarketOrderToClosePosition,
    } = mockPlaceMarketOrderToClosePosition()


    // executing
    const exchange = new BitfinexAuthed({ credentials })

    const params: IAlunaPositionCloseParams = {
      id: '',
      symbolPair,
    }

    const {
      error,
      result,
    } = await executeAndCatch(() => exchange.position!.close(params))


    // validating
    expect(result).not.to.be.ok

    const msg = 'Position id is required to closing Bitfinex position'

    expect(error!.code).to.be.eq(AlunaPositionErrorCodes.DOESNT_HAVE_ID)
    expect(error!.message).to.be.eq(msg)
    expect(error!.httpStatusCode).to.be.eq(400)

    expect(get.callCount).to.be.eq(0)

    expect(placeMarketOrderToClosePosition.callCount).to.be.eq(0)

  })

  it('should throw error if position is already closed', async () => {

    // preparing data
    const mockedPosition = cloneDeep(PARSED_POSITIONS[0])
    mockedPosition.status = AlunaPositionStatusEnum.CLOSED
    const {
      id,
      symbolPair,
    } = mockedPosition


    // mocking
    const { get } = mockGet({ module: getMod })
    get.returns(Promise.resolve({ position: mockedPosition }))

    const {
      placeMarketOrderToClosePosition,
    } = mockPlaceMarketOrderToClosePosition()


    // executing
    const exchange = new BitfinexAuthed({ credentials })

    const params: IAlunaPositionCloseParams = {
      id,
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
    expect(error!.httpStatusCode).to.be.eq(400)

    expect(get.callCount).to.be.eq(1)
    expect(get.firstCall.args[0]).to.deep.eq({
      id: params.id,
      http: new BitfinexHttp(exchange.settings),
    })

    expect(placeMarketOrderToClosePosition.callCount).to.be.eq(0)

  })

})
