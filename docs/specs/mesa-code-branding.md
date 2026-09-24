# Mesa Code Branding

## Status

Implemented

## Tujuan

Mengubah identitas produk yang terlihat pengguna dari ZCode menjadi Mesa Code tanpa memutus kompatibilitas internal workspace, plugin, sesi, protocol, dan runtime Agent.

## Ruang Lingkup

- Nama produk yang terlihat pengguna: `Mesa Code`.
- Nama executable desktop: `MesaCode.exe`.
- Desktop distribution targets Windows x64; installer uses Mesa Code identity.
- Judul window, product metadata, desktop shortcut, uninstall entry, dan label installer menggunakan Mesa Code.
- Dokumentasi user-facing utama menggunakan Mesa Code.
- All app, tray, installer, uninstaller, Linux, and macOS icon sources use canonical assets from `public/logo/icons/`.

## Di Luar Ruang Lingkup

Identifier internal berikut tetap menggunakan ZCode untuk menjaga kompatibilitas:

- Package scope `@zcode/*`.
- Environment variable `ZCODE_*`.
- Protocol scheme `zcode://`.
- Storage directory `.zcode`.
- Nama simbol TypeScript dan kontrak RPC internal.
- Nama Agent CLI internal dan format data sesi.

## Kepemilikan dan Batas

- `packages/desktop` memiliki product identity untuk desktop executable, window, installer, dan shortcut.
- `packages/ui` memiliki teks UI user-facing melalui sistem i18n.
- Root README dan dokumentasi user-facing memiliki nama produk yang konsisten.
- Identifier internal tidak diubah oleh branding layer.

## Invariants

1. Build desktop tetap menghasilkan Windows installer NSIS.
2. Executable utama pada package Windows bernama `MesaCode.exe`.
3. Aplikasi lama dan aplikasi Mesa Code tidak boleh saling menghapus data sesi karena storage internal tetap `.zcode`.
4. Protocol `zcode://`, environment variable, dan package import tidak berubah.
5. Build tidak boleh menambah pelanggaran arsitektur baru.
6. Packaging does not use stale generated icon assets when canonical assets exist.

## Anonymous Startup

### Product Rule

Mesa Code must open the workspace without requiring account login or OAuth when no provider is configured. Provider login and API-key setup remain optional actions available from Settings or an explicit Connect action.

### State Ownership

- `Root` owns whether the Welcome/Login surface is visible.
- Provider availability remains owned by the existing provider model-selection state and is not converted into a startup login requirement.
- Existing OAuth, API-key, session restoration, and provider-request flows remain available when explicitly invoked.

### Invariants

1. Startup must not set `welcomeScreenOpenReason` to `startup-provider-required` solely because the user is anonymous or no provider is configured.
2. Workspace fallback creation and session restoration must not wait for a login screen.
3. Explicit login/provider requests and session-expired recovery continue to open the existing login surface.
4. No internal storage keys, protocol identifiers, or provider configuration formats change.

### Acceptance Scenarios

- A fresh anonymous installation reaches the workspace without showing a login page.
- A user can still explicitly open Connect/Settings and configure OAuth or an API key.
- Existing authenticated users and session-expired flows preserve their current behavior.

## English-Only Product Language

### Product Rule

Mesa Code uses English for all user-facing application UI, onboarding, menus, settings, errors, documentation, and repository README entry points. English is fixed as `en-US`; the app must not resolve UI language from the operating system or expose a language selector.

### State Ownership

- `ZCodeIntlProvider` owns the effective UI locale and resolves it to `en-US`.
- Existing locale values and persisted settings remain accepted only as compatibility data; they must not change the rendered UI language.
- Documentation is maintained in English. Dependency-owned documentation and third-party notices are outside this migration boundary.

### Invariants

1. The effective renderer locale is always `en-US`.
2. A previous `zh-CN` or `system` preference cannot make the UI render Chinese.
3. No language switcher or language selection control is visible in the application.
4. Internal protocol, storage, settings schema, and locale types remain compatible unless a separate migration is approved.

### Acceptance Scenarios

- A fresh install and an upgrade from a Chinese/system preference both render English UI.
- Settings and sidebar menus do not offer language choices.
- Root and translated README documentation are English-only.

## Acceptance Scenarios

- Membuka aplikasi hasil build menampilkan `Mesa Code` pada title dan metadata aplikasi.
- Installer dan uninstall entry Windows menampilkan `Mesa Code`.
- File executable utama bernama `MesaCode.exe`.
- Aplikasi dapat membaca sesi dan konfigurasi existing tanpa migrasi data.
- `pnpm typecheck`, `pnpm lint`, dan `pnpm architecture:check --changed` tetap berhasil.
- Packaging Windows dapat menghasilkan installer `.exe` pada environment yang memiliki hak symbolic link atau Developer Mode.

## Migration Boundary

Perubahan identifier internal, storage, protocol, package scope, atau CLI command memerlukan proposal migrasi terpisah dan tidak termasuk perubahan ini.
