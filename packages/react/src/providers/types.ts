/**
 * Provider interface for WhatsApp verification
 */
export interface VerificationProvider {
  /** Provider name for identification */
  name: string

  /**
   * Send a verification code to the phone number
   */
  sendCode(params: SendCodeParams): Promise<SendCodeResponse>

  /**
   * Verify the code entered by the user
   */
  verifyCode(params: VerifyCodeParams): Promise<VerifyCodeResponse>
}

export interface SendCodeParams {
  phone: string
  codeLength: number
  expiresIn: number
}

export interface SendCodeResponse {
  /** The verification code that was sent */
  code: string
  /** ISO timestamp when the code expires */
  expiresAt: string
}

export interface VerifyCodeParams {
  phone: string
  /** The code entered by the user */
  code: string
  /** The expected code (for client-side verification) */
  expectedCode: string
}

export interface VerifyCodeResponse {
  verified: boolean
}

/**
 * Base configuration for all providers
 */
export interface BaseProviderConfig {
  /** Custom message template. Use {code} as placeholder */
  messageTemplate?: string
}

/**
 * Configuration for WhatsApp Web API provider
 */
export interface WhatsAppWebApiConfig extends BaseProviderConfig {
  apiUrl: string
  sessionId?: string
  authToken?: string
}

/**
 * Configuration for Evolution API provider
 */
export interface EvolutionApiConfig extends BaseProviderConfig {
  apiUrl: string
  instanceName: string
  apiKey: string
}

/**
 * Configuration for WhatsApp Cloud API provider
 */
export interface WhatsAppCloudApiConfig extends BaseProviderConfig {
  phoneNumberId: string
  accessToken: string
}

// Helper functions for client-side code generation

/**
 * Generate a random numeric code
 */
export function generateCode(length: number): string {
  return Array.from({ length }, () => Math.floor(Math.random() * 10)).join('')
}

/**
 * Calculate expiry timestamp
 */
export function calculateExpiry(expiresInSeconds: number): string {
  return new Date(Date.now() + expiresInSeconds * 1000).toISOString()
}

/**
 * Format verification message with code
 */
export function formatMessage(template: string, code: string): string {
  return template.replace('{code}', code)
}

export const DEFAULT_MESSAGE_TEMPLATE = 'Your verification code is: {code}'
