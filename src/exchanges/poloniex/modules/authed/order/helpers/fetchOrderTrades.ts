import { AlunaError } from '../../../../../../lib/core/AlunaError'
import { AlunaOrderErrorCodes } from '../../../../../../lib/errors/AlunaOrderErrorCodes'
import { getPoloniexEndpoints } from '../../../../poloniexSpecs'
import {
  IPoloniexFetchOrderDetailsParams,
  IPoloniexOrderInfo,
  TGetOrderTradesResponse,
} from '../../../../schemas/IPoloniexOrderSchema'



export const fetchOrderTrades = async (
  params: IPoloniexFetchOrderDetailsParams,
): Promise<IPoloniexOrderInfo[]> => {

  const {
    id,
    http,
    credentials,
    settings,
  } = params

  const timestamp = new Date().getTime()
  const statusParams = new URLSearchParams()

  statusParams.append('command', 'returnOrderTrades')
  statusParams.append('orderNumber', id)
  statusParams.append('nonce', timestamp.toString())

  const rawOrderTrades = await http.authedRequest<TGetOrderTradesResponse>({
    credentials,
    url: getPoloniexEndpoints(settings).order.get,
    body: statusParams,
  })

  if ('error' in rawOrderTrades) {

    throw new AlunaError({
      code: AlunaOrderErrorCodes.NOT_FOUND,
      message: rawOrderTrades.error as string,
      httpStatusCode: 404,
      metadata: rawOrderTrades,
    })

  }

  return rawOrderTrades
}
