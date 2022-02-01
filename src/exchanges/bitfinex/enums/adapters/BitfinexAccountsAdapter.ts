import { buildAdapter } from '../../../../lib/enums/adapters/buildAdapter'
import { AlunaAccountEnum } from '../../../../lib/enums/AlunaAccountEnum'
import { BitfinexAccountsEnum } from '../BitfinexAccountsEnum'



export class BitfinexAccountsAdapter {

  static readonly ERROR_MESSAGE_PREFIX = 'Account'

  static translateToAluna (params: {
    value: string,
  }): AlunaAccountEnum {

    const { value } = params

    let account: AlunaAccountEnum

    if (/^exchange/i.test(value)) {

      account = AlunaAccountEnum.EXCHANGE

    } else {

      account = AlunaAccountEnum.MARGIN

    }

    return account

  }

  static translateToBitfinex =
    buildAdapter<AlunaAccountEnum, BitfinexAccountsEnum>({
      errorMessagePrefix: BitfinexAccountsAdapter.ERROR_MESSAGE_PREFIX,
      mappings: {
        [AlunaAccountEnum.EXCHANGE]: BitfinexAccountsEnum.EXCHANGE,
        [AlunaAccountEnum.MARGIN]: BitfinexAccountsEnum.MARGIN,
        [AlunaAccountEnum.LENDING]: BitfinexAccountsEnum.FUNDING,
        [AlunaAccountEnum.DERIVATIVES]: BitfinexAccountsEnum.DERIVATIVES,
      },
    })

}
