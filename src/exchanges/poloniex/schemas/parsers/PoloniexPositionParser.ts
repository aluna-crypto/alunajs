import { AlunaAccountEnum } from '../../../../lib/enums/AlunaAccountEnum'
import { AlunaPositionStatusEnum } from '../../../../lib/enums/AlunaPositionStatusEnum'
import { IAlunaPositionSchema } from '../../../../lib/schemas/IAlunaPositionSchema'
import { PoloniexPositionSideAdapter } from '../../enums/adapters/PoloniexPositionSideAdapter'
import { Poloniex } from '../../Poloniex'
import { IPoloniexPositionWithCurrency } from '../IPoloniexPositionSchema'



export class PoloniexPositionParser {

  static parse (params: {
    rawPosition: IPoloniexPositionWithCurrency,
  }) {

    const { rawPosition } = params

    const {
      amount,
      baseCurrency,
      basePrice,
      currencyPair,
      liquidationPrice,
      pl,
      quoteCurrency,
      total,
      type,
    } = rawPosition

    const position: IAlunaPositionSchema = {
      id: currencyPair,
      symbolPair: currencyPair,
      exchangeId: Poloniex.ID,
      baseSymbolId: baseCurrency,
      quoteSymbolId: quoteCurrency,
      total: parseFloat(total),
      amount: parseFloat(amount),
      account: AlunaAccountEnum.MARGIN,
      status: AlunaPositionStatusEnum.OPEN,
      side: PoloniexPositionSideAdapter.translateToAluna({ from: type }),
      basePrice: parseFloat(basePrice),
      openPrice: parseFloat(basePrice),
      pl: parseFloat(pl),
      plPercentage: 0, // @TODO -> Update
      liquidationPrice,
      openedAt: new Date(), // @TODO -> Poloniex don't provide this value
      meta: rawPosition,
    }

    return position

  }

}
