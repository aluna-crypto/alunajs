import { AAlunaModule } from '../../../lib/core/abstracts/AAlunaModule'
import { AlunaAccountEnum } from '../../../lib/enums/AlunaAccountEnum'
import { AlunaHttpVerbEnum } from '../../../lib/enums/AlunaHtttpVerbEnum'
import { IAlunaBalanceModule } from '../../../lib/modules/IAlunaBalanceModule'
import { IAlunaBalanceSchema } from '../../../lib/schemas/IAlunaBalanceSchema'
import { AlunaSymbolMapping } from '../../../utils/mappings/AlunaSymbolMapping'
import { Bittrex } from '../Bittrex'
import { BittrexHttp } from '../BittrexHttp'
import { BittrexLog } from '../BittrexLog'
import { PROD_BITTREX_URL } from '../BittrexSpecs'
import { IBittrexBalanceSchema } from '../schemas/IBittrexBalanceSchema'



export class BittrexBalanceModule extends AAlunaModule implements IAlunaBalanceModule {

  public async listRaw (): Promise<IBittrexBalanceSchema[]> {

    BittrexLog.info('fetching Bittrex balances')

    const { keySecret } = this.exchange

    const rawAccountInfo = await BittrexHttp
      .privateRequest<IBittrexBalanceSchema[]>({
        verb: AlunaHttpVerbEnum.GET,
        url: `${PROD_BITTREX_URL}/balances`,
        keySecret,
      })

    return rawAccountInfo

  }



  public async list (): Promise<IAlunaBalanceSchema[]> {

    const rawBalances = await this.listRaw()

    const parsedBalances = this.parseMany({ rawBalances })

    BittrexLog.info(`parsed ${parsedBalances.length} balances for Bittrex`)

    return parsedBalances

  }



  public parse (params: {
    rawBalance: IBittrexBalanceSchema,
  }): IAlunaBalanceSchema {

    const { rawBalance } = params

    const {
      total,
      available,
      currencySymbol,
    } = rawBalance

    const symbolId = AlunaSymbolMapping.translateSymbolId({
      exchangeSymbolId: currencySymbol,
      symbolMappings: Bittrex.settings.mappings,
    })

    return {
      symbolId,
      account: AlunaAccountEnum.EXCHANGE,
      available: Number(available),
      total: Number(total),
      meta: rawBalance,
    }

  }



  public parseMany (params: {
    rawBalances: IBittrexBalanceSchema[],
  }): IAlunaBalanceSchema[] {

    const { rawBalances } = params

    const parsedBalances = rawBalances.reduce<IAlunaBalanceSchema[]>(
      (accumulator, rawBalance) => {

        const {
          total: totalBalance,
        } = rawBalance

        const total = parseFloat(totalBalance)

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
