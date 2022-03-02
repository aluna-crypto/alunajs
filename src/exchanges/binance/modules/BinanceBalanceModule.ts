import BigNumber from 'bignumber.js'

import { AAlunaModule } from '../../../lib/core/abstracts/AAlunaModule'
import { AlunaAccountEnum } from '../../../lib/enums/AlunaAccountEnum'
import { AlunaHttpVerbEnum } from '../../../lib/enums/AlunaHtttpVerbEnum'
import { IAlunaBalanceModule } from '../../../lib/modules/IAlunaBalanceModule'
import { IAlunaBalanceSchema } from '../../../lib/schemas/IAlunaBalanceSchema'
import { AlunaSymbolMapping } from '../../../utils/mappings/AlunaSymbolMapping'
import { Binance } from '../Binance'
import { BinanceHttp } from '../BinanceHttp'
import { BinanceLog } from '../BinanceLog'
import { PROD_BINANCE_URL } from '../BinanceSpecs'
import { IBinanceBalanceSchema } from '../schemas/IBinanceBalanceSchema'
import { IBinanceKeyAccountSchema } from '../schemas/IBinanceKeySchema'



export class BinanceBalanceModule extends AAlunaModule implements IAlunaBalanceModule {

  public async listRaw (): Promise<IBinanceBalanceSchema[]> {

    BinanceLog.info('fetching Binance balances')

    const { keySecret } = this.exchange

    const rawAccountInfo = await BinanceHttp
      .privateRequest<IBinanceKeyAccountSchema>({
        verb: AlunaHttpVerbEnum.GET,
        url: `${PROD_BINANCE_URL}/api/v3/account`,
        keySecret,
      })

    return rawAccountInfo.balances

  }



  public async list (): Promise<IAlunaBalanceSchema[]> {

    const rawBalances = await this.listRaw()

    const parsedBalances = this.parseMany({ rawBalances })

    BinanceLog.info(`parsed ${parsedBalances.length} balances for Binance`)

    return parsedBalances

  }



  public parse (params: {
    rawBalance: IBinanceBalanceSchema,
  }): IAlunaBalanceSchema {

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

    return {
      symbolId,
      account: AlunaAccountEnum.EXCHANGE,
      available,
      total,
      meta: rawBalance,
    }

  }



  public parseMany (params: {
    rawBalances: IBinanceBalanceSchema[],
  }): IAlunaBalanceSchema[] {

    const { rawBalances } = params

    const parsedBalances = rawBalances.reduce<IAlunaBalanceSchema[]>(
      (accumulator, rawBalance) => {

        const {
          free,
          locked,
        } = rawBalance

        const total = parseFloat(free) + parseFloat(locked)

        if (total > 0) {

          const parsedBalance = this.parse({ rawBalance })

          accumulator.push(parsedBalance)

        }

        return accumulator

      },
      [],
    )

    return parsedBalances

  }

}
