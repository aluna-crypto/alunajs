import { expect } from 'chai'

import {
  Aluna,
  AlunaAccountEnum,
  AlunaError,
  AlunaFeaturesModeEnum,
  AlunaHttpVerbEnum,
  AlunaInstrumentStateEnum,
  AlunaOrderStatusEnum,
  AlunaOrderTypesEnum,
  AlunaPositionStatusEnum,
  AlunaSideEnum,
  IAlunaBalanceModule,
  IAlunaBalanceSchema,
  IAlunaExchange,
  IAlunaExchangeSchema,
  IAlunaHttp,
  IAlunaInstrumentSchema,
  IAlunaKeyModule,
  IAlunaKeyPermissionSchema,
  IAlunaKeySecretSchema,
  IAlunaMarketModule,
  IAlunaMarketSchema,
  IAlunaModule,
  IAlunaOrderReadModule,
  IAlunaOrderSchema,
  IAlunaOrderWriteModule,
  IAlunaPositionModule,
  IAlunaPositionSchema,
  IAlunaSettingsSchema,
  IAlunaSymbolModule,
  IAlunaSymbolSchema,
  IAlunaTickerSchema,
} from './index'



describe('index', () => {

  /*
    Note: Interfaces are assigned to variables only to fail in case
    the index file stop exporting them.
  */

  it('should export everything seamlessly', () => {

    // main
    expect(Aluna).to.be.ok


    // core
    expect(AlunaError).to.be.ok

    const alunaExchange: IAlunaExchange | null = null
    const alunaHttp: IAlunaHttp | null = null
    const alunaModule: IAlunaModule | null = null

    expect(alunaExchange).not.to.be.ok
    expect(alunaHttp).not.to.be.ok
    expect(alunaModule).not.to.be.ok


    // enums
    expect(AlunaAccountEnum).to.be.ok
    expect(AlunaFeaturesModeEnum).to.be.ok
    expect(AlunaHttpVerbEnum).to.be.ok
    expect(AlunaInstrumentStateEnum).to.be.ok
    expect(AlunaOrderStatusEnum).to.be.ok
    expect(AlunaOrderTypesEnum).to.be.ok
    expect(AlunaPositionStatusEnum).to.be.ok
    expect(AlunaSideEnum).to.be.ok


    // modules
    const alunaBalanceModule: IAlunaBalanceModule | null = null
    const alunaKeyModule: IAlunaKeyModule | null = null
    const alunaMarketModule: IAlunaMarketModule | null = null
    const alunaOrderReadModule: IAlunaOrderReadModule | null = null
    const alunaOrderWriteModule: IAlunaOrderWriteModule | null = null
    const alunaPositionModule: IAlunaPositionModule | null = null
    const alunaSymbolModule: IAlunaSymbolModule | null = null

    expect(alunaBalanceModule).not.to.be.ok
    expect(alunaKeyModule).not.to.be.ok
    expect(alunaMarketModule).not.to.be.ok
    expect(alunaOrderReadModule).not.to.be.ok
    expect(alunaOrderWriteModule).not.to.be.ok
    expect(alunaPositionModule).not.to.be.ok
    expect(alunaSymbolModule).not.to.be.ok


    // schemas
    const alunaBalanceSchema: IAlunaBalanceSchema | null = null
    const alunaExchangeSpecsSchema: IAlunaExchangeSchema | null = null
    const alunaInstrumentSchema: IAlunaInstrumentSchema | null = null
    const alunaKeyPermissionSchema: IAlunaKeyPermissionSchema | null = null
    const alunaKeySecretSchema: IAlunaKeySecretSchema | null = null
    const alunaMarketSchema: IAlunaMarketSchema | null = null
    const alunaOrderSchema: IAlunaOrderSchema | null = null
    const alunaPositionSchema: IAlunaPositionSchema | null = null
    const alunaSettingsSchema: IAlunaSettingsSchema | null = null
    const alunaSymbolSchema: IAlunaSymbolSchema | null = null
    const alunaTickerSchema: IAlunaTickerSchema | null = null

    expect(alunaBalanceSchema).not.to.be.ok
    expect(alunaExchangeSpecsSchema).not.to.be.ok
    expect(alunaInstrumentSchema).not.to.be.ok
    expect(alunaKeyPermissionSchema).not.to.be.ok
    expect(alunaKeySecretSchema).not.to.be.ok
    expect(alunaMarketSchema).not.to.be.ok
    expect(alunaOrderSchema).not.to.be.ok
    expect(alunaPositionSchema).not.to.be.ok
    expect(alunaSettingsSchema).not.to.be.ok
    expect(alunaSymbolSchema).not.to.be.ok
    expect(alunaTickerSchema).not.to.be.ok

  })



})
