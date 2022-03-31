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
import { BittrexHttp } from '../BittrexHttp'
import { BittrexLog } from '../BittrexLog'
import { PROD_BITTREX_URL } from '../BittrexSpecs'
import { BittrexOrderTimeInForceEnum } from '../enums/BittrexOrderTimeInForceEnum'
import { BittrexOrderTypeEnum } from '../enums/BittrexOrderTypeEnum'
import { BittrexSideEnum } from '../enums/BittrexSideEnum'
import { IBittrexBalanceSchema } from '../schemas/IBittrexBalanceSchema'
import { IBittrexKeySchema } from '../schemas/IBittrexKeySchema'



export class BittrexKeyModule extends AAlunaModule implements IAlunaKeyModule {

  public details: IAlunaKeySchema

  public parsePermissions (params: {
    rawKey: IBittrexKeySchema,
  }): IAlunaKeyParsePermissionsReturns {

    const { rawKey } = params

    const alunaPermissions: IAlunaKeyPermissionSchema = {
      read: false,
      trade: false,
      withdraw: false,
    }

    delete rawKey.accountId

    Object.assign(alunaPermissions, rawKey)

    return {
      key: alunaPermissions,
      requestCount: 0,
    }

  }

  public async fetchDetails (): Promise<IAlunaKeyFetchDetailsReturns> {

    BittrexLog.info('fetching Bittrex key permissions')

    const INVALID_PERMISSION_MESSAGE = 'INVALID_PERMISSION'
    const BAD_REQUEST_MESSAGE = 'BAD_REQUEST'

    const { keySecret } = this.exchange

    let requestCount = 0

    const permissions: IBittrexKeySchema = {
      read: false,
      trade: false,
      withdraw: false,
    }

    try {

      const {
        requestCount: privateRequestCount,
      } = await BittrexHttp
        .privateRequest<IBittrexBalanceSchema>({
          verb: AlunaHttpVerbEnum.GET,
          url: `${PROD_BITTREX_URL}/balances`,
          keySecret,
        })

      permissions.read = true
      requestCount += privateRequestCount

    } catch (error) {

      if (error.metadata?.code === INVALID_PERMISSION_MESSAGE) {

        permissions.read = false

      } else {

        throw error

      }

    }

    try {

      const requestBody = {
        marketSymbol: 'BTCEUR',
        direction: BittrexSideEnum.BUY,
        type: BittrexOrderTypeEnum.MARKET,
        quantity: 0,
        timeInForce: BittrexOrderTimeInForceEnum.GOOD_TIL_CANCELLED,
        useAwards: false,
      }

      // need to assign the requestCount before because the request will fail
      requestCount += 1

      await BittrexHttp
        .privateRequest<IBittrexBalanceSchema>({
          verb: AlunaHttpVerbEnum.POST,
          url: `${PROD_BITTREX_URL}/orders`,
          keySecret,
          body: requestBody,
        })

    } catch (error) {

      if (error.metadata?.code === INVALID_PERMISSION_MESSAGE) {

        permissions.trade = false

      } else if (error.metadata?.code === BAD_REQUEST_MESSAGE) {

        permissions.trade = true

      } else {

        throw error

      }

    }

    try {

      const {
        data: account,
        requestCount: privateRequestCount,
      } = await BittrexHttp
        .privateRequest<IBittrexKeySchema>({
          verb: AlunaHttpVerbEnum.GET,
          url: `${PROD_BITTREX_URL}/account`,
          keySecret,
        })

      requestCount += privateRequestCount

      permissions.accountId = account.accountId

    } catch (error) {

      BittrexLog.error(error)

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
    rawKey: IBittrexKeySchema,
  }): IAlunaKeyParseDetailsReturns {

    BittrexLog.info('parsing Bittrex key details')

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

    const totalRequestCount = parsePermissionsCount + requestCount

    return {
      key: this.details,
      requestCount: totalRequestCount,
    }

  }

}
