import { BitfinexPositionStatusEnum } from '../enums/BitfinexPositionStatusEnum'



export interface IBitfinexPositionSchema extends TBitfinexPosition {}



type TBitfinexPosition = [
    SYMBOL: string,
    STATUS: BitfinexPositionStatusEnum,
    AMOUNT: number,
    BASE_PRICE: number,
    FUNDING: number,
    FUNDING_TYPE: 0 | 1, // 0 for daily, 1 for term
    PL: number | null,
    PL_PERC: number | null,
    PRICE_LIQ: number | null,
    LEVERAGE: number | null,
    _PLACEHOLDER: null,
    POSITION_ID: number,
    MTS_CREATE: number,
    MTS_UPDATE: number,
    _PLACEHOLDER: null,
    TYPE: 0 | 1, // 0 = Margin position, 1 = Derivatives position
    _PLACEHOLDER: null,
    COLLATERAL: number,
    COLLATERAL_MIN: number,
    META: any,
  ]
