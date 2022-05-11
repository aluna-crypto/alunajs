import { IBitmexKeySchema } from '../../schemas/IBitmexKeySchema'



export const BITMEX_RAW_KEY: IBitmexKeySchema = {
  id: '34563456356,',
  secret: ' 345343563456534,',
  name: 'my-Key',
  nonce: 0,
  cidr: '0.0.0.0/0',
  permissions: ['order'],
  enabled: true,
  userId: 666,
  created: '2022-03-06T19:20:03.242Z',
}



export const BITMEX_RAW_PERMISSIONS: string[][] = [
  [],
  ['orderCancel', 'withdraw'],
  ['order'],
]
