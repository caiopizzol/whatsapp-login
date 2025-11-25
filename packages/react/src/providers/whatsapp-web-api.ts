import type {
  VerificationProvider,
  SendCodeParams,
  SendCodeResponse,
  VerifyCodeParams,
  VerifyCodeResponse,
  WhatsAppWebApiConfig,
} from './types'

/**
 * Provider for WhatsApp Web API (whatsapp-web-api)
 *
 * This provider uses server-side code generation and verification.
 * The backend handles code storage and validation.
 *
 * @see https://github.com/caiopizzol/whatsapp-web-api
 */
export class WhatsAppWebApiProvider implements VerificationProvider {
  name = 'whatsapp-web-api'

  private config: WhatsAppWebApiConfig

  constructor(config: WhatsAppWebApiConfig) {
    this.config = {
      sessionId: 'login',
      ...config,
    }
  }

  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }
    if (this.config.authToken) {
      headers['Authorization'] = `Bearer ${this.config.authToken}`
    }
    return headers
  }

  async sendCode(params: SendCodeParams): Promise<SendCodeResponse> {
    const response = await fetch(
      `${this.config.apiUrl}/sessions/${this.config.sessionId}/verify/send`,
      {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          phone: params.phone,
          codeLength: params.codeLength,
          expiresIn: params.expiresIn,
        }),
      }
    )

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Failed to send verification code')
    }

    return {
      code: data.code,
      expiresAt: data.expiresAt,
    }
  }

  async verifyCode(params: VerifyCodeParams): Promise<VerifyCodeResponse> {
    const response = await fetch(
      `${this.config.apiUrl}/sessions/${this.config.sessionId}/verify/check`,
      {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          phone: params.phone,
          code: params.code,
        }),
      }
    )

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Invalid verification code')
    }

    return { verified: true }
  }
}
