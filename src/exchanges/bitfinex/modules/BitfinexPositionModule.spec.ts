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

})
