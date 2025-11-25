import { useState, useCallback, useRef } from 'react'

export type LoginStatus =
  | 'idle'
  | 'sending'
  | 'code_sent'
  | 'verifying'
  | 'success'
  | 'error'

export interface UseWhatsAppLoginOptions {
  apiUrl: string
  sessionId?: string
  authToken?: string
  codeLength?: number
  codeExpiry?: number
  onSuccess?: (data: { phone: string }) => void
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
    apiUrl,
    sessionId = 'login',
    authToken,
    codeLength = 6,
    codeExpiry = 300,
    onSuccess,
    onError,
  } = options

  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const [status, setStatus] = useState<LoginStatus>('idle')
  const [error, setError] = useState<Error | null>(null)
  const [expiresAt, setExpiresAt] = useState<Date | null>(null)

  const pendingCodeRef = useRef<string | null>(null)

  const getHeaders = useCallback(() => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`
    }
    return headers
  }, [authToken])

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
        const response = await fetch(
          `${apiUrl}/sessions/${sessionId}/verify/send`,
          {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({
              phone: targetPhone,
              codeLength,
              expiresIn: codeExpiry,
            }),
          }
        )

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Failed to send verification code')
        }

        pendingCodeRef.current = data.code
        setExpiresAt(new Date(data.expiresAt))
        setPhone(targetPhone)
        setStatus('code_sent')
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err))
        setError(error)
        setStatus('error')
        onError?.(error)
      }
    },
    [apiUrl, sessionId, phone, codeLength, codeExpiry, getHeaders, onError]
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
        const response = await fetch(
          `${apiUrl}/sessions/${sessionId}/verify/check`,
          {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({
              phone,
              code: targetCode,
            }),
          }
        )

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Invalid verification code')
        }

        setStatus('success')
        onSuccess?.({ phone })
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err))
        setError(error)
        setStatus('error')
        onError?.(error)
      }
    },
    [apiUrl, sessionId, phone, code, getHeaders, onSuccess, onError]
  )

  const reset = useCallback(() => {
    setPhone('')
    setCode('')
    setStatus('idle')
    setError(null)
    setExpiresAt(null)
    pendingCodeRef.current = null
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
