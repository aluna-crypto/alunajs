import { expect } from 'chai'
import { ImportMock } from 'ts-mock-imports'

import { AlunaAccountEnum } from '../../../../lib/enums/AlunaAccountEnum'
import { mockAlunaSymbolMapping } from '../../../../utils/mappings/AlunaSymbolMapping.mock'
import { OkxOrderSideAdapter } from '../../enums/adapters/OkxOrderSideAdapter'
import { OkxOrderTypeAdapter } from '../../enums/adapters/OkxOrderTypeAdapter'
import { OkxStatusAdapter } from '../../enums/adapters/OkxStatusAdapter'
import { OkxOrderStatusEnum } from '../../enums/OkxOrderStatusEnum'
import {
  OKX_RAW_ORDER,
} from '../../test/fixtures/okxOrder'
import { IOkxOrderSchema } from '../IOkxOrderSchema'
import { OkxOrderParser } from './OkxOrderParser'



describe('OkxOrderParser', () => {

  const translatedSymbol = 'BTC'

  const mockDeps = () => {

    const { alunaSymbolMappingMock } = mockAlunaSymbolMapping({
      returnSymbol: translatedSymbol,
    })

    return { alunaSymbolMappingMock }

  }

  it('should parse Okx order just fine', async () => {

    const { alunaSymbolMappingMock } = mockDeps()

    const rawOrder: IOkxOrderSchema = OKX_RAW_ORDER

    const parsedOrder = OkxOrderParser.parse({
      rawOrder,
    })

    const rawOriginalQuantity = parseFloat(rawOrder.sz)
    const rawPrice = parseFloat(rawOrder.px)
    const rawSide = rawOrder.side
    const rawType = rawOrder.ordType
    const rawStatus = rawOrder.state

    expect(parsedOrder.id).to.be.eq(rawOrder.ordId)
    expect(parsedOrder.baseSymbolId).to.be.eq(translatedSymbol)
    expect(parsedOrder.quoteSymbolId).to.be.eq(translatedSymbol)
    expect(parsedOrder.symbolPair).to.be.eq(rawOrder.instId)
    expect(parsedOrder.total).to.be.eq(rawOriginalQuantity * rawPrice)
    expect(parsedOrder.amount).to.be.eq(rawOriginalQuantity)
    expect(parsedOrder.rate).to.be.eq(rawPrice)
    expect(parsedOrder.account).to.be.eq(AlunaAccountEnum.EXCHANGE)

    expect(parsedOrder.side)
      .to.be.eq(OkxOrderSideAdapter.translateToAluna({ from: rawSide }))
    expect(parsedOrder.status)
      .to.be.eq(OkxStatusAdapter.translateToAluna({ from: rawStatus }))
    expect(parsedOrder.type)
      .to.be.eq(OkxOrderTypeAdapter.translateToAluna({ from: rawType }))
    expect(parsedOrder.placedAt.getTime())
      .to.be.eq(new Date(Number(rawOrder.cTime)).getTime())

    expect(alunaSymbolMappingMock.callCount).to.be.eq(2)

  })

  it(
    'should parse Okx order just fine without time and updateTime',
    async () => {

      const mockedDate = new Date(Date.now())

      function mockedDateConstructor () {

        return mockedDate

      }

      ImportMock.mockOther(
        global,
        'Date',
        mockedDateConstructor as any,
      )

      const { alunaSymbolMappingMock } = mockDeps()

      const rawOrder: IOkxOrderSchema = OKX_RAW_ORDER

      rawOrder.cTime = undefined as any
      rawOrder.state = OkxOrderStatusEnum.CANCELED
      rawOrder.uTime = undefined as any

      const parsedOrder = OkxOrderParser.parse({
        rawOrder,
      })

      expect(parsedOrder.placedAt.getTime()).to.be.eq(new Date().getTime())

      expect(parsedOrder.canceledAt).to.be.eq(undefined)

      expect(alunaSymbolMappingMock.callCount).to.be.eq(2)

    },
  )

  it('should parse Okx order just fine with updateTime', async () => {

    const { alunaSymbolMappingMock } = mockDeps()

    const rawOrder: IOkxOrderSchema = OKX_RAW_ORDER

    rawOrder.cTime = new Date().getTime().toString()
    rawOrder.uTime = new Date().getTime().toString()
    rawOrder.state = OkxOrderStatusEnum.CANCELED

    const parsedOrder = OkxOrderParser.parse({
      rawOrder,
    })

    expect(alunaSymbolMappingMock.callCount).to.be.eq(2)
    expect(alunaSymbolMappingMock.args[0][0]).to.deep.eq({
      exchangeSymbolId: rawOrder.ccy,
      symbolMappings: {},
    })
    expect(alunaSymbolMappingMock.args[1][0]).to.deep.eq({
      exchangeSymbolId: rawOrder.tgtCcy,
      symbolMappings: {},
    })

    const updatedAt = new Date(Number(rawOrder.uTime)).getTime()

    expect(parsedOrder.canceledAt?.getTime()).to.be.eq(updatedAt)

    rawOrder.state = OkxOrderStatusEnum.FILLED

    const parsedOrder2 = OkxOrderParser.parse({
      rawOrder,
    })

    expect(parsedOrder2.filledAt?.getTime()).to.be.eq(updatedAt)

    expect(alunaSymbolMappingMock.callCount).to.be.eq(4)
    expect(alunaSymbolMappingMock.args[2][0]).to.deep.eq({
      exchangeSymbolId: rawOrder.ccy,
      symbolMappings: {},
    })
    expect(alunaSymbolMappingMock.args[3][0]).to.deep.eq({
      exchangeSymbolId: rawOrder.tgtCcy,
      symbolMappings: {},
    })

  })

})
