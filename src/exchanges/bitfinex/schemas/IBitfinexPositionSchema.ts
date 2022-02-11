import { BitfinexPositionStatusEnum } from '../enums/BitfinexPositionStatusEnum'



export interface IBitfinexPositionSchema extends TBitfinexPosition {}



type TBitfinexPosition = [
    SYMBOL: string, // 0
    STATUS: BitfinexPositionStatusEnum, // 1
    AMOUNT: number, // 2
    BASE_PRICE: number, // 3
    FUNDING: number, // 4
    FUNDING_TYPE: 0 | 1, // 5 (0 for daily, 1 for term)
    PL: number | null, // 6
    PL_PERC: number | null, // 7
    PRICE_LIQ: number | null, // 8
    LEVERAGE: number | null, // 9
    _PLACEHOLDER: null, // 10
    POSITION_ID: number, // 11
    MTS_CREATE: number | null, // 12
    MTS_UPDATE: number | null, // 13
    _PLACEHOLDER: null, // 14
    TYPE: 0 | 1, // 15 (0 = Margin position, 1 = Derivatives position)
    _PLACEHOLDER: null, // 16
    COLLATERAL: number, // 17
    COLLATERAL_MIN: number, // 18
    META: any, // 19
  ]
