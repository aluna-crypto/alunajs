import { IAlunaModule } from '../core/IAlunaModule'
import {
  IAlunaKeyPermissionSchema,
  IAlunaKeySchema,
} from '../schemas/IAlunaKeySchema'



export interface IAlunaKeyModule extends IAlunaModule {

  fetchDetails (): Promise<IAlunaKeySchema>
  parseDetails (params: { rawKey: any }): IAlunaKeySchema
  parsePermissions (params: { rawKey: any }): IAlunaKeyPermissionSchema

}
