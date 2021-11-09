import { AAlunaModule } from '../../../lib/core/abstracts/AAlunaModule'
import { IAlunaBalanceModule } from '../../../lib/modules/IAlunaBalanceModule'
import { IAlunaBalanceSchema } from '../../../lib/schemas/IAlunaBalanceSchema'
import { GateIOLog } from '../GateIOLog'
import { IGateIOBalanceSchema } from '../schemas/IGateIOBalanceSchema'



export class GateIOBalanceModule extends AAlunaModule implements IAlunaBalanceModule {

  public async listRaw (): Promise<IGateIOBalanceSchema[]> {

    // TODO implement me

    GateIOLog.info('fetching GateIO balances')

    throw new Error('not implemented')

  }



  public async list (): Promise<IAlunaBalanceSchema[]> {

    // TODO implement me

    const rawBalances = await this.listRaw()

    const parsedBalances = this.parseMany({ rawBalances })

    GateIOLog.info(`parsed ${parsedBalances.length} balances for GateIO`)

    throw new Error('not implemented')

  }



  public parse (params: {
    rawBalance: IGateIOBalanceSchema,
  }): IAlunaBalanceSchema {

    // TODO implement me

    const {
      rawBalance,
    } = params

    throw new Error('not implemented')

  }



  public parseMany (params: {
    rawBalances: IGateIOBalanceSchema[],
  }): IAlunaBalanceSchema[] {

    // TODO implement me

    const {
      rawBalances,
    } = params

    throw new Error('not implemented')

  }

}
