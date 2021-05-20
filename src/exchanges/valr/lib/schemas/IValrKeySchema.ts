export interface IValrKeySchema {
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
