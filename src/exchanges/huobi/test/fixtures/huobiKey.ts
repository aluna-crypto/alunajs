import { IHuobiKeySchema } from '../../schemas/IHuobiKeySchema'



const rest = {} as any

export const HUOBI_KEY_PERMISSIONS: IHuobiKeySchema = {
  permission: 'readOnly,trade,withdraw',
  ...rest,
}
