# whatsapp-login

WhatsApp phone verification components for web frameworks.

## Packages

| Package                                   | Description                                                |
| ----------------------------------------- | ---------------------------------------------------------- |
| [@whatsapp-login/react](./packages/react) | React components and hooks for WhatsApp phone verification |

## Prerequisites

You need a running [WhatsApp Web API](https://github.com/caiopizzol/whatsapp-web-api) instance with an authenticated session.

## Quick Start

### React

```bash
npm install @whatsapp-login/react
```

```jsx
import { WhatsAppLogin } from '@whatsapp-login/react'
import '@whatsapp-login/react/styles.css'

function App() {
  return (
    <WhatsAppLogin
      apiUrl="http://localhost:3000"
      sessionId="my-session"
      onSuccess={({ phone }) => {
        console.log('Verified:', phone)
      }}
    />
  )
}
```

## Development

This is a monorepo managed with [pnpm workspaces](https://pnpm.io/workspaces).

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run development mode
pnpm dev

# Lint and format
pnpm lint
pnpm format
```

## Examples

See the [examples](./examples) directory for complete usage examples.

## License

MIT
