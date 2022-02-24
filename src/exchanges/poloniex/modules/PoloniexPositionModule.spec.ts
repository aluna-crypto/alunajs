import { expect } from 'chai'
import {
  ImportMock,
  OtherManager,
} from 'ts-mock-imports'

import { IAlunaExchange } from '../../../lib/core/IAlunaExchange'
import { AlunaAccountEnum } from '../../../lib/enums/AlunaAccountEnum'
import { AlunaPositionStatusEnum } from '../../../lib/enums/AlunaPositionStatusEnum'
import { AlunaSideEnum } from '../../../lib/enums/AlunaSideEnum'
import { AlunaPositionErrorCodes } from '../../../lib/errors/AlunaPositionErrorCodes'
import { IAlunaKeySecretSchema } from '../../../lib/schemas/IAlunaKeySecretSchema'
import { Poloniex } from '../Poloniex'
import { PoloniexHttp } from '../PoloniexHttp'
import { PoloniexCurrencyParser } from '../schemas/parsers/PoloniexCurrencyParser'
import { PoloniexPositionParser } from '../schemas/parsers/PoloniexPositionParser'
import {
  POLONIEX_PARSED_POSITIONS,
  POLONIEX_RAW_POSITION_WITH_CURRENCY,
  POLONIEX_RAW_POSITIONS,
} from '../test/fixtures/poloniexPosition'
import { PoloniexPositionModule } from './PoloniexPositionModule'



describe('PoloniexPositionModule', () => {

  const poloniexPositionModule = PoloniexPositionModule.prototype

  let exchangeMock: OtherManager<IAlunaExchange>

  const id = 'BTC_ETH'

  const keySecret: IAlunaKeySecretSchema = {
    key: '',
    secret: '',
  }

  const mockKeySecret = () => {

    exchangeMock = ImportMock.mockOther(
      poloniexPositionModule,
      'exchange',
      { keySecret } as IAlunaExchange,
    )

    return { exchangeMock }

  }

  beforeEach(mockKeySecret)


  const mockRequest = (requestResponse: any) => {

    const requestMock = ImportMock.mockFunction(
      PoloniexHttp,
      'privateRequest',
      Promise.resolve(requestResponse),
    )

    return { requestMock }

  }

  it('should properly list Poloniex raw positions', async () => {

    ImportMock.mockOther(
      poloniexPositionModule,
      'exchange',
      {
        keySecret: {
          key: '',
          secret: '',
        },
      } as IAlunaExchange,
    )

    const requestMock = ImportMock.mockFunction(
      PoloniexHttp,
      'privateRequest',
      POLONIEX_RAW_POSITIONS,
    )

    const currencyParserMock = ImportMock.mockFunction(
      PoloniexCurrencyParser,
      'parse',
      [POLONIEX_RAW_POSITION_WITH_CURRENCY],
    )


    const rawPosition = await poloniexPositionModule.listRaw()

    expect(requestMock.callCount).to.be.eq(1)

    expect(currencyParserMock.callCount).to.be.eq(1)
    expect(currencyParserMock.calledWith({
      rawInfo: POLONIEX_RAW_POSITIONS,
    })).to.be.ok

    expect(rawPosition.length).to.eq(1)
    expect(rawPosition).to.deep.eq([POLONIEX_RAW_POSITION_WITH_CURRENCY])

  })

  it('should properly list Poloniex parsed positions', async () => {

    const poloniexParsedOrders = POLONIEX_PARSED_POSITIONS

    const listRawMock = ImportMock.mockFunction(
      poloniexPositionModule,
      'listRaw',
      ['raw-orders'],
    )

    const parseManyMock = ImportMock.mockFunction(
      poloniexPositionModule,
      'parseMany',
      poloniexParsedOrders,
    )

    const parsedOrders = await poloniexPositionModule.list()

    expect(listRawMock.callCount).to.be.eq(1)

    expect(parseManyMock.callCount).to.be.eq(1)

    expect(parsedOrders.length).to.be.eq(1)

    expect(parsedOrders).to.deep.eq(poloniexParsedOrders)


  })

  it('should properly parse a Poloniex raw position', async () => {

    const rawPosition = POLONIEX_RAW_POSITION_WITH_CURRENCY

    const parseMock = ImportMock.mockFunction(
      PoloniexPositionParser,
      'parse',
    )

    parseMock
      .onFirstCall().returns(POLONIEX_PARSED_POSITIONS[0])

    const parsedPosition1 = await poloniexPositionModule
      .parse({ rawPosition })

    expect(parseMock.callCount).to.be.eq(1)
    expect(parseMock.calledWith({ rawPosition })).to.be.ok

    expect(parsedPosition1.symbolPair).to.be.ok
    expect(parsedPosition1.baseSymbolId).to.be.ok
    expect(parsedPosition1.quoteSymbolId).to.be.ok
    expect(parsedPosition1.total).to.be.ok
    expect(parsedPosition1.amount).to.be.ok
    expect(parsedPosition1.basePrice).to.be.ok
    expect(parsedPosition1.liquidationPrice).to.be.ok
    expect(parsedPosition1.openPrice).to.be.ok
    expect(parsedPosition1.openedAt).to.be.ok


    expect(parsedPosition1.exchangeId).to.be.eq(Poloniex.ID)
    expect(parsedPosition1.status).to.be.eq(AlunaPositionStatusEnum.OPEN)
    expect(parsedPosition1.account).to.be.eq(AlunaAccountEnum.MARGIN)
    expect(parsedPosition1.side).to.be.eq(AlunaSideEnum.LONG)

  })

  it('should properly parse many Poloniex raw positions', async () => {

    const rawPositions = [POLONIEX_RAW_POSITION_WITH_CURRENCY]
    const parsedPositions = POLONIEX_PARSED_POSITIONS

    const parseMock = ImportMock.mockFunction(
      PoloniexPositionParser,
      'parse',
    )

    parsedPositions.forEach((parsed, index) => {

      parseMock.onCall(index).returns(parsed)

    })

    const parsedManyResp = await poloniexPositionModule.parseMany(
      { rawPositions },
    )

    expect(parsedManyResp.length).to.be.eq(1)
    expect(parseMock.callCount).to.be.eq(1)

    parsedManyResp.forEach((parsed, index) => {

      expect(parsed).to.deep.eq(parsedPositions[index])
      expect(parseMock.calledWith({
        rawPosition: parsed,
      }))

    })


  })

  it('should properly get a Poloniex raw position', async () => {

    const keySecret = {
      key: '',
      secret: '',
    }

    ImportMock.mockOther(
      poloniexPositionModule,
      'exchange',
      {
        keySecret,
      } as IAlunaExchange,
    )

    const requestMock = ImportMock.mockFunction(
      PoloniexHttp,
      'privateRequest',
      POLONIEX_RAW_POSITION_WITH_CURRENCY,
    )


    const { currencyPair } = POLONIEX_RAW_POSITION_WITH_CURRENCY

    const id = currencyPair
    const splittedCurrencyPair = currencyPair.split('_')
    const baseCurrency = splittedCurrencyPair[0]
    const quoteCurrency = splittedCurrencyPair[1]

    const rawPosition = await poloniexPositionModule.getRaw({
      id,
    })


    expect(requestMock.callCount).to.be.eq(1)

    expect(rawPosition.baseCurrency).to.be.eq(baseCurrency)
    expect(rawPosition.quoteCurrency).to.be.eq(quoteCurrency)
    expect(rawPosition.currencyPair).to.be.eq(id)

  })

  it('should properly get a Poloniex parsed position', async () => {

    const rawPositionMock = ImportMock.mockFunction(
      poloniexPositionModule,
      'getRaw',
      'rawPosition',
    )

    const parseMock = ImportMock.mockFunction(
      poloniexPositionModule,
      'parse',
      POLONIEX_PARSED_POSITIONS[0],
    )

    const params = {
      id: 'id',
      symbolPair: 'symbolPair',
    }

    const parsedPosition = await poloniexPositionModule.get(params)

    expect(rawPositionMock.callCount).to.be.eq(1)
    expect(rawPositionMock.calledWith(params)).to.be.ok

    expect(parseMock.callCount).to.be.eq(1)
    expect(parseMock.calledWith({ rawPosition: 'rawPosition' })).to.be.ok

    expect(parsedPosition.status).to.be.eq(AlunaPositionStatusEnum.OPEN)
    expect(parsedPosition.account).to.be.eq(AlunaAccountEnum.MARGIN)
    expect(parsedPosition.side).to.be.eq(AlunaSideEnum.LONG)

  })

  it('should properly close Poloniex position', async () => {

    const mockedParsedPosition = POLONIEX_PARSED_POSITIONS[0]

    const { requestMock } = mockRequest(true)

    const getMock = ImportMock.mockFunction(
      poloniexPositionModule,
      'get',
      Promise.resolve(mockedParsedPosition),
    )

    const closedPosition = await poloniexPositionModule.close({
      id,
    })

    expect(requestMock.callCount).to.be.eq(1)

    expect(getMock.callCount).to.be.eq(1)
    expect(getMock.args[0][0]).to.deep.eq({
      id,
    })

    mockedParsedPosition.status = AlunaPositionStatusEnum.CLOSED

    expect(mockedParsedPosition).to.deep.eq(closedPosition)

  })

  it('should ensure position id is given to close position', async () => {

    let error
    let result

    const { requestMock } = mockRequest(true)

    const getMock = ImportMock.mockFunction(
      poloniexPositionModule,
      'get',
      Promise.resolve(POLONIEX_PARSED_POSITIONS[0]),
    )

    try {

      result = await poloniexPositionModule.close({})

    } catch (err) {

      error = err

    }

    expect(result).not.to.be.ok

    const errMsg = 'Position id is required to close Poloniex positions'

    expect(error.code).to.be.eq(AlunaPositionErrorCodes.DOESNT_HAVE_ID)
    expect(error.message).to.be.eq(errMsg)
    expect(error.httpStatusCode).to.be.eq(400)

    expect(requestMock.callCount).to.be.eq(0)
    expect(getMock.callCount).to.be.eq(0)

  })

})
