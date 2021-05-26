import { IAlunaKeyPermissionSchema } from '../schemas/IAlunaKeyPermissionSchema'
import { IAlunaKeySecretSchema } from '../schemas/IAlunaKeySecretSchema'



export interface IAlunaKey {

  validate (
    params: IAlunaKeySecretSchema,
  ): Promise<boolean>

  getPermissions (
    params: IAlunaKeySecretSchema,
  ): Promise<IAlunaKeyPermissionSchema>

  parsePermissions (
    params: { rawKey: any },
  ): IAlunaKeyPermissionSchema

}
