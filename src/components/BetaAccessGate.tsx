import { useState, type FormEvent } from 'react'
import type { useAccount } from '../auth/useAccount'

type BetaAccessGateProps = {
  account: Pick<ReturnType<typeof useAccount>, 'loading' | 'sendMagicLink'>
}

function Logo() {
  return <div className="logo beta-logo" aria-label="Overlap"><span>Over</span><span>lap</span></div>
}

export function BetaAccessGate({ account }: BetaAccessGateProps) {
  const [email, setEmail] = useState('')
  const [busy, setBusy] = useState(false)
  const [status, setStatus] = useState('')

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    setBusy(true)
    setStatus('')
    try {
      await account.sendMagicLink(email)
      setStatus('Login-Link verschickt. Öffne ihn auf diesem Gerät.')
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Login konnte nicht gestartet werden.')
    } finally {
      setBusy(false)
    }
  }

  return <main className="beta-access">
    <section className="beta-story" aria-label="Overlap Einführung">
      <Logo />
      <span className="eyebrow">Private Beta</span>
      <h1>Deine Woche.<br/><em>Weniger Aufwand.</em></h1>
      <p>Gerichte, die Zutaten clever teilen – ohne jeden Tag gleich zu schmecken.</p>
      <div className="overlap-mark"><span>weniger planen</span><span>cleverer einkaufen</span></div>
    </section>
    <section className="beta-login" aria-labelledby="beta-login-title">
      <span className="eyebrow">Willkommen zurück</span>
      <h2 id="beta-login-title">Bei Overlap anmelden</h2>
      {account.loading ? <p role="status">Sicherer Zugang wird geprüft …</p> : <>
        <p>Die Beta ist einladungsbasiert. Nutze die E-Mail-Adresse, mit der du eingeladen wurdest.</p>
        <form onSubmit={submit}>
          <label htmlFor="beta-email">E-Mail-Adresse</label>
          <input id="beta-email" type="email" autoComplete="email" value={email} onChange={event => setEmail(event.target.value)} placeholder="du@beispiel.de" required />
          <button className="primary wide" disabled={busy}>{busy ? 'Wird gesendet …' : 'Sicheren Login-Link senden'} <span>→</span></button>
        </form>
        <small>Kein Passwort nötig. Unbekannte Adressen erhalten keinen Zugang.</small>
        {status && <p className="account-status" role="status">{status}</p>}
      </>}
    </section>
  </main>
}
