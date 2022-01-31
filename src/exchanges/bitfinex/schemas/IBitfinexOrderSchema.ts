export interface IBitfinexOrderSchema extends TBitfinexOrder {}



type TBitfinexOrder = [
  ID: number,
  GID: number | null,
  CID: number,
  SYMBOL: string,
  MTS_CREATE: number,
  MTS_UPDATE: number,
  AMOUNT: number,
  AMOUNT_ORIG: number,
  TYPE: string,
  TYPE_PREV: string | null,
  _PLACEHOLDER: string | null,
  _PLACEHOLDER: string | null,
  FLAGS: number,
  STATUS: string,
  _PLACEHOLDER: string | null,
  _PLACEHOLDER: string | null,
  PRICE: number,
  PRICE_AVG: number,
  PRICE_TRAILING: number,
  PRICE_AUX_LIMIT: number,
  _PLACEHOLDER: string | null,
  _PLACEHOLDER: string | null,
  _PLACEHOLDER: string | null,
  HIDDEN: 1 | 0, // 1 if Hidden, 0 if not hidden
  PLACED_ID: number,
  _PLACEHOLDER: string | null,
  _PLACEHOLDER: string | null,
  _PLACEHOLDER: string | null,
  ROUTING: 'BFX' | 'API>BFX', // indicates origin of action: BFX, API>BFX
  _PLACEHOLDER: string | null,
  _PLACEHOLDER: string | null,
  META: any
]

