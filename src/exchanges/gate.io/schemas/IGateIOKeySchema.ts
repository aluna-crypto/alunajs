export interface IGateIOKeySchema {
  label: string
  permissions: IGateIOKeyPermissions
  addedAt: string
}

export interface IGateIOKeyPermissions {
  spot: GateIOApiKeyPermissions
  margin: GateIOApiKeyPermissions
  wallet: GateIOApiKeyPermissions
}

export enum GateIOApiKeyPermissions {
  READ_ONLY = 'Read-only',
  READ_WRITE = 'Read-write',
  WITHDRAW = 'Withdraw',
}
export interface IGateIOKeyAllowedWithdrawAddressList {
  currency: string
  address: string
}
