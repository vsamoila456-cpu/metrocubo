# MetroCubo AI — Guida alla messa online

Sito completo con analisi foto AI reale. Tre passi, fattibili anche da telefono (browser in "modalità desktop" consigliata).

## Cosa contiene

- `index.html` — l'app completa (interfaccia, inventario, preventivo)
- `api/analyze.js` — il server che parla con l'AI (la chiave resta segreta qui)
- `package.json` — configurazione minima

## Passo 1 — Chiave API Anthropic (5 min)

1. Vai su **console.anthropic.com** e crea un account
2. Sezione **Billing** → carica credito (bastano 5 $ per centinaia di analisi)
3. Sezione **API Keys** → **Create Key** → copia la chiave (inizia con `sk-ant-...`)

Costo reale: ogni foto analizzata costa circa **1-3 centesimi**.

## Passo 2 — Carica il progetto su GitHub (5 min)

1. Crea un account su **github.com**
2. **New repository** → nome `metrocubo` → Create
3. **Add file → Upload files** → carica `index.html`, `package.json` e la cartella `api` con `analyze.js` dentro
   (da telefono: attiva "Sito desktop" nel browser se il caricamento non appare)
4. **Commit changes**

## Passo 3 — Pubblica su Vercel (5 min, gratis)

1. Vai su **vercel.com** → **Sign up with GitHub**
2. **Add New → Project** → seleziona il repository `metrocubo` → **Import**
3. Prima di premere Deploy: apri **Environment Variables** e aggiungi:
   - Name: `ANTHROPIC_API_KEY`
   - Value: la chiave copiata al Passo 1
4. **Deploy**

Dopo 1 minuto avrai un indirizzo tipo `metrocubo.vercel.app` — l'app è online, l'analisi foto funziona davvero, e puoi mandare il link a chiunque (anche a una ditta pilota).

## Problemi comuni

- **"ANTHROPIC_API_KEY non configurata"** → la variabile al Passo 3.3 manca o è scritta male. Su Vercel: Settings → Environment Variables → aggiungi → poi Redeploy.
- **Analisi lenta** → normale: 5-10 secondi a foto.
- **Errore 401 da Anthropic** → chiave sbagliata o credito esaurito su console.anthropic.com.
