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

    let logMessage = 'Valr API key is'

    if (isValid) {

      logMessage = logMessage.concat(' valid')

    } else {

      logMessage = logMessage.concat(' invalid')

    }

    ValrLog.info(logMessage)

    return isValid

  }



  public async getPermissions (): Promise<IAlunaKeyPermissionSchema> {

    ValrLog.info('fetching Valr key permissions')

    let rawKey: IValrKeySchema

    try {

      const { keySecret } = this.exchange

      rawKey = await ValrHttp.privateRequest<IValrKeySchema>({
        verb: AlunaHttpVerbEnum.GET,
        url: 'https://api.valr.com/v1/account/api-keys/current',
        keySecret,
      })

    } catch (error) {

      ValrLog.error(error.message)

      throw error

    }

    const parsedPermissions = this.parsePermissions({ rawKey })

    return parsedPermissions

  }



  public parsePermissions (params: {
    rawKey: IValrKeySchema,
  }): IAlunaKeyPermissionSchema {

    const { rawKey } = params

    const { permissions } = rawKey

    const alunaPermissions: IAlunaKeyPermissionSchema = {
      read: false,
      trade: false,
      withdraw: false,
    }

    permissions.forEach((permission) => {

      switch (permission) {

        case ValrApiKeyPermissions.VIEW_ACCESS:
          alunaPermissions.read = true
          break

        case ValrApiKeyPermissions.TRADE:
          alunaPermissions.trade = true
          break

        case ValrApiKeyPermissions.WITHDRAW:
          alunaPermissions.withdraw = true
          break

        default:

          ValrLog.info(`Unknown permission '${permission}' found on Valr`
            .concat('permissions API response'))

      }

    })

    if (alunaPermissions.withdraw) {

      throw new AlunaError({
        message: 'API key should not have withdraw permission.',
        statusCode: 401,
      })

    }

    return alunaPermissions

  }

}
