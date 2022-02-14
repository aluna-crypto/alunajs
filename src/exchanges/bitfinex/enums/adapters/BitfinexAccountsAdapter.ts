import { buildAdapter } from '../../../../lib/enums/adapters/buildAdapter'
import { AlunaAccountEnum } from '../../../../lib/enums/AlunaAccountEnum'
import { BitfinexAccountsEnum } from '../BitfinexAccountsEnum'
import { BitfinexOrderTypesEnum } from '../BitfinexOrderTypesEnum'



export class BitfinexAccountsAdapter {

  static readonly ERROR_MESSAGE_PREFIX = 'Account'

  static translateToAluna (params: {
    value: BitfinexOrderTypesEnum | BitfinexAccountsEnum,
  }): AlunaAccountEnum {

    const { value } = params

    let translatedAccount: AlunaAccountEnum

    if (/^exchange/i.test(value)) {

      translatedAccount = AlunaAccountEnum.EXCHANGE

    } else {

      translatedAccount = AlunaAccountEnum.MARGIN

    }

    return translatedAccount

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
