import React, { useRef, useEffect, useCallback } from 'react'

export interface CodeInputProps {
  value: string
  onChange: (value: string) => void
  onComplete: (code: string) => void
  length?: number
  disabled?: boolean
  autoFocus?: boolean
  error?: string | null
}

export function CodeInput({
  value,
  onChange,
  onComplete,
  length = 6,
  disabled = false,
  autoFocus = true,
  error,
}: CodeInputProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    if (autoFocus && inputRefs.current[0]) {
      inputRefs.current[0].focus()
    }
  }, [autoFocus])

  useEffect(() => {
    if (value.length === length) {
      onComplete(value)
    }
  }, [value, length, onComplete])

  const focusInput = useCallback((index: number) => {
    const input = inputRefs.current[index]
    if (input) {
      input.focus()
      input.select()
    }
  }, [])

  const handleChange = (index: number, digit: string) => {
    if (!/^\d*$/.test(digit)) return

    const newValue = value.split('')
    newValue[index] = digit
    const joined = newValue.join('').slice(0, length)
    onChange(joined)

    if (digit && index < length - 1) {
      focusInput(index + 1)
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace') {
      if (!value[index] && index > 0) {
        focusInput(index - 1)
      }
      const newValue = value.split('')
      newValue[index] = ''
      onChange(newValue.join(''))
    } else if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault()
      focusInput(index - 1)
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      e.preventDefault()
      focusInput(index + 1)
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '')
    if (pasted) {
      onChange(pasted.slice(0, length))
      const nextIndex = Math.min(pasted.length, length - 1)
      focusInput(nextIndex)
    }
  }

  return (
    <div className="wa-code-input">
      <label className="wa-label">Verification code</label>
      <div
        className="wa-code-boxes"
        role="group"
        aria-label="Verification code"
      >
        {Array.from({ length }).map((_, index) => (
          <input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el
            }}
            type="text"
            inputMode="numeric"
            autoComplete={index === 0 ? 'one-time-code' : 'off'}
            className="wa-code-box"
            value={value[index] || ''}
            onChange={(e) => handleChange(index, e.target.value.slice(-1))}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            onFocus={(e) => e.target.select()}
            disabled={disabled}
            maxLength={1}
            aria-label={`Digit ${index + 1}`}
            aria-invalid={!!error}
          />
        ))}
      </div>
      {error && (
        <p className="wa-error" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
