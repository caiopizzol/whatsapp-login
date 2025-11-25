# whatsapp-login

WhatsApp phone verification components for web frameworks.

<img width="400" height="400" alt="WhatsApp Login Component" src="https://github.com/user-attachments/assets/fc7cda0c-6ff8-4faf-ada9-23f17bcf10a1" />


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
