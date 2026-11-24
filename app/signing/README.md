Den här mappen innehåller bara offentlig information.

`cert-sha256.txt` är SHA-256-fingeravtrycket för certifikatet som ATS signeras med. Bygget jämför APK:n med det och
stoppar om de skiljer sig, så att en release aldrig publiceras signerad med fel nyckel. Den privata nyckeln finns INTE här
och hamnar aldrig i repot: den finns bara i GitHub-hemligheterna KEYSTORE_B64 och KEYSTORE_PASSWORD (och i ägarens
säkerhetskopia).
