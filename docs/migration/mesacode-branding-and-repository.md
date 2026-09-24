# Mesa Code branding and repository migration

## Purpose

Mesa Code is the user-facing product name. Internal `mesacode` identifiers remain temporarily where they are required for runtime compatibility. This document records the migration boundary and the Git repository source of truth.

## Product naming

Use **Mesa Code** in user-facing text:

- application title and window labels
- installer and uninstaller text
- onboarding, welcome, settings, errors, and notifications
- logos, icons, tray entries, and shortcuts
- README files and public documentation

Do not use `Mesacode` as a visible product label.

Provider names such as `Z.ai` remain unchanged because they identify an external provider.

## Internal compatibility boundary

The following identifiers remain internal until a separately reviewed protocol and data migration is complete:

- `@mesacode/*` package names
- `apps/mesacode-cli`
- `MESACODE_*` environment variables
- `.mesacode/` storage and `.mesacodeignore`
- `mesacode://` deep links
- `mesacode-protocol`
- internal TypeScript symbols containing `Mesacode`

Do not bulk-replace these identifiers. They affect package resolution, persisted data, protocol compatibility, update behavior, and existing user installations.

## Storage behavior

A workspace-free conversation uses the internal fallback directory:

```text
~/.mesacode/workspace/default
```

This directory is an Agent working directory, not a user-selected project. It exists because the Agent process requires a real current working directory. Storage migration to `~/.mesacode` requires a separate idempotent migration design and is not implied by branding changes.

## Logo sources

Canonical Mesa Code logo assets live under `public/logo/`:

- `mesa-code-mark.svg`
- `mesa-code-logo.svg`
- `mesa-code-logo-dark.svg`
- `mesa-code-favicon.svg`
- `icons/` raster and Windows icon assets

Legacy unused assets should be removed only after repository-wide reference search confirms no imports or packaging references remain.

## Windows installer

Windows NSIS packaging uses Mesa Code icons from `public/logo/icons/`. Installer cleanup offers optional deletion of application data. The option is disabled by default and must not delete user data unless explicitly selected.

## Repository source of truth

Canonical Git remote:

```text
https://github.com/levanza1358/mesacode.git
```

All future pushes, issue references, and repository links must target this remote. Local internal package names do not define repository identity.

## Validation

Run from repository root after branding or packaging changes:

```powershell
pnpm typecheck
pnpm lint
pnpm architecture:check --changed
pnpm fmt:check
```

For Windows installer validation:

```powershell
$env:MESACODE_SKIP_REMOTE_ASSETS="1"
pnpm bundle:desktop
```

Verify that the built installer, executable, shortcut, tray icon, and visible UI all show Mesa Code branding.
