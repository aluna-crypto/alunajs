import { debug } from 'debug'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import { AlunaHttpVerbEnum } from '../../../../../lib/enums/AlunaHtttpVerbEnum'
import {
  IAlunaKeyFetchDetailsParams,
  IAlunaKeyFetchDetailsReturns,
} from '../../../../../lib/modules/authed/IAlunaKeyModule'
import { HuobiHttp } from '../../../HuobiHttp'
import { getHuobiEndpoints } from '../../../huobiSpecs'
import { IHuobiKeySchema, IHuobiRawKeySchema } from '../../../schemas/IHuobiKeySchema'
import { getHuobiAccountId } from '../helpers/getHuobiAccountId'



const log = debug('alunajs:huobi/key/fetchDetails')



export const fetchDetails = (exchange: IAlunaExchangeAuthed) => async (
  params: IAlunaKeyFetchDetailsParams = {},
): Promise<IAlunaKeyFetchDetailsReturns> => {

  log('fetching Huobi key permissions')

  const {
    settings,
    credentials,
  } = exchange

  const { http = new HuobiHttp(settings) } = params

  const userId = await http.authedRequest<number>({
    verb: AlunaHttpVerbEnum.GET,
    url: getHuobiEndpoints(settings).key.fetchUserId,
    credentials,
  })

  const query = new URLSearchParams()
  query.append('uid', userId.toString())

  const [keyInfo] = await http.authedRequest<IHuobiKeySchema[]>({
    verb: AlunaHttpVerbEnum.GET,
    url: getHuobiEndpoints(settings).key.fetchDetails,
    credentials,
    query: query.toString(),
  })

  const { accountId } = await getHuobiAccountId({
    credentials,
    http,
    settings,
  })

  const rawKey: IHuobiRawKeySchema = {
    ...keyInfo,
    accountId,
    userId,
  }

  const { key } = exchange.key.parseDetails({ rawKey })

  const { requestWeight } = http

  return {
    key,
    requestWeight,
  }

}
