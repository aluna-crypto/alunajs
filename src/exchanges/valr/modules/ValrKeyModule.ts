import { AAlunaModule } from '../../../lib/core/abstracts/AAlunaModule'
import { AlunaError } from '../../../lib/core/AlunaError'
import { AlunaHttpVerbEnum } from '../../../lib/enums/AlunaHtttpVerbEnum'
import { IAlunaKeyModule } from '../../../lib/modules/IAlunaKeyModule'
import { IAlunaKeyPermissionSchema } from '../../../lib/schemas/IAlunaKeyPermissionSchema'
import {
  IValrKeySchema,
  ValrApiKeyPermissions,
} from '../schemas/IValrKeySchema'
import { ValrHttp } from '../ValrHttp'
import { ValrLog } from '../ValrLog'



export class ValrKeyModule extends AAlunaModule implements IAlunaKeyModule {

  public async validate (): Promise<boolean> {

    ValrLog.info('trying to validate Valr key')

    const { read } = await this.getPermissions()

    const isValid = read

    let logMessage: string

    if (isValid) {

      logMessage = 'Valr API key is valid'

    } else {

      logMessage = 'Valr API key is invalid'

    }

    ValrLog.info(logMessage)

    return isValid

  }



  public async getPermissions (): Promise<IAlunaKeyPermissionSchema> {

    ValrLog.info('fetching Valr key permissions')

    let permissions: IValrKeySchema

    try {

      const {
        keySecret,
      } = this.exchange

      permissions = await ValrHttp.privateRequest<IValrKeySchema>({
        verb: AlunaHttpVerbEnum.GET,
        url: 'https://api.valr.com/v1/account/api-keys/current',
        keySecret,
      })

    } catch (error) {

      ValrLog.error(error.message)

      throw error

    }

    const parsedPermissions = this.parsePermissions({
      rawKey: permissions,
    })

    return parsedPermissions

  }



  public parsePermissions (params: {
    rawKey: IValrKeySchema,
  }): IAlunaKeyPermissionSchema {

    const {
      rawKey,
    } = params

    const { permissions } = rawKey

    const read = permissions.includes(ValrApiKeyPermissions.VIEW_ACCESS)
    const trade = permissions.includes(ValrApiKeyPermissions.TRADE)
    const withdraw = permissions.includes(ValrApiKeyPermissions.WITHDRAW)

    if (withdraw) {

      throw new AlunaError({
        message: 'API key should not have withdraw permission.',
        statusCode: 401,
      })

    }

    const alunaPermissions: IAlunaKeyPermissionSchema = {
      read,
      trade,
      withdraw: false,
    }

    return alunaPermissions

  }

}
