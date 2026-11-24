# ATS – CV check for Word and ODT

Android app that reads a CV in Word (`.docx`) or ODT (`.odt`), calculates an ATS score (how well an Applicant Tracking
System can read it) and gives AI suggestions for every paragraph. Tap a suggestion to use it, then save the improved
document as a new file in `Download/ATS`. The original is never changed.

Built with Expo / React Native on the same base as Alif (theme, menus, manual, in-app updates).

## Download

The latest version: [ATS.apk](https://github.com/menola8803/ATS/releases/latest/download/ATS.apk) (Android 10 or newer).
Installed copies update themselves under Settings › Updates.

## Building

Every push to `main` that changes `app/` builds an APK in GitHub Actions (Actions › Build APK › Artifacts).
When the version in `app/package.json` changes, a release with `ATS.apk` is published.

## Signing

The APK is signed with the ATS key (alias `ats`). The key is only stored in the GitHub secrets `KEYSTORE_B64` and
`KEYSTORE_PASSWORD` and in the owner's backup – never in the repository. `app/signing/cert-sha256.txt` is the
certificate's fingerprint: the build stops if the APK is signed with any other key.
A new key is made with `skapa-signeringsnyckel.sh` (or `.ps1` on Windows).

## Structure

- `app/src/core` – logic that can be tested in Node: reading and writing .docx/.odt, the ATS score, the AI suggestions.
- `app/src/screens` – the screens.
- `app/modules/ats-native` – Android code: saving to Download/ATS, reading files, checking and installing updates.
- `app/assets/demo` – three made-up demo CVs (weak, medium, strong).
- `CHANGELOG.md` (Swedish) and `CHANGELOG.en.md` (English) – release notes; the app shows the one matching its language.
