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

  fetchDetails (params: IAlunaKeyFetchDetailsParams): Promise<IAlunaKeyFetchDetailsReturns>
  parseDetails (params: IAlunaKeyParseDetailsParams): IAlunaKeyParseDetailsReturns
  parsePermissions (params: IAlunaKeyParsePermissionsParams): IAlunaKeyParsePermissionsReturns

  /* eslint-enable max-len */

}



/**
 * Parse
 */

export interface IAlunaKeyParseDetailsParams {
  rawKey: any
}

export interface IAlunaKeyParseDetailsReturns extends IAlunaModuleReturns {
  key: IAlunaKeySchema
}



export interface IAlunaKeyParsePermissionsParams<T = any> {
  rawKey: T
}

export interface IAlunaKeyParsePermissionsReturns {
  key: IAlunaKeyPermissionSchema
}



/**
 * Fetch
 */

export interface IAlunaKeyFetchDetailsParams extends IAlunaModuleParams {

}

export interface IAlunaKeyFetchDetailsReturns extends IAlunaModuleReturns {
  key: IAlunaKeySchema
}
