import { expect } from 'chai'
import {
  filter,
  map,
} from 'lodash'
import Sinon from 'sinon'
import { ImportMock } from 'ts-mock-imports'

import { mockExchangeModule } from '../../../../test/helpers/exchange'
import { AlunaOrderSideEnum } from '../../../lib/enums/AlunaOrderSideEnum'
import { AlunaOrderTypesEnum } from '../../../lib/enums/AlunaOrderTypesEnum'
import { AlunaPositionSideEnum } from '../../../lib/enums/AlunaPositionSideEnum'
import { AlunaPositionStatusEnum } from '../../../lib/enums/AlunaPositionStatusEnum'
import { AlunaPositionErrorCodes } from '../../../lib/errors/AlunaPositionErrorCodes'
import { IAlunaPositionSchema } from '../../../lib/schemas/IAlunaPositionSchema'
import { executeAndCatch } from '../../../utils/executeAndCatch'
import { BitfinexHttp } from '../BitfinexHttp'
import { BitfinexPositionParser } from '../schemas/parsers/BitfinexPositionParser'
import {
  BITFINEX_PARSED_POSITIONS,
  BITFINEX_RAW_POSITIONS,
} from '../test/fixtures/bitfinexPosition'
import { BitfinexPositionModule } from './BitfinexPositionModule'



describe('BitfinexPositionModule', () => {

  const bitfinexPositionModule = BitfinexPositionModule.prototype

  const id = '666'

  const mockRequest = (requestResponse: any) => {

    const requestMock = ImportMock.mockFunction(
      BitfinexHttp,
      'privateRequest',
      Promise.resolve(requestResponse),
    )

    return { requestMock }

  }

  const mockBitfinexPositionParser = (
    resonse: IAlunaPositionSchema[],
    mockBitfinexModule = true,
  ) => {

    let parserMock: Sinon.SinonStub

    if (mockBitfinexModule) {

      parserMock = ImportMock.mockFunction(
        bitfinexPositionModule,
        'parse',
      )

    } else {

      parserMock = ImportMock.mockFunction(
        BitfinexPositionParser,
        'parse',
      )

    }

    resonse.forEach((res, i) => {

      parserMock.onCall(i).returns(Promise.resolve(res))

    })

    return { parserMock }

  }

  it('should properly list Bitfinex raw positions', async () => {

    const {
      exchangeMock,
    } = mockExchangeModule({ module: bitfinexPositionModule })

    const { requestMock } = mockRequest(BITFINEX_RAW_POSITIONS)

    const rawPositions = await bitfinexPositionModule.listRaw()

    expect(rawPositions).to.deep.eq(BITFINEX_RAW_POSITIONS)
    expect(requestMock.callCount).to.be.eq(1)
    expect(requestMock.calledWithExactly({
      url: 'https://api.bitfinex.com/v2/auth/r/positions',
      keySecret: exchangeMock.getValue().keySecret,
    })).to.be.ok

  })

  it('should properly list Bitfinex parsed positions', async () => {

    const mockedRawPositions = BITFINEX_RAW_POSITIONS
    const mockedParsedPositions = BITFINEX_PARSED_POSITIONS

    const listRawMock = ImportMock.mockFunction(
      bitfinexPositionModule,
      'listRaw',
      Promise.resolve(mockedRawPositions),
    )

    const parseManyMock = ImportMock.mockFunction(
      bitfinexPositionModule,
      'parseMany',
      mockedParsedPositions,
    )

    const parsedPositions = await bitfinexPositionModule.list()

    expect(parsedPositions).to.deep.eq(mockedParsedPositions)

    expect(listRawMock.callCount).to.be.eq(1)

    expect(parseManyMock.callCount).to.be.eq(1)
    expect(parseManyMock.args[0][0]).to.deep.eq({
      rawPositions: mockedRawPositions,
    })

  })

  it('should properly parse a Bitfinex raw position', async () => {

    const { parserMock } = mockBitfinexPositionParser(
      BITFINEX_PARSED_POSITIONS,
      false,
    )

    const promises = map(BITFINEX_RAW_POSITIONS, async (rawPosition, i) => {

      // skipping 'derivatives' and 'funding'
      if (/^(f)|(F0)/.test(rawPosition[0])) {

        return

      }

      const parsedPosition = await bitfinexPositionModule.parse({
        rawPosition,
      })

      expect(BITFINEX_PARSED_POSITIONS).to.includes(parsedPosition)
      expect(parserMock.args[i][0]).to.deep.eq({
        rawPosition,
      })

    })

    await Promise.all(promises)

    // skipped 1 'derivatives' and 1 'funding' raw position
    expect(parserMock.callCount).to.be.eq(BITFINEX_RAW_POSITIONS.length - 2)

  })

  it('should properly parse many Bitfinex raw positions', async () => {

    const { parserMock } = mockBitfinexPositionParser(
      BITFINEX_PARSED_POSITIONS,
    )

    const parsedPositions = await bitfinexPositionModule.parseMany({
      rawPositions: BITFINEX_RAW_POSITIONS,
    })

    expect(parsedPositions).to.deep.eq(BITFINEX_PARSED_POSITIONS)

    const rawPosition1 = BITFINEX_RAW_POSITIONS.find((p) => /^f/.test(p[0]))

    expect(rawPosition1).to.be.ok
    expect(parserMock.calledWithExactly({
      rawPosition: rawPosition1,
    })).not.to.be.ok

    const rawPosition2 = BITFINEX_RAW_POSITIONS.find((p) => /F0/.test(p[0]))

    expect(rawPosition2).to.be.ok
    expect(parserMock.calledWithExactly({
      rawPosition: rawPosition2,
    })).not.to.be.ok

    // skipped 1 'derivatives' and 1 'funding' raw position
    expect(parserMock.callCount).to.be.eq(BITFINEX_RAW_POSITIONS.length - 2)

  })

  it('should properly get a Bitfinex raw position', async () => {

    const { exchangeMock } = mockExchangeModule({
      module: bitfinexPositionModule,
    })

    const mockedRawPosition = [BITFINEX_RAW_POSITIONS[0]]

    const { requestMock } = mockRequest(mockedRawPosition)

    const rawPosition = await bitfinexPositionModule.getRaw({
      id,
    })

    expect(rawPosition).to.deep.eq(mockedRawPosition[0])
    expect(requestMock.callCount).to.be.eq(1)
    expect(requestMock.calledWithExactly({
      url: 'https://api.bitfinex.com/v2/auth/r/positions/audit',
      keySecret: exchangeMock.getValue().keySecret,
      body: { id: [Number(id)], limit: 1 },
    })).to.be.ok

  })

  it('should throw error if position is not found', async () => {

    const { exchangeMock } = mockExchangeModule({
      module: bitfinexPositionModule,
    })

    const { requestMock } = mockRequest(Promise.resolve([]))

    const {
      error,
      result,
    } = await executeAndCatch(async () => bitfinexPositionModule.getRaw({
      id,
    }))

    expect(result).not.to.be.ok

    expect(error!.code).to.be.eq(AlunaPositionErrorCodes.NOT_FOUND)
    expect(error!.message).to.be.eq('Position not found')

    expect(requestMock.callCount).to.be.eq(1)
    expect(requestMock.calledWithExactly({
      url: 'https://api.bitfinex.com/v2/auth/r/positions/audit',
      keySecret: exchangeMock.getValue().keySecret,
      body: { id: [Number(id)], limit: 1 },
    })).to.be.ok

  })

  it('should properly get a Bitfinex parsed position', async () => {

    const mockedRawPosition = BITFINEX_RAW_POSITIONS[0]

    const getRawMock = ImportMock.mockFunction(
      bitfinexPositionModule,
      'getRaw',
      Promise.resolve(mockedRawPosition),
    )

    const { parserMock } = mockBitfinexPositionParser(
      BITFINEX_PARSED_POSITIONS,
    )

    const parsedPosition = await bitfinexPositionModule.get({
      id,
    })

    expect(parsedPosition).to.deep.eq(BITFINEX_PARSED_POSITIONS[0])

    expect(getRawMock.callCount).to.be.eq(1)
    expect(getRawMock.args[0][0]).to.deep.eq({
      id,
    })

    expect(parserMock.callCount).to.be.eq(1)
    expect(parserMock.args[0][0]).to.deep.eq({
      rawPosition: mockedRawPosition,
    })

  })

  it('should properly close Bitfinex position', async () => {

    const mockedDate = new Date()

    ImportMock.mockFunction(
      global,
      'Date',
      mockedDate,
    )

    const placeSpy = Sinon.spy(async () => Promise.resolve(true))

    const openMockedPositions = filter(BITFINEX_PARSED_POSITIONS, (p) => {

      return p.status === AlunaPositionStatusEnum.OPEN

    })

    mockExchangeModule({
      module: bitfinexPositionModule,
      overrides: {
        order: {
          place: placeSpy,
        } as any,
      },
    })

    const mockedParsedPosition1 = openMockedPositions[0]

    const getMock = ImportMock.mockFunction(
      bitfinexPositionModule,
      'get',
      Promise.resolve(mockedParsedPosition1),
    )

    const closedPosition = await bitfinexPositionModule.close({
      id,
    })

    expect(getMock.callCount).to.be.eq(1)
    expect(getMock.args[0][0]).to.deep.eq({
      id,
    })

    const side = mockedParsedPosition1.side === AlunaPositionSideEnum.LONG
      ? AlunaOrderSideEnum.SELL
      : AlunaOrderSideEnum.BUY

    expect(placeSpy.callCount).to.be.eq(1)
    expect(placeSpy.args[0]).to.deep.eq([{
      account: mockedParsedPosition1.account,
      amount: mockedParsedPosition1.amount,
      symbolPair: mockedParsedPosition1.symbolPair,
      type: AlunaOrderTypesEnum.MARKET,
      side,
    }])

    expect(closedPosition).to.deep.eq({
      ...mockedParsedPosition1,
      status: AlunaPositionStatusEnum.CLOSED,
      closedAt: mockedDate,
    })


    const mockedParsedPosition2 = openMockedPositions[1]

    getMock.returns(Promise.resolve(mockedParsedPosition2))

    const closedPosition2 = await bitfinexPositionModule.close({
      id,
    })

    expect(getMock.callCount).to.be.eq(2)
    expect(getMock.args[1][0]).to.deep.eq({
      id,
    })

    const side2 = mockedParsedPosition2.side === AlunaPositionSideEnum.LONG
      ? AlunaOrderSideEnum.SELL
      : AlunaOrderSideEnum.BUY

    expect(placeSpy.callCount).to.be.eq(2)
    expect(placeSpy.args[1]).to.deep.eq([{
      account: mockedParsedPosition2.account,
      amount: mockedParsedPosition2.amount,
      symbolPair: mockedParsedPosition2.symbolPair,
      type: AlunaOrderTypesEnum.MARKET,
      side: side2,
    }])

    expect(closedPosition2).to.deep.eq({
      ...mockedParsedPosition2,
      status: AlunaPositionStatusEnum.CLOSED,
      closedAt: mockedDate,
    })

  })

  it('should ensure position id is given to close position', async () => {

    let error
    let result

    const { requestMock } = mockRequest(true)

    const getMock = ImportMock.mockFunction(
      bitfinexPositionModule,
      'get',
      Promise.resolve(BITFINEX_PARSED_POSITIONS[0]),
    )

    try {

      result = await bitfinexPositionModule.close({})

    } catch (err) {

      error = err

    }

    expect(result).not.to.be.ok

    const errMsg = 'Position id is required to close Bitfinex positions'

    expect(error.code).to.be.eq(AlunaPositionErrorCodes.DOESNT_HAVE_ID)
    expect(error.message).to.be.eq(errMsg)
    expect(error.httpStatusCode).to.be.eq(400)

    expect(requestMock.callCount).to.be.eq(0)
    expect(getMock.callCount).to.be.eq(0)

  })

  it('should return error if position is already closed', async () => {

    mockExchangeModule({ module: bitfinexPositionModule })

    let error
    let result

    const getMock = ImportMock.mockFunction(
      bitfinexPositionModule,
      'get',
      Promise.resolve(BITFINEX_PARSED_POSITIONS[1]),
    )

    try {

      result = await bitfinexPositionModule.close({
        id,
      })

    } catch (err) {

      error = err

    }

    expect(result).not.to.be.ok

    const errMsg = 'Position is already closed'

    expect(error.code).to.be.eq(AlunaPositionErrorCodes.ALREADY_CLOSED)
    expect(error.message).to.be.eq(errMsg)
    expect(error.httpStatusCode).to.be.eq(400)

    expect(getMock.callCount).to.be.eq(1)
    expect(getMock.args[0][0]).to.deep.eq({
      id,
    })

  })

})
