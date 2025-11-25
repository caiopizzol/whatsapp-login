import { useState, useCallback, useRef, useMemo } from 'react'
import type { VerificationProvider } from '../providers/types'
import { WhatsAppWebApiProvider } from '../providers/whatsapp-web-api'

export type LoginStatus =
  | 'idle'
  | 'sending'
  | 'code_sent'
  | 'verifying'
  | 'success'
  | 'error'

export interface UseWhatsAppLoginOptions {
  /**
   * Custom verification provider.
   * If provided, apiUrl/sessionId/authToken are ignored.
   */
  provider?: VerificationProvider

  /**
   * URL of your WhatsApp Web API instance.
   * Required if no provider is specified.
   */
  apiUrl?: string

  /**
   * Session ID for WhatsApp Web API.
   * @default 'login'
   */
  sessionId?: string

  /**
   * Bearer token for authentication.
   */
  authToken?: string

  /**
   * Length of the verification code.
   * @default 6
   */
  codeLength?: number

  /**
   * Code expiration time in seconds.
   * @default 300
   */
  codeExpiry?: number

  /**
   * Callback when verification succeeds.
   */
  onSuccess?: (data: { phone: string }) => void

  /**
   * Callback when an error occurs.
   */
  onError?: (error: Error) => void
}

export interface UseWhatsAppLoginReturn {
  phone: string
  setPhone: (phone: string) => void
  code: string
  setCode: (code: string) => void
  status: LoginStatus
  error: Error | null
  expiresAt: Date | null
  sendCode: (phoneNumber?: string) => Promise<void>
  verifyCode: (verificationCode?: string) => Promise<void>
  reset: () => void
}

export function useWhatsAppLogin(
  options: UseWhatsAppLoginOptions
): UseWhatsAppLoginReturn {
  const {
    provider: customProvider,
    apiUrl,
    sessionId = 'login',
    authToken,
    codeLength = 6,
    codeExpiry = 300,
    onSuccess,
    onError,
  } = options

  // Create provider instance (memoized)
  const provider = useMemo(() => {
    if (customProvider) return customProvider

    if (!apiUrl) {
      throw new Error(
        'Either provider or apiUrl must be specified for useWhatsAppLogin'
      )
    }

    return new WhatsAppWebApiProvider({
      apiUrl,
      sessionId,
      authToken,
    })
  }, [customProvider, apiUrl, sessionId, authToken])

  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const [status, setStatus] = useState<LoginStatus>('idle')
  const [error, setError] = useState<Error | null>(null)
  const [expiresAt, setExpiresAt] = useState<Date | null>(null)

  // Store the expected code for client-side verification
  const expectedCodeRef = useRef<string | null>(null)

  const sendCode = useCallback(
    async (phoneNumber?: string) => {
      const targetPhone = phoneNumber || phone
      if (!targetPhone) {
        const err = new Error('Phone number is required')
        setError(err)
        onError?.(err)
        return
      }

      setStatus('sending')
      setError(null)

      try {
        const response = await provider.sendCode({
          phone: targetPhone,
          codeLength,
          expiresIn: codeExpiry,
        })

        expectedCodeRef.current = response.code
        setExpiresAt(new Date(response.expiresAt))
        setPhone(targetPhone)
        setStatus('code_sent')
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err))
        setError(error)
        setStatus('error')
        onError?.(error)
      }
    },
    [provider, phone, codeLength, codeExpiry, onError]
  )

  const verifyCode = useCallback(
    async (verificationCode?: string) => {
      const targetCode = verificationCode || code
      if (!targetCode) {
        const err = new Error('Verification code is required')
        setError(err)
        onError?.(err)
        return
      }

      setStatus('verifying')
      setError(null)

      try {
        await provider.verifyCode({
          phone,
          code: targetCode,
          expectedCode: expectedCodeRef.current || '',
        })

        setStatus('success')
        onSuccess?.({ phone })
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err))
        setError(error)
        setStatus('error')
        onError?.(error)
      }
    },
    [provider, phone, code, onSuccess, onError]
  )

  const reset = useCallback(() => {
    setPhone('')
    setCode('')
    setStatus('idle')
    setError(null)
    setExpiresAt(null)
    expectedCodeRef.current = null
  }, [])

  return {
    phone,
    setPhone,
    code,
    setCode,
    status,
    error,
    expiresAt,
    sendCode,
    verifyCode,
    reset,
  }
}
