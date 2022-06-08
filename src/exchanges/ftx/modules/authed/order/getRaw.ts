import { debug } from 'debug'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaOrderGetParams,
  IAlunaOrderGetRawReturns,
} from '../../../../../lib/modules/authed/IAlunaOrderModule'
import { FtxHttp } from '../../../FtxHttp'
import {
  IFtxOrderSchema,
  IFtxTriggerOrderSchema,
} from '../../../schemas/IFtxOrderSchema'
import { getFtxOrdinaryOrder } from './helpers/getFtxOrdinaryOrder'
import { getFtxTriggerOrder } from './helpers/getFtxTriggerOrder'



const log = debug('alunajs:ftx/order/getRaw')



export const getRaw = (exchange: IAlunaExchangeAuthed) => async (
  params: IAlunaOrderGetParams,
): Promise<IAlunaOrderGetRawReturns<IFtxOrderSchema | IFtxTriggerOrderSchema>> => {

  log('getting raw order', params)

  const { settings } = exchange

  const {
    id,
    symbolPair,
    http = new FtxHttp(settings),
  } = params

  let rawOrder: IFtxOrderSchema | IFtxTriggerOrderSchema | undefined

  rawOrder = await getFtxOrdinaryOrder({
    exchange,
    http,
    id,
  })

  if (!rawOrder) {

    rawOrder = await getFtxTriggerOrder({
      symbolPair,
      exchange,
      http,
      id,
    })

  }

  const { requestWeight } = http

  return {
    rawOrder,
    requestWeight,
  }

}
