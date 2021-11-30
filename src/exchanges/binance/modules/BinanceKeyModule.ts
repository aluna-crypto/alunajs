import { AAlunaModule } from '../../../lib/core/abstracts/AAlunaModule'
import { AlunaHttpVerbEnum } from '../../../lib/enums/AlunaHtttpVerbEnum'
import { IAlunaKeyModule } from '../../../lib/modules/IAlunaKeyModule'
import { IAlunaKeyPermissionSchema } from '../../../lib/schemas/IAlunaKeyPermissionSchema'
import { PROD_BINANCE_URL } from '../Binance'
import { BinanceHttp } from '../BinanceHttp'
import { BinanceLog } from '../BinanceLog'
import {
  BinanceApiKeyPermissions,
  IBinanceKeyAccountSchema,
} from '../schemas/IBinanceKeySchema'



export class BinanceKeyModule extends AAlunaModule implements IAlunaKeyModule {

  public async validate (): Promise<boolean> {

    BinanceLog.info('trying to validate Binance key')

    const { read } = await this.getPermissions()

    const isValid = read

    let logMessage = 'Binance API key is'

    if (isValid) {

      logMessage = logMessage.concat(' valid')

    } else {

      logMessage = logMessage.concat(' invalid')

    }

    BinanceLog.info(logMessage)

    return isValid

  }



  public async getPermissions (): Promise<IAlunaKeyPermissionSchema> {

    BinanceLog.info('fetching Binance key permissions')

    let rawKey: IBinanceKeyAccountSchema

    try {

      const { keySecret } = this.exchange

      rawKey = 
        await BinanceHttp
          .privateRequest<IBinanceKeyAccountSchema>({
            verb: AlunaHttpVerbEnum.GET,
            url: PROD_BINANCE_URL + '/api/v3/account',
            keySecret,
          })

    } catch (error) {

      BinanceLog.error(error.message)

      throw error

    }

    const parsedPermissions = this.parsePermissions({ rawKey })

    return parsedPermissions

  }



  public parsePermissions (params: {
    rawKey: IBinanceKeyAccountSchema,
  }): IAlunaKeyPermissionSchema {

    const { rawKey } = params

    const { permissions } = rawKey

    const alunaPermissions: IAlunaKeyPermissionSchema = {
      read: false,
      trade: false,
      withdraw: false,
      meta: rawKey,
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

}
