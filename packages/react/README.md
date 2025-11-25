# @whatsapp-login/react

WhatsApp phone verification component for React.

## Installation

```bash
npm install @whatsapp-login/react
```

## Prerequisites

You need a running [WhatsApp Web API](https://github.com/caiopizzol/whatsapp-web-api) instance with an authenticated session.

## Quick Start

```jsx
import { WhatsAppLogin } from '@whatsapp-login/react'
import '@whatsapp-login/react/styles.css'

function App() {
  return (
    <WhatsAppLogin
      apiUrl="http://localhost:3000"
      sessionId="my-session"
      authToken="your-api-token"
      onSuccess={({ phone }) => {
        console.log('Verified:', phone)
      }}
    />
  )
}
```

## Props

| Prop           | Type        | Default      | Description                      |
| -------------- | ----------- | ------------ | -------------------------------- |
| `apiUrl`       | `string`    | **required** | URL of your WhatsApp Web API     |
| `sessionId`    | `string`    | `"login"`    | Session ID for the API           |
| `authToken`    | `string`    | -            | Bearer token for authentication  |
| `codeLength`   | `number`    | `6`          | Length of verification code      |
| `codeExpiry`   | `number`    | `300`        | Code expiration (seconds)        |
| `appearance`   | `object`    | -            | Customize appearance (see below) |
| `logo`         | `ReactNode` | -            | Custom logo component            |
| `showBranding` | `boolean`   | `true`       | Show/hide footer branding        |
| `onSuccess`    | `function`  | -            | Called on verification success   |
| `onError`      | `function`  | -            | Called on error                  |

## Appearance

The `appearance` prop allows you to customize the look and feel of the component:

| Property                    | Type                          | Default   | Description         |
| --------------------------- | ----------------------------- | --------- | ------------------- |
| `theme`                     | `'light' \| 'dark' \| 'auto'` | `'auto'`  | Theme mode          |
| `variables.colorPrimary`    | `string`                      | `#25D366` | Primary/brand color |
| `variables.colorBackground` | `string`                      | `#ffffff` | Background color    |
| `variables.colorText`       | `string`                      | `#1a1a1a` | Text color          |
| `variables.colorError`      | `string`                      | `#dc2626` | Error state color   |
| `variables.borderRadius`    | `string`                      | `8px`     | Border radius       |
| `variables.fontFamily`      | `string`                      | system    | Custom font family  |

Example:

```jsx
<WhatsAppLogin
  apiUrl="http://localhost:3000"
  appearance={{
    theme: 'dark',
    variables: {
      colorPrimary: '#00a884',
      borderRadius: '12px',
    },
  }}
/>
```

## Logo Customization

You can customize the logo by passing a React component to the `logo` prop:

```jsx
import { WhatsAppLogin, WhatsAppLogo } from '@whatsapp-login/react'

// Use the default WhatsApp logo (explicit)
<WhatsAppLogin apiUrl="..." logo={<WhatsAppLogo />} />

// Customize logo size
<WhatsAppLogin apiUrl="..." logo={<WhatsAppLogo width={48} height={48} />} />

// Use a custom logo
<WhatsAppLogin
  apiUrl="..."
  logo={<img src="/my-logo.png" alt="Logo" width="32" height="32" />}
/>

// Use any React component
<WhatsAppLogin
  apiUrl="..."
  logo={
    <div style={{ fontSize: '24px' }}>🔐</div>
  }
/>
```

The `WhatsAppLogo` component uses the official WhatsApp branding (with gradient) from `src/assets/whatsapp.svg`. The SVG file is also available at `@whatsapp-login/react/assets/whatsapp.svg` for direct usage outside of React.

## Components

In addition to the main `WhatsAppLogin` component, you can use standalone components for custom layouts:

### PhoneInput

| Prop          | Type       | Default               | Description         |
| ------------- | ---------- | --------------------- | ------------------- |
| `value`       | `string`   | **required**          | Current phone value |
| `onChange`    | `function` | **required**          | Change handler      |
| `onSubmit`    | `function` | **required**          | Submit handler      |
| `disabled`    | `boolean`  | `false`               | Disable input       |
| `placeholder` | `string`   | `'+1 (555) 000-0000'` | Input placeholder   |
| `autoFocus`   | `boolean`  | `true`                | Auto-focus on mount |
| `error`       | `string`   | -                     | Error message       |

### CodeInput

| Prop         | Type       | Default      | Description                    |
| ------------ | ---------- | ------------ | ------------------------------ |
| `value`      | `string`   | **required** | Current code value             |
| `onChange`   | `function` | **required** | Change handler                 |
| `onComplete` | `function` | **required** | Called when all digits entered |
| `length`     | `number`   | `6`          | Number of code boxes           |
| `disabled`   | `boolean`  | `false`      | Disable input                  |
| `autoFocus`  | `boolean`  | `true`       | Auto-focus first field         |
| `error`      | `string`   | -            | Error message                  |

## Headless Mode

Use the `useWhatsAppLogin` hook for complete control over the UI:

```jsx
import { useWhatsAppLogin } from '@whatsapp-login/react'

function CustomLogin() {
  const { phone, setPhone, code, setCode, status, sendCode, verifyCode } =
    useWhatsAppLogin({
      apiUrl: 'http://localhost:3000',
      onSuccess: ({ phone }) => console.log('Verified:', phone),
    })

  if (status === 'code_sent') {
    return (
      <>
        <input value={code} onChange={(e) => setCode(e.target.value)} />
        <button onClick={() => verifyCode()}>Verify</button>
      </>
    )
  }

  return (
    <>
      <input value={phone} onChange={(e) => setPhone(e.target.value)} />
      <button onClick={() => sendCode()}>Send Code</button>
    </>
  )
}
```

### Hook Options

| Option       | Type       | Default      | Description                     |
| ------------ | ---------- | ------------ | ------------------------------- |
| `apiUrl`     | `string`   | **required** | URL of your WhatsApp Web API    |
| `sessionId`  | `string`   | `"login"`    | Session ID for the API          |
| `authToken`  | `string`   | -            | Bearer token for authentication |
| `codeLength` | `number`   | `6`          | Length of verification code     |
| `codeExpiry` | `number`   | `300`        | Code expiration (seconds)       |
| `onSuccess`  | `function` | -            | Called on verification success  |
| `onError`    | `function` | -            | Called on error                 |

### Hook Return Values

| Value        | Type                                | Description                |
| ------------ | ----------------------------------- | -------------------------- |
| `phone`      | `string`                            | Current phone number       |
| `setPhone`   | `function`                          | Update phone number        |
| `code`       | `string`                            | Current verification code  |
| `setCode`    | `function`                          | Update verification code   |
| `status`     | `LoginStatus`                       | Current status (see below) |
| `error`      | `Error \| null`                     | Error object if any        |
| `expiresAt`  | `Date \| null`                      | Code expiration time       |
| `sendCode`   | `(phone?: string) => Promise<void>` | Send verification code     |
| `verifyCode` | `(code?: string) => Promise<void>`  | Verify code                |
| `reset`      | `() => void`                        | Reset to initial state     |

### Login Status

The `status` value can be one of:

- `'idle'` - Initial state, waiting for phone input
- `'sending'` - Sending code to phone number
- `'code_sent'` - Code successfully sent, awaiting verification
- `'verifying'` - Verifying the entered code
- `'success'` - Verification complete
- `'error'` - Error occurred at any step

## CSS Variables

For advanced styling customization, you can override these CSS custom properties:

| Variable                | Default   | Description          |
| ----------------------- | --------- | -------------------- |
| `--wa-color-primary`    | `#25D366` | Primary/brand color  |
| `--wa-color-background` | `#ffffff` | Background color     |
| `--wa-color-text`       | `#1a1a1a` | Text color           |
| `--wa-color-text-muted` | `#6b7280` | Secondary text color |
| `--wa-color-border`     | `#e5e7eb` | Border color         |
| `--wa-color-error`      | `#dc2626` | Error state color    |
| `--wa-border-radius`    | `8px`     | Border radius        |
| `--wa-font-family`      | system    | Font family          |

Example:

```css
:root {
  --wa-color-primary: #00a884;
  --wa-border-radius: 12px;
}
```

## License

MIT
