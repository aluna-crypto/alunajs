import debug from 'debug'

import { IAlunaExchangePublic } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaSymbolListParams,
  IAlunaSymbolListRawReturns,
} from '../../../../../lib/modules/public/IAlunaSymbolModule'
import { OkxSymbolTypeEnum } from '../../../enums/OkxSymbolTypeEnum'
import { OkxHttp } from '../../../OkxHttp'
import { IOkxSymbolSchema } from '../../../schemas/IOkxSymbolSchema'
import { fetchInstruments } from '../helpers/fetchInstruments'



const log = debug('alunajs:okx/symbol/listRaw')



export const listRaw = (exchange: IAlunaExchangePublic) => async (
  params: IAlunaSymbolListParams = {},
): Promise<IAlunaSymbolListRawReturns<IOkxSymbolSchema[]>> => {

  log('fetching Okx raw symbols')

  const { settings } = exchange

  const { http = new OkxHttp(settings) } = params

  const {
    instruments: rawSpotSymbols,
  } = await fetchInstruments({
    http,
    settings,
    type: OkxSymbolTypeEnum.SPOT,
  })

  const {
    instruments: rawMarginSymbols,
  } = await fetchInstruments({
    http,
    settings,
    type: OkxSymbolTypeEnum.MARGIN,
  })

  const { requestWeight } = http

  const rawSymbols = [...rawSpotSymbols, ...rawMarginSymbols]

  return {
    requestWeight,
    rawSymbols,
  }

}
