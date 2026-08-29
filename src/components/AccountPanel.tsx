import { useState, type FormEvent } from 'react'
import type { useAccount } from '../auth/useAccount'

type AccountPanelProps = {
  onClose: () => void
  onEditPreferences: () => void
  account: ReturnType<typeof useAccount>
}

export function AccountPanel({ onClose, onEditPreferences, account }: AccountPanelProps) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    setBusy(true)
    setStatus('')
    try {
      await account.sendMagicLink(email)
      setStatus('Link ist unterwegs. Öffne ihn auf diesem Gerät.')
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Login konnte nicht gestartet werden.')
    } finally {
      setBusy(false)
    }
  }

  return <div className="modal-backdrop account-backdrop" onClick={onClose}>
    <section className="account-panel" role="dialog" aria-modal="true" aria-labelledby="account-title" onClick={event => event.stopPropagation()}>
      <button className="close" onClick={onClose} aria-label="Konto schließen">×</button>
      <span className="eyebrow">Dein Overlap</span>
      <h2 id="account-title">Profil & Synchronisierung</h2>

      {!account.configured && <div className="account-mode">
        <b>Lokaler Testmodus</b>
        <p>Deine Auswahl bleibt ausschließlich in diesem Browser. Sobald das Supabase-Projekt verbunden ist, werden Login und geräteübergreifende Synchronisierung aktiviert.</p>
      </div>}

      {account.configured && account.loading && <p>Profil wird geladen …</p>}

      {account.configured && !account.loading && !account.session && <form onSubmit={submit}>
        <label htmlFor="login-email">E-Mail-Adresse</label>
        <input id="login-email" type="email" autoComplete="email" value={email} onChange={event => setEmail(event.target.value)} placeholder="du@beispiel.de" required />
        <button className="primary wide" disabled={busy}>{busy ? 'Wird gesendet …' : 'Sicheren Login-Link senden'}</button>
        <small>Kein Passwort nötig. Der einmalige Link funktioniert nur für eingeladene Beta-Konten.</small>
      </form>}

      {account.session && <div className="account-mode synced">
        <b>Angemeldet</b>
        <p>{account.session.user.email}</p>
        <button className="secondary" onClick={() => void account.signOut()}>Abmelden</button>
      </div>}

      {status && <p className="account-status" role="status">{status}</p>}
      <button className="account-preferences" onClick={onEditPreferences}>Essensprofil bearbeiten →</button>
    </section>
  </div>
}
