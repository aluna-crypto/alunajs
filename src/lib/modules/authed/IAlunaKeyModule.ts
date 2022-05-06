import {
  IAlunaKeyPermissionSchema,
  IAlunaKeySchema,
} from '../../schemas/IAlunaKeySchema'
import {
  IAlunaModuleParams,
  IAlunaModuleReturns,
} from '../../schemas/IAlunaModuleSchema'



export interface IAlunaKeyModule {

  fetchDetails (params?: IAlunaKeyFetchDetailsParams): Promise<IAlunaKeyFetchDetailsReturns>
  parseDetails (params: IAlunaKeyParseDetailsParams<any>): IAlunaKeyParseDetailsReturns
  parsePermissions (params: IAlunaKeyParsePermissionsParams<any>): IAlunaKeyParsePermissionsReturns

}



/**
 * Parse
 */

export interface IAlunaKeyParseDetailsParams <T> {
  rawKey: T
}

export interface IAlunaKeyParseDetailsReturns {
  key: IAlunaKeySchema
}



export interface IAlunaKeyParsePermissionsParams <T> extends IAlunaKeyParseDetailsParams<T> {}

export interface IAlunaKeyParsePermissionsReturns {
  permissions: IAlunaKeyPermissionSchema
}



/**
 * Fetch
 */

export interface IAlunaKeyFetchDetailsParams extends IAlunaModuleParams {}

export interface IAlunaKeyFetchDetailsReturns extends IAlunaKeyParseDetailsReturns, IAlunaModuleReturns {}
