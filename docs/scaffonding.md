# AlunaJS / Scaffolding

The first step to add a new **_exchange_**.

## TL;DR

```
yarn add-exchange
```

## Terminology

Before configuring the generator, the basics.

 1. Trading Features
    - The account types that trading is enabled on this exchange:
      - `Spot`
      - `Margin`
      - `Derivatives`
 1. API Features (that the exchange provides)
    - Order Editting
      - _Does the exhange API provides a method for editing orders?_
    - Position Indentifier
      - _Does the exhange API provides a `uid` for `positions`?_

# 1. Scafflding

Let's do it.

```
yarn add-exchange
```

`<image-1-here>`<br/>
`<image-2-here>`

Configure your new exchange and voilà.

If your `exchangeId` was 'bitfinex', you should end up with this:

```bash
src/exchanges/bitfinex
├── Bitfinex.ts
├── BitfinexAuthed.ts
├── BitfinexHttp.ts
├── bitfinexSpecs.ts
├── enums
│   └── delete-me.txt
├── errors
│   └── delete-me.txt
├── modules
│   ├── authed
│   └── public
└── schemas
    ├── IBitfinexKeySchema.ts
    ├── IBitfinexMarketSchema.ts
    └── IBitfinexSymbolSchema.ts
```

# 2. HTTP Class

First, implement an http class.

It should sign requests and send them the way the exchange expects.

Examples:
 - [`BittrexHttp.ts`](../src/exchanges/bittrex/BittrexHttp.ts)
 - [`BittfinexHttp.ts`](../src/exchanges/bittrex/BitfinexHttp.ts)


# 3. Schemas & Enums

Here we need to configure and the `types` related to the exchange.

They should completely describe the data model for all Exchange API methods.

Enums:
  - Bittrex:
    - [`BittrexOrderSideEnum.ts`](../src/exchanges/bittrex/enums/BittrexOrderSideEnum.ts`)
    - [`BittrexOrderTypeEnum.ts`](../src/exchanges/bittrex/enums/BittrexOrderTypeEnum.ts)
  - Bitfinex:
    - [`BitfinexOrderSideEnum.ts`](../src/exchanges/bittrex/enums/BitfinexOrderSideEnum.ts`)
    - [`BitfinexOrderTypeEnum.ts`](../src/exchanges/bittrex/enums/BitfinexOrderTypeEnum.ts)

Schemas:
  - Bittrex:
    - [`IBittrexSymbolSchema.ts`](../src/exchanges/bittrex/schemas/IBittrexSymbolSchema.ts)
    - [`IBittrexMarketSchema.ts`](../src/exchanges/bittrex/schemas/IBittrexMarketSchema.ts)
    - [`IBittrexKeySchema.ts`](../src/exchanges/bittrex/schemas/IBittrexKeySchema.ts)
    - [`IBittrexBalanceSchema.ts`](../src/exchanges/bittrex/schemas/IBittrexBalanceSchema.ts)
  - Bitfinex:
    - [`IBitfinexSymbolSchema.ts`](../src/exchanges/bittrex/schemas/IBitfinexSymbolSchema.ts)
    - [`IBitfinexMarketSchema.ts`](../src/exchanges/bittrex/schemas/IBitfinexMarketSchema.ts)
    - [`IBitfinexKeySchema.ts`](../src/exchanges/bittrex/schemas/IBitfinexKeySchema.ts)
    - [`IBitfinexBalanceSchema.ts`](../src/exchanges/bittrex/schemas/IBitfinexBalanceSchema.ts)


# 4. Public Modules

Implement all the public API methods:

Examples:

 - [`bitfinex/modules/public/market.ts`](../src/exchanges/bitfinex/modules/public/market.ts)
 - [`bitfinex/modules/public/symbol.ts`](../src/exchanges/bitfinex/modules/public/symbol.ts)


# 5. Authed Modules

Here, all the authenticated methods:

Examples:

 - [`bitfinex/modules/authed/key.ts`](../src/exchanges/bitfinex/modules/authed/key.ts)
 - [`bitfinex/modules/authed/balance.ts`](../src/exchanges/bitfinex/modules/authed/balance.ts)
 - [`bitfinex/modules/authed/order.ts`](../src/exchanges/bitfinex/modules/authed/order.ts)
 - [`bitfinex/modules/authed/position.ts`](../src/exchanges/bitfinex/modules/authed/position.ts)
