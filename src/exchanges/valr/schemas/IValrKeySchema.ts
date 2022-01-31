export interface IValrKeySchema {
  label: string
  permissions: ValrApiKeyPermissions[]
  addedAt: string
  allowedIpAddressCidr?: string
  allowedWithdrawAddressList?: IValrKeyAllowedWithdrawAddressList[]
}

export enum ValrApiKeyPermissions {
  VIEW_ACCESS = 'View access',
  TRADE = 'Trade',
  WITHDRAW = 'Withdraw',
}

export interface IValrKeyAllowedWithdrawAddressList {
  currency: string
  address: string
}
