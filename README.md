# Mesa Code
<div align="center">
	<img src="public/logo/icons/1024x1024.png" alt="Mesa Code logo" width="144" height="144" />
	<h1>Mesa Code</h1>
	<p><strong>AI-powered coding workspace for Windows, web, and terminal.</strong></p>
	<p>
	<a href="https://github.com/levanza1358/mesacode">Repository</a> ·
	<a href="https://github.com/levanza1358/mesacode/issues">Issues</a> ·
	<a href="https://github.com/levanza1358/mesacode/discussions">Discussions</a>
	</p>
</div>
Mesa Code brings repository exploration, coding agents, debugging, Git workflows, tools, MCP, skills, plugins, and model providers into one focused workspace.

## What Mesa Code does

- Reads and searches repositories with workspace-aware context.
- Edits source files while preserving project boundaries.
- Runs commands, tests, builds, and development services.
- Supports local projects, remote workspaces, Git, MCP servers, plugins, and skills.
- Provides desktop, browser, and terminal interfaces.
- Offers themes, accent palettes, session history, and workspace persistence.
- Ships as a Windows x64 Electron application with a branded NSIS installer.
- Includes an optional uninstall cleanup choice for application data and caches.

## Interfaces

| Interface | Purpose | Command |
| --- | --- | --- |
| Desktop | Windows x64 Electron application | `pnpm dev:desktop` |
| Web | Browser client and local backend | `pnpm dev:web` |
| Agent CLI | Terminal UI and Agent runtime | `pnpm --filter @mesacode/cli dev` |

## Quick start

### Requirements

- Windows for desktop packaging.
- Git.
- Node.js `24.14.0`.
- pnpm `10.33.2`.
- Tool versions defined by `mise.toml`.

Install dependencies and prepare the workspace:

```powershell
pnpm bootstrap
```

Start Mesa Code Desktop:

```powershell
pnpm dev:desktop
```

Start Web development:

```powershell
pnpm dev:web
```

## Development commands

```powershell
pnpm install
pnpm typecheck
pnpm lint
pnpm fmt:check
pnpm architecture:check --changed
pnpm verify:pre-push
```

Test desktop configuration:

```powershell
pnpm dev:desktop:test
```

Use isolated development data:

```powershell
$env:MESACODE_DATA_BASE_DIR="$env:USERPROFILE\.mesacode-dev-home"
pnpm dev:desktop:test
```

## Workspace behavior

When no project is selected, the Agent still needs a real current working directory. Mesa Code uses this internal fallback:

```text
%USERPROFILE%\.mesacode\workspace\default
```

This is not a user project. It is an internal working directory for workspace-free conversations. Selected projects continue to use their actual project path.

## Configuration

| Variable | Purpose |
| --- | --- |
| `MESACODE_DATA_BASE_DIR` | Application data root; `.mesacode` is created below it |
| `MESACODE_SERVER_WORKSPACE` | Workspace used by the Web backend |
| `MESACODE_SERVER_AUTH_TOKEN` | HTTP/WebSocket server authentication |
| `MESACODE_BUILTIN_PROVIDER_CONFIG_FILE` | Local provider configuration override |
| `MESACODE_DIST_BASE_URL` | CLI distribution download base URL |

Use `.env.local` for local overrides. Never commit API keys, tokens, credentials, or private user data.

## Windows packaging

Mesa Code desktop distribution targets Windows x64.

```powershell
$env:MESACODE_SKIP_REMOTE_ASSETS="1"
pnpm bundle:desktop
```

Installer output:

```text
packages/desktop/dist/
```

Canonical branding assets:

- `public/logo/mesa-code-mark.svg`
- `public/logo/mesa-code-logo.svg`
- `public/logo/mesa-code-logo-dark.svg`
- `public/logo/mesa-code-favicon.svg`
- `public/logo/icons/` — PNG and Windows ICO assets

## Uninstall and data cleanup

The uninstaller keeps user data by default. Users can explicitly select **Delete all Mesa Code data, settings, caches, and workspace data** to remove application data, caches, and internal workspace data, including legacy `.mesacode` data.

## Repository layout

| Directory | Responsibility |
| --- | --- |
| `packages/desktop` | Electron Main, Host, Renderer, and packaging |
| `packages/ui` | Shared React UI, hooks, and Zustand stores |
| `packages/web` | Web client |
| `packages/server` | HTTP, WebSocket, and remote services |
| `packages/services` | Business services, persistence, files, sessions, and Git |
| `packages/shared` | Shared types, protocol, validation, and contracts |
| `packages/rpc` | RPC framework |
| `packages/client` | Agent client SDK |
| `packages/provider` | Provider capabilities |
| `apps/mesacode-cli` | Agent CLI, TUI, runtime, and tools |
| `config` | Default and provider configuration |
| `scripts` | Build, packaging, asset, and release scripts |
| `docs` | Product and technical specifications |

## Compatibility note

User-facing branding is **Mesa Code**. Internal compatibility identifiers remain unchanged for now:

- `@mesacode/*`
- `apps/mesacode-cli`
- `MESACODE_*`
- `.mesacode/` and `.mesacodeignore`
- `mesacode://`
- `mesacode-protocol`

These identifiers preserve existing installations, stored sessions, package resolution, protocol behavior, and runtime compatibility. See `docs/migration/mesacode-branding-and-repository.md` before changing them.

## Contributing

1. Read `AGENTS.md` and the relevant package instructions.
2. Update the corresponding spec before changing behavior.
3. Preserve module boundaries and single ownership of mutable state.
4. Add tests for behavior changes.
5. Run typecheck, lint, formatting, and architecture checks.
6. Keep comments and technical documentation in English.

## Documentation

- `AGENTS.md` — repository workflow and engineering rules.
- `CONTEXT.md` — product vocabulary and domain context.
- `DESIGN.md` — UI design rules.
- `config/README.md` — configuration reference.
- `docs/specs/` — product and technical specifications.
- `docs/migration/mesacode-branding-and-repository.md` — branding and repository migration boundary.
- `NOTICE.md` — licensing and third-party notices.

## License and notices

See `NOTICE.md`, `LICENSE`, and `THIRD-PARTY-NOTICES.md` for licensing, attribution, and third-party component information.

## Source repository

```text
https://github.com/levanza1358/mesacode.git
```
# Mesa Code

Mesa Code adalah workspace coding berbasis AI untuk desktop Windows, browser, dan terminal. Mesa Code membantu membaca repository, mencari file, menjalankan perintah, mengedit source code, memakai tools, serta mengelola sesi coding dalam satu aplikasi.

## Fitur utama

- Desktop Electron untuk Windows x64.
- Web interface dan terminal interface.
- Agent untuk coding, debugging, refactor, pencarian code, dan operasi repository.
- Dukungan workspace lokal, remote workspace, Git, MCP, plugins, skills, dan provider model.
- Tema UI dan accent palette yang dapat diubah.
- Installer Windows dengan branding Mesa Code.
- Uninstaller dengan pilihan menghapus seluruh data aplikasi.

## Struktur repository

| Direktori | Fungsi |
| --- | --- |
| `packages/desktop` | Electron Main, Host, Renderer, dan packaging desktop |
| `packages/ui` | Komponen React, hooks, store Zustand, dan UI bersama |
| `packages/web` | Web client |
| `packages/server` | HTTP, WebSocket, dan koneksi remote |
| `packages/services` | Business service, persistence, file, session, dan Git |
| `packages/shared` | Type, protocol, validation, dan kontrak bersama |
| `packages/rpc` | RPC framework |
| `packages/client` | Agent client SDK |
| `packages/provider` | Provider capability bersama |
| `apps/mesacode-cli` | Agent CLI, TUI, runtime, dan tools |
| `config` | Konfigurasi provider dan default aplikasi |
| `scripts` | Script build, packaging, asset, dan release |
| `docs` | Spec dan dokumentasi teknis |

Nama internal seperti `@mesacode/*`, `apps/mesacode-cli`, `MESACODE_*`, `.mesacode/`, dan `mesacode-protocol` masih dipertahankan untuk kompatibilitas runtime dan data pengguna lama. Nama yang tampil ke pengguna tetap **Mesa Code**.

## Persiapan development

Kebutuhan:

- Windows untuk desktop packaging.
- Git.
- Node.js `24.14.0`.
- pnpm `10.33.2`.
- Tool version mengikuti `mise.toml`.

Install dependency dan asset dasar:

```powershell
pnpm bootstrap
```

Perintah umum:

```powershell
pnpm install
pnpm typecheck
pnpm lint
pnpm fmt:check
pnpm architecture:check --changed
```

## Menjalankan aplikasi

### Desktop Windows

```powershell
pnpm dev:desktop
```

Mode test:

```powershell
pnpm dev:desktop:test
```

Pisahkan data development dari data utama dengan `MESACODE_DATA_BASE_DIR`:

```powershell
$env:MESACODE_DATA_BASE_DIR="$env:USERPROFILE\.mesacode-dev-home"
pnpm dev:desktop:test
```

Jika belum memilih project, Agent memakai folder kerja internal:

```text
%USERPROFILE%\.mesacode\workspace\default
```

Folder ini bukan project user. Folder ini hanya menyediakan current working directory nyata untuk Agent.

### Web

```powershell
pnpm dev:web
```

Web server berjalan pada `http://localhost:5173`. Backend default berjalan pada port `3030`.

Untuk menentukan workspace backend:

```powershell
$env:MESACODE_SERVER_WORKSPACE="D:\path\ke\project"
pnpm dev:web
```

### Agent CLI

```powershell
pnpm --filter @mesacode/cli dev
pnpm --filter @mesacode/cli... build
```

Perintah CLI distribution memiliki mode TUI dan Web. Identifier command saat ini masih `mesacode` demi kompatibilitas internal.

## Konfigurasi penting

| Variable | Fungsi |
| --- | --- |
| `MESACODE_DATA_BASE_DIR` | Root data aplikasi; default memakai home user dan subdirektori `.mesacode` |
| `MESACODE_SERVER_WORKSPACE` | Workspace backend Web |
| `MESACODE_BUILTIN_PROVIDER_CONFIG_FILE` | File konfigurasi provider lokal |
| `MESACODE_DIST_BASE_URL` | Base URL download CLI distribution |
| `MESACODE_SERVER_AUTH_TOKEN` | Token autentikasi HTTP/WebSocket server |

Konfigurasi default tersedia di `config/default.json`. Untuk konfigurasi lokal, gunakan `.env.local`; jangan commit credential, API key, token, atau data pribadi.

## Build installer Windows

Mesa Code hanya menargetkan Windows x64 untuk packaging desktop.

```powershell
$env:MESACODE_SKIP_REMOTE_ASSETS="1"
pnpm bundle:desktop
```

Output berada di:

```text
packages/desktop/dist/
```

Installer memakai NSIS dan asset logo canonical dari `public/logo/icons/`. Asset branding SVG tersedia di `public/logo/`.

## Uninstall dan data aplikasi

Uninstaller default tidak menghapus data user. Saat opsi **Delete all Mesa Code data, settings, caches, and workspace data** dicentang, uninstaller membersihkan data aplikasi dan workspace internal lama.

Data lama memakai `.mesacode` karena compatibility boundary. Jangan menghapus folder itu secara manual jika masih membutuhkan history, settings, skills, plugins, atau session lama.

## Aturan kontribusi

- Baca `AGENTS.md` sebelum mengubah code.
- Update spec terkait sebelum mengubah behavior.
- Pertahankan ownership state dan batas antar module.
- UI tidak boleh mengakses platform API secara langsung; gunakan service/platform contract yang tersedia.
- Tambahkan test untuk behavior baru.
- Tulis source comment dan dokumentasi teknis dalam bahasa Inggris, kecuali file katalog terjemahan.
- Jalankan `pnpm typecheck`, `pnpm lint`, dan `pnpm architecture:check --changed` setelah perubahan code.
- Jangan commit `node_modules`, build output, log, API key, token, atau file capture lokal.

## Dokumentasi lanjutan

- `AGENTS.md` — aturan kerja repository.
- `CONTEXT.md` — vocabulary dan domain context.
- `DESIGN.md` — aturan desain UI.
- `config/README.md` — konfigurasi aplikasi.
- `docs/specs/` — product dan technical specs.
- `docs/migration/mesacode-branding-and-repository.md` — batas branding dan repository migration.
- `NOTICE.md` — notice, licensing, dan third-party information.

## Repository

Source of truth:

```text
https://github.com/levanza1358/mesacode.git
```
