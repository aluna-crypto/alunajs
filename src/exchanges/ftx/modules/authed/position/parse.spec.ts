import { expect } from 'chai'
import {
  clone,
  each,
} from 'lodash'
import { ImportMock } from 'ts-mock-imports'

import { AlunaAccountEnum } from '../../../../../lib/enums/AlunaAccountEnum'
import { AlunaPositionSideEnum } from '../../../../../lib/enums/AlunaPositionSideEnum'
import { AlunaPositionStatusEnum } from '../../../../../lib/enums/AlunaPositionStatusEnum'
import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { mockTranslateSymbolId } from '../../../../../utils/mappings/translateSymbolId.mock'
import { FtxOrderSideEnum } from '../../../enums/FtxOrderSideEnum'
import { FtxAuthed } from '../../../FtxAuthed'
import { IFtxPositionSchema } from '../../../schemas/IFtxPositionSchema'
import { FTX_RAW_POSITIONS } from '../../../test/fixtures/ftxPositions'
import { mockSplitFtxSymbolPair } from '../../public/market/helpers/splitFtxSymbolPair.mock'



describe(__filename, () => {

  const credentials: IAlunaCredentialsSchema = {
    key: 'key',
    secret: 'secret',
  }

  type TTestArr = {
    testCase: string
    positionProps: Partial<IFtxPositionSchema>
  }


  const testsCasesArr: Array<TTestArr> = [
    {
      testCase: '(OPEN)',
      positionProps: { size: 10 },
    },
    {
      testCase: '(CLOSED)',
      positionProps: { size: 0 },
    },
    {
      testCase: '(LONG)',
      positionProps: { side: FtxOrderSideEnum.BUY },
    },
    {
      testCase: '(SHORT)',
      positionProps: { side: FtxOrderSideEnum.SELL },
    },
    {
      testCase: '(W/ LIQ. PRICE.)',
      positionProps: { estimatedLiquidationPrice: 10 },
    },
  ]

  each(testsCasesArr, (params) => {

    const {
      positionProps,
      testCase,
    } = params

    it(`should parse a Bitmex raw position just fine ${testCase}`, async () => {

      // preparing data
      const rawPosition = clone({
        ...FTX_RAW_POSITIONS[0],
        ...positionProps,
      })

      const expectedBaseSymbolId = 'BTC'
      const expectedQuoteSymbolId = 'ETH'


      // mocking
      const mockedDate = new Date()

      ImportMock.mockFunction(
        global,
        'Date',
        mockedDate,
      )

      const { translateSymbolId } = mockTranslateSymbolId()

      const { splitFtxSymbolPair } = mockSplitFtxSymbolPair()

      splitFtxSymbolPair.returns({
        baseSymbolId: expectedBaseSymbolId,
        quoteSymbolId: expectedQuoteSymbolId,
      })

      translateSymbolId.onFirstCall().returns(expectedBaseSymbolId)
      translateSymbolId.onSecondCall().returns(expectedQuoteSymbolId)


      // executing
      const exchange = new FtxAuthed({ credentials })

      const { position } = exchange.position!.parse({
        rawPosition,
      })


      // validating
      const {
        future,
        size,
        side,
        // netSize,
        // longOrderSize,
        // shortOrderSize,
        cost,
        entryPrice,
        // unrealizedPnl,
        realizedPnl,
        initialMarginRequirement,
        // maintenanceMarginRequirement,
        // openSize,
        // collateralUsed,
        estimatedLiquidationPrice,
      } = rawPosition


      const expectedOpenedAt = new Date()

      let expectedClosedAt: Date | undefined
      let expectedClosePrice: number | undefined
      let expectedStatus: AlunaPositionStatusEnum

      if (size === 0) {

        expectedClosedAt = new Date()
        expectedClosePrice = entryPrice
        expectedStatus = AlunaPositionStatusEnum.CLOSED

      } else {

        expectedStatus = AlunaPositionStatusEnum.OPEN

      }


      const computedSide = side === 'buy'
        ? AlunaPositionSideEnum.LONG
        : AlunaPositionSideEnum.SHORT

      const expectedAmount = Math.abs(size)
      const expectedBasePrice = entryPrice
      const expectedOpenPrice = entryPrice

      const total = Math.abs(cost)

      const expectedPl = realizedPnl
      const expectedPlPercentage = (realizedPnl / 100)
      const expectedLiquidationPrice = estimatedLiquidationPrice || -1
      const expectedLeverage = Math.round((1 / initialMarginRequirement))

      expect(position.symbolPair).to.be.eq(future)
      expect(position.baseSymbolId).to.be.eq(expectedBaseSymbolId)
      expect(position.quoteSymbolId).to.be.eq(expectedQuoteSymbolId)
      expect(position.account).to.be.eq(AlunaAccountEnum.DERIVATIVES)
      expect(position.amount).to.be.eq(expectedAmount)
      expect(position.total).to.be.eq(total)
      expect(position.openPrice).to.be.eq(expectedOpenPrice)
      expect(position.basePrice).to.be.eq(expectedBasePrice)
      expect(position.pl).to.be.eq(expectedPl)
      expect(position.plPercentage).to.be.eq(expectedPlPercentage)
      expect(position.status).to.be.eq(expectedStatus)
      expect(position.side).to.be.eq(computedSide)
      expect(position.liquidationPrice).to.be.eq(expectedLiquidationPrice)
      expect(position.openedAt).to.deep.eq(expectedOpenedAt)
      expect(position.closedAt).to.deep.eq(expectedClosedAt)
      expect(position.closePrice).to.deep.eq(expectedClosePrice)
      expect(position.leverage).to.deep.eq(expectedLeverage)
      expect(position.meta).to.deep.eq(rawPosition)

      expect(splitFtxSymbolPair.callCount).to.be.eq(1)
      expect(splitFtxSymbolPair.firstCall.args[0]).to.deep.eq({
        market: future,
      })

      expect(translateSymbolId.callCount).to.be.eq(2)
      expect(translateSymbolId.firstCall.args[0]).to.deep.eq({
        exchangeSymbolId: expectedBaseSymbolId,
        symbolMappings: exchange.settings.symbolMappings,
      })
      expect(translateSymbolId.secondCall.args[0]).to.deep.eq({
        exchangeSymbolId: expectedQuoteSymbolId,
        symbolMappings: exchange.settings.symbolMappings,
      })

    })

  })

})
