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
  ValrPrivateRequest,
} from '../requests/ValrPrivateRequest'
import {
  IValrKeySchema,
} from '../schemas/IValrKeySchema'



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

    const {
      key,
      secret,
    } = params

    let permissions = {} as IValrKeySchema

    try {

      await this.get<IValrKeySchema>({
        url: 'https://api.valr.com/v1/account/balances',
        path: 'as',
        credentials: {
          key,
          secret,
        },
      })

      permissions = {
        canRead: true,
        canTrade: !!await this.get<IValrOrderSchema>({
          url: 'https://api.valr.com/v1/simple/notACurrencyXX00/order',
          path: '/v1/simple/notACurrencyXX00/order',
          body: JSON.stringify({
            payInCurrency: 'notAnActualCurrencyXX00',
            payAmount: '0',
            side: 'SELL',
          }),
          credentials: {
            key,
            secret,
          },
        }),
        canWithraw: false,
      }

    } catch (error) {

      if (error.message === 'Unauthorized') {

        permissions = {
          canRead: false,
          canTrade: false,
          canWithraw: false,
        }

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
