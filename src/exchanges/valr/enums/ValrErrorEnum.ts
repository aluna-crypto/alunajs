export enum ValrErrorEnum {
  UNAUTHORIZED = 'Unauthorized',
  INVALID_KEY = 'API key or secret is invalid',
  INVALID_REQUEST = 'Invalid Request, please check your request and try again',
  INVALID_SIGNATURE = 'Request has an invalid signature',
  INVALID_ORDER = 'Invalid Order. ' // it comes with an extra empty char
}
