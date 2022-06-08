import { debug } from 'debug'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import { AlunaHttpVerbEnum } from '../../../../../lib/enums/AlunaHtttpVerbEnum'
import {
  IAlunaOrderListParams,
  IAlunaOrderListRawReturns,
} from '../../../../../lib/modules/authed/IAlunaOrderModule'
import { FtxHttp } from '../../../FtxHttp'
import { getFtxEndpoints } from '../../../ftxSpecs'
import {
  IFtxOrderSchema,
  IFtxTriggerOrderSchema,
} from '../../../schemas/IFtxOrderSchema'



const log = debug('alunajs:ftx/order/listRaw')



export const listRaw = (exchange: IAlunaExchangeAuthed) => async (
  params: IAlunaOrderListParams = {},
): Promise<IAlunaOrderListRawReturns<Array<IFtxTriggerOrderSchema | IFtxOrderSchema>>> => {

  log('fetching Ftx open orders', params)

  const {
    settings,
    credentials,
  } = exchange

  const { http = new FtxHttp(settings) } = params

  const ordinaryOrders = await http.authedRequest<IFtxOrderSchema[]>({
    verb: AlunaHttpVerbEnum.GET,
    url: getFtxEndpoints(settings).order.list,
    credentials,
  })

  const triggerOrders = await http.authedRequest<IFtxTriggerOrderSchema[]>({
    verb: AlunaHttpVerbEnum.GET,
    url: getFtxEndpoints(settings).order.listTriggerOrders,
    credentials,
  })

  const { requestWeight } = http

  const rawOrders = [
    ...ordinaryOrders,
    ...triggerOrders,
  ]

  return {
    rawOrders,
    requestWeight,
  }

}
