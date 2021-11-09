import { AAlunaModule } from '../../../lib/core/abstracts/AAlunaModule'
import { IAlunaKeyModule } from '../../../lib/modules/IAlunaKeyModule'
import { IAlunaKeyPermissionSchema } from '../../../lib/schemas/IAlunaKeyPermissionSchema'
import { GateIOLog } from '../GateIOLog'
import { IGateIOKeySchema } from '../schemas/IGateIOKeySchema'



export class GateIOKeyModule extends AAlunaModule implements IAlunaKeyModule {

  public async validate (): Promise<boolean> {

    // TODO implement me

    GateIOLog.info('trying to validate GateIO key')

    throw new Error('not implemented')

    const { read } = await this.getPermissions()

    const isValid = read

    GateIOLog.info(`GateIO key is ${isValid ? '' : 'not '}valid`)

    return isValid

  }



  public async getPermissions (): Promise<IAlunaKeyPermissionSchema> {

    // TODO implement me

    GateIOLog.info('fetching GateIO key permissions')

    throw new Error('not implemented')

  }



  public parsePermissions (params: {
    rawKey: IGateIOKeySchema,
  }): IAlunaKeyPermissionSchema {

    // TODO implement me

    throw new Error('not implemented')

  }

}
