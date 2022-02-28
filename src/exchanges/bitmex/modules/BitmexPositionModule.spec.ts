import { expect } from 'chai'
import {
  each,
  filter,
} from 'lodash'
import { ImportMock } from 'ts-mock-imports'

import { mockExchangeModule } from '../../../../test/utils/exchange/mocks'
import { mockPrivateHttpRequest } from '../../../../test/utils/http/mocks'
import { AlunaHttpVerbEnum } from '../../../lib/enums/AlunaHtttpVerbEnum'
import { AlunaGenericErrorCodes } from '../../../lib/errors/AlunaGenericErrorCodes'
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
      requestResponse: Promise.resolve(BITMEX_RAW_POSITIONS),
    })

    const rawPositions = await bitmexPositionModule.listRaw()

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
      Promise.resolve(mockedRawPositions),
    )

    const parseManyMock = ImportMock.mockFunction(
      bitmexPositionModule,
      'parseMany',
      mockedParsedPositions,
    )

    const parsedPositions = await bitmexPositionModule.list()

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
      Promise.resolve(parsedMarket),
    )

    const bitmexPositionParserMock = ImportMock.mockFunction(
      BitmexPositionParser,
      'parse',
      parsedPosition,
    )

    const parseResponse = await bitmexPositionModule.parse({
      rawPosition,
    })

    expect(parseResponse).to.deep.eq(parsedPosition)

    expect(bitmexMarketModuleMock.callCount).to.be.eq(1)
    expect(bitmexMarketModuleMock.args[0][0]).to.deep.eq({
      symbolPair: rawPosition.symbol,
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
      Promise.resolve(undefined),
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

      parseMock.onCall(i).returns(parsed)

    })

    const parsedPositions = await bitmexPositionModule.parseMany({
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
      requestResponse: Promise.resolve([mockedRawPosition]),
    })

    const rawPosition = await bitmexPositionModule.getRaw({
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
      Promise.resolve(rawPosition),
    )

    const parseMock = ImportMock.mockFunction(
      bitmexPositionModule,
      'parse',
      Promise.resolve(parsedPosition),
    )

    const getResponse = await bitmexPositionModule.get({
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
      Promise.resolve(mockedParsedPosition),
    )

    const closedPosition = await bitmexPositionModule.close({
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
      Promise.resolve(crossPos),
    )

    const expectedLeverage1 = 0

    const leverage1 = await bitmexPositionModule.getLeverage({
      symbolPair: crossPos.symbol,
    })

    expect(leverage1).to.be.eq(expectedLeverage1)

    expect(getMock.callCount).to.be.eq(1)
    expect(getMock.args[0][0]).to.deep.eq({
      symbolPair: crossPos.symbol,
    })


    const [leveragePos] = filter(BITMEX_RAW_POSITIONS, (p) => !p.crossMargin)

    getMock.returns(Promise.resolve(leveragePos))

    const expectedLeverage2 = leveragePos.leverage

    const leverage2 = await bitmexPositionModule.getLeverage({
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
      requestResponse: Promise.resolve(position),
    })

    const leverageRes = await bitmexPositionModule.setLeverage({
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

})
