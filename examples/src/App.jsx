import { useState } from 'react'
import { WhatsAppLogin } from '@whatsapp-login/react'
import '@whatsapp-login/react/styles.css'

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
      apiUrl="http://localhost:3000"
      sessionId="login"
      authToken=""
      onSuccess={({ phone }) => setVerified(phone)}
      onError={(err) => console.error(err)}
    />
  )
}
