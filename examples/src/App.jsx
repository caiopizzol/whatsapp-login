import { useState } from 'react'
import { WhatsAppLogin } from '@whatsapp-login/react'
import '@whatsapp-login/react/styles.css'

// Example using WhatsApp Web API (default provider)
// See: https://github.com/caiopizzol/whatsapp-web-api

// Configuration - replace with your own values or use environment variables
const API_URL = import.meta.env.VITE_WHATSAPP_API_URL || 'http://localhost:3000'
const SESSION_ID = import.meta.env.VITE_WHATSAPP_SESSION_ID || 'your-session-id-here'
const AUTH_TOKEN = import.meta.env.VITE_WHATSAPP_AUTH_TOKEN || 'your-secret-token-here'

export default function App() {
  const [verified, setVerified] = useState(null)

  if (verified) {
    return (
      <div className="success">
        <h1>Logged in!</h1>
        <p>Phone: {verified}</p>
        <button onClick={() => setVerified(null)}>Log out</button>
      </div>
    )
  }

  return (
    <WhatsAppLogin
      apiUrl={API_URL}
      sessionId={SESSION_ID}
      authToken={AUTH_TOKEN}
      onSuccess={({ phone }) => setVerified(phone)}
      onError={(err) => console.error('Login error:', err)}
    />
  )
}
