export interface IAlunaKeyPermissionSchema {
  balance: {
    read: boolean
  }
  orders: {
    read: boolean
    write: boolean
  }
  deposits: {
    read: boolean
  }
  withdraw: {
    write: boolean
  }
}
