declare module 'iyzipay' {
  interface IyzipayOptions {
    apiKey: string
    secretKey: string
    uri: string
  }

  interface CallbackResult {
    status: string
    errorCode?: string
    errorMessage?: string
    errorGroup?: string
    locale?: string
    systemTime?: number
    conversationId?: string
    token?: string
    checkoutFormContent?: string
    tokenExpireTime?: number
    paymentPageUrl?: string
    paymentStatus?: string
    paymentId?: string
    fraudStatus?: number
    price?: string
    paidPrice?: string
    currency?: string
    installment?: number
    basketId?: string
    [key: string]: unknown
  }

  interface RequestParams {
    [key: string]: unknown
  }

  interface Resource {
    create(params: RequestParams, callback: (err: Error | null, result: CallbackResult) => void): void
    retrieve(params: RequestParams, callback: (err: Error | null, result: CallbackResult) => void): void
  }

  class Iyzipay {
    constructor(options: IyzipayOptions)
    checkoutFormInitialize: Resource
    checkoutForm: Resource
    payment: Resource
    subscription: Resource
    [key: string]: Resource | unknown
  }

  export = Iyzipay
}
