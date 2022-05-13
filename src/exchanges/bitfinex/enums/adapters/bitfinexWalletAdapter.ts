import { buildAdapter } from '../../../../lib/enums/adapters/buildAdapter'
import { AlunaWalletEnum } from '../../../../lib/enums/AlunaWalletEnum'
import { BitfinexAccountsEnum } from '../BitfinexAccountsEnum'



const errorMessagePrefix = 'Wallet type'



export const translateWalletToAluna = buildAdapter<
  BitfinexAccountsEnum,
  AlunaWalletEnum
>({
  errorMessagePrefix,
  mappings: {
    [BitfinexAccountsEnum.EXCHANGE]: AlunaWalletEnum.SPOT,
    [BitfinexAccountsEnum.MARGIN]: AlunaWalletEnum.MARGIN,
    [BitfinexAccountsEnum.DERIVATIVES]: AlunaWalletEnum.DERIVATIVES,
    [BitfinexAccountsEnum.FUNDING]: AlunaWalletEnum.FUNDING,
  },
})



export const translateWalletToBitfinex = buildAdapter<
  AlunaWalletEnum,
  BitfinexAccountsEnum
>({
  errorMessagePrefix,
  mappings: {
    [AlunaWalletEnum.SPOT]: BitfinexAccountsEnum.EXCHANGE,
    [AlunaWalletEnum.MARGIN]: BitfinexAccountsEnum.MARGIN,
    [AlunaWalletEnum.DERIVATIVES]: BitfinexAccountsEnum.DERIVATIVES,
    [AlunaWalletEnum.FUNDING]: BitfinexAccountsEnum.FUNDING,
  },
})
