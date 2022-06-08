import { IAlunaExchangeAuthed } from '../../../../../../lib/core/IAlunaExchange'
import { IAlunaHttp } from '../../../../../../lib/core/IAlunaHttp'
import { AlunaHttpVerbEnum } from '../../../../../../lib/enums/AlunaHtttpVerbEnum'
import { getFtxEndpoints } from '../../../../ftxSpecs'
import { IFtxOrderSchema } from '../../../../schemas/IFtxOrderSchema'



export interface IGetFtxOrdinaryOrderParams {
  id: string
  exchange: IAlunaExchangeAuthed
  http: IAlunaHttp
}



export const getFtxOrdinaryOrder = async (
  params: IGetFtxOrdinaryOrderParams,
): Promise<IFtxOrderSchema | undefined> => {

  const {
    id,
    http,
    exchange,
  } = params

  const {
    settings,
    credentials,
  } = exchange

  try {

    const rawOrder = await http.authedRequest<IFtxOrderSchema>({
      credentials,
      verb: AlunaHttpVerbEnum.GET,
      url: getFtxEndpoints(settings).order.get(id),
    })

    return rawOrder

  } catch (err) {

    if (err.message === 'Order not found') {

      return

    }

    throw err

  }

}
