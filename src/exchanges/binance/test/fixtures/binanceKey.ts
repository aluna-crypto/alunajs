import { BinanceApiKeyPermissionsEnum } from '../../enums/BinanceApiKeyPermissionsEnum'
import { IBinanceKeySchema } from '../../schemas/IBinanceKeySchema'



const MOCK_REST_BINANCE_KEY_PERMISSIONS: any = {}

export const BINANCE_KEY_PERMISSIONS: IBinanceKeySchema = {
  permissions: [
    BinanceApiKeyPermissionsEnum.SPOT,
  ],
  canTrade: true,
  canWithdraw: true,
  ...MOCK_REST_BINANCE_KEY_PERMISSIONS,
}
