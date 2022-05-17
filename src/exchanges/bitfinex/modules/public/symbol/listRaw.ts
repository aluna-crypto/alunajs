import debug from 'debug'

import { IAlunaExchangePublic } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaSymbolListParams,
  IAlunaSymbolListRawReturns,
} from '../../../../../lib/modules/public/IAlunaSymbolModule'
import { BitfinexHttp } from '../../../BitfinexHttp'
import { getBitfinexEndpoints } from '../../../bitfinexSpecs'
import {
  IBitfinexSymbolsSchema,
  TBitfinexCurrenciesPairs,
} from '../../../schemas/IBitfinexSymbolSchema'



const log = debug('alunajs:bitfinex/symbol/listRaw')



export const listRaw = (exchange: IAlunaExchangePublic) => async (
  params: IAlunaSymbolListParams = {},
): Promise<IAlunaSymbolListRawReturns<IBitfinexSymbolsSchema>> => {

  log('fetching Bitfinex raw symbols')

  const { settings } = exchange

  const { http = new BitfinexHttp(settings) } = params

  const [
    currencies,
    currenciesNames,
  ] = await http.publicRequest<[string[], TBitfinexCurrenciesPairs]>({
    url: getBitfinexEndpoints(settings).symbol.list,
  })

  const rawSymbols: IBitfinexSymbolsSchema = {
    currencies,
    currenciesNames,
  }

  const { requestWeight } = http

  return {
    requestWeight,
    rawSymbols,
  }

}
