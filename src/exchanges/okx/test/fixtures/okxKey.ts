import { IOkxKeyAccountSchema, IOkxKeySchema } from '../../schemas/IOkxKeySchema'



export const OKX_KEY_PERMISSIONS: IOkxKeySchema = {
  read: true,
  trade: true,
  withdraw: false,
  accountId: '781767883763712',
}

export const OKX_KEY_ACCOUNT_PERMISSIONS: IOkxKeyAccountSchema = {
  acctLv: '3',
  autoLoan: true,
  ctIsoMode: 'automatic',
  greeksType: 'PA',
  level: 'Lv3',
  levelTmp: '',
  mgnIsoMode: 'autonomy',
  posMode: 'net_mode',
  uid: '781767883763712',
}
