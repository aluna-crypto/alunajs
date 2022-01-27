import {
  AlunaError,
  AlunaHttpErrorCodes,
  IAlunaKeySchema,
} from '../../..'
import { AAlunaModule } from '../../../lib/core/abstracts/AAlunaModule'
import { IAlunaKeyModule } from '../../../lib/modules/IAlunaKeyModule'
import { IAlunaKeyPermissionSchema } from '../../../lib/schemas/IAlunaKeySchema'
import { BitfinexHttp } from '../BitfinexHttp'
import { BitfinexLog } from '../BitfinexLog'
import { IBitfinexKey } from '../schemas/IBitfinexKeySchema'



export class BitfinexKeyModule extends AAlunaModule implements IAlunaKeyModule {

  public details: IAlunaKeySchema

  public async fetchDetails (): Promise<IAlunaKeySchema> {

    BitfinexLog.info('fetching Bitfinex key details')

    const { keySecret } = this.exchange

    let rawKey: IBitfinexKey

    try {

      rawKey = await BitfinexHttp.privateRequest<IBitfinexKey>({
        url: 'https://api.bitfinex.com/v2/auth/r/permissions',
        keySecret,
      })

    } catch (error) {

      console.log(error)

      throw new AlunaError({
        code: AlunaHttpErrorCodes.REQUEST_ERROR,
        message: error.message,
        httpStatusCode: 500,
        metadata: error,
      })

    }

    const details = this.parseDetails({ rawKey })

    return details

  }

  public parseDetails (params: {
    rawKey: IBitfinexKey,
  }): IAlunaKeySchema {

    BitfinexLog.info('parsing Bitfinex key details')

    const {
      rawKey,
    } = params

    this.details = {
      meta: rawKey,
      accountId: undefined,
      permissions: this.parsePermissions({ rawKey }),
    }

    return this.details

  }

  public parsePermissions (params: {
    rawKey: IBitfinexKey,
  }): IAlunaKeyPermissionSchema {

    BitfinexLog.info('parsing Bitfinex key permissions')

    const { rawKey } = params

    const [
      _accountScope,
      ordersScope,
      _fundingScope,
      _settingsScope,
      walletsScope,
      withdrawScope,
    ] = rawKey

    const canReadBalances = walletsScope[1] === 1

    const canReadOrders = ordersScope[1] === 1
    const canCreateOrders = ordersScope[2] === 1

    const canWithdraw = withdrawScope[2] === 1

    const alunaPermissions: IAlunaKeyPermissionSchema = {
      read: canReadBalances && canReadOrders,
      trade: canCreateOrders,
      withdraw: canWithdraw,
    }

    return alunaPermissions

  }

}
