import { expect } from 'chai'
import {
  each,
  filter,
} from 'lodash'
import { ImportMock } from 'ts-mock-imports'

import { mockExchangeModule } from '../../../../test/helpers/exchange'
import { mockPrivateHttpRequest } from '../../../../test/helpers/http'
import { AlunaError } from '../../../lib/core/AlunaError'
import { AlunaHttpVerbEnum } from '../../../lib/enums/AlunaHtttpVerbEnum'
import { AlunaBalanceErrorCodes } from '../../../lib/errors/AlunaBalanceErrorCodes'
import { AlunaExchangeErrorCodes } from '../../../lib/errors/AlunaExchangeErrorCodes'
import { AlunaGenericErrorCodes } from '../../../lib/errors/AlunaGenericErrorCodes'
import { AlunaHttpErrorCodes } from '../../../lib/errors/AlunaHttpErrorCodes'
import { executeAndCatch } from '../../../utils/executeAndCatch'
import { BitmexHttp } from '../BitmexHttp'
import { PROD_BITMEX_URL } from '../BitmexSpecs'
import { BitmexPositionParser } from '../schemas/parsers/BitmexPositionParser'
import { BITMEX_PARSED_MARKETS } from '../test/bitmexMarkets'
import {
  BITMEX_PARSED_POSITIONS,
  BITMEX_RAW_POSITIONS,
} from '../test/bitmexPositions'
import { BitmexMarketModule } from './BitmexMarketModule'
import { BitmexPositionModule } from './BitmexPositionModule'



describe('BitmexPositionModule', () => {

  const bitmexPositionModule = BitmexPositionModule.prototype

  const symbol = 'XBTUSD'

  it('should properly list Bitmex raw positions', async () => {

    const { exchangeMock } = mockExchangeModule({
      module: bitmexPositionModule,
    })

    const { requestMock } = mockPrivateHttpRequest({
      exchangeHttp: BitmexHttp,
      requestResponse: BITMEX_RAW_POSITIONS,
    })

    const { rawPositions } = await bitmexPositionModule.listRaw()

    expect(rawPositions).to.deep.eq(BITMEX_RAW_POSITIONS)
    expect(requestMock.callCount).to.be.eq(1)
    expect(requestMock.calledWithExactly({
      url: `${PROD_BITMEX_URL}/position`,
      keySecret: exchangeMock.getValue().keySecret,
      verb: AlunaHttpVerbEnum.GET,
      body: { filter: { isOpen: true } },
    })).to.be.ok

  })

  it('should properly list Bitmex parsed positions', async () => {

    const mockedRawPositions = BITMEX_RAW_POSITIONS
    const mockedParsedPositions = BITMEX_PARSED_POSITIONS

    const listRawMock = ImportMock.mockFunction(
      bitmexPositionModule,
      'listRaw',
      Promise.resolve({
        rawPositions: mockedRawPositions,
        requestCount: 1,
      }),
    )

    const parseManyMock = ImportMock.mockFunction(
      bitmexPositionModule,
      'parseMany',
      {
        positions: mockedParsedPositions,
        requestCount: 1,
      },
    )

    const { positions: parsedPositions } = await bitmexPositionModule.list()

    expect(parsedPositions).to.deep.eq(mockedParsedPositions)

    expect(listRawMock.callCount).to.be.eq(1)

    expect(parseManyMock.callCount).to.be.eq(1)
    expect(parseManyMock.args[0][0]).to.deep.eq({
      rawPositions: mockedRawPositions,
    })

  })

  it('should properly parse a Bitmex raw position', async () => {

    const parsedMarket = BITMEX_PARSED_MARKETS[0]

    const rawPosition = BITMEX_RAW_POSITIONS[0]
    const parsedPosition = BITMEX_PARSED_POSITIONS[0]

    const bitmexMarketModuleMock = ImportMock.mockFunction(
      BitmexMarketModule,
      'get',
      Promise.resolve({
        market: parsedMarket,
        requestCount: 1,
      }),
    )

    const bitmexPositionParserMock = ImportMock.mockFunction(
      BitmexPositionParser,
      'parse',
      parsedPosition,
    )

    const { position: parseResponse } = await bitmexPositionModule.parse({
      rawPosition,
    })

    expect(parseResponse).to.deep.eq(parsedPosition)

    expect(bitmexMarketModuleMock.callCount).to.be.eq(1)
    expect(bitmexMarketModuleMock.args[0][0]).to.deep.eq({
      id: rawPosition.symbol,
    })

    expect(bitmexPositionParserMock.callCount).to.be.eq(1)
    expect(bitmexPositionParserMock.args[0][0]).to.deep.eq({
      rawPosition,
      baseSymbolId: parsedMarket.baseSymbolId,
      quoteSymbolId: parsedMarket.quoteSymbolId,
      instrument: parsedMarket.instrument!,
    })

  })

  it('should ensure position market is found to parse position', async () => {

    let error
    let result

    const rawPosition = BITMEX_RAW_POSITIONS[0]
    const parsedPosition = BITMEX_PARSED_POSITIONS[0]

    const bitmexMarketModuleMock = ImportMock.mockFunction(
      BitmexMarketModule,
      'get',
      Promise.resolve({
        market: undefined,
        requestCount: 1,
      }),
    )

    const bitmexPositionParserMock = ImportMock.mockFunction(
      BitmexPositionParser,
      'parse',
      parsedPosition,
    )

    try {

      result = await bitmexPositionModule.parse({
        rawPosition,
      })

    } catch (err) {

      error = err

    }

    expect(result).not.to.be.ok

    const msg = `Bitmex symbol pair not found for ${rawPosition.symbol}`

    expect(error).to.be.ok
    expect(error.code).to.be.eq(AlunaGenericErrorCodes.PARAM_ERROR)
    expect(error.message).to.be.eq(msg)

    expect(bitmexMarketModuleMock.callCount).to.be.eq(1)

    expect(bitmexPositionParserMock.callCount).to.be.eq(0)

  })

  it('should properly parse many Bitmex raw positions', async () => {

    const parseMock = ImportMock.mockFunction(
      bitmexPositionModule,
      'parse',
    )

    each(BITMEX_PARSED_POSITIONS, (parsed, i) => {

      parseMock.onCall(i).returns({
        position: parsed,
        requestCount: 1,
      })

    })

    const {
      positions: parsedPositions,
    } = await bitmexPositionModule.parseMany({
      rawPositions: BITMEX_RAW_POSITIONS,
    })

    expect(parsedPositions).to.deep.eq(BITMEX_PARSED_POSITIONS)

    expect(parseMock.callCount).to.be.eq(parsedPositions.length)

  })

  it('should properly get a Bitmex raw position', async () => {

    const { exchangeMock } = mockExchangeModule({
      module: bitmexPositionModule,
    })

    const mockedRawPosition = BITMEX_RAW_POSITIONS[0]

    const { requestMock } = mockPrivateHttpRequest({
      exchangeHttp: BitmexHttp,
      requestResponse: [mockedRawPosition],
    })

    const { rawPosition } = await bitmexPositionModule.getRaw({
      symbolPair: symbol,
    })

    expect(rawPosition).to.deep.eq(mockedRawPosition)

    expect(requestMock.callCount).to.be.eq(1)
    expect(requestMock.calledWithExactly({
      url: `${PROD_BITMEX_URL}/position`,
      body: { filter: { symbol } },
      keySecret: exchangeMock.getValue().keySecret,
      verb: AlunaHttpVerbEnum.GET,
    })).to.be.ok

  })

  it('should ensure position symbol is given to get a position', async () => {

    let error
    let result

    const { requestMock } = mockPrivateHttpRequest({
      exchangeHttp: BitmexHttp,
    })

    try {

      result = await bitmexPositionModule.getRaw({})

    } catch (err) {

      error = err

    }

    expect(result).not.to.be.ok

    const errMsg = 'Position symbol is required to get Bitmex positions'

    expect(error.code).to.be.eq(AlunaGenericErrorCodes.PARAM_ERROR)
    expect(error.message).to.be.eq(errMsg)
    expect(error.httpStatusCode).to.be.eq(400)

    expect(requestMock.callCount).to.be.eq(0)

  })

  it('should properly get a Bitmex parsed position', async () => {

    const rawPosition = BITMEX_RAW_POSITIONS[0]
    const parsedPosition = BITMEX_PARSED_POSITIONS[0]

    const getRawMock = ImportMock.mockFunction(
      bitmexPositionModule,
      'getRaw',
      Promise.resolve({
        rawPosition,
        requestCount: 1,
      }),
    )

    const parseMock = ImportMock.mockFunction(
      bitmexPositionModule,
      'parse',
      Promise.resolve({
        position: parsedPosition,
        requestCount: 1,
      }),
    )

    const { position: getResponse } = await bitmexPositionModule.get({
      symbolPair: symbol,
    })

    expect(parsedPosition).to.deep.eq(getResponse)

    expect(getRawMock.callCount).to.be.eq(1)
    expect(getRawMock.args[0][0]).to.deep.eq({
      symbolPair: symbol,
    })

    expect(parseMock.callCount).to.be.eq(1)
    expect(parseMock.args[0][0]).to.deep.eq({
      rawPosition,
    })

  })

  it('should properly close Bitmex position', async () => {

    const { exchangeMock } = mockExchangeModule({
      module: bitmexPositionModule,
    })

    const mockedParsedPosition = BITMEX_PARSED_POSITIONS[0]

    const { requestMock } = mockPrivateHttpRequest({
      exchangeHttp: BitmexHttp,
    })

    const getMock = ImportMock.mockFunction(
      bitmexPositionModule,
      'get',
      Promise.resolve({
        position: mockedParsedPosition,
        requestCount: 1,
      }),
    )

    const { position: closedPosition } = await bitmexPositionModule.close({
      symbolPair: symbol,
    })

    expect(requestMock.callCount).to.be.eq(1)
    expect(requestMock.calledWithExactly({
      url: `${PROD_BITMEX_URL}/order`,
      body: { execInst: 'Close', symbol },
      keySecret: exchangeMock.getValue().keySecret,
    })).to.be.ok

    expect(getMock.callCount).to.be.eq(1)
    expect(getMock.args[0][0]).to.deep.eq({
      symbolPair: symbol,
    })

    expect(mockedParsedPosition).to.deep.eq(closedPosition)

  })

  it('should ensure position symbol is given to close position', async () => {

    let error
    let result

    const { requestMock } = mockPrivateHttpRequest({
      exchangeHttp: BitmexHttp,
    })

    try {

      result = await bitmexPositionModule.close({})

    } catch (err) {

      error = err

    }

    expect(result).not.to.be.ok

    const errMsg = 'Position symbol is required to close Bitmex positions'

    expect(error.code).to.be.eq(AlunaGenericErrorCodes.PARAM_ERROR)
    expect(error.message).to.be.eq(errMsg)
    expect(error.httpStatusCode).to.be.eq(400)

    expect(requestMock.callCount).to.be.eq(0)

  })

  it('should get position leverage just fine', async () => {

    const [crossPos] = filter(BITMEX_RAW_POSITIONS, (p) => p.crossMargin)

    const getMock = ImportMock.mockFunction(
      bitmexPositionModule,
      'getRaw',
      Promise.resolve({
        rawPosition: crossPos,
        requestCount: 1,
      }),
    )

    const expectedLeverage1 = 0

    const { leverage: leverage1 } = await bitmexPositionModule.getLeverage({
      symbolPair: crossPos.symbol,
    })

    expect(leverage1).to.be.eq(expectedLeverage1)

    expect(getMock.callCount).to.be.eq(1)
    expect(getMock.args[0][0]).to.deep.eq({
      symbolPair: crossPos.symbol,
    })


    const [leveragePos] = filter(BITMEX_RAW_POSITIONS, (p) => !p.crossMargin)

    getMock.returns(Promise.resolve({
      rawPosition: leveragePos,
      requestCount: 1,
    }))

    const expectedLeverage2 = leveragePos.leverage

    const { leverage: leverage2 } = await bitmexPositionModule.getLeverage({
      symbolPair: leveragePos.symbol,
    })

    expect(leverage2).to.be.eq(expectedLeverage2)

    expect(getMock.callCount).to.be.eq(2)
    expect(getMock.args[1][0]).to.deep.eq({
      symbolPair: leveragePos.symbol,
    })

  })

  it('should set position leverage just fine', async () => {

    const { exchangeMock } = mockExchangeModule({
      module: bitmexPositionModule,
    })

    const leverage = 50

    const [position] = filter(BITMEX_RAW_POSITIONS, (p) => {

      return p.leverage === leverage

    })

    const { requestMock } = mockPrivateHttpRequest({
      exchangeHttp: BitmexHttp,
      requestResponse: position,
    })

    const { leverage: leverageRes } = await bitmexPositionModule.setLeverage({
      leverage,
      symbolPair: position.symbol,
    })

    expect(leverageRes).to.be.eq(leverage)

    expect(requestMock.callCount).to.be.eq(1)
    expect(requestMock.args[0][0]).to.deep.eq({
      url: `${PROD_BITMEX_URL}/position/leverage`,
      body: { symbol: position.symbol, leverage },
      keySecret: exchangeMock.getValue().keySecret,
    })

  })

  it('should throw error if infuccient balance to set leverage', async () => {

    mockExchangeModule({ module: bitmexPositionModule })

    const throwedError1 = new AlunaError({
      code: AlunaHttpErrorCodes.REQUEST_ERROR,
      message: 'Account has zero XBt margin balance',
      httpStatusCode: 404,
      metadata: {
        error: 'Account has zero XBt margin balance',
      },
    })

    const { requestMock } = mockPrivateHttpRequest({
      exchangeHttp: BitmexHttp,
      requestResponse: Promise.reject(throwedError1),
      isReject: true,
    })

    const symbolPair = 'XBTUSD'

    const res = await executeAndCatch(() => bitmexPositionModule.setLeverage({
      leverage: 10,
      symbolPair,
    }))

    const {
      result,
      error,
    } = res

    expect(result).not.to.be.ok

    const message = `Cannot set leverage for ${symbolPair} because of `
      .concat('insufficient balance')

    expect(error!.code).to.be.eq(AlunaBalanceErrorCodes.INSUFFICIENT_BALANCE)
    expect(error!.httpStatusCode).to.be.eq(400)
    expect(error!.message).to.be.eq(message)
    expect(error!.metadata).to.deep.eq(throwedError1.metadata)

    expect(requestMock.callCount).to.be.eq(1)


    const throwedError2 = new AlunaError({
      code: AlunaExchangeErrorCodes.EXCHANGE_IS_DOWN,
      message: 'Exchange is down',
      httpStatusCode: 500,
      metadata: {
        error: 'Exchange is offline.',
      },
    })

    requestMock.returns(Promise.reject(throwedError2))

    const res2 = await executeAndCatch(() => bitmexPositionModule.setLeverage({
      leverage: 10,
      symbolPair,
    }))

    const {
      result: result2,
      error: error2,
    } = res2

    expect(result2).not.to.be.ok

    expect(error2!.code).to.be.eq(throwedError2.code)
    expect(error2!.httpStatusCode).to.be.eq(throwedError2.httpStatusCode)
    expect(error2!.message).to.be.eq(throwedError2.message)
    expect(error2!.metadata).to.deep.eq(throwedError2.metadata)

    expect(requestMock.callCount).to.be.eq(2)

  })

})
