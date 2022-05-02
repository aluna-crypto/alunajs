export enum AlunaAccountEnum {
  EXCHANGE = 'exchange',
  MARGIN = 'margin',
  DERIVATIVES = 'derivatives',
  LENDING = 'lending', // QUESTION: Should we remove this account type?
  MAIN = 'main', // Okx doesn't provide separated balances
}
