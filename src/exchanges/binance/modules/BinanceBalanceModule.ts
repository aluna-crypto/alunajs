import { AAlunaModule } from '../../../lib/core/abstracts/AAlunaModule'
import { AlunaAccountEnum } from '../../../lib/enums/AlunaAccountEnum'
import { AlunaHttpVerbEnum } from '../../../lib/enums/AlunaHtttpVerbEnum'
import { IAlunaBalanceModule } from '../../../lib/modules/IAlunaBalanceModule'
import { IAlunaBalanceSchema } from '../../../lib/schemas/IAlunaBalanceSchema'
import { BinanceHttp } from '../BinanceHttp'
import { BinanceLog } from '../BinanceLog'
import { IBinanceBalanceSchema } from '../schemas/IBinanceBalanceSchema'



export class BinanceBalanceModule extends AAlunaModule implements IAlunaBalanceModule {

  public async listRaw (): Promise<IBinanceBalanceSchema[]> {

    BinanceLog.info('fetching Binance balances')

    const rawBalances = await BinanceHttp.privateRequest<IBinanceBalanceSchema[]>({
      verb: AlunaHttpVerbEnum.GET,
      url: 'https://api.binance.com/v1/account/balances',
      keySecret: this.exchange.keySecret,
    })

    return rawBalances

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
    } = rawBalance

    return {
      symbolId: asset,
      account: AlunaAccountEnum.EXCHANGE,
      available: Number(free),
      total: Number(free),
      meta: rawBalance,
    }

  }



  public parseMany (params: {
    rawBalances: IBinanceBalanceSchema[],
  }): IAlunaBalanceSchema[] {

    const { rawBalances } = params

    const parsedBalances = rawBalances.reduce((accumulator, rawBalance) => {

      if (parseFloat(rawBalance.free) > 0) {

        const parsedBalance = this.parse({ rawBalance })

        accumulator.push(parsedBalance)

      }

      return accumulator

    }, [] as IAlunaBalanceSchema[])

    return parsedBalances

  }

}
