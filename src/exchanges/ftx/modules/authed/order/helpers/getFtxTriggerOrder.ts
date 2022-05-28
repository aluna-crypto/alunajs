import { find } from 'lodash'

import { AlunaError } from '../../../../../../lib/core/AlunaError'
import { IAlunaExchangeAuthed } from '../../../../../../lib/core/IAlunaExchange'
import { IAlunaHttp } from '../../../../../../lib/core/IAlunaHttp'
import { AlunaHttpVerbEnum } from '../../../../../../lib/enums/AlunaHtttpVerbEnum'
import { AlunaOrderErrorCodes } from '../../../../../../lib/errors/AlunaOrderErrorCodes'
import { getFtxEndpoints } from '../../../../ftxSpecs'
import { IFtxTriggerOrderSchema } from '../../../../schemas/IFtxOrderSchema'



export interface IGetFtxTriggerOrderParams {
  id: string
  http: IAlunaHttp
  exchange: IAlunaExchangeAuthed
  symbolPair: string
}



export const getFtxTriggerOrder = async (
  params: IGetFtxTriggerOrderParams,
): Promise<IFtxTriggerOrderSchema> => {

  const {
    id,
    http,
    exchange,
    symbolPair,
  } = params

  const {
    settings,
    credentials,
  } = exchange

  const rawOrders = await http.authedRequest<IFtxTriggerOrderSchema[]>({
    credentials,
    verb: AlunaHttpVerbEnum.GET,
    // FTX does not have an endpoint to get trigger orders by id
    url: getFtxEndpoints(settings).order.listTriggerOrdersHistory,
    body: { market: symbolPair },
  })

  const rawOrder = find(rawOrders, (({ id: orderId }) => {
    return orderId === parseInt(id, 10)
  }))

  if (!rawOrder) {

    const error = new AlunaError({
      code: AlunaOrderErrorCodes.NOT_FOUND,
      message: 'Order not found',
    })

    throw error

  }

  return rawOrder

}
