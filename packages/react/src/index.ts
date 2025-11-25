// Components
export { WhatsAppLogin } from './components/WhatsAppLogin'
export type {
  WhatsAppLoginProps,
  WhatsAppLoginAppearance,
} from './components/WhatsAppLogin'

export { PhoneInput } from './components/PhoneInput'
export type { PhoneInputProps } from './components/PhoneInput'

export { CodeInput } from './components/CodeInput'
export type { CodeInputProps } from './components/CodeInput'

export { WhatsAppLogo } from './components/WhatsAppLogo'
export type { WhatsAppLogoProps } from './components/WhatsAppLogo'

// Hooks
export { useWhatsAppLogin } from './hooks/useWhatsAppLogin'
export type {
  UseWhatsAppLoginOptions,
  UseWhatsAppLoginReturn,
  LoginStatus,
} from './hooks/useWhatsAppLogin'

// Providers
export { WhatsAppWebApiProvider } from './providers/whatsapp-web-api'
export { EvolutionApiProvider } from './providers/evolution-api'
export { WhatsAppCloudApiProvider } from './providers/whatsapp-cloud-api'

// Provider types
export type {
  VerificationProvider,
  SendCodeParams,
  SendCodeResponse,
  VerifyCodeParams,
  VerifyCodeResponse,
  BaseProviderConfig,
  WhatsAppWebApiConfig,
  EvolutionApiConfig,
  WhatsAppCloudApiConfig,
} from './providers/types'

// Provider utilities
export {
  generateCode,
  calculateExpiry,
  formatMessage,
  DEFAULT_MESSAGE_TEMPLATE,
} from './providers/types'
