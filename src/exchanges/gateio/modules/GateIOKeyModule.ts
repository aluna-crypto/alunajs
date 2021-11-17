import { AlunaError } from '../../..'
import { AAlunaModule } from '../../../lib/core/abstracts/AAlunaModule'
import { AlunaHttpVerbEnum } from '../../../lib/enums/AlunaHtttpVerbEnum'
import { IAlunaKeyModule } from '../../../lib/modules/IAlunaKeyModule'
import { IAlunaKeyPermissionSchema } from '../../../lib/schemas/IAlunaKeyPermissionSchema'
import { GateIOHttp } from '../GateIOHttp'
import { GateIOLog } from '../GateIOLog'
import {
  GateIOApiKeyPermissions,
  IGateIOKeySchema,
} from '../schemas/IGateIOKeySchema'



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

    const rawKey: IGateIOKeySchema = {
      addedAt: new Date().toString(),
      permissions: {
        margin: GateIOApiKeyPermissions.NONE,
        spot: GateIOApiKeyPermissions.NONE,
        wallet: GateIOApiKeyPermissions.NONE,
      },
    }


    const {
      keySecret,
    } = this.exchange


    // check for read-write permissions for spot and margin

    try {

      const body = {
        currency_pair: 'ALUNAJS_TEST',
        type: 'limit',
        account: 'spot',
        side: 'buy',
        iceberg: '0',
        amount: '1',
        price: '5.00032',
        time_in_force: 'gtc',
        auto_borrow: false,
      }

      await GateIOHttp.privateRequest<any>({
        verb: AlunaHttpVerbEnum.POST,
        url: 'https://api.gateio.ws/api/v4/spot/orders',
        keySecret,
        body,
      })

    } catch (error) {

      /* will check if the user has read or read-write permissions based on
        error thrown by Gate API
      */

      const spot = 'Request API key does not have spot permission'

      if (error.message !== spot) {

        rawKey.permissions.margin = GateIOApiKeyPermissions.READ_WRITE
        rawKey.permissions.spot = GateIOApiKeyPermissions.READ_WRITE

      }

      GateIOLog.error(error.message)

    }

    // check for read-only permissions for spot and margin

    try {

      const body = {
        currency_pair: 'ALUNAJS_TEST',
      }

      await GateIOHttp.privateRequest<any>({
        verb: AlunaHttpVerbEnum.GET,
        url: 'https://api.gateio.ws/api/v4/spot/orders',
        keySecret,
        body,
      })

    } catch (error) {

      const spot = 'Request API key does not have spot permission'

      if (error.message !== spot) {

        rawKey.permissions.margin = GateIOApiKeyPermissions.READ_ONLY
        rawKey.permissions.spot = GateIOApiKeyPermissions.READ_ONLY

      } else {

        rawKey.permissions.margin = GateIOApiKeyPermissions.NONE
        rawKey.permissions.spot = GateIOApiKeyPermissions.NONE

      }

      GateIOLog.error(error.message)

    }

    // check for read-only permissions for wallet

    try {

      const body = {
        currency: 'ALUNAJSTEST',
      }

      await GateIOHttp.privateRequest<any>({
        verb: AlunaHttpVerbEnum.GET,
        url: 'https://api.gateio.ws/api/v4/wallet/total_balance',
        keySecret,
        body,
      })

    } catch (error) {

      const wallet = 'Request API key does not have wallet permission'

      if (error.message !== wallet) {

        rawKey.permissions.wallet = GateIOApiKeyPermissions.READ_ONLY

      }

      GateIOLog.error(error.message)

    }

    // check for withdraw permission

    try {

      const body = {
        currency: 'ALUNAJSTEST',
        address: '1HkxtBAMrA3tP5ENnYY2CZortjZvFDH5Cs',
        amount: '222.61',
        chain: 'TRX',
      }

      await GateIOHttp.privateRequest<any>({
        verb: AlunaHttpVerbEnum.POST,
        url: 'https://api.gateio.ws/api/v4/withdrawals',
        keySecret,
        body,
      })

    } catch (error) {

      const withdraw = 'Request API key does not have withdraw permission'

      if (error.message !== withdraw) {

        throw new AlunaError({
          message: 'API key should not have withdraw permission.',
          statusCode: 401,
        })


      }

      GateIOLog.error(error.message)

    }

    const parsedPermissions = this.parsePermissions({
      rawKey,
    })

    return parsedPermissions

  }



  public parsePermissions (params: {
    rawKey: IGateIOKeySchema,
  }): IAlunaKeyPermissionSchema {

    const spotPermissions = params.rawKey.permissions.spot

    const {
      READ_WRITE, READ_ONLY,
    } = GateIOApiKeyPermissions

    const trade = (spotPermissions === READ_WRITE)
    const read = (trade || spotPermissions === READ_ONLY)

    const ok: IAlunaKeyPermissionSchema = {
      read,
      trade,
      withdraw: false,
    }

    return ok

  }

}
