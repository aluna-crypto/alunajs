import { IFtxKeySchema } from '../../schemas/IFtxKeySchema'



const FTX_RAW_MOCKED_REST_KEY = {} as any

export const FTX_KEY_PERMISSIONS: IFtxKeySchema = {
  ...FTX_RAW_MOCKED_REST_KEY,
  readOnly: true,
  withdrawalEnabled: true,
  account: {
    accountIdentifier: 1234,
  },
}
