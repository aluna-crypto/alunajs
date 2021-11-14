export interface IGateIOKeySchema {
  permissions: IGateIOKeyPermissions
  addedAt: string
}



export enum GateIOApiKeyPermissions {
  READ_ONLY = 'Read-only',
  READ_WRITE = 'Read-write',
  NONE = 'None',
}



export interface IGateIOKeyPermissions {
  spot: GateIOApiKeyPermissions
  margin: GateIOApiKeyPermissions
  wallet: GateIOApiKeyPermissions
}


export interface IGateIOKeyAllowedWithdrawAddressList {
  currency: string
  address: string
}
