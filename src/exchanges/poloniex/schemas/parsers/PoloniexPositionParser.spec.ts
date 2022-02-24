import { expect } from 'chai'

import { AlunaAccountEnum } from '../../../../lib/enums/AlunaAccountEnum'
import { AlunaPositionStatusEnum } from '../../../../lib/enums/AlunaPositionStatusEnum'
import { PoloniexPositionSideAdapter } from '../../enums/adapters/PoloniexPositionSideAdapter'
import { Poloniex } from '../../Poloniex'
import { POLONIEX_RAW_POSITION_WITH_CURRENCY } from '../../test/fixtures/poloniexPosition'
import { PoloniexPositionParser } from './PoloniexPositionParser'



describe('PoloniexPositionParser', () => {


  it('should parse Poloniex position just fine', async () => {

    const rawPosition = POLONIEX_RAW_POSITION_WITH_CURRENCY

    const parsedPosition = PoloniexPositionParser.parse({
      rawPosition,
    })

    const {
      exchangeId,
      symbolPair,
      baseSymbolId,
      quoteSymbolId,
      account,
      amount,
      basePrice,
      liquidationPrice,
      openPrice,
      pl,
      plPercentage,
      side,
      status,
      total,
      id,
    } = parsedPosition

    expect(exchangeId).to.be.eq(Poloniex.ID)
    expect(account).to.be.eq(AlunaAccountEnum.MARGIN)
    expect(symbolPair).to.be.eq(rawPosition.currencyPair)
    expect(baseSymbolId).to.be.eq(rawPosition.baseCurrency)
    expect(quoteSymbolId).to.be.eq(rawPosition.quoteCurrency)

    expect(openPrice).to.be.eq(parseFloat(rawPosition.basePrice))
    expect(amount).to.be.eq(parseFloat(rawPosition.amount))
    expect(liquidationPrice).to.be.eq(rawPosition.liquidationPrice)
    expect(basePrice).to.be.eq(parseFloat(rawPosition.basePrice))
    expect(pl).to.be.eq(parseFloat(rawPosition.pl))
    expect(plPercentage).to.be.eq(0)
    expect(total).to.be.eq(parseFloat(rawPosition.total))
    expect(id).to.be.eq(rawPosition.currencyPair)
    expect(status).to.be.eq(AlunaPositionStatusEnum.OPEN)
    expect(side).to.be.eq(PoloniexPositionSideAdapter.translateToAluna({
      from: rawPosition.type,
    }))

  })

})
