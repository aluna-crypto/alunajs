import { IAlunaModule } from '@lib/abstracts/IAlunaModule'

import { IAlunaKeyPermissionSchema } from '../schemas/IAlunaKeyPermissionSchema'
import { IAlunaKeySecretSchema } from '../schemas/IAlunaKeySecretSchema'



export interface IAlunaKeyModule extends IAlunaModule {

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
