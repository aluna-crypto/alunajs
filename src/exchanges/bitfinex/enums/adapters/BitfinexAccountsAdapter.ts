import { buildAdapter } from '../../../../lib/enums/adapters/buildAdapter'
import { AlunaAccountEnum } from '../../../../lib/enums/AlunaAccountEnum'
import { BitfinexAccountsEnum } from '../BitfinexAccountsEnum'



export class BitfinexAccountsAdapter {

  static readonly ERROR_MESSAGE_PREFIX = 'Balance type'

  static translateToAluna =
    buildAdapter<BitfinexAccountsEnum, AlunaAccountEnum>({
      errorMessagePrefix: BitfinexAccountsAdapter.ERROR_MESSAGE_PREFIX,
      mappings: {
        [BitfinexAccountsEnum.EXCHANGE]: AlunaAccountEnum.EXCHANGE,
        [BitfinexAccountsEnum.MARGIN]: AlunaAccountEnum.MARGIN,
        [BitfinexAccountsEnum.FUNDING]: AlunaAccountEnum.LENDING,
        [BitfinexAccountsEnum.DERIV]: AlunaAccountEnum.DERIVATIVES,
      },
    })

  static translateToBitfinex =
    buildAdapter<AlunaAccountEnum, BitfinexAccountsEnum>({
      errorMessagePrefix: BitfinexAccountsAdapter.ERROR_MESSAGE_PREFIX,
      mappings: {
        [AlunaAccountEnum.EXCHANGE]: BitfinexAccountsEnum.EXCHANGE,
        [AlunaAccountEnum.MARGIN]: BitfinexAccountsEnum.MARGIN,
        [AlunaAccountEnum.LENDING]: BitfinexAccountsEnum.FUNDING,
        [AlunaAccountEnum.DERIVATIVES]: BitfinexAccountsEnum.DERIV,
      },
    })

}
