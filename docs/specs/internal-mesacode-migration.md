# Internal Mesa Code migration

## Status

Strict migration approved: Mesa Code is the only supported internal product identity. This is a breaking migration; legacy Mesacode identifiers are not compatibility targets.

## Product rule

Migrate internal product identifiers from Mesacode to Mesa Code without losing existing sessions, workspaces, plugins, protocol compatibility, or user data.

All product onboarding is removed. A fresh install must enter the normal application surface directly, and the product must not expose occupation, interface-mode, memory, suggestion, migration, or onboarding-record flows. OS permission setup flows, such as CUA accessibility permission, are not product onboarding and remain available where required.

The application theme contract is limited to `light`, `dark`, and `black`. `dark` is the default for new and invalid preferences. Theme-specific accent palettes and accent selection are not supported; the semantic `accent` token remains an internal UI token for existing component states.

## Migration boundary

In scope:

- New canonical package scope for future Mesa Code packages.
- Canonical Mesa Code environment variables only.
- Canonical Mesa Code storage root only.
- New protocol and artifact names with compatibility readers.
- User-facing CLI, scripts, logs, docs, and generated distribution names.

Out of scope for first slice:

- Bulk-renaming all existing packages and directories in one change.
- Preserving legacy runtime identifiers or storage roots.
- Silent conversion of legacy data.

## Owners and interfaces

- `packages/shared`: canonical identity constants and compatibility parsing.
- Desktop main/runtime: storage discovery and migration prompt/operation.
- CLI/runtime: protocol and environment compatibility.
- Packaging scripts: artifact and distribution naming.
- UI: user-facing labels only; no direct storage migration logic.
- UI startup: normal application startup owns the first-render path; no product onboarding gate may wrap `RootWorkspaceContent` or the settings surface.
- UI appearance: `useTheme` owns the three-value theme preference and applies `dark` by default; no theme catalog or accent-palette selector is exposed.

## Required compatibility rules

1. New installs and runtime paths use Mesa Code canonical names.
2. Legacy Mesacode data is rejected unless explicitly converted by a one-time migration tool.
3. Canonical storage is never silently merged with a legacy storage root.
4. Legacy environment variables are rejected.
5. Protocol readers and writers use Mesa Code identity only.
6. Package scope migration is coordinated across the workspace in dependency order.
7. Migration tools are explicit, idempotent, and never silently delete source data.

## Phase plan

1. Inventory and centralize identity constants. (complete)
2. Remove legacy aliases and compatibility readers. (in progress)
3. Migrate storage with explicit copy/verification.
4. Migrate protocol/artifact names.
5. Migrate package scope and directories in dependency-order batches.
6. Remove legacy paths only after telemetry, tests, and rollback window prove safe.

## Acceptance scenarios

- Fresh Mesa Code install uses canonical identity and storage.
- Existing Mesacode data is clearly reported as requiring explicit migration.
- Only canonical Mesa Code environment variables are accepted.
- Legacy protocol peers are rejected with an actionable error.
- Restarting migration does not duplicate or corrupt data.
- A fresh install opens the normal application without rendering any product onboarding screen or migration wizard.
- Invalid, missing, and legacy theme preferences resolve to `dark`; only `light`, `dark`, and `black` can be selected.
- Installer rollback leaves original Mesacode data intact.
- `pnpm typecheck`, `pnpm lint`, and `pnpm architecture:check --changed` pass after each phase.
