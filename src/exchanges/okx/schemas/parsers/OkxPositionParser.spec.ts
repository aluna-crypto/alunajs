import { expect } from 'chai'
import { ImportMock } from 'ts-mock-imports'

import { AlunaPositionStatusEnum } from '../../../../lib/enums/AlunaPositionStatusEnum'
import { mockAlunaSymbolMapping } from '../../../../utils/mappings/AlunaSymbolMapping.mock'
import { OkxPositionSideAdapter } from '../../enums/adapters/OkxPositionSideAdapter'
import { Okx } from '../../Okx'
import { OKX_RAW_POSITION } from '../../test/fixtures/okxPosition'
import { OkxPositionParser } from './OkxPositionParser'



describe('OkxPositionParser', () => {

  it('should parse Okx positions just fine', async () => {

    const mockedSymbolId = 'BTC'

    const baseSymbolId = mockedSymbolId
    const quoteSymbolId = mockedSymbolId

    const { alunaSymbolMappingMock } = mockAlunaSymbolMapping({
      returnSymbol: mockedSymbolId,
    })

    const mockedDate = new Date('2022-04-20T14:19:40.795Z')

    function fakeDateConstructor () {

      return mockedDate

    }

    ImportMock.mockOther(
      global,
      'Date',
      fakeDateConstructor as any,
    )

    const rawPosition = OKX_RAW_POSITION

    const parsedPosition = OkxPositionParser.parse({
      rawPosition,
    })

    const {
      instId,
      posSide,
      avgPx,
      last,
      posId,
      upl,
      uplRatio,
      lever,
      cTime,
      baseBal,
      liqPx,
    } = rawPosition


    const expectedSide = OkxPositionSideAdapter.translateToAluna({
      from: posSide,
    })

    const basePrice = Number(last)
    const openPrice = Number(avgPx)

    const amount = Number(baseBal)

    const total = amount * basePrice

    const pl = parseFloat(upl)
    const plPercentage = parseFloat(uplRatio)
    const leverage = Number(lever)
    const createdAt = new Date(cTime)

    const liquidationPrice = Number(liqPx)

    expect(parsedPosition.exchangeId).to.be.eq(Okx.ID)

    expect(parsedPosition.id).to.be.eq(posId)

    expect(parsedPosition.symbolPair).to.be.eq(instId)
    expect(parsedPosition.baseSymbolId).to.be.eq(baseSymbolId)
    expect(parsedPosition.quoteSymbolId).to.be.eq(quoteSymbolId)

    expect(parsedPosition.status).to.be.eq(AlunaPositionStatusEnum.OPEN)
    expect(parsedPosition.side).to.be.eq(expectedSide)

    expect(parsedPosition.basePrice).to.be.eq(basePrice)
    expect(parsedPosition.openPrice).to.be.eq(openPrice)
    expect(parsedPosition.amount).to.be.eq(amount)
    expect(parsedPosition.total).to.be.eq(total)

    expect(parsedPosition.pl).to.be.eq(pl)
    expect(parsedPosition.plPercentage).to.be.eq(plPercentage)
    expect(parsedPosition.liquidationPrice).to.be.eq(liquidationPrice)
    expect(parsedPosition.leverage).to.be.eq(leverage)

    expect(parsedPosition.openedAt).to.deep.eq(createdAt)
    expect(parsedPosition.closedAt).to.deep.eq(undefined)
    expect(parsedPosition.closePrice).to.deep.eq(undefined)

    expect(alunaSymbolMappingMock.callCount).to.be.eq(2)

  })

})
