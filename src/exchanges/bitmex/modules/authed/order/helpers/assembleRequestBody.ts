import { IAlunaOrderPlaceParams } from '../../../../../../lib/modules/authed/IAlunaOrderModule'
import { IAlunaInstrumentSchema } from '../../../../../../lib/schemas/IAlunaInstrumentSchema'
import { IAlunaSettingsSchema } from '../../../../../../lib/schemas/IAlunaSettingsSchema'
import { translateOrderSideToBitmex } from '../../../../enums/adapters/bitmexOrderSideAdapter'
import { translateOrderTypeToBitmex } from '../../../../enums/adapters/bitmexOrderTypeAdapter'
import { BitmexOrderTypeEnum } from '../../../../enums/BitmexOrderTypeEnum'
import { translateAmountToOrderQty } from './translateAmountToOrderQty'



interface IAssembleRequestBodyOrderParams extends IAlunaOrderPlaceParams {
  id?: string
}



interface IAssembleRequestBodyParams {
  orderParams: IAssembleRequestBodyOrderParams
  instrument: IAlunaInstrumentSchema
  settings: IAlunaSettingsSchema
  action: 'place' | 'edit'
}



interface IAssembleRequestBodyReturns {
  body: Record<string, any>
}



export const assembleRequestBody = (
  params: IAssembleRequestBodyParams,
): IAssembleRequestBodyReturns => {

  const {
    orderParams,
    instrument,
    settings,
    action,
  } = params

  const {
    id,
    amount,
    symbolPair,
    side,
    type,
    rate,
    limitRate,
    stopRate,
  } = orderParams

  const ordType = translateOrderTypeToBitmex({
    from: type,
  })

  const translatedSide = translateOrderSideToBitmex({
    from: side,
  })

  const { orderQty } = translateAmountToOrderQty({
    amount,
    instrument: instrument!,
  })


  let price: number | undefined
  let stopPx: number | undefined

  switch (ordType) {

    case BitmexOrderTypeEnum.LIMIT:
      price = rate
      break

    case BitmexOrderTypeEnum.STOP_MARKET:
      stopPx = stopRate
      break

    case BitmexOrderTypeEnum.STOP_LIMIT:
      stopPx = stopRate
      price = limitRate
      break

    default:

  }

  const { orderAnnotation } = settings

  const body = {
    orderQty,
    ...(price ? { price } : {}),
    ...(stopPx ? { stopPx } : {}),
    ...(orderAnnotation ? { text: orderAnnotation } : {}),
  }

  if (action === 'place') {

    Object.assign(body, {
      symbol: symbolPair,
      side: translatedSide,
      ordType,
    })

  } else {

    Object.assign(body, { orderID: id! })

  }

  return { body }

}
