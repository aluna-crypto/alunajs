import { AAlunaModule } from '../../../lib/core/abstracts/AAlunaModule'
import { AlunaHttpVerbEnum } from '../../../lib/enums/AlunaHtttpVerbEnum'
import { IAlunaKeyModule } from '../../../lib/modules/IAlunaKeyModule'
import { IAlunaKeyPermissionSchema } from '../../../lib/schemas/IAlunaKeyPermissionSchema'
import { GateIOHttp } from '../GateIOHttp'
import { GateIOLog } from '../GateIOLog'
import { IGateIOKeySchema } from '../schemas/IGateIOKeySchema'



export class GateIOKeyModule extends AAlunaModule implements IAlunaKeyModule {

  public async validate (): Promise<boolean> {

    GateIOLog.info('trying to validate GateIO key')

    const { read } = await this.getPermissions()

    const isValid = read

    let logMessage: string

    if (isValid) {

      logMessage = 'GateIO API key is valid'

    } else {

      logMessage = 'GateIO API key is invalid'

    }

    GateIOLog.info(logMessage)

    return isValid

  }



  public async getPermissions (): Promise<IAlunaKeyPermissionSchema> {

    GateIOLog.info('fetching GateIO key permissions')

    let permissions: IGateIOKeySchema

    try {

      const {
        keySecret,
      } = this.exchange

      permissions = await GateIOHttp.privateRequest<IGateIOKeySchema>({
        verb: AlunaHttpVerbEnum.GET,
        url: 'https://www.gateio.api.ws/api/v4/',
        keySecret,
      })

    } catch (error) {

      GateIOLog.error(error.message)

      throw error

    }

    const parsedPermissions = this.parsePermissions({
      rawKey: permissions,
    })

    return parsedPermissions

  }



  public parsePermissions (params: {
    rawKey: IGateIOKeySchema,
  }): IAlunaKeyPermissionSchema {

    // TODO implement me

    throw new Error('not implemented')

  }

}
