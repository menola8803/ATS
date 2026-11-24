This folder only holds public information.

`cert-sha256.txt` is the SHA-256 fingerprint of the certificate ATS is signed with. The build compares the APK with it
and stops if they differ, so a release is never published signed with the wrong key. The private key is NOT here and
never goes into the repository: it lives only in the GitHub secrets KEYSTORE_B64 and KEYSTORE_PASSWORD (and in the
owner's backup).
