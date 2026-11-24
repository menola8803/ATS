# ATS – CV-koll för Word och ODT

Android-app som läser ett CV i Word (`.docx`) eller ODT (`.odt`), räknar en ATS-poäng (hur väl ett rekryteringssystem kan
läsa det) och ger AI-förslag för varje stycke. Man trycker på ett förslag för att använda det och sparar det förbättrade
dokumentet som en ny fil i `Download/ATS`. Originalet ändras aldrig.

Byggd med Expo / React Native på samma grund som Alif (tema, menyer, manual, uppdateringar).

## Bygga

Varje push till `main` som ändrar `app/` bygger en APK i GitHub Actions (Actions › Build APK › Artifacts).
När versionen i `app/package.json` ändras skapas en release med `ATS.apk`, som appen själv hittar under Inställningar › Uppdateringar.

## Signering

APK:n signeras med ATS-nyckeln (alias `ats`). Nyckeln finns bara i GitHub-hemligheterna `KEYSTORE_B64` och
`KEYSTORE_PASSWORD` och i ägarens säkerhetskopia – aldrig i repot. `app/signing/cert-sha256.txt` är certifikatets
fingeravtryck: bygget stoppas om APK:n är signerad med någon annan nyckel.
En ny nyckel skapas med `skapa-signeringsnyckel.sh` (eller `.ps1` i Windows).

## Struktur

- `app/src/core` – logik som går att testa i Node: läsa och skriva .docx/.odt, ATS-poängen, AI-förslagen.
- `app/src/screens` – skärmarna.
- `app/modules/ats-native` – Android-kod: spara i Download/ATS, läsa filer, kontrollera och installera uppdateringar.
- `app/assets/demo` – tre påhittade demo-CV (svagt, medel, starkt).
