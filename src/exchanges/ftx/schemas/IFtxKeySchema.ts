export interface IFtxAccountSchema {
  accountIdentifier: number
    username: string
    collateral: number
    freeCollateral: number
    totalAccountValue: number
    totalPositionSize: number
    initialMarginRequirement: number
    maintenanceMarginRequirement: number
    marginFraction: number
    openMarginFraction: number
    liquidating: boolean
    backstopProvider: boolean
    positions: []
    takerFee: number
    makerFee: number
    leverage: number
    positionLimit: number
    positionLimitUsed: number
    useFttCollateral: boolean
    chargeInterestOnNegativeUsd: boolean
    spotMarginEnabled: boolean
    spotLendingEnabled: boolean
}

export interface IFtxUserSchema {
  agreedToMarginAndLocAgreement: boolean
  hkClientType: boolean
  coachellaPurchaseAgreement: boolean
  mobileHasDeposited: boolean
  defaultFiat: number
  paidNftListingFee: number
  agreedToTrumpExtension: boolean
  ukClientTypeResponse: boolean
  mobileHasTraded: boolean
  displayName: string
  fiatVerified: boolean
  email: string
  mid: string
  kycApplicationStatus: string
  kycLevel: number
  kycType: string
  referralCode: number
  referred: boolean
  referrerId: number
  vip: number
  mmLevel: number
  feeTier: number
  ftt: number
  jurisdiction: string
  monthlyVolume: number
  monthlyMakerVolume: number
  monthlyLtVolume: number
  monthlyLeveragedTokenCreationVolume: number
  monthlyLeveragedTokenRedemptionVolume: number
  dailyVolume: number
  dailyMakerVolume: number
  dailyLeveragedTokenCreationVolume: number
  dailyLeveragedTokenRedemptionVolume: number
  mfa: string
  requireMfaForWithdrawals: boolean
  requireWithdrawalPassword: boolean
  requireWhitelistedWithdrawals: boolean
  whitelistedAddressDelayDays: number
  randomSlug: string
  showInLeaderboard: boolean
  useRealNameInLeaderboard: boolean
  chatUserId: number
  useBodPriceChange: boolean
  confirmTrades: boolean
  cancelAllOrdersButtonEnabled: boolean
  passedLtQuiz: boolean
  ukClientType: string
  hkStatus: string
  hkStatusMobile: string
  originCode: string
  nuveiUploadedPof: boolean
  nuveiPofRejected: boolean
  neverRequireEmailLinks: boolean
  chatApp: boolean
  chatHandle: boolean
  language: string
  dailyLocInterestRate: number
  optionsEnabled: boolean
  canOtcTradeOptions: boolean
  whitelistedSeller: boolean
}


export interface IFtxKeySchema {
  loggedIn: boolean
  account: IFtxAccountSchema
  user: IFtxUserSchema
  subaccount: boolean // @TODO -> Need to verify
  country: string
  state: string
  supportOnly: boolean
  mfaRequired: boolean
  requiresEmailLink: boolean
  mfa: string
  readOnly: boolean
  restrictedToSubaccount: boolean
  withdrawalEnabled: boolean
  internalTransfersEnabled: boolean
  onlyAllowSupportOnly: boolean
  tokenizedStockAllowed: boolean
}
