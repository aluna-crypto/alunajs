import { IAlunaKeySchema } from '../../..'
import { AAlunaModule } from '../../../lib/core/abstracts/AAlunaModule'
import { AlunaHttpVerbEnum } from '../../../lib/enums/AlunaHtttpVerbEnum'
import { IAlunaKeyModule } from '../../../lib/modules/IAlunaKeyModule'
import { IAlunaKeyPermissionSchema } from '../../../lib/schemas/IAlunaKeySchema'
import {
  IValrKeySchema,
  ValrApiKeyPermissions,
} from '../schemas/IValrKeySchema'
import { ValrHttp } from '../ValrHttp'
import { ValrLog } from '../ValrLog'



export class ValrKeyModule extends AAlunaModule implements IAlunaKeyModule {

  public details: IAlunaKeySchema

  public async fetchDetails (): Promise<IAlunaKeySchema> {

    ValrLog.info('fetching Valr key details')

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

    const details = this.parseDetails({ rawKey })

    return details

  }

  public parseDetails (params: {
    rawKey: IValrKeySchema,
  }): IAlunaKeySchema {

    ValrLog.info('parsing Valr key details')

    const {
      rawKey,
    } = params

    this.details = {
      meta: rawKey,
      accountId: undefined, //  valr doesn't give this
      permissions: this.parsePermissions({ rawKey }),
    }

    return this.details

  }

  public parsePermissions (params: {
    rawKey: IValrKeySchema,
  }): IAlunaKeyPermissionSchema {

    ValrLog.info('parsing Valr key permissions')

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

    return alunaPermissions

  }

}
