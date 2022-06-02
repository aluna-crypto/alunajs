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


      let expectedClosedAt: Date | undefined
      let expectedClosePrice: number | undefined
      let expectedStatus: AlunaPositionStatusEnum

      let expectedBasePrice: number
      let expectedOpenPrice: number
      let expectedAmount: number
      let expectedTotal: number
      let expectedPl: number
      let expectedPlPercentage: number
      let expectedLiquidationPrice: number
      let expectedLeverage: number

      const expectedOpenedAt = new Date()
      const isOpen = size !== 0

      if (isOpen) {

        expectedStatus = AlunaPositionStatusEnum.OPEN

        expectedTotal = Math.abs(cost)
        expectedAmount = Math.abs(size)

        expectedBasePrice = entryPrice
        expectedOpenPrice = (cost - realizedPnl) / size

        expectedPl = realizedPnl
        expectedPlPercentage = (((expectedBasePrice - expectedOpenPrice) / expectedOpenPrice) * 100)
        expectedLiquidationPrice = estimatedLiquidationPrice || -1
        expectedLeverage = Math.round((1 / initialMarginRequirement))

      } else {

        expectedStatus = AlunaPositionStatusEnum.CLOSED
        expectedClosedAt = new Date()
        expectedClosePrice = -1

        expectedTotal = -1
        expectedAmount = -1

        expectedBasePrice = -1
        expectedOpenPrice = -1

        expectedPl = -1
        expectedPlPercentage = -1
        expectedLiquidationPrice = -1
        expectedLeverage = -1

      }

      const expectedComputedSide = side === FtxOrderSideEnum.BUY
        ? AlunaPositionSideEnum.LONG
        : AlunaPositionSideEnum.SHORT

      expect(position.symbolPair).to.be.eq(future)
      expect(position.baseSymbolId).to.be.eq(expectedBaseSymbolId)
      expect(position.quoteSymbolId).to.be.eq(expectedQuoteSymbolId)
      expect(position.account).to.be.eq(AlunaAccountEnum.DERIVATIVES)
      expect(position.amount).to.be.eq(expectedAmount)
      expect(position.total).to.be.eq(expectedTotal)
      expect(position.openPrice).to.be.eq(expectedOpenPrice)
      expect(position.basePrice).to.be.eq(expectedBasePrice)
      expect(position.pl).to.be.eq(expectedPl)
      expect(position.plPercentage).to.be.eq(expectedPlPercentage)
      expect(position.status).to.be.eq(expectedStatus)
      expect(position.side).to.be.eq(expectedComputedSide)
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
