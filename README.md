# Overlap

Smarter Wochenplan durch gemeinsame Zutaten – mit steuerbarem Sweetspot zwischen Effizienz und Abwechslung.

```bash
npm install
npm run dev
npm test
npm run browser:install
npm run test:e2e
npm run typecheck
npm run lint
npm run build
```

Der erste Slice läuft lokal-first. Empfehlungslogik und Einkaufsaggregation liegen als reine, getestete TypeScript-Domäne unter `src/domain/`; Browserzustand wird versionierungsfähig lokal gespeichert. Supabase folgt erst nach separater Schema- und RLS-Prüfung.
