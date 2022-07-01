import debug from 'debug'
import { find } from 'lodash'

import { AlunaError } from '../../../../../lib/core/AlunaError'
import { IAlunaExchangePublic } from '../../../../../lib/core/IAlunaExchange'
import { AlunaMarketErrorCodes } from '../../../../../lib/errors/AlunaMarketErrorCodes'
import {
  IAlunaMarketGetParams,
  IAlunaMarketGetRawReturns,
} from '../../../../../lib/modules/public/IAlunaMarketModule'
import { HuobiHttp } from '../../../HuobiHttp'
import {
  IHuobiMarketSchema,
  IHuobiMarketsSchema,
} from '../../../schemas/IHuobiMarketSchema'



const log = debug('alunajs:Huobi/market/listRaw')



export const getRaw = (exchange: IAlunaExchangePublic) => async (
  params: IAlunaMarketGetParams,
): Promise<IAlunaMarketGetRawReturns<IHuobiMarketSchema>> => {

  const { settings } = exchange

  const {
    symbolPair,
    http = new HuobiHttp(settings),
  } = params

  log('fetching Huobi markets')

  /**
   * Huobi has only one endpoint that get market data by market symbol. However,
   * this endpoint does not return the market ticker info. In order to avoid
   * doing extra requests to get this information, we then execute the market
   * list and get the desired market from the response.
   */
  const { rawMarkets } = await exchange.market.listRaw({ http })

  const {
    rawSymbols,
    huobiMarkets,
  } = rawMarkets as IHuobiMarketsSchema

  const huobiMarket = find(huobiMarkets, { symbol: symbolPair })
  const rawSymbol = find(rawSymbols, { symbol: symbolPair })

  if (!huobiMarket || !rawSymbol) {

    throw new AlunaError({
      code: AlunaMarketErrorCodes.NOT_FOUND,
      message: `Market not found for '${symbolPair}'.`,
      httpStatusCode: 200,
    })

  }

  const rawMarket: IHuobiMarketSchema = {
    huobiMarket,
    rawSymbol,
  }

  const { requestWeight } = http

  return {
    rawMarket,
    requestWeight,
  }

}
