import { AAlunaModule } from '../../../lib/core/abstracts/AAlunaModule'
import { AlunaHttpVerbEnum } from '../../../lib/enums/AlunaHtttpVerbEnum'
import { IAlunaKeyModule } from '../../../lib/modules/IAlunaKeyModule'
import {
  IAlunaKeyPermissionSchema,
  IAlunaKeySchema,
} from '../../../lib/schemas/IAlunaKeySchema'
import { GateioSideEnum } from '../enums/GateioSideEnum'
import { GateioHttp } from '../GateioHttp'
import { GateioLog } from '../GateioLog'
import { PROD_GATEIO_URL } from '../GateioSpecs'
import { IGateioBalanceSchema } from '../schemas/IGateioBalanceSchema'
import { IGateioKeySchema } from '../schemas/IGateioKeySchema'
import { IGateioOrderRequest } from '../schemas/IGateioOrderSchema'



export class GateioKeyModule extends AAlunaModule implements IAlunaKeyModule {

  public details: IAlunaKeySchema

  public parsePermissions (params: {
    rawKey: IGateioKeySchema,
  }): IAlunaKeyPermissionSchema {

    const { rawKey } = params

    const alunaPermissions: IAlunaKeyPermissionSchema = {
      read: false,
      trade: false,
      withdraw: false,
    }

    Object.assign(alunaPermissions, rawKey)

    return alunaPermissions

  }

  public async fetchDetails (): Promise<IAlunaKeySchema> {

    GateioLog.info('fetching Gateio key permissions')

    const FORBIDDEN_MESSAGE = 'FORBIDDEN'
    const READ_ONLY_MESSAGE = 'READ_ONLY'
    const INVALID_CURRENCY_PAIR_MESSAGE = 'INVALID_CURRENCY_PAIR'

    const { keySecret } = this.exchange

    const permissions: IGateioKeySchema = {
      read: false,
      trade: false,
      withdraw: false,
    }

    try {

      await GateioHttp
        .privateRequest<IGateioBalanceSchema>({
          verb: AlunaHttpVerbEnum.GET,
          url: `${PROD_GATEIO_URL}/spot/accounts`,
          keySecret,
        })

      permissions.read = true

    } catch (error) {

      if (error.metadata?.label === FORBIDDEN_MESSAGE) {

        permissions.read = false

      } else {

        throw error

      }

    }

    try {

      const requestBody: IGateioOrderRequest = {
        currency_pair: 'BTCUSDT',
        side: GateioSideEnum.BUY,
        amount: '0',
        price: '0',
      }

      await GateioHttp
        .privateRequest<IGateioBalanceSchema>({
          verb: AlunaHttpVerbEnum.POST,
          url: `${PROD_GATEIO_URL}/spot/orders`,
          keySecret,
          body: requestBody,
        })

    } catch (error) {

      if (error.metadata?.label === FORBIDDEN_MESSAGE) {

        permissions.trade = false

      } else if (error.metadata?.label === READ_ONLY_MESSAGE) {

        permissions.trade = false

      } else if (error.metadata?.label === INVALID_CURRENCY_PAIR_MESSAGE) {

        permissions.trade = true

      } else {

        throw error

      }

    }

    const details = this.parseDetails({ rawKey: permissions })

    return details

  }

  public parseDetails (params: {
    rawKey: IGateioKeySchema,
  }): IAlunaKeySchema {

    GateioLog.info('parsing Gateio key details')

    const {
      rawKey,
    } = params

    this.details = {
      meta: rawKey,
      accountId: undefined, // accountId is not provided
      permissions: this.parsePermissions({ rawKey }),
    }

    return this.details

  }

}
