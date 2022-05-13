import { expect } from 'chai'
import { each } from 'lodash'

import { AlunaAccountEnum } from '../../../../../../lib/enums/AlunaAccountEnum'
import { AlunaOrderSideEnum } from '../../../../../../lib/enums/AlunaOrderSideEnum'
import { AlunaOrderTypesEnum } from '../../../../../../lib/enums/AlunaOrderTypesEnum'
import { IAlunaOrderEditParams } from '../../../../../../lib/modules/authed/IAlunaOrderModule'
import { IAlunaSettingsSchema } from '../../../../../../lib/schemas/IAlunaSettingsSchema'
import { translateOrderSideToBitmex } from '../../../../enums/adapters/bitmexOrderSideAdapter'
import { translateOrderTypeToBitmex } from '../../../../enums/adapters/bitmexOrderTypeAdapter'
import { BitmexOrderTypeEnum } from '../../../../enums/BitmexOrderTypeEnum'
import { assembleRequestBody } from './assembleRequestBody'
import { mockTranslateAmountToOrderQty } from './translateAmountToOrderQty.mock'



describe(__filename, () => {

  const commonParams: IAlunaOrderEditParams = {
    account: AlunaAccountEnum.DERIVATIVES,
    amount: 10,
    side: AlunaOrderSideEnum.BUY,
    type: AlunaOrderTypesEnum.LIMIT,
    symbolPair: 'XBTUSD',
    id: '666',
  }

  const rate = 15
  const limitRate = 10
  const stopRate = 5

  const paramsDict: Record<string, IAlunaOrderEditParams> = {
    [AlunaOrderTypesEnum.LIMIT]: { ...commonParams, rate },
    [AlunaOrderTypesEnum.MARKET]: { ...commonParams },
    [AlunaOrderTypesEnum.STOP_MARKET]: { ...commonParams, stopRate },
    [AlunaOrderTypesEnum.STOP_LIMIT]: { ...commonParams, limitRate, stopRate },
  }

  const actions: Array<'place' | 'edit'> = [
    'place',
    'edit',
  ]

  const ordersTypes = [
    AlunaOrderTypesEnum.LIMIT,
    AlunaOrderTypesEnum.MARKET,
    AlunaOrderTypesEnum.STOP_MARKET,
    AlunaOrderTypesEnum.STOP_LIMIT,
  ]

  const sides = [
    AlunaOrderSideEnum.BUY,
    AlunaOrderSideEnum.SELL,
  ]

  each(actions, (action, index) => {

    each(ordersTypes, (type) => {

      if (action === 'edit' && type === AlunaOrderTypesEnum.MARKET) {
        return
      }

      each(sides, (side) => {

        it(`should assemble request body for ${action} ${side} ${type} order just fine`, () => {

          // preparing data
          const orderParams = {
            ...paramsDict[type],
            type,
            side,
          }

          const settings: IAlunaSettingsSchema = {
            ...(index % 2 === 0 ? { orderAnnotation: 'nice!' } : {}),
          }

          const mockedOrderQty = 100
          const mockedInstrument = {} as any


          // mocking
          const { translateAmountToOrderQty } = mockTranslateAmountToOrderQty()
          translateAmountToOrderQty.returns({ orderQty: mockedOrderQty })


          // executing
          const { body } = assembleRequestBody({
            action,
            instrument: mockedInstrument,
            settings,
            orderParams,
          })


          // validating
          const ordType = translateOrderTypeToBitmex({
            from: orderParams.type,
          })

          const translatedSide = translateOrderSideToBitmex({
            from: orderParams.side,
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

          const expectedBody = {
            orderQty: mockedOrderQty,
            ...(price ? { price } : {}),
            ...(stopPx ? { stopPx } : {}),
            ...(orderAnnotation ? { text: orderAnnotation } : {}),
          }

          if (action === 'place') {

            Object.assign(expectedBody, {
              symbol: orderParams.symbolPair,
              side: translatedSide,
              ordType,
            })

          } else {

            Object.assign(expectedBody, { orderID: orderParams.id })

          }

          expect(body).to.deep.eq(expectedBody)

        })

      })

    })

  })

})
