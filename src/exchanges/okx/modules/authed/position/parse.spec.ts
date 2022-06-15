import { expect } from 'chai'
import { AlunaAccountEnum } from '../../../../../lib/enums/AlunaAccountEnum'
import { AlunaPositionStatusEnum } from '../../../../../lib/enums/AlunaPositionStatusEnum'

import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { mockTranslateSymbolId } from '../../../../../utils/mappings/translateSymbolId.mock'
import { translatePositionSideToAluna } from '../../../enums/adapters/okxPositionSideAdapter'
import { OkxAuthed } from '../../../OkxAuthed'
import { OKX_RAW_POSITIONS } from '../../../test/fixtures/okxPositions'



describe(__filename, () => {

  const credentials: IAlunaCredentialsSchema = {
    key: 'key',
    secret: 'secret',
  }

  it('should parse a Okx raw position just fine', async () => {

    // preparing data
    const rawPosition = OKX_RAW_POSITIONS[0]

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

    const [baseSymbolId, quoteSymbolId] = instId.split('/')

    const side = translatePositionSideToAluna({
      from: posSide,
    })

    const basePrice = Number(last)
    const openPrice = Number(avgPx)
    const amount = Number(baseBal)
    const total = amount * basePrice
    const pl = parseFloat(upl)
    const plPercentage = parseFloat(uplRatio)
    const leverage = Number(lever)
    const openedAt = new Date(Number(cTime))
    const liquidationPrice = Number(liqPx)
    const status = AlunaPositionStatusEnum.OPEN

    // mocking

    const { translateSymbolId } = mockTranslateSymbolId()

    translateSymbolId.onFirstCall().returns(baseSymbolId)

    translateSymbolId.onSecondCall().returns(quoteSymbolId)

    // executing

    const exchange = new OkxAuthed({ credentials })

    const { position } = exchange.position!.parse({ rawPosition })

    // validating
    expect(position).to.exist

    expect(position.id).to.be.eq(posId)
    expect(position.symbolPair).to.be.eq(instId)
    expect(position.baseSymbolId).to.be.eq(baseSymbolId)
    expect(position.quoteSymbolId).to.be.eq(quoteSymbolId)
    expect(position.account).to.be.eq(AlunaAccountEnum.MARGIN)
    expect(position.amount).to.be.eq(amount)
    expect(position.status).to.be.eq(status)
    expect(position.liquidationPrice).to.be.eq(liquidationPrice)
    expect(position.openedAt.getTime()).to.be.eq(openedAt.getTime())
    expect(position.leverage).to.be.eq(leverage)
    expect(position.plPercentage).to.be.eq(plPercentage)
    expect(position.pl).to.be.eq(pl)
    expect(position.total).to.be.eq(total)
    expect(position.openPrice).to.be.eq(openPrice)
    expect(position.basePrice).to.be.eq(basePrice)
    expect(position.side).to.be.eq(side)

    expect(translateSymbolId.callCount).to.be.eq(2)

    expect(translateSymbolId.firstCall.args[0]).to.deep.eq({
      exchangeSymbolId: baseSymbolId,
      symbolMappings: exchange.settings.symbolMappings,
    })

    expect(translateSymbolId.secondCall.args[0]).to.deep.eq({
      exchangeSymbolId: quoteSymbolId,
      symbolMappings: exchange.settings.symbolMappings,
    })

  })
})
