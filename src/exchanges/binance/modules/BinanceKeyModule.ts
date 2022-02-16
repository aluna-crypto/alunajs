import { AAlunaModule } from '../../../lib/core/abstracts/AAlunaModule'
import { AlunaHttpVerbEnum } from '../../../lib/enums/AlunaHtttpVerbEnum'
import { IAlunaKeyModule } from '../../../lib/modules/IAlunaKeyModule'
import {
  IAlunaKeyPermissionSchema,
  IAlunaKeySchema,
} from '../../../lib/schemas/IAlunaKeySchema'
import { BinanceHttp } from '../BinanceHttp'
import { BinanceLog } from '../BinanceLog'
import { PROD_BINANCE_URL } from '../BinanceSpecs'
import {
  BinanceApiKeyPermissions,
  IBinanceKeyAccountSchema,
} from '../schemas/IBinanceKeySchema'



export class BinanceKeyModule extends AAlunaModule implements IAlunaKeyModule {

  public details: IAlunaKeySchema

  public parsePermissions (params: {
    rawKey: IBinanceKeyAccountSchema,
  }): IAlunaKeyPermissionSchema {

    const { rawKey } = params

    const { permissions } = rawKey

    const alunaPermissions: IAlunaKeyPermissionSchema = {
      read: false,
      trade: false,
      withdraw: false,
    }

    permissions.forEach((permission: string) => {

      switch (permission) {

        case BinanceApiKeyPermissions.SPOT:
          alunaPermissions.read = true
          alunaPermissions.trade = rawKey.canTrade
          alunaPermissions.withdraw = rawKey.canWithdraw
          break

        default:

          BinanceLog.info(`Unknown permission '${permission}' found on Binance`
            .concat('permissions API response'))
          break

      }

    })

    return alunaPermissions

  }

  public async fetchDetails (): Promise<IAlunaKeySchema> {

    BinanceLog.info('fetching Binance key permissionsa')

    let rawKey: IBinanceKeyAccountSchema

    try {

      const { keySecret } = this.exchange

      rawKey = await BinanceHttp
        .privateRequest<IBinanceKeyAccountSchema>({
          verb: AlunaHttpVerbEnum.GET,
          url: `${PROD_BINANCE_URL}/api/v3/account`,
          keySecret,
        })

    } catch (error) {

      BinanceLog.error(error.message)

      throw error

    }

    const details = this.parseDetails({ rawKey })

    return details

  }

  public parseDetails (params: {
    rawKey: IBinanceKeyAccountSchema,
  }): IAlunaKeySchema {

    BinanceLog.info('parsing Binance key details')

    const {
      rawKey,
    } = params

    this.details = {
      meta: rawKey,
      accountId: undefined, //  binance doesn't give this
      permissions: this.parsePermissions({ rawKey }),
    }

    return this.details

  }

}
