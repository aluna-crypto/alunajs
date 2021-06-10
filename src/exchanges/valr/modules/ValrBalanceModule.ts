import { AAlunaModule } from '../../../lib/core/abstracts/AAlunaModule'
import { AlunaAccountEnum } from '../../../lib/enums/AlunaAccountEnum'
import { AlunaHttpVerbEnum } from '../../../lib/enums/AlunaHtttpVerbEnum'
import { IAlunaBalanceModule } from '../../../lib/modules/IAlunaBalanceModule'
import { IAlunaBalanceSchema } from '../../../lib/schemas/IAlunaBalanceSchema'
import { IValrBalanceSchema } from '../schemas/IValrBalanceSchema'
import { ValrHttp } from '../ValrHttp'



export class ValrBalanceModule extends AAlunaModule implements IAlunaBalanceModule {

  public async listRaw (): Promise<IValrBalanceSchema[]> {

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

    return parsedBalances

  }



  public parse (params: {
    rawBalance: IValrBalanceSchema,
  }): IAlunaBalanceSchema {

    const {
      rawBalance,
    } = params

    return {
      symbolId: rawBalance.currency,
      account: AlunaAccountEnum.EXCHANGE,
      available: Number(rawBalance.available),
      total: Number(rawBalance.total),
    }

  }



  public parseMany (params: {
    rawBalances: IValrBalanceSchema[],
  }): IAlunaBalanceSchema[] {

    const {
      rawBalances,
    } = params

    const parsedBalances = rawBalances.reduce((cumulator, current) => {

      if (parseFloat(current.total) > 0) {

        const parsedBalance = this.parse({
          rawBalance: current,
        })

        cumulator.push(parsedBalance)

      }

      return cumulator

    }, [] as IAlunaBalanceSchema[])

    return parsedBalances

  }

}
