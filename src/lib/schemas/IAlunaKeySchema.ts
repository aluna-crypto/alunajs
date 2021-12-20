export interface IAlunaKeySchema {

  accountId?: string
  permissions: IAlunaKeyPermissionSchema

  meta: any

}

export interface IAlunaKeyPermissionSchema {

  read: boolean
  trade?: boolean
  withdraw?: boolean

}
