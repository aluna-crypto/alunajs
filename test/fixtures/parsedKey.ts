import {
  IAlunaKeyPermissionSchema,
  IAlunaKeySchema,
} from '../../src/lib/schemas/IAlunaKeySchema'



export const PARSED_PERMISSIONS: IAlunaKeyPermissionSchema = {
  read: true,
  trade: true,
  withdraw: false,
}



export const PARSED_KEY: IAlunaKeySchema = {
  accountId: '666',
  permissions: PARSED_PERMISSIONS,
  meta: {},
}
