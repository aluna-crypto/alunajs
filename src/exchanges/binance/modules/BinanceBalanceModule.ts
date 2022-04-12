import BigNumber from 'bignumber.js'

import { AAlunaModule } from '../../../lib/core/abstracts/AAlunaModule'
import { AlunaAccountEnum } from '../../../lib/enums/AlunaAccountEnum'
import { AlunaHttpVerbEnum } from '../../../lib/enums/AlunaHtttpVerbEnum'
import {
  IAlunaBalanceListRawReturns,
  IAlunaBalanceListReturns,
  IAlunaBalanceModule,
  IAlunaBalanceParseManyReturns,
  IAlunaBalanceParseReturns,
} from '../../../lib/modules/IAlunaBalanceModule'
import { IAlunaBalanceSchema } from '../../../lib/schemas/IAlunaBalanceSchema'
import { AlunaSymbolMapping } from '../../../utils/mappings/AlunaSymbolMapping'
import { Binance } from '../Binance'
import { BinanceHttp } from '../BinanceHttp'
import { BinanceLog } from '../BinanceLog'
import { PROD_BINANCE_URL } from '../BinanceSpecs'
import { IBinanceBalanceSchema } from '../schemas/IBinanceBalanceSchema'
import { IBinanceKeyAccountSchema } from '../schemas/IBinanceKeySchema'



export class BinanceBalanceModule extends AAlunaModule implements IAlunaBalanceModule {

  public async listRaw ()
    : Promise<IAlunaBalanceListRawReturns<IBinanceBalanceSchema>> {

    BinanceLog.info('fetching Binance balances')

    const { keySecret } = this.exchange

    const {
      data: rawAccountInfo,
      requestCount,
    } = await BinanceHttp
      .privateRequest<IBinanceKeyAccountSchema>({
        verb: AlunaHttpVerbEnum.GET,
        url: `${PROD_BINANCE_URL}/api/v3/account`,
        keySecret,
      })

    const { balances } = rawAccountInfo

    return {
      rawBalances: balances,
      requestCount,
    }

  }



  public async list (): Promise<IAlunaBalanceListReturns> {

    const requestCount = 0

    const {
      requestCount: listRawCount,
      rawBalances,
    } = await this.listRaw()

    const {
      balances: parsedBalances,
      requestCount: parseManyCount,
    } = this.parseMany({ rawBalances })

    BinanceLog.info(`parsed ${parsedBalances.length} balances for Binance`)

    const totalRequestCount = requestCount
      + parseManyCount
      + listRawCount

    return {
      balances: parsedBalances,
      requestCount: totalRequestCount,
    }

  }



  public parse (params: {
    rawBalance: IBinanceBalanceSchema,
  }): IAlunaBalanceParseReturns {

    const { rawBalance } = params

    const {
      asset,
      free,
      locked,
    } = rawBalance

    const symbolMappings = Binance.settings.mappings

    const symbolId = AlunaSymbolMapping.translateSymbolId({
      exchangeSymbolId: asset,
      symbolMappings,
    })

    const available = Number(free)
    const total = new BigNumber(available)
      .plus(Number(locked))
      .toNumber()

    const parsedBalance = {
      symbolId,
      account: AlunaAccountEnum.EXCHANGE,
      available,
      total,
      meta: rawBalance,
    }

    return {
      balance: parsedBalance,
      requestCount: 0,
    }

  }



  public parseMany (params: {
    rawBalances: IBinanceBalanceSchema[],
  }): IAlunaBalanceParseManyReturns {

    const { rawBalances } = params

    let requestCount = 0

    const parsedBalances = rawBalances.reduce<IAlunaBalanceSchema[]>(
      (accumulator, rawBalance) => {

        const {
          free,
          locked,
        } = rawBalance

        const total = parseFloat(free) + parseFloat(locked)

        if (total > 0) {

          const {
            balance: parsedBalance,
            requestCount: parseCount,
          } = this.parse({ rawBalance })

          requestCount += parseCount

          accumulator.push(parsedBalance)

        }

        return accumulator

      },
      [],
    )

    return {
      balances: parsedBalances,
      requestCount,
    }

  }

}
