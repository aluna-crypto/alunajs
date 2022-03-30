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
import { IValrBalanceSchema } from '../schemas/IValrBalanceSchema'
import { Valr } from '../Valr'
import { ValrHttp } from '../ValrHttp'
import { ValrLog } from '../ValrLog'



export class ValrBalanceModule extends AAlunaModule implements IAlunaBalanceModule {

  public async listRaw ()
    : Promise<IAlunaBalanceListRawReturns<IValrBalanceSchema>> {

    ValrLog.info('fetching Valr balances')

    const {
      data: rawBalances,
      apiRequestCount,
    } = await ValrHttp.privateRequest<IValrBalanceSchema[]>({
      verb: AlunaHttpVerbEnum.GET,
      url: 'https://api.valr.com/v1/account/balances',
      keySecret: this.exchange.keySecret,
    })

    return {
      rawBalances,
      apiRequestCount,
    }

  }

  public async list (): Promise<IAlunaBalanceListReturns> {

    let apiRequestCount = 0

    const {
      rawBalances,
      apiRequestCount: listRawCount,
    } = await this.listRaw()

    apiRequestCount += 1

    const {
      balances: parsedBalances,
      apiRequestCount: parseManyCount,
    } = this.parseMany({ rawBalances })

    apiRequestCount += 1

    ValrLog.info(`parsed ${parsedBalances.length} balances for Valr`)

    const totalApiRequestCount = parseManyCount
    + apiRequestCount
    + listRawCount

    const response: IAlunaBalanceListReturns = {
      apiRequestCount: totalApiRequestCount,
      balances: parsedBalances,
    }

    return response

  }

  public parse (params: {
    rawBalance: IValrBalanceSchema,
  }): IAlunaBalanceParseReturns {

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

    const parsedBalance: IAlunaBalanceSchema = {
      symbolId,
      account: AlunaAccountEnum.EXCHANGE,
      available: Number(available),
      total: Number(total),
      meta: rawBalance,
    }

    const response: IAlunaBalanceParseReturns = {
      balance: parsedBalance,
      apiRequestCount: 1,
    }

    return response

  }

  public parseMany (params: {
    rawBalances: IValrBalanceSchema[],
  }): IAlunaBalanceParseManyReturns {

    const { rawBalances } = params

    let apiRequestCount = 0

    const parsedBalances = rawBalances.reduce((accumulator, rawBalance) => {

      if (parseFloat(rawBalance.total) > 0) {

        const {
          balance: parsedBalance,
          apiRequestCount: parseCount,
        } = this.parse({ rawBalance })

        apiRequestCount += parseCount + 1

        accumulator.push(parsedBalance)

      }

      return accumulator

    }, [] as IAlunaBalanceSchema[])

    const response: IAlunaBalanceParseManyReturns = {
      balances: parsedBalances,
      apiRequestCount,
    }

    return response

  }

}
