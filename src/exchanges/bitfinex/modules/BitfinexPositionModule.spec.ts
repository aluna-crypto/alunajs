import { expect } from 'chai'
import Sinon from 'sinon'
import {
  ImportMock,
  OtherManager,
} from 'ts-mock-imports'

import {
  IAlunaExchange,
  IAlunaKeySecretSchema,
  IAlunaPositionSchema,
} from '../../..'
import { BitfinexHttp } from '../BitfinexHttp'
import { BitfinexPositionParser } from '../schemas/parsers/BitfinexPositionParser'
import {
  BITFINEX_PARSED_POSITIONS,
  BITFINEX_RAW_POSITIONS,
} from '../test/fixtures/bitfinexPosition'
import { BitfinexPositionModule } from './BitfinexPositionModule'



describe('BitfinexPositionModule', () => {

  const bitfinexPositionModule = BitfinexPositionModule.prototype

  let exchangeMock: OtherManager<IAlunaExchange>

  const keySecret: IAlunaKeySecretSchema = {
    key: '',
    secret: '',
  }

  const mockKeySecret = () => {

    exchangeMock = ImportMock.mockOther(
      bitfinexPositionModule,
      'exchange',
      { keySecret } as IAlunaExchange,
    )

    return { exchangeMock }

  }

  beforeEach(mockKeySecret)


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

    const { requestMock } = mockRequest(BITFINEX_RAW_POSITIONS)

    const rawOrders = await bitfinexPositionModule.listRaw()

    expect(rawOrders).to.deep.eq(BITFINEX_RAW_POSITIONS)
    expect(requestMock.callCount).to.be.eq(1)
    expect(requestMock.calledWithExactly({
      url: 'https://api.bitfinex.com/v2/auth/r/positions',
      keySecret: exchangeMock.getValue().keySecret,
    })).to.be.ok

  })

  it('should properly parse a Bitfinex raw position', () => {

    const { parserMock } = mockedBitfinexPositionParser(
      BITFINEX_PARSED_POSITIONS,
      false,
    )

    BITFINEX_RAW_POSITIONS.forEach((rawPosition, i) => {

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

  it('should properly get a raw Bitfinex raw position', async () => {

    const id = '666'

    const mockedRawOrder = [BITFINEX_RAW_POSITIONS[0]]

    const { requestMock } = mockRequest(mockedRawOrder)

    const rawOrder = await bitfinexPositionModule.getRaw({
      id,
    })

    expect(rawOrder).to.deep.eq(mockedRawOrder[0])
    expect(requestMock.callCount).to.be.eq(1)
    expect(requestMock.calledWithExactly({
      url: 'https://api.bitfinex.com/v2/auth/r/positions/audit',
      keySecret: exchangeMock.getValue().keySecret,
      body: { id: [id], limit: 1 },
    })).to.be.ok

  })

})
