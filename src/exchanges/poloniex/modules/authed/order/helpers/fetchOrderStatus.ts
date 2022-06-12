import { AlunaError } from '../../../../../../lib/core/AlunaError'
import { AlunaOrderErrorCodes } from '../../../../../../lib/errors/AlunaOrderErrorCodes'
import { getPoloniexEndpoints } from '../../../../poloniexSpecs'
import {
  IPoloniexFetchOrderDetailsParams,
  IPoloniexOrderStatusInfoSchema,
  TGetOrderStatusResponse,
} from '../../../../schemas/IPoloniexOrderSchema'



export const fetchOrderStatus = async (
  params: IPoloniexFetchOrderDetailsParams,
): Promise<IPoloniexOrderStatusInfoSchema> => {

  const {
    id,
    http,
    credentials,
    settings,
  } = params

  const timestamp = new Date().getTime()
  const statusParams = new URLSearchParams()

  statusParams.append('command', 'returnOrderStatus')
  statusParams.append('orderNumber', id)
  statusParams.append('nonce', timestamp.toString())

  const { result } = await http.authedRequest<TGetOrderStatusResponse>({
    credentials,
    url: getPoloniexEndpoints(settings).order.get,
    body: statusParams,
  })

  if (result.error) {

    throw new AlunaError({
      code: AlunaOrderErrorCodes.NOT_FOUND,
      message: result.error as string,
      httpStatusCode: 200,
      metadata: result.error,
    })

  }

  return result[id]
}
