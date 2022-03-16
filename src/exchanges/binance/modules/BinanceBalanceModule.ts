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

  public async listRaw (): Promise<IAlunaBalanceListRawReturns> {

    BinanceLog.info('fetching Binance balances')

    const { keySecret } = this.exchange

    const {
      data: rawAccountInfo,
      apiRequestCount,
    } = await BinanceHttp
      .privateRequest<IBinanceKeyAccountSchema>({
        verb: AlunaHttpVerbEnum.GET,
        url: `${PROD_BINANCE_URL}/api/v3/account`,
        keySecret,
      })

    const { balances } = rawAccountInfo

    return {
      rawBalances: balances,
      apiRequestCount,
    }

  }



  public async list (): Promise<IAlunaBalanceListReturns> {

    let apiRequestCount = 0

    const {
      apiRequestCount: listRawRequestCount,
      rawBalances,
    } = await this.listRaw()

    apiRequestCount += 1

    const {
      balances: parsedBalances,
      apiRequestCount: parseManyRequestCount,
    } = this.parseMany({ rawBalances })

    apiRequestCount += 1

    BinanceLog.info(`parsed ${parsedBalances.length} balances for Binance`)

    const totalApiRequestCount = apiRequestCount
      + parseManyRequestCount
      + listRawRequestCount

    return {
      balances: parsedBalances,
      apiRequestCount: totalApiRequestCount,
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
      apiRequestCount: 1,
    }

  }



  public parseMany (params: {
    rawBalances: IBinanceBalanceSchema[],
  }): IAlunaBalanceParseManyReturns {

    const { rawBalances } = params

    let apiRequestCount = 0

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
            apiRequestCount: parseRequestCount,
          } = this.parse({ rawBalance })

          apiRequestCount += parseRequestCount + 1

          accumulator.push(parsedBalance)

        }

        return accumulator

      },
      [],
    )

    return {
      balances: parsedBalances,
      apiRequestCount,
    }

  }

}
