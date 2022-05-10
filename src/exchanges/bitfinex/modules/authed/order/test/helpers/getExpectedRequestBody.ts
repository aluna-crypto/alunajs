import { AlunaOrderTypesEnum } from '../../../../../../../lib/enums/AlunaOrderTypesEnum'
import {
  IAlunaOrderEditParams,
  IAlunaOrderPlaceParams,
} from '../../../../../../../lib/modules/authed/IAlunaOrderModule'
import { bitfinexBaseSpecs } from '../../../../../bitfinexSpecs'
import { translateOrderSideToBitfinex } from '../../../../../enums/adapters/bitfinexOrderSideAdapter'
import { translateOrderTypeToBitfinex } from '../../../../../enums/adapters/bitfinexOrderTypeAdapter'



export const getExpectedRequestBody = (
  params: IAlunaOrderPlaceParams | IAlunaOrderEditParams,
): Record<any, any> => {

  const {
    account,
    type,
    side,
    amount,
    rate,
    symbolPair,
    limitRate,
    stopRate,
    id,
  } = params as IAlunaOrderEditParams

  const translatedOrderType = translateOrderTypeToBitfinex({
    from: type,
    account,
  })

  const translatedAmount = translateOrderSideToBitfinex({
    amount: Number(amount),
    side,
  })

  let price: undefined | string
  let priceAuxLimit: undefined | string

  switch (type) {

    case AlunaOrderTypesEnum.LIMIT:
      price = rate!.toString()
      break

    case AlunaOrderTypesEnum.STOP_MARKET:
      price = stopRate!.toString()
      break

    case AlunaOrderTypesEnum.STOP_LIMIT:
      price = stopRate!.toString()
      priceAuxLimit = limitRate!.toString()
      break

    default:

  }

  const { affiliateCode } = bitfinexBaseSpecs.settings

  const body: Record<string, any> = {
    ...(price ? { price } : {}),
    ...(priceAuxLimit ? { price_aux_limit: priceAuxLimit } : {}),
  }

  if (id) {

    body.amount = translatedAmount
    body.id = Number(id)

  } else {

    body.amount = translatedAmount
    body.symbol = symbolPair
    body.type = translatedOrderType

    if (affiliateCode) {
      body.aff_code = affiliateCode
    }

  }

  return body

}
