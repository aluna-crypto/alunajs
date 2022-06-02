export enum FtxMarketTypeEnum {
  SPOT = 'spot',
  FUTURE = 'future',
  PERPETUAL = 'perpetual',
  /**
   * Type 'prediction is shown only when listing future markets ( '/futures' ).
   * When listing all markets ( '/markets' ), predictions markets are listed as
   * 'future'
   */
  PREDICTION = 'prediction'
}
