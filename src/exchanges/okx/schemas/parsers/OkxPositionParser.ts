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
      last,
      posId,
      upl,
      uplRatio,
      lever,
      cTime,
      baseBal,
      liqPx,
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
      from: posSide,
    })

    const basePrice = Number(last)
    const openPrice = Number(avgPx)

    const amount = Number(baseBal)

    const total = amount * basePrice

    const pl = parseFloat(upl)
    const plPercentage = parseFloat(uplRatio)
    const leverage = Number(lever)
    const createdAt = new Date(Number(cTime))

    const liquidationPrice = Number(liqPx)

    const position: IAlunaPositionSchema = {
      id: posId,
      symbolPair: instId,
      exchangeId: Okx.ID,
      baseSymbolId,
      quoteSymbolId,
      total,
      amount,
      account: AlunaAccountEnum.MARGIN,
      status,
      side,
      basePrice,
      openPrice,
      pl,
      plPercentage,
      leverage,
      liquidationPrice,
      openedAt: createdAt,
      closedAt: undefined, // @TODO
      closePrice: undefined, // @TODO
      meta: rawPosition,
    }

    return position

  }

}
