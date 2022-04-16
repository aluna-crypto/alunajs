import { AlunaAccountEnum } from '../../../../lib/enums/AlunaAccountEnum'
import { AlunaOrderStatusEnum } from '../../../../lib/enums/AlunaOrderStatusEnum'
import { IAlunaOrderSchema } from '../../../../lib/schemas/IAlunaOrderSchema'
import { AlunaSymbolMapping } from '../../../../utils/mappings/AlunaSymbolMapping'
import { HuobiOrderSideAdapter } from '../../enums/adapters/HuobiOrderSideAdapter'
import { HuobiOrderTypeAdapter } from '../../enums/adapters/HuobiOrderTypeAdapter'
import { HuobiStatusAdapter } from '../../enums/adapters/HuobiStatusAdapter'
import { HuobiOrderSideEnum } from '../../enums/HuobiOrderSideEnum'
import { HuobiOrderTypeEnum } from '../../enums/HuobiOrderTypeEnum'
import { Huobi } from '../../Huobi'
import { IHuobiMarketWithCurrency } from '../IHuobiMarketSchema'
import { IHuobiOrderSchema } from '../IHuobiOrderSchema'



export class HuobiOrderParser {

  static parse(params: {
    rawOrder: IHuobiOrderSchema,
    symbolInfo: IHuobiMarketWithCurrency,
  }): IAlunaOrderSchema {

    const {
      rawOrder,
      symbolInfo,
    } = params

    const exchangeId = Huobi.ID

    const {
      symbol,
      price,
      type,
      'created-at': created_at,
      amount,
      state,
      id,
    } = rawOrder

    const {
      baseCurrency,
      quoteCurrency,
    } = symbolInfo

    const symbolMappings = Huobi.settings.mappings

    const baseSymbolId = AlunaSymbolMapping.translateSymbolId({
      exchangeSymbolId: baseCurrency,
      symbolMappings,
    })

    const quoteSymbolId = AlunaSymbolMapping.translateSymbolId({
      exchangeSymbolId: quoteCurrency,
      symbolMappings,
    })

    const orderStatus = HuobiStatusAdapter.translateToAluna({ from: state })

    let filledAt: Date | undefined
    let canceledAt: Date | undefined

    if (orderStatus === AlunaOrderStatusEnum.CANCELED) {

      canceledAt = new Date()

    }

    if (orderStatus === AlunaOrderStatusEnum.FILLED) {

      filledAt = new Date()

    }

    const orderSide = type.split('-')[0] as HuobiOrderSideEnum
    const orderType = type.split('-')[1] as HuobiOrderTypeEnum

    const parsedOrder: IAlunaOrderSchema = {
      id,
      symbolPair: symbol,
      total: parseFloat(amount) * parseFloat(price),
      amount: parseFloat(amount),
      rate: parseFloat(price),
      exchangeId,
      baseSymbolId,
      quoteSymbolId,
      account: AlunaAccountEnum.EXCHANGE,
      side: HuobiOrderSideAdapter.translateToAluna(
        { from: orderSide },
      ),
      status: orderStatus,
      type: HuobiOrderTypeAdapter.translateToAluna(
        { from: orderType },
      ),
      placedAt: new Date(created_at),
      filledAt,
      canceledAt,
      meta: rawOrder,
    }

    return parsedOrder

  }

}
