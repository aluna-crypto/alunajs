import { AAlunaModule } from '../../../lib/core/abstracts/AAlunaModule'
import { AlunaHttpVerbEnum } from '../../../lib/enums/AlunaHtttpVerbEnum'
import { IAlunaKeyModule } from '../../../lib/modules/IAlunaKeyModule'
import { IAlunaKeyPermissionSchema } from '../../../lib/schemas/IAlunaKeyPermissionSchema'
import { ValrErrorEnum } from '../enums/ValrErrorEnum'
import { ValrOrderTimeInForceEnum } from '../enums/ValrOrderTimeInForceEnum'
import { ValrSideEnum } from '../enums/ValrSideEnum'
import { IValrKeySchema } from '../schemas/IValrKeySchema'
import { IValrOrderListSchema } from '../schemas/IValrOrderSchema'
import { ValrHttp } from '../ValrHttp'
import { ValrLog } from '../ValrLog'



export class ValrKeyModule extends AAlunaModule implements IAlunaKeyModule {

  public async validate (): Promise<boolean> {

    ValrLog.info()

    const alunaPermissions = await this.getPermissions()

    return alunaPermissions.read

  }



  public async getPermissions (): Promise<IAlunaKeyPermissionSchema> {

    ValrLog.info()

    const permissions = {
      read: false,
      trade: false,
      withraw: undefined,
    }

    try {

      /**
       * If this goes ok, it means we can read
       */
      await ValrHttp.privateRequest<IValrKeySchema>({
        verb: AlunaHttpVerbEnum.GET,
        url: 'https://api.valr.com/v1/orders/open',
        keySecret: this.exchange.keySecret,
      })

      permissions.read = true

      /**
       * The next request will try to place an order with invalid params, to
       * cause one of two errors:
       *
       *  1) If the error is about permissions, it means the api/key doesn't
       *     have permissions to write (place orders)
       *
       *  2) If the error is about the trade operation, it means the request
       *     went through, passed the key validation step, and failed on
       *     the trade operation (which fails because we use invalid params
       *     on purpose). This means we have permissions to write.
       *
       * The catch is that Valr will first verify if the API key has permissions
       * and only then verify the actual order params. This trick allow us to
       * findout if the API key has permission to create orders, since Valr
       * does not provide a request for it.
       */
      await ValrHttp.privateRequest<IValrOrderListSchema>({
        url: 'https://api.valr.com/v1/orders/limit',
        body: {
          side: ValrSideEnum.SELL,
          quantity: '0',
          price: '0',
          pair: 'NotACurrencyXX99',
          postOnly: false,
          timeInForce: ValrOrderTimeInForceEnum.GOOD_TILL_CANCELLED,
        },
        keySecret: this.exchange.keySecret,
      })

    } catch ({ message }) {

      /**
       * Now we validate if the error is related to the trade operation or the
       * key permissions, and fill the permissions accordingly.
       */
      const canRead = permissions.read
      const isRequestInvalid = (message === ValrErrorEnum.INVALID_REQUEST)

      permissions.trade = (canRead && isRequestInvalid)

    }

    const parsedPermissions = this.parsePermissions({
      rawKey: permissions,
    })

    return parsedPermissions

  }



  public parsePermissions (params: {
    rawKey: IValrKeySchema,
  }): IAlunaKeyPermissionSchema {

    ValrLog.info()

    const {
      rawKey,
    } = params

    return rawKey

  }

}
