import { AAlunaModule } from '../../../lib/core/abstracts/AAlunaModule'
import { AlunaHttpVerbEnum } from '../../../lib/enums/AlunaHtttpVerbEnum'
import { IAlunaKeyModule } from '../../../lib/modules/IAlunaKeyModule'
import {
  IAlunaKeyPermissionSchema,
  IAlunaKeySchema,
} from '../../../lib/schemas/IAlunaKeySchema'
import { FtxHttp } from '../FtxHttp'
import { FtxLog } from '../FtxLog'
import { PROD_FTX_URL } from '../FtxSpecs'
import { IFtxKeySchema } from '../schemas/IFtxKeySchema'
import { IFtxResponseSchema } from '../schemas/IFtxSchema'



export class FtxKeyModule extends AAlunaModule implements IAlunaKeyModule {

  public details: IAlunaKeySchema

  public parsePermissions (params: {
    rawKey: IFtxKeySchema,
  }): IAlunaKeyPermissionSchema {

    const { rawKey } = params

    const { readOnly, withdrawalEnabled } = rawKey

    const alunaPermissions: IAlunaKeyPermissionSchema = {
      read: true,
      trade: false,
      withdraw: false,
    }

    if (!readOnly) {

      alunaPermissions.read = true
      alunaPermissions.trade = true

    }

    if (withdrawalEnabled) {

      alunaPermissions.withdraw = true

    }

    return alunaPermissions

  }

  public async fetchDetails (): Promise<IAlunaKeySchema> {

    FtxLog.info('fetching Ftx key permissionsa')

    let rawKey: IFtxKeySchema

    try {

      const { keySecret } = this.exchange

      const { result } = await FtxHttp
        .privateRequest<IFtxResponseSchema<IFtxKeySchema>>({
          verb: AlunaHttpVerbEnum.GET,
          url: `${PROD_FTX_URL}/login_status`,
          keySecret,
        })

      rawKey = result

    } catch (error) {

      FtxLog.error(error.message)

      throw error

    }

    const details = this.parseDetails({ rawKey })

    return details

  }

  public parseDetails (params: {
    rawKey: IFtxKeySchema,
  }): IAlunaKeySchema {

    FtxLog.info('parsing Ftx key details')

    const {
      rawKey,
    } = params

    const { account } = rawKey

    const { accountIdentifier } = account

    this.details = {
      accountId: accountIdentifier.toString(),
      permissions: this.parsePermissions({ rawKey }),
      meta: rawKey,
    }

    return this.details

  }

}
