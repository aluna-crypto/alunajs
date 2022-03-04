import { AAlunaModule } from '../../../lib/core/abstracts/AAlunaModule'
import { AlunaAccountEnum } from '../../../lib/enums/AlunaAccountEnum'
import { AlunaHttpVerbEnum } from '../../../lib/enums/AlunaHtttpVerbEnum'
import { IAlunaBalanceModule } from '../../../lib/modules/IAlunaBalanceModule'
import { IAlunaBalanceSchema } from '../../../lib/schemas/IAlunaBalanceSchema'
import { AlunaSymbolMapping } from '../../../utils/mappings/AlunaSymbolMapping'
import { IValrBalanceSchema } from '../schemas/IValrBalanceSchema'
import { Valr } from '../Valr'
import { ValrHttp } from '../ValrHttp'
import { ValrLog } from '../ValrLog'



export class ValrBalanceModule extends AAlunaModule implements IAlunaBalanceModule {

  public async listRaw (): Promise<IValrBalanceSchema[]> {

    ValrLog.info('fetching Valr balances')

    const rawBalances = await ValrHttp.privateRequest<IValrBalanceSchema[]>({
      verb: AlunaHttpVerbEnum.GET,
      url: 'https://api.valr.com/v1/account/balances',
      keySecret: this.exchange.keySecret,
    })

    return rawBalances

  }

  public async list (): Promise<IAlunaBalanceSchema[]> {

    const rawBalances = await this.listRaw()

    const parsedBalances = this.parseMany({ rawBalances })

    ValrLog.info(`parsed ${parsedBalances.length} balances for Valr`)

    return parsedBalances

  }

  public parse (params: {
    rawBalance: IValrBalanceSchema,
  }): IAlunaBalanceSchema {

    const { rawBalance } = params

    const {
      currency,
      available,
      total,
    } = rawBalance

    const symbolId = AlunaSymbolMapping.translateSymbolId({
      exchangeSymbolId: currency,
      symbolMappings: Valr.settings.mappings,
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
    rawBalances: IValrBalanceSchema[],
  }): IAlunaBalanceSchema[] {

    const { rawBalances } = params

    const parsedBalances = rawBalances.reduce((accumulator, rawBalance) => {

      if (parseFloat(rawBalance.total) > 0) {

        const parsedBalance = this.parse({ rawBalance })

        accumulator.push(parsedBalance)

      }

      return accumulator

    }, [] as IAlunaBalanceSchema[])

    return parsedBalances

  }

}
