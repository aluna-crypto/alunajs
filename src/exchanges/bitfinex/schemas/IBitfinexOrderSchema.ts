import { BitfinexOrderTypeEnum } from '../enums/BitfinexOrderTypeEnum'



export interface IBitfinexOrderSchema extends TBitfinexOrder {}



type TBitfinexOrder = [
  ID: number, // 0
  GID: number | null, // 1
  CID: number, // 2
  SYMBOL: string, // 3
  MTS_CREATE: number, // 4
  MTS_UPDATE: number, // 5
  AMOUNT: number, // 6
  AMOUNT_ORIG: number, // 7
  TYPE: BitfinexOrderTypeEnum, // 8
  TYPE_PREV: BitfinexOrderTypeEnum | null, // 9
  _PLACEHOLDER: string | null, // 10
  _PLACEHOLDER: string | null, // 11
  FLAGS: string, // 12
  STATUS: string, // 13
  _PLACEHOLDER: string | null, // 14
  _PLACEHOLDER: string | null, // 15
  PRICE: number, // 16
  PRICE_AVG: number, // 17
  PRICE_TRAILING: number, // 18
  PRICE_AUX_LIMIT: number, // 19
  _PLACEHOLDER: string | null, // 20
  _PLACEHOLDER: string | null, // 21
  _PLACEHOLDER: string | null, // 22
  HIDDEN: 1 | 0, // 23 - 2 if Hidden, 0 if not hidden
  PLACED_ID: number, // 24
  _PLACEHOLDER: string | null, // 25
  _PLACEHOLDER: string | null, // 26
  _PLACEHOLDER: string | null, // 27
  ROUTING: 'BFX' | 'API>BFX' | '', // 28
  _PLACEHOLDER: string | null, // 29
  _PLACEHOLDER: string | null, // 30
  META: any // 31
]



export type TBitfinexPlaceOrderResponse = [
  MTS: number,
  TYPE: string,
  MESSAGE_ID: string | null,
  PLACE_HOLDER: null,
  ORDER: [IBitfinexOrderSchema],
  CODE: number,
  STATUS: 'SUCCESS' | 'ERROR' | 'FAILURE',
  TEXT: string,
]



export type TBitfinexEditCancelOrderResponse = [
  MTS: number,
  TYPE: string,
  MESSAGE_ID: string | null,
  PLACE_HOLDER: null,
  ORDER: IBitfinexOrderSchema,
  CODE: number,
  STATUS: 'SUCCESS' | 'ERROR' | 'FAILURE',
  TEXT: string,
]
