import { buildAdapter } from '../../../../lib/enums/adapters/buildAdapter'
import { AlunaAccountEnum } from '../../../../lib/enums/AlunaAccountEnum'
import { BitfinexAccountsEnum } from '../BitfinexAccountsEnum'
import { BitfinexOrderTypeEnum } from '../BitfinexOrderTypeEnum'



const errorMessagePrefix = 'Account'

export const translateAccountToAluna = (params: {
    value: BitfinexOrderTypeEnum | BitfinexAccountsEnum
  }): AlunaAccountEnum => {

  const { value } = params

  let translatedAccount: AlunaAccountEnum

  if (/^exchange/i.test(value)) {

    translatedAccount = AlunaAccountEnum.SPOT

  } else {

    translatedAccount = AlunaAccountEnum.MARGIN

  }

  return translatedAccount

}



export const translateToBitfinex = buildAdapter<AlunaAccountEnum, BitfinexAccountsEnum>({
  errorMessagePrefix,
  mappings: {
    [AlunaAccountEnum.SPOT]: BitfinexAccountsEnum.EXCHANGE,
    [AlunaAccountEnum.MARGIN]: BitfinexAccountsEnum.MARGIN,
    [AlunaAccountEnum.LENDING]: BitfinexAccountsEnum.FUNDING,
    [AlunaAccountEnum.DERIVATIVES]: BitfinexAccountsEnum.DERIVATIVES,
  },
})
