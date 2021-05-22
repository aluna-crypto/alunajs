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

    const rawKey = await this.post<IValrKeySchema>({
      url: '/get-key-permissions',
      params: {
        key,
        secret,
      },
    })

    const parsedPermissions = this.parsePermissions({
      rawKey,
    })

    return parsedPermissions

  }



  public parsePermissions (
    params: {
      rawKey: IValrKeySchema,
    },
  ): IAlunaKeySecretSchema {

    // TODO: implement me
    const x: any = params
    return x

  }

}
