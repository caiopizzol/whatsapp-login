import type {
  VerificationProvider,
  SendCodeParams,
  SendCodeResponse,
  VerifyCodeParams,
  VerifyCodeResponse,
  EvolutionApiConfig,
} from './types'
import {
  generateCode,
  calculateExpiry,
  formatMessage,
  DEFAULT_MESSAGE_TEMPLATE,
} from './types'

/**
 * Provider for Evolution API
 *
 * This provider uses client-side code generation. The code is generated
 * locally and sent via Evolution API's sendText endpoint.
 *
 * @see https://github.com/EvolutionAPI/evolution-api
 */
export class EvolutionApiProvider implements VerificationProvider {
  name = 'evolution-api'

  private config: EvolutionApiConfig

  constructor(config: EvolutionApiConfig) {
    this.config = {
      messageTemplate: DEFAULT_MESSAGE_TEMPLATE,
      ...config,
    }
  }

  async sendCode(params: SendCodeParams): Promise<SendCodeResponse> {
    const code = generateCode(params.codeLength)
    const message = formatMessage(this.config.messageTemplate!, code)

    const response = await fetch(
      `${this.config.apiUrl}/message/sendText/${this.config.instanceName}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: this.config.apiKey,
        },
        body: JSON.stringify({
          number: params.phone,
          text: message,
        }),
      }
    )

    if (!response.ok) {
      const data = await response.json().catch(() => ({}))
      throw new Error(
        data.message || data.error || 'Failed to send verification code'
      )
    }

    return {
      code,
      expiresAt: calculateExpiry(params.expiresIn),
    }
  }

  async verifyCode(params: VerifyCodeParams): Promise<VerifyCodeResponse> {
    // Client-side verification: compare codes directly
    const verified = params.code === params.expectedCode
    if (!verified) {
      throw new Error('Invalid verification code')
    }
    return { verified }
  }
}
