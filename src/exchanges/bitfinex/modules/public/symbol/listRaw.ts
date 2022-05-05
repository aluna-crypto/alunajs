import debug from 'debug'

import { IAlunaExchangePublic } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaSymbolListParams,
  IAlunaSymbolListRawReturns,
} from '../../../../../lib/modules/public/IAlunaSymbolModule'
import { BitfinexHttp } from '../../../BitfinexHttp'
import { bitfinexEndpoints } from '../../../bitfinexSpecs'
import {
  IBitfinexSymbolsSchema,
  TBitfinexCurrenciesPairs,
} from '../../../schemas/IBitfinexSymbolSchema'



const log = debug('@alunajs:bitfinex/symbol/listRaw')



export const listRaw = (exchange: IAlunaExchangePublic) => async (
  params: IAlunaSymbolListParams = {},
): Promise<IAlunaSymbolListRawReturns<IBitfinexSymbolsSchema>> => {

  log('fetching Bitfinex raw symbols')

  const { http = new BitfinexHttp() } = params

  const [
    currencies,
    currenciesNames,
  ] = await http.publicRequest<[string[], TBitfinexCurrenciesPairs]>({
    url: bitfinexEndpoints.symbol.list,
  })

  const rawSymbols: IBitfinexSymbolsSchema = {
    currencies,
    currenciesNames,
  }

  const { requestCount } = http

  return {
    requestCount,
    rawSymbols,
  }

}
