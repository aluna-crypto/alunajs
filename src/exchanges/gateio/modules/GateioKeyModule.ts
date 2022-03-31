import { AAlunaModule } from '../../../lib/core/abstracts/AAlunaModule'
import { AlunaHttpVerbEnum } from '../../../lib/enums/AlunaHtttpVerbEnum'
import {
  IAlunaKeyFetchDetailsReturns,
  IAlunaKeyModule,
  IAlunaKeyParseDetailsReturns,
  IAlunaKeyParsePermissionsReturns,
} from '../../../lib/modules/IAlunaKeyModule'
import {
  IAlunaKeyPermissionSchema,
  IAlunaKeySchema,
} from '../../../lib/schemas/IAlunaKeySchema'
import { GateioSideEnum } from '../enums/GateioSideEnum'
import { GateioHttp } from '../GateioHttp'
import { GateioLog } from '../GateioLog'
import { PROD_GATEIO_URL } from '../GateioSpecs'
import { IGateioBalanceSchema } from '../schemas/IGateioBalanceSchema'
import {
  IGateioKeyAccountSchema,
  IGateioKeySchema,
} from '../schemas/IGateioKeySchema'
import { IGateioOrderRequest } from '../schemas/IGateioOrderSchema'



export class GateioKeyModule extends AAlunaModule implements IAlunaKeyModule {

  public details: IAlunaKeySchema

  public parsePermissions (params: {
    rawKey: IGateioKeySchema,
  }): IAlunaKeyParsePermissionsReturns {

    const { rawKey } = params

    const alunaPermissions: IAlunaKeyPermissionSchema = {
      read: false,
      trade: false,
      withdraw: false,
    }

    Object.assign(alunaPermissions, rawKey)

    return {
      key: alunaPermissions,
      requestCount: 0,
    }

  }

  public async fetchDetails (): Promise<IAlunaKeyFetchDetailsReturns> {

    GateioLog.info('fetching Gateio key permissions')

    const FORBIDDEN_MESSAGE = 'FORBIDDEN'
    const READ_ONLY_MESSAGE = 'READ_ONLY'
    const INVALID_CURRENCY_PAIR_MESSAGE = 'INVALID_CURRENCY_PAIR'

    const { keySecret } = this.exchange

    const permissions: IGateioKeySchema = {
      read: false,
      trade: false,
      withdraw: false,
      accountId: undefined,
    }

    let requestCount = 0

    try {

      const {
        requestCount: privateRequestCount,
      } = await GateioHttp
        .privateRequest<IGateioBalanceSchema>({
          verb: AlunaHttpVerbEnum.GET,
          url: `${PROD_GATEIO_URL}/spot/accounts`,
          keySecret,
        })

      requestCount += privateRequestCount

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

      // need to assign the requestCount before because the request will fail
      requestCount += 1

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

    try {

      const {
        data: account,
        requestCount: privateRequestCount,
      } = await GateioHttp
        .privateRequest<IGateioKeyAccountSchema>({
          verb: AlunaHttpVerbEnum.GET,
          url: `${PROD_GATEIO_URL}/wallet/fee`,
          keySecret,
        })

      requestCount += privateRequestCount

      permissions.accountId = account.user_id.toString()

    } catch (error) {

      GateioLog.error(error)

      throw error

    }

    const {
      key: details,
      requestCount: parseDetailsCount,
    } = this.parseDetails({ rawKey: permissions })

    const totalRequestCount = requestCount + parseDetailsCount

    return {
      key: details,
      requestCount: totalRequestCount,
    }

  }

  public parseDetails (params: {
    rawKey: IGateioKeySchema,
  }): IAlunaKeyParseDetailsReturns {

    GateioLog.info('parsing Gateio key details')

    const {
      rawKey,
    } = params

    const {
      accountId,
    } = rawKey

    const requestCount = 0

    const {
      key: parsedPermissions,
      requestCount: parsePermissionsCount,
    } = this.parsePermissions({ rawKey })

    this.details = {
      meta: rawKey,
      accountId,
      permissions: parsedPermissions,
    }

    const totalRequestCount = requestCount + parsePermissionsCount

    return {
      key: this.details,
      requestCount: totalRequestCount,
    }

  }

}
