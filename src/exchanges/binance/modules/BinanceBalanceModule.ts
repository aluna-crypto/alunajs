import { AAlunaModule } from '../../../lib/core/abstracts/AAlunaModule'
import { AlunaAccountEnum } from '../../../lib/enums/AlunaAccountEnum'
import { AlunaHttpVerbEnum } from '../../../lib/enums/AlunaHtttpVerbEnum'
import { IAlunaBalanceModule } from '../../../lib/modules/IAlunaBalanceModule'
import { IAlunaBalanceSchema } from '../../../lib/schemas/IAlunaBalanceSchema'
import { PROD_BINANCE_URL } from '../Binance'
import { BinanceHttp } from '../BinanceHttp'
import { BinanceLog } from '../BinanceLog'
import { IBinanceBalanceSchema } from '../schemas/IBinanceBalanceSchema'
import { IBinanceKeyAccountSchema } from '../schemas/IBinanceKeySchema'



export class BinanceBalanceModule
  extends AAlunaModule implements IAlunaBalanceModule {

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

    return {
      symbolId: asset,
      account: AlunaAccountEnum.EXCHANGE,
      available: Number(free),
      total: Number(free) + Number(locked),
      meta: rawBalance,
    }

  }



  public parseMany (params: {
    rawBalances: IBinanceBalanceSchema[],
  }): IAlunaBalanceSchema[] {

    const { rawBalances } = params

    const parsedBalances = rawBalances.reduce((accumulator, rawBalance) => {
      const total = parseFloat(rawBalance.free) + parseFloat(rawBalance.locked);

      if (total > 0) {

        const parsedBalance = this.parse({ rawBalance })

        accumulator.push(parsedBalance)

      }

      return accumulator

    }, [] as IAlunaBalanceSchema[])

    return parsedBalances

  }

}
