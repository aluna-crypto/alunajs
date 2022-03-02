import { AAlunaModule } from '../../../lib/core/abstracts/AAlunaModule'
import { AlunaAccountEnum } from '../../../lib/enums/AlunaAccountEnum'
import { AlunaHttpVerbEnum } from '../../../lib/enums/AlunaHtttpVerbEnum'
import { IAlunaBalanceModule } from '../../../lib/modules/IAlunaBalanceModule'
import { IAlunaBalanceSchema } from '../../../lib/schemas/IAlunaBalanceSchema'
import { AlunaSymbolMapping } from '../../../utils/mappings/AlunaSymbolMapping'
import { Gateio } from '../Gateio'
import { GateioHttp } from '../GateioHttp'
import { GateioLog } from '../GateioLog'
import { PROD_GATEIO_URL } from '../GateioSpecs'
import { IGateioBalanceSchema } from '../schemas/IGateioBalanceSchema'



export class GateioBalanceModule extends AAlunaModule implements IAlunaBalanceModule {

  public async listRaw (): Promise<IGateioBalanceSchema[]> {

    GateioLog.info('fetching Gateio balances')

    const { keySecret } = this.exchange

    const rawAccountInfo = await GateioHttp
      .privateRequest<IGateioBalanceSchema[]>({
        verb: AlunaHttpVerbEnum.GET,
        url: `${PROD_GATEIO_URL}/spot/accounts`,
        keySecret,
      })

    return rawAccountInfo

  }



  public async list (): Promise<IAlunaBalanceSchema[]> {

    const rawBalances = await this.listRaw()

    const parsedBalances = this.parseMany({ rawBalances })

    GateioLog.info(`parsed ${parsedBalances.length} balances for Gateio`)

    return parsedBalances

  }



  public parse (params: {
    rawBalance: IGateioBalanceSchema,
  }): IAlunaBalanceSchema {

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

    return {
      symbolId,
      account: AlunaAccountEnum.EXCHANGE,
      available: Number(available),
      total: Number(available) + Number(locked),
      meta: rawBalance,
    }

  }



  public parseMany (params: {
    rawBalances: IGateioBalanceSchema[],
  }): IAlunaBalanceSchema[] {

    const { rawBalances } = params

    const parsedBalances = rawBalances.reduce<IAlunaBalanceSchema[]>(
      (accumulator, rawBalance) => {

        const {
          available,
          locked,
        } = rawBalance

        const total = parseFloat(available) + parseFloat(locked)

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
