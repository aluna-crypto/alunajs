import { AAlunaModule } from '../../../lib/core/abstracts/AAlunaModule'
import { IAlunaBalanceModule } from '../../../lib/modules/IAlunaBalanceModule'
import { IAlunaBalanceSchema } from '../../../lib/schemas/IAlunaBalanceSchema'
import { GateioLog } from '../GateioLog'
import { IGateioBalanceSchema } from '../schemas/IGateioBalanceSchema'



export class GateioBalanceModule extends AAlunaModule implements IAlunaBalanceModule {

  public async listRaw (): Promise<IGateioBalanceSchema[]> {

    // TODO implement me

    GateioLog.info('fetching Gateio balances')

    throw new Error('not implemented')

  }



  public async list (): Promise<IAlunaBalanceSchema[]> {

    // TODO implement me

    const rawBalances = await this.listRaw()

    const parsedBalances = this.parseMany({ rawBalances })

    GateioLog.info(`parsed ${parsedBalances.length} balances for Gateio`)

    throw new Error('not implemented')

  }



  public parse (params: {
    rawBalance: IGateioBalanceSchema,
  }): IAlunaBalanceSchema {

    // TODO implement me

    const {
      rawBalance,
    } = params

    throw new Error('not implemented')

  }



  public parseMany (params: {
    rawBalances: IGateioBalanceSchema[],
  }): IAlunaBalanceSchema[] {

    // TODO implement me

    const {
      rawBalances,
    } = params

    throw new Error('not implemented')

  }

}
