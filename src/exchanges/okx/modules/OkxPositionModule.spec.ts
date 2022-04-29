import { expect } from 'chai'
import {
  each,
} from 'lodash'
import { ImportMock } from 'ts-mock-imports'

import { mockExchangeModule } from '../../../../test/helpers/exchange'
import { mockPrivateHttpRequest } from '../../../../test/helpers/http/axios'
import { AlunaHttpVerbEnum } from '../../../lib/enums/AlunaHtttpVerbEnum'
import { AlunaGenericErrorCodes } from '../../../lib/errors/AlunaGenericErrorCodes'
import { OkxHttp } from '../OkxHttp'
import { PROD_OKX_URL } from '../OkxSpecs'
import { OkxPositionParser } from '../schemas/parsers/OkxPositionParser'
import {
  OKX_PARSED_POSITION,
  OKX_RAW_POSITION,
} from '../test/fixtures/okxPosition'
import { OkxPositionModule } from './OkxPositionModule'



describe('OkxPositionModule', () => {

  const okxPositionModule = OkxPositionModule.prototype

  const symbol = 'XBTUSD'

  it('should properly list Okx raw positions', async () => {

    const { exchangeMock } = mockExchangeModule({
      module: okxPositionModule,
    })

    const { requestMock } = mockPrivateHttpRequest({
      exchangeHttp: OkxHttp,
      requestResponse: [OKX_RAW_POSITION],
    })

    const { rawPositions } = await okxPositionModule.listRaw()

    expect(rawPositions).to.deep.eq([OKX_RAW_POSITION])
    expect(requestMock.callCount).to.be.eq(1)
    expect(requestMock.calledWithExactly({
      url: `${PROD_OKX_URL}/account/positions`,
      keySecret: exchangeMock.getValue().keySecret,
      verb: AlunaHttpVerbEnum.GET,
    })).to.be.ok

  })

  it('should properly list Okx parsed positions', async () => {

    const mockedRawPositions = [OKX_RAW_POSITION]
    const mockedParsedPositions = [OKX_PARSED_POSITION]

    const listRawMock = ImportMock.mockFunction(
      okxPositionModule,
      'listRaw',
      Promise.resolve({
        rawPositions: mockedRawPositions,
        requestCount: 1,
      }),
    )

    const parseManyMock = ImportMock.mockFunction(
      okxPositionModule,
      'parseMany',
      {
        positions: mockedParsedPositions,
        requestCount: 1,
      },
    )

    const { positions: parsedPositions } = await okxPositionModule.list()

    expect(parsedPositions).to.deep.eq(mockedParsedPositions)

    expect(listRawMock.callCount).to.be.eq(1)

    expect(parseManyMock.callCount).to.be.eq(1)
    expect(parseManyMock.args[0][0]).to.deep.eq({
      rawPositions: mockedRawPositions,
    })

  })

  it('should properly parse a Okx raw position', async () => {

    const rawPosition = OKX_RAW_POSITION
    const parsedPosition = OKX_PARSED_POSITION

    const okxPositionParserMock = ImportMock.mockFunction(
      OkxPositionParser,
      'parse',
      parsedPosition,
    )

    const { position: parseResponse } = await okxPositionModule.parse({
      rawPosition,
    })

    expect(parseResponse).to.deep.eq(parsedPosition)

    expect(okxPositionParserMock.callCount).to.be.eq(1)
    expect(okxPositionParserMock.args[0][0]).to.deep.eq({
      rawPosition,
    })

  })

  it('should properly parse many Okx raw positions', async () => {

    const parseMock = ImportMock.mockFunction(
      okxPositionModule,
      'parse',
    )

    const parsedPositionsMock = [OKX_PARSED_POSITION]

    each(parsedPositionsMock, (parsed, i) => {

      parseMock.onCall(i).returns({
        position: parsed,
        requestCount: 1,
      })

    })

    const {
      positions: parsedPositions,
    } = await okxPositionModule.parseMany({
      rawPositions: [OKX_RAW_POSITION],
    })

    expect(parsedPositions).to.deep.eq([OKX_PARSED_POSITION])

    expect(parseMock.callCount).to.be.eq(parsedPositions.length)

  })

  it('should properly get a Okx raw position', async () => {

    const { exchangeMock } = mockExchangeModule({
      module: okxPositionModule,
    })

    const mockedRawPosition = OKX_RAW_POSITION

    const { requestMock } = mockPrivateHttpRequest({
      exchangeHttp: OkxHttp,
      requestResponse: [mockedRawPosition],
    })

    const { rawPosition } = await okxPositionModule.getRaw({
      symbolPair: symbol,
    })

    expect(rawPosition).to.deep.eq(mockedRawPosition)

    expect(requestMock.callCount).to.be.eq(1)
    expect(requestMock.calledWithExactly({
      url: `${PROD_OKX_URL}/account/positions`,
      keySecret: exchangeMock.getValue().keySecret,
      verb: AlunaHttpVerbEnum.GET,
      query: `instId=${symbol}`,
    })).to.be.ok

  })

  it('should ensure position symbol is given to get a position', async () => {

    let error
    let result

    const { requestMock } = mockPrivateHttpRequest({
      exchangeHttp: OkxHttp,
      requestResponse: [OKX_RAW_POSITION],
    })

    try {

      result = await okxPositionModule.getRaw({})

    } catch (err) {

      error = err

    }

    expect(result).not.to.be.ok

    const errMsg = 'Position symbol is required to get Okx positions'

    expect(error.code).to.be.eq(AlunaGenericErrorCodes.PARAM_ERROR)
    expect(error.message).to.be.eq(errMsg)
    expect(error.httpStatusCode).to.be.eq(400)

    expect(requestMock.callCount).to.be.eq(0)

  })

  it('should properly get a Okx parsed position', async () => {

    const rawPosition = OKX_RAW_POSITION
    const parsedPosition = OKX_PARSED_POSITION

    const getRawMock = ImportMock.mockFunction(
      okxPositionModule,
      'getRaw',
      Promise.resolve({
        rawPosition,
        requestCount: 1,
      }),
    )

    const parseMock = ImportMock.mockFunction(
      okxPositionModule,
      'parse',
      Promise.resolve({
        position: parsedPosition,
        requestCount: 1,
      }),
    )

    const { position: getResponse } = await okxPositionModule.get({
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

  it('should properly close Okx position', async () => {

    const { exchangeMock } = mockExchangeModule({
      module: okxPositionModule,
    })

    const mockedParsedPosition = OKX_PARSED_POSITION

    const { requestMock } = mockPrivateHttpRequest({
      exchangeHttp: OkxHttp,
      requestResponse: [OKX_RAW_POSITION],
    })

    const getMock = ImportMock.mockFunction(
      okxPositionModule,
      'get',
      Promise.resolve({
        position: mockedParsedPosition,
        requestCount: 1,
      }),
    )

    const id = '1'

    const { position: closedPosition } = await okxPositionModule.close({
      symbolPair: symbol,
      id,
    })

    expect(requestMock.callCount).to.be.eq(1)
    expect(requestMock.calledWithExactly({
      url: `${PROD_OKX_URL}/trade/cancel-order`,
      body: {
        ordId: id,
        instId: symbol,
      },
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
      exchangeHttp: OkxHttp,
    })

    try {

      result = await okxPositionModule.close({})

    } catch (err) {

      error = err

    }

    expect(result).not.to.be.ok

    const errMsg = 'Position symbol is required to close Okx positions'

    expect(error.code).to.be.eq(AlunaGenericErrorCodes.PARAM_ERROR)
    expect(error.message).to.be.eq(errMsg)
    expect(error.httpStatusCode).to.be.eq(400)

    expect(requestMock.callCount).to.be.eq(0)

  })

  it('should throw an error if position is not found on close', async () => {

    let error
    let result

    mockExchangeModule({
      module: okxPositionModule,
    })

    const response = [{
      sCode: '51400',
      sMsg: 'Position not found',
    }]

    const { requestMock } = mockPrivateHttpRequest({
      exchangeHttp: OkxHttp,
      requestResponse: response,
    })

    try {

      result = await okxPositionModule.close({
        symbolPair: 'BTC-USDT',
        id: '213456',
      })

    } catch (err) {

      error = err

    }

    expect(result).not.to.be.ok

    const errMsg = 'Position not found'

    expect(error.code).to.be.eq(AlunaGenericErrorCodes.NOT_FOUND)
    expect(error.message).to.be.eq(errMsg)
    expect(error.httpStatusCode).to.be.eq(404)

    expect(requestMock.callCount).to.be.eq(1)

  })

  it('should get position leverage just fine', async () => {

    const crossPos = OKX_RAW_POSITION

    const getMock = ImportMock.mockFunction(
      okxPositionModule,
      'getRaw',
      Promise.resolve({
        rawPosition: crossPos,
        requestCount: 1,
      }),
    )

    const expectedLeverage1 = Number(crossPos.lever)

    const { leverage: leverage1 } = await okxPositionModule.getLeverage({
      symbolPair: crossPos.instId,
    })

    expect(leverage1).to.be.eq(expectedLeverage1)

    expect(getMock.callCount).to.be.eq(1)
    expect(getMock.args[0][0]).to.deep.eq({
      symbolPair: crossPos.instId,
    })

  })

  it('should set position leverage just fine', async () => {

    const { exchangeMock } = mockExchangeModule({
      module: okxPositionModule,
    })

    const leverage = 10

    const position = OKX_RAW_POSITION

    const { requestMock } = mockPrivateHttpRequest({
      exchangeHttp: OkxHttp,
      requestResponse: [position],
    })

    const { leverage: leverageRes } = await okxPositionModule.setLeverage({
      leverage,
      symbolPair: position.instId,
    })

    expect(leverageRes).to.be.eq(leverage)

    expect(requestMock.callCount).to.be.eq(1)
    expect(requestMock.args[0][0]).to.deep.eq({
      url: `${PROD_OKX_URL}/account/set-leverage`,
      body: {
        instId: position.instId,
        lever: leverage.toString(),
        mgnMode: 'cross',
      },
      keySecret: exchangeMock.getValue().keySecret,
    })

  })

  // it('should throw error if infuccient balance to set leverage', async () => {

  //   mockExchangeModule({ module: okxPositionModule })

  //   const throwedError1 = new AlunaError({
  //     code: AlunaHttpErrorCodes.REQUEST_ERROR,
  //     message: 'Account has zero XBt margin balance',
  //     httpStatusCode: 404,
  //     metadata: {
  //       error: 'Account has zero XBt margin balance',
  //     },
  //   })

  //   const { requestMock } = mockPrivateHttpRequest({
  //     exchangeHttp: OkxHttp,
  //     requestResponse: Promise.reject(throwedError1),
  //     isReject: true,
  //   })

  //   const symbolPair = 'XBTUSD'

  //   const res = await executeAndCatch(() => okxPositionModule.setLeverage({
  //     leverage: 10,
  //     symbolPair,
  //   }))

  //   const {
  //     result,
  //     error,
  //   } = res

  //   expect(result).not.to.be.ok

  //   const message = `Cannot set leverage for ${symbolPair} because of `
  //     .concat('insufficient balance')

  //   expect(error!.code).to.be.eq(AlunaBalanceErrorCodes.INSUFFICIENT_BALANCE)
  //   expect(error!.httpStatusCode).to.be.eq(400)
  //   expect(error!.message).to.be.eq(message)
  //   expect(error!.metadata).to.deep.eq(throwedError1.metadata)

  //   expect(requestMock.callCount).to.be.eq(1)


  //   const throwedError2 = new AlunaError({
  //     code: AlunaExchangeErrorCodes.EXCHANGE_IS_DOWN,
  //     message: 'Exchange is down',
  //     httpStatusCode: 500,
  //     metadata: {
  //       error: 'Exchange is offline.',
  //     },
  //   })

  //   requestMock.returns(Promise.reject(throwedError2))

  //   const res2 = await executeAndCatch(() => okxPositionModule.setLeverage({
  //     leverage: 10,
  //     symbolPair,
  //   }))

  //   const {
  //     result: result2,
  //     error: error2,
  //   } = res2

  //   expect(result2).not.to.be.ok

  //   expect(error2!.code).to.be.eq(throwedError2.code)
  //   expect(error2!.httpStatusCode).to.be.eq(throwedError2.httpStatusCode)
  //   expect(error2!.message).to.be.eq(throwedError2.message)
  //   expect(error2!.metadata).to.deep.eq(throwedError2.metadata)

  //   expect(requestMock.callCount).to.be.eq(2)

  // })

})
