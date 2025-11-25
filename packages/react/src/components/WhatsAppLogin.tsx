import React, { useEffect, useState } from 'react'
import { useWhatsAppLogin } from '../hooks/useWhatsAppLogin'
import { PhoneInput } from './PhoneInput'
import { CodeInput } from './CodeInput'
import { WhatsAppLogo } from './WhatsAppLogo'
import type { VerificationProvider } from '../providers/types'

export interface WhatsAppLoginAppearance {
  theme?: 'light' | 'dark' | 'auto'
  variables?: {
    colorPrimary?: string
    colorBackground?: string
    colorText?: string
    colorError?: string
    borderRadius?: string
    fontFamily?: string
  }
}

export interface WhatsAppLoginProps {
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
  codeLength?: number
  codeExpiry?: number
  appearance?: WhatsAppLoginAppearance
  logo?: React.ReactNode
  onSuccess?: (data: { phone: string }) => void
  onError?: (error: Error) => void
  showBranding?: boolean
}

export function WhatsAppLogin({
  provider,
  apiUrl,
  sessionId = 'login',
  authToken,
  codeLength = 6,
  codeExpiry = 300,
  appearance = {},
  logo,
  onSuccess,
  onError,
  showBranding = true,
}: WhatsAppLoginProps) {
  const {
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
  } = useWhatsAppLogin({
    provider,
    apiUrl,
    sessionId,
    authToken,
    codeLength,
    codeExpiry,
    onSuccess,
    onError,
  })

  const [timeLeft, setTimeLeft] = useState<number | null>(() => {
    if (!expiresAt) return null
    return Math.max(0, Math.floor((expiresAt.getTime() - Date.now()) / 1000))
  })

  useEffect(() => {
    if (!expiresAt) {
      return
    }

    const updateTimer = () => {
      const remaining = Math.max(
        0,
        Math.floor((expiresAt.getTime() - Date.now()) / 1000)
      )
      setTimeLeft(remaining)
    }

    updateTimer()
    const interval = setInterval(updateTimer, 1000)
    return () => clearInterval(interval)
  }, [expiresAt])

  const cssVariables = {
    '--wa-color-primary': appearance.variables?.colorPrimary || '#25D366',
    '--wa-color-background': appearance.variables?.colorBackground || '#ffffff',
    '--wa-color-text': appearance.variables?.colorText || '#1a1a1a',
    '--wa-color-error': appearance.variables?.colorError || '#dc2626',
    '--wa-border-radius': appearance.variables?.borderRadius || '8px',
    '--wa-font-family':
      appearance.variables?.fontFamily ||
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  } as React.CSSProperties

  const themeClass =
    appearance.theme === 'dark'
      ? 'wa-theme-dark'
      : appearance.theme === 'light'
        ? 'wa-theme-light'
        : 'wa-theme-auto'

  const isCodeStep =
    status === 'code_sent' || status === 'verifying' || status === 'error'
  const isSuccess = status === 'success'

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className={`wa-login ${themeClass}`} style={cssVariables}>
      <div className="wa-login-card">
        <div className="wa-header">
          <div className="wa-logo">{logo || <WhatsAppLogo />}</div>
          <h2 className="wa-title">
            {isSuccess ? 'Verified!' : isCodeStep ? 'Enter code' : 'Sign in'}
          </h2>
          <p className="wa-subtitle">
            {isSuccess
              ? 'Your phone number has been verified'
              : isCodeStep
                ? `We sent a code to ${phone}`
                : 'Enter your WhatsApp number to continue'}
          </p>
        </div>

        <div className="wa-body">
          {isSuccess ? (
            <div className="wa-success">
              <div className="wa-success-icon">
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--wa-color-primary)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
              <p className="wa-verified-phone">{phone}</p>
            </div>
          ) : isCodeStep ? (
            <>
              <CodeInput
                value={code}
                onChange={setCode}
                onComplete={verifyCode}
                length={codeLength}
                disabled={status === 'verifying'}
                error={error?.message}
              />

              {timeLeft !== null && timeLeft > 0 && (
                <p className="wa-timer">
                  Code expires in {formatTime(timeLeft)}
                </p>
              )}

              {timeLeft === 0 && <p className="wa-expired">Code expired</p>}

              <button
                type="button"
                className="wa-button wa-button-primary"
                onClick={() => verifyCode()}
                disabled={status === 'verifying' || code.length !== codeLength}
              >
                {status === 'verifying' ? (
                  <span className="wa-spinner" />
                ) : (
                  'Verify'
                )}
              </button>

              <button
                type="button"
                className="wa-button wa-button-secondary"
                onClick={reset}
                disabled={status === 'verifying'}
              >
                Use different number
              </button>
            </>
          ) : (
            <>
              <PhoneInput
                value={phone}
                onChange={setPhone}
                onSubmit={sendCode}
                disabled={status === 'sending'}
                error={error?.message}
              />

              <button
                type="button"
                className="wa-button wa-button-primary"
                onClick={() => sendCode()}
                disabled={status === 'sending' || phone.length < 10}
              >
                {status === 'sending' ? (
                  <span className="wa-spinner" />
                ) : (
                  'Continue'
                )}
              </button>
            </>
          )}
        </div>

        {showBranding && (
          <div className="wa-footer">
            <span className="wa-branding">
              Secured by{' '}
              <a
                href="https://github.com/caiopizzol/whatsapp-login"
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp Login
              </a>
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
