import { expect } from 'chai'
import { cloneDeep } from 'lodash'
import { ImportMock } from 'ts-mock-imports'

import { PARSED_POSITIONS } from '../../../../../../test/fixtures/parsedPositions'
import { mockHttp } from '../../../../../../test/mocks/exchange/Http'
import { mockGet } from '../../../../../../test/mocks/exchange/modules/mockGet'
import { AlunaPositionStatusEnum } from '../../../../../lib/enums/AlunaPositionStatusEnum'
import { AlunaPositionErrorCodes } from '../../../../../lib/errors/AlunaPositionErrorCodes'
import { IAlunaPositionCloseParams } from '../../../../../lib/modules/authed/IAlunaPositionModule'
import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { executeAndCatch } from '../../../../../utils/executeAndCatch'
import { BitmexAuthed } from '../../../BitmexAuthed'
import { BitmexHttp } from '../../../BitmexHttp'
import { getBitmexEndpoints } from '../../../bitmexSpecs'
import * as getMod from './get'



describe(__filename, () => {

  const credentials: IAlunaCredentialsSchema = {
    key: 'key',
    secret: 'secret',
  }

  it('should close position just fine', async () => {

    // preparing data
    const bitmexPosition = cloneDeep(PARSED_POSITIONS[0])
    bitmexPosition.status = AlunaPositionStatusEnum.OPEN
    const { symbolPair } = bitmexPosition


    // mocking
    const { get } = mockGet({ module: getMod })
    get.returns(Promise.resolve({ position: bitmexPosition }))

    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: BitmexHttp.prototype })

    authedRequest.returns(Promise.resolve(bitmexPosition))

    const mockedDate = new Date()

    ImportMock.mockFunction(
      global,
      'Date',
      mockedDate,
    )


    // executing
    const exchange = new BitmexAuthed({ credentials })

    const params: IAlunaPositionCloseParams = {
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
      symbolPair: params.symbolPair,
      http: new BitmexHttp(exchange.settings),
    })

    expect(authedRequest.callCount).to.be.eq(1)
    expect(authedRequest.firstCall.args[0]).to.deep.eq({
      credentials,
      url: getBitmexEndpoints({}).position.close,
      body: { execInst: 'Close', symbol: symbolPair },
    })

    expect(publicRequest.callCount).to.be.eq(0)

  })

  it('should throw error if position is already closed', async () => {

    // preparing data
    const mockedPosition = cloneDeep(PARSED_POSITIONS[0])
    mockedPosition.status = AlunaPositionStatusEnum.CLOSED
    const { symbolPair } = mockedPosition


    // mocking
    const { get } = mockGet({ module: getMod })
    get.returns(Promise.resolve({ position: mockedPosition }))

    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: BitmexHttp.prototype })

    authedRequest.returns(Promise.resolve(mockedPosition))


    // executing
    const exchange = new BitmexAuthed({ credentials })

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
    expect(error!.httpStatusCode).to.be.eq(400)

    expect(get.callCount).to.be.eq(1)
    expect(get.firstCall.args[0]).to.deep.eq({
      symbolPair: params.symbolPair,
      http: new BitmexHttp(exchange.settings),
    })

    expect(authedRequest.callCount).to.be.eq(0)
    expect(publicRequest.callCount).to.be.eq(0)

  })

})
