import {
  IAlunaKeyPermissionSchema,
  IAlunaKeySchema,
} from '../../schemas/IAlunaKeySchema'
import {
  IAlunaModuleParams,
  IAlunaModuleReturns,
} from '../../schemas/IAlunaModuleSchema'



export interface IAlunaKeyModule {

  /* eslint-disable max-len */

  fetchDetails (params?: IAlunaKeyFetchDetailsParams): Promise<IAlunaKeyFetchDetailsReturns>
  parseDetails (params: IAlunaKeyParseDetailsParams): Promise<IAlunaKeyParseDetailsReturns>
  parsePermissions (params: IAlunaKeyParsePermissionsParams): Promise<IAlunaKeyParsePermissionsReturns>

  /* eslint-enable max-len */

}



/**
 * Parse
 */

export interface IAlunaKeyParseDetailsParams <T = any> extends IAlunaModuleParams {
  rawKey: T
}

export interface IAlunaKeyParseDetailsReturns extends IAlunaModuleReturns {
  key: IAlunaKeySchema
}



export interface IAlunaKeyParsePermissionsParams <T = any> extends IAlunaKeyParseDetailsParams<T> {}

export interface IAlunaKeyParsePermissionsReturns extends IAlunaModuleReturns {
  key: IAlunaKeyPermissionSchema
}



/**
 * Fetch
 */

export interface IAlunaKeyFetchDetailsParams extends IAlunaModuleParams {}

export interface IAlunaKeyFetchDetailsReturns extends IAlunaKeyParseDetailsReturns {}
