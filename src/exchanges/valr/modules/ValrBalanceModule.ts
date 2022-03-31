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
      requestCount,
    } = await ValrHttp.privateRequest<IValrBalanceSchema[]>({
      verb: AlunaHttpVerbEnum.GET,
      url: 'https://api.valr.com/v1/account/balances',
      keySecret: this.exchange.keySecret,
    })

    return {
      rawBalances,
      requestCount,
    }

  }

  public async list (): Promise<IAlunaBalanceListReturns> {

    const requestCount = 0

    const {
      rawBalances,
      requestCount: listRawCount,
    } = await this.listRaw()

    const {
      balances: parsedBalances,
      requestCount: parseManyCount,
    } = this.parseMany({ rawBalances })

    ValrLog.info(`parsed ${parsedBalances.length} balances for Valr`)

    const totalRequestCount = parseManyCount
    + requestCount
    + listRawCount

    const response: IAlunaBalanceListReturns = {
      requestCount: totalRequestCount,
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
      requestCount: 0,
    }

    return response

  }

  public parseMany (params: {
    rawBalances: IValrBalanceSchema[],
  }): IAlunaBalanceParseManyReturns {

    const { rawBalances } = params

    let requestCount = 0

    const parsedBalances = rawBalances.reduce((accumulator, rawBalance) => {

      if (parseFloat(rawBalance.total) > 0) {

        const {
          balance: parsedBalance,
          requestCount: parseCount,
        } = this.parse({ rawBalance })

        requestCount += parseCount

        accumulator.push(parsedBalance)

      }

      return accumulator

    }, [] as IAlunaBalanceSchema[])

    const response: IAlunaBalanceParseManyReturns = {
      balances: parsedBalances,
      requestCount,
    }

    return response

  }

}
