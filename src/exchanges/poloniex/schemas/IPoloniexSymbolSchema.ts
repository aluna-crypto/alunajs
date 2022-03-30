export interface IPoloniexSymbolInfoSchema {
    id: number
    name: string
    humanType: string
    currencyType: string
    txFee: string
    minConf: number
    depositAddress: string
    depositDisabled: number
    disabled: number
    frozen: number
    hexColor: string
    blockchain: string
    delisted: number
    isGeofenced: number
}

export interface IPoloniexSymbolSchema {
    [key: string]: IPoloniexSymbolInfoSchema
}

export interface IPoloniexSymbolWithCurrency extends IPoloniexSymbolInfoSchema {
    currency: string
}
