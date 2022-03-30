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
import { Gateio } from '../Gateio'
import { GateioHttp } from '../GateioHttp'
import { GateioLog } from '../GateioLog'
import { PROD_GATEIO_URL } from '../GateioSpecs'
import { IGateioBalanceSchema } from '../schemas/IGateioBalanceSchema'



export class GateioBalanceModule extends AAlunaModule implements IAlunaBalanceModule {

  public async listRaw ()
    : Promise<IAlunaBalanceListRawReturns<IGateioBalanceSchema>> {

    GateioLog.info('fetching Gateio balances')

    const { keySecret } = this.exchange

    const { data: rawAccountInfo, apiRequestCount } = await GateioHttp
      .privateRequest<IGateioBalanceSchema[]>({
        verb: AlunaHttpVerbEnum.GET,
        url: `${PROD_GATEIO_URL}/spot/accounts`,
        keySecret,
      })

    return {
      apiRequestCount,
      rawBalances: rawAccountInfo,
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

    GateioLog.info(`parsed ${parsedBalances.length} balances for Gateio`)

    const totalApiRequestCount = apiRequestCount
        + listRawCount
        + parseManyCount

    return {
      balances: parsedBalances,
      apiRequestCount: totalApiRequestCount,
    }

  }



  public parse (params: {
    rawBalance: IGateioBalanceSchema,
  }): IAlunaBalanceParseReturns {

    const { rawBalance } = params

    const {
      currency,
      available,
      locked,
    } = rawBalance

    const symbolId = AlunaSymbolMapping.translateSymbolId({
      exchangeSymbolId: currency,
      symbolMappings: Gateio.settings.mappings,
    })

    const parsedBalance = {
      symbolId,
      account: AlunaAccountEnum.EXCHANGE,
      available: Number(available),
      total: Number(available) + Number(locked),
      meta: rawBalance,
    }

    return {
      balance: parsedBalance,
      apiRequestCount: 1,
    }

  }



  public parseMany (params: {
    rawBalances: IGateioBalanceSchema[],
  }): IAlunaBalanceParseManyReturns {

    const { rawBalances } = params

    let apiRequestCount = 0

    const parsedBalances = rawBalances.reduce<IAlunaBalanceSchema[]>(
      (accumulator, rawBalance) => {

        const {
          available,
          locked,
        } = rawBalance

        const total = parseFloat(available) + parseFloat(locked)

        if (total > 0) {

          const {
            balance: parsedBalance,
            apiRequestCount: parseCount,
          } = this.parse({ rawBalance })

          apiRequestCount += parseCount + 1

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
