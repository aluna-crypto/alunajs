import { AlunaAccountEnum } from '../../../../lib/enums/AlunaAccountEnum'
import { AlunaPositionStatusEnum } from '../../../../lib/enums/AlunaPositionStatusEnum'
import { IAlunaPositionSchema } from '../../../../lib/schemas/IAlunaPositionSchema'
import { AlunaSymbolMapping } from '../../../../utils/mappings/AlunaSymbolMapping'
import { OkxPositionSideAdapter } from '../../enums/adapters/OkxPositionSideAdapter'
import { Okx } from '../../Okx'
import { IOkxPositionSchema } from '../IOkxPositionSchema'



export class OkxPositionParser {

  static parse (params: {
    rawPosition: IOkxPositionSchema,
  }) {

    const { rawPosition } = params

    const {
      instId,
      posSide,
      avgPx,
      markPx,
      last,
      posId,
    } = rawPosition

    const [baseCurrency, quoteCurrency] = instId.split('-')

    const symbolMappings = Okx.settings.mappings

    const baseSymbolId = AlunaSymbolMapping.translateSymbolId({
      exchangeSymbolId: baseCurrency,
      symbolMappings,
    })

    const quoteSymbolId = AlunaSymbolMapping.translateSymbolId({
      exchangeSymbolId: quoteCurrency,
      symbolMappings,
    })

    const status = AlunaPositionStatusEnum.OPEN

    const side = OkxPositionSideAdapter.translateToAluna({
      posSide,
    })

    const computedBasePrice = Number(last)
    const computedOpenPrice = Number(avgPx)

    const total = computedAmount * computedBasePrice

    const position: IAlunaPositionSchema = {
      id: posId,
      symbolPair: instId,
      exchangeId: Okx.ID,
      baseSymbolId,
      quoteSymbolId,
      total,
      amount: computedAmount,
      account: AlunaAccountEnum.MARGIN,
      status,
      side,
      basePrice: computedBasePrice,
      openPrice: computedOpenPrice,
      pl: computedPl,
      plPercentage,
      leverage: computedLeverage,
      liquidationPrice,
      openedAt,
      closedAt,
      closePrice,
      meta: rawPosition,
    }

    return position

  }

}
