import type {
  VerificationProvider,
  SendCodeParams,
  SendCodeResponse,
  VerifyCodeParams,
  VerifyCodeResponse,
  WhatsAppCloudApiConfig,
} from './types'
import {
  generateCode,
  calculateExpiry,
  formatMessage,
  DEFAULT_MESSAGE_TEMPLATE,
} from './types'

const GRAPH_API_VERSION = 'v18.0'
const GRAPH_API_BASE = 'https://graph.facebook.com'

/**
 * Provider for WhatsApp Cloud API (Official Meta API)
 *
 * This provider uses client-side code generation. The code is generated
 * locally and sent via Meta's official WhatsApp Cloud API.
 *
 * @see https://developers.facebook.com/docs/whatsapp/cloud-api
 */
export class WhatsAppCloudApiProvider implements VerificationProvider {
  name = 'whatsapp-cloud-api'

  private config: WhatsAppCloudApiConfig

  constructor(config: WhatsAppCloudApiConfig) {
    this.config = {
      messageTemplate: DEFAULT_MESSAGE_TEMPLATE,
      ...config,
    }
  }

  async sendCode(params: SendCodeParams): Promise<SendCodeResponse> {
    const code = generateCode(params.codeLength)
    const message = formatMessage(this.config.messageTemplate!, code)

    const response = await fetch(
      `${GRAPH_API_BASE}/${GRAPH_API_VERSION}/${this.config.phoneNumberId}/messages`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.config.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to: params.phone,
          type: 'text',
          text: {
            preview_url: false,
            body: message,
          },
        }),
      }
    )

    if (!response.ok) {
      const data = await response.json().catch(() => ({}))
      const errorMessage =
        data.error?.message || data.error || 'Failed to send verification code'
      throw new Error(errorMessage)
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
