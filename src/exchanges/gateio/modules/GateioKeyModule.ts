import { AAlunaModule } from '../../../lib/core/abstracts/AAlunaModule'
import { IAlunaKeyModule } from '../../../lib/modules/IAlunaKeyModule'
import { IAlunaKeyPermissionSchema } from '../../../lib/schemas/IAlunaKeyPermissionSchema'
import { GateioLog } from '../GateioLog'
import { IGateioKeySchema } from '../schemas/IGateioKeySchema'



export class GateioKeyModule extends AAlunaModule implements IAlunaKeyModule {

  public async validate (): Promise<boolean> {

    // TODO implement me

    GateioLog.info('trying to validate Gateio key')

    throw new Error('not implemented')

    const { read } = await this.getPermissions()

    const isValid = read

    GateioLog.info(`Gateio key is ${isValid ? '' : 'not '}valid`)

    return isValid

  }



  public async getPermissions (): Promise<IAlunaKeyPermissionSchema> {

    // TODO implement me

    GateioLog.info('fetching Gateio key permissions')

    throw new Error('not implemented')

  }



  public parsePermissions (params: {
    rawKey: IGateioKeySchema,
  }): IAlunaKeyPermissionSchema {

    // TODO implement me

    throw new Error('not implemented')

  }

}
