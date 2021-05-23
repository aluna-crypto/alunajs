import {
  IAlunaKey,
} from '../../../../lib/modules/IAlunaKey'
import {
  IAlunaKeyPermissionSchema,
} from '../../../../lib/schemas/IAlunaKeyPermissionSchema'
import {
  IAlunaKeySecretSchema,
} from '../../../../lib/schemas/IAlunaKeySecretSchema'
import {
  ValrErrorEnum,
} from '../enums/ValrErrorEnum'
import {
  ValrPrivateRequest,
} from '../requests/ValrPrivateRequest'
import {
  IValrKeySchema,
} from '../schemas/IValrKeySchema'
import {
  IValrOrderSchema,
} from '../schemas/IValrOrderSchema'



export class ValrKey extends ValrPrivateRequest implements IAlunaKey {

  public async validate (
    params: IAlunaKeySecretSchema,
  ): Promise<boolean> {

    // TODO: implement me
    const x: any = params
    return x

  }



  public async getPermissions (
    params: IAlunaKeySecretSchema,
  ): Promise<IAlunaKeyPermissionSchema> {

    const permissions = {
      canRead: false,
      canTrade: false,
      canWithraw: false,
    }

    try {

      await this.get<IValrKeySchema>({
        url: 'https://api.valr.com/v1/account/balances',
        path: '/v1/account/balances',
        credentials: this.exchange.keySecret,
      })

      permissions.canRead = true

      await this.get<IValrOrderSchema>({
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
        credentials: this.exchange.keySecret,
      })

    } catch (error) {

      if (
        error.message === ValrErrorEnum.INVALID_REQUEST
        && permissions.canRead
      ) {

        permissions.canTrade = true

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
      rawKey: {
        canRead, canTrade, canWithraw,
      },
    } = params

    return {
      balance: {
        read: canRead,
      },
      orders: {
        read: canRead,
        write: canTrade,
      },
      deposits: {
        read: canRead,
      },
      withdraw: {
        write: canWithraw,
      },
    }

  }

}
