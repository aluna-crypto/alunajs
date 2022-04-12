import {
  filter,
  map,
  omit,
} from 'lodash'

import { AAlunaModule } from '../../../lib/core/abstracts/AAlunaModule'
import { AlunaError } from '../../../lib/core/AlunaError'
import { AlunaHttpVerbEnum } from '../../../lib/enums/AlunaHtttpVerbEnum'
import { AlunaHttpErrorCodes } from '../../../lib/errors/AlunaHttpErrorCodes'
import { AlunaKeyErrorCodes } from '../../../lib/errors/AlunaKeyErrorCodes'
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
import { BitmexHttp } from '../BitmexHttp'
import { BitmexLog } from '../BitmexLog'
import { PROD_BITMEX_URL } from '../BitmexSpecs'
import { IBitmexKeysSchema } from '../schemas/IBitmexKeysSchema'



export class BitmexKeyModule extends AAlunaModule implements IAlunaKeyModule {

  public details: IAlunaKeySchema

  public async fetchDetails (): Promise<IAlunaKeyFetchDetailsReturns> {

    BitmexLog.info('fetching Bitmex key details')

    const { keySecret } = this.exchange

    let rawKey: IBitmexKeysSchema
    let requestCount = 0

    try {

      const {
        data: apiKeyResponse,
        requestCount: privateRequestCount,
      } = await BitmexHttp.privateRequest<IBitmexKeysSchema>({
        verb: AlunaHttpVerbEnum.GET,
        url: `${PROD_BITMEX_URL}/apiKey`,
        keySecret,
      })

      rawKey = apiKeyResponse
      requestCount += privateRequestCount

    } catch (error) {

      const {
        message,
        metadata,
      } = error

      let {
        code,
        httpStatusCode,
      } = error

      if (message === 'Invalid API Key.') {

        code = AlunaKeyErrorCodes.INVALID
        httpStatusCode = 401

      } else {

        code = AlunaHttpErrorCodes.REQUEST_ERROR
        httpStatusCode = 500

      }

      const alunaError = new AlunaError({
        code,
        message,
        httpStatusCode,
        metadata,
      })

      BitmexLog.error(alunaError)

      throw alunaError

    }

    const {
      key: details,
      requestCount: parseDetailsCount,
    } = this.parseDetails({ rawKey })

    const totalRequestCount = requestCount + parseDetailsCount

    return {
      key: details,
      requestCount: totalRequestCount,
    }

  }

  public parseDetails (params: {
    rawKey: IBitmexKeysSchema,
  }): IAlunaKeyParseDetailsReturns {

    BitmexLog.info('parsing Bitmex key details')

    const {
      rawKey,
    } = params

    /**
     * According with 'BitMEX' API documentation both API 'KEY' and 'SECRET' are
     * returned in each key object. However, during my tests, I've seen only the
     * API 'KEY' (id) inside each key object. For safety we are removing any
     * 'secret' property that may exists inside each raw single key object to
     * avoid having this data stored inside the 'IAlunaKeySchema' 'meta'
     * property
     */
    const rawKeysWithoutSecrets = map(rawKey, (k) => omit(k, 'secret'))

    const [{ userId }] = rawKey

    const requestCount = 0

    const {
      key: parsedPermissions,
      requestCount: parsePermissionsCount,
    } = this.parsePermissions({ rawKey })

    this.details = {
      accountId: userId.toString(),
      permissions: parsedPermissions,
      meta: rawKeysWithoutSecrets,
    }

    const totalRequestCount = requestCount + parsePermissionsCount

    return {
      key: this.details,
      requestCount: totalRequestCount,
    }

  }

  public parsePermissions (params: {
    rawKey: IBitmexKeysSchema,
  }): IAlunaKeyParsePermissionsReturns {

    BitmexLog.info('parsing Bitmex key permissions')

    const { rawKey } = params

    const { key } = this.exchange.keySecret

    const [singleRawKey] = filter(rawKey, ((k) => k.id === key))

    const parsedKey: IAlunaKeyPermissionSchema = {
      read: true,
    }

    const { permissions } = singleRawKey

    if (permissions.length) {

      parsedKey.trade = permissions.includes('order')
      parsedKey.withdraw = permissions.includes('withdraw')

    }

    return {
      key: parsedKey,
      requestCount: 0,
    }

  }

}
