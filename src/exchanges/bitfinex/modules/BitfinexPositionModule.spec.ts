import { expect } from 'chai'
import Sinon from 'sinon'
import {
  ImportMock,
  OtherManager,
} from 'ts-mock-imports'

import { IAlunaExchange } from '../../../lib/core/IAlunaExchange'
import { AlunaPositionErrorCodes } from '../../../lib/errors/AlunaPositionErrorCodes'
import { IAlunaKeySecretSchema } from '../../../lib/schemas/IAlunaKeySecretSchema'
import { IAlunaPositionSchema } from '../../../lib/schemas/IAlunaPositionSchema'
import { BitfinexHttp } from '../BitfinexHttp'
import { BitfinexSymbolMapping } from '../mappings/BitfinexSymbolMapping'
import { BitfinexPositionParser } from '../schemas/parsers/BitfinexPositionParser'
import {
  BITFINEX_PARSED_POSITIONS,
  BITFINEX_RAW_POSITIONS,
} from '../test/fixtures/bitfinexPosition'
import { BitfinexPositionModule } from './BitfinexPositionModule'



describe('BitfinexPositionModule', () => {

  const bitfinexPositionModule = BitfinexPositionModule.prototype

  let exchangeMock: OtherManager<IAlunaExchange>

  const id = '666'

  const keySecret: IAlunaKeySecretSchema = {
    key: '',
    secret: '',
  }

  const mockExchange = () => {

    exchangeMock = ImportMock.mockOther(
      bitfinexPositionModule,
      'exchange',
      { keySecret } as IAlunaExchange,
    )

    return { exchangeMock }

  }


  const mockRequest = (requestResponse: any) => {

    const requestMock = ImportMock.mockFunction(
      BitfinexHttp,
      'privateRequest',
      Promise.resolve(requestResponse),
    )

    return { requestMock }

  }

  const mockedBitfinexPositionParser = (
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

      parserMock.onCall(i).returns(res)

    })

    return { parserMock }

  }

  it('should properly list Bitfinex raw positions', async () => {

    mockExchange()

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

  it('should properly parse a Bitfinex raw position', () => {

    const { exchangeMock } = mockExchange()

    const mappings = {
      UST: 'USDT',
    }

    const baseSymbolId = 'UST'
    const quoteSymbolId = 'UCT'

    ImportMock.mockFunction(
      BitfinexSymbolMapping,
      'translateToAluna',
      {
        baseSymbolId,
        quoteSymbolId,
      },
    )

    const { parserMock } = mockedBitfinexPositionParser(
      BITFINEX_PARSED_POSITIONS,
      false,
    )

    BITFINEX_RAW_POSITIONS.forEach((rawPosition, i) => {

      if (i % 3 !== 0) {

        exchangeMock.set({
          keySecret,
          settings: {
            mappings,
          },
        })

      } else {

        exchangeMock.set({
          keySecret,
        })

      }

      // skipping 'derivatives' and 'funding'
      if (/^(f)|(F0)/.test(rawPosition[0])) {

        return

      }

      const parsedPosition = bitfinexPositionModule.parse({
        rawPosition,
      })

      expect(BITFINEX_PARSED_POSITIONS).to.includes(parsedPosition)
      expect(parserMock.args[i][0]).to.deep.eq({
        rawPosition,
        baseSymbolId,
        quoteSymbolId,
      })

    })

    // skipped 1 'derivatives' and 1 'funding' raw position
    expect(parserMock.callCount).to.be.eq(BITFINEX_RAW_POSITIONS.length - 2)

  })

  it('should properly parse many Bitfinex raw positions', () => {

    const { parserMock } = mockedBitfinexPositionParser(
      BITFINEX_PARSED_POSITIONS,
    )

    const parsedPositions = bitfinexPositionModule.parseMany({
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

    mockExchange()

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

  it('should properly get a Bitfinex parsed position', async () => {

    const mockedRawPosition = BITFINEX_RAW_POSITIONS[0]

    const getRawMock = ImportMock.mockFunction(
      bitfinexPositionModule,
      'getRaw',
      Promise.resolve(mockedRawPosition),
    )

    const { parserMock } = mockedBitfinexPositionParser(
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

    mockExchange()

    const mockedParsedPosition = BITFINEX_PARSED_POSITIONS[1]

    const { requestMock } = mockRequest(true)

    const getMock = ImportMock.mockFunction(
      bitfinexPositionModule,
      'get',
      Promise.resolve(mockedParsedPosition),
    )

    const closedPosition = await bitfinexPositionModule.close({
      id,
    })

    expect(requestMock.callCount).to.be.eq(1)
    expect(requestMock.calledWithExactly({
      url: 'https://api.bitfinex.com/v1/position/close',
      body: { position_id: Number(id) },
      keySecret: exchangeMock.getValue().keySecret,
    })).to.be.ok

    expect(getMock.callCount).to.be.eq(1)
    expect(getMock.args[0][0]).to.deep.eq({
      id,
    })

    expect(mockedParsedPosition).to.deep.eq(closedPosition)

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

  it('should return error if position could not be closed', async () => {

    mockExchange()

    let error
    let result

    const { requestMock } = mockRequest(true)

    const getMock = ImportMock.mockFunction(
      bitfinexPositionModule,
      'get',
      Promise.resolve(BITFINEX_RAW_POSITIONS[0]),
    )

    try {

      result = await bitfinexPositionModule.close({
        id,
      })

    } catch (err) {

      console.log(err)

      error = err

    }

    expect(result).not.to.be.ok

    const errMsg = 'Position could not be closed'

    expect(error.code).to.be.eq(AlunaPositionErrorCodes.COULD_NOT_BE_CLOSED)
    expect(error.message).to.be.eq(errMsg)
    expect(error.httpStatusCode).to.be.eq(500)

    expect(requestMock.callCount).to.be.eq(1)
    expect(getMock.callCount).to.be.eq(1)

  })

})
