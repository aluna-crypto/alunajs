export interface IValrKeySchema {
  label: string
  permissions: ValrApiKeyPermissionsEnum[]
  addedAt: string
  allowedIpAddressCidr?: string
  allowedWithdrawAddressList?: IValrKeyAllowedWithdrawAddressList[]
}

export enum ValrApiKeyPermissionsEnum {
  VIEW_ACCESS = 'View access',
  TRADE = 'Trade',
  WITHDRAW = 'Withdraw',
}

export interface IValrKeyAllowedWithdrawAddressList {
  currency: string
  address: string
}
