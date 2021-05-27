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
      withraw: false,
    }

    try {

      await request.get<IValrKeySchema>({
        url: 'https://api.valr.com/v1/account/balances',
        path: '/v1/account/balances',
        keySecret: this.exchange.keySecret,
      })

      permissions.read = true

      await request.get<IValrOrderSchema>({
        url: 'https://api.valr.com/v1/orders/limit',
        path: '/v1/orders/limit',
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
