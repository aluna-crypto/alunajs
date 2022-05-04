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
 - [`BittrexHttp.ts`](http://github.com/alunacrypto/alunajs)
 - [`BittfinexHttp.ts`](http://github.com/alunacrypto/alunajs)


# 3. Schemas & Enums

Here we need to configure and the `types` related to the exchange.

They should completely describe the data model for all Exchange API methods.

Enums:
- [`BittrexSideEnum.ts`](http://github.com/alunacrypto/alunajs)
- [`BittrexOrderTypeEnum.ts`](http://github.com/alunacrypto/alunajs)

Schemas:
 - Bittrex:
   - [`IBittrexSymbolSchema.ts`](http://github.com/alunacrypto/alunajs)
   - [`IBittrexMarketSchema.ts`](http://github.com/alunacrypto/alunajs)
   - [`IBittrexKeySchema.ts`](http://github.com/alunacrypto/alunajs)
   - [`IBittrexBalanceSchema.ts`](http://github.com/alunacrypto/alunajs)
- Bitfinex:
   - [`IBitfinexPositionSchema.ts`](http://github.com/alunacrypto/alunajs)


# 4. Public Modules

Implement all the public API methods:

Examples:

 - [`bitfinex/modules/public/market.ts`](http://github.com/alunacrypto/alunajs)
 - [`bitfinex/modules/public/symbol.ts`](http://github.com/alunacrypto/alunajs)


# 5. Authed Modules

Here, all the authenticated methods:

Examples:

 - [`bitfinex/modules/authed/key.ts`](http://github.com/alunacrypto/alunajs)
 - [`bitfinex/modules/authed/balance.ts`](http://github.com/alunacrypto/alunajs)
 - [`bitfinex/modules/authed/order.ts`](http://github.com/alunacrypto/alunajs)
 - [`bitfinex/modules/authed/position.ts`](http://github.com/alunacrypto/alunajs)
