export type AccessMode = 'app'

// Öffentlicher Zugriff: Jeder kommt direkt in die App. Ohne Session läuft alles
// lokal im Browser (kein Login nötig). Mit einer gültigen Session wird zusätzlich
// sicher synchronisiert. Es gibt keinen Login-Gate mehr.
export function getAccessMode(_state: { configured: boolean; loading: boolean; authenticated: boolean }): AccessMode {
  return 'app'
}
