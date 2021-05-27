import { AAlunaModule } from '@lib/abstracts/AAlunaModule'
import { IAlunaKeyModule } from '@lib/modules/IAlunaKeyModule'
import {
  IAlunaKeyPermissionSchema,
} from '@lib/schemas/IAlunaKeyPermissionSchema'

import { ValrErrorEnum } from '../enums/ValrErrorEnum'
import { IValrKeySchema } from '../schemas/IValrKeySchema'
import { IValrOrderSchema } from '../schemas/IValrOrderSchema'
import { ValrRequest } from '../ValrRequest'



export class ValrKeyModule extends AAlunaModule implements IAlunaKeyModule {

  public async validate (): Promise<boolean> {

    const alunaPermissions = await this.getPermissions()

    return alunaPermissions.read

  }



  public async getPermissions (): Promise<IAlunaKeyPermissionSchema> {

    const request = new ValrRequest()

    const permissions = {
      read: false,
      trade: false,
      withraw: undefined,
    }

    try {

      await request.get<IValrKeySchema>({
        url: 'https://api.valr.com/v1/account/balances',
        keySecret: this.exchange.keySecret,
      })

      permissions.read = true

      /**
       * The next request will try to place an order with invalid params. Since
       * the place order path requires an API with authotization to trade
       * Valr will first verify the API auth and only then verify the params.
       * This trick allow us to findout if the API key has permission to
       * create orders, since Valr does not provide a request for it
       */

      await request.get<IValrOrderSchema>({
        url: 'https://api.valr.com/v1/orders/limit',
        body: JSON.stringify({
          side: 'SELL',
          quantity: '0',
          price: '0',
          pair: 'NotACurrencyXX99',
          postOnly: false,
          timeInForce: 'GTC',
        }),
        keySecret: this.exchange.keySecret,
      })

    } catch (error) {

      if (
        error.message === ValrErrorEnum.INVALID_REQUEST
        && permissions.read
      ) {

        permissions.trade = true

      }

    }

    const parsedPermissions = this.parsePermissions({
      rawKey: permissions,
    })

    return parsedPermissions

  }



  public parsePermissions (
    params: {
      rawKey: IValrKeySchema,
    },
  ): IAlunaKeyPermissionSchema {

    const {
      rawKey,
    } = params

    return rawKey

  }

}
