# Network Device Mirror

## Status

This document describes the implemented device-mirror foundation and the remaining work. It is
the source of truth for the Network settings surface, browser mirror entrypoint, pairing, and
the direct-IP/Tailscale transport boundary.

### Implemented

- Network settings is available in the desktop settings page.
- The primary device exposes a typed mirror service with trusted-peer management.
- Pairing uses an expiring, single-use code.
- Mirror devices use an Ed25519 identity. The primary stores the public key only.
- Each WebSocket connection receives a challenge. Pairing and reconnect messages are signed.
- Conversation frames reuse the V4 snapshot/delta wire contract.
- Mirror commands reuse the V4 command envelope and `CommandInbox` path.
- Network diagnostics report local IPv4 addresses, the configured port, and Tailscale state.
- Mirror-mode HTTP servers can serve a browser mirror at the root URL without Electron APIs.
- A paired browser stores its identity locally and can reconnect without a new pairing code.

### Not complete yet

- The browser mirror currently presents received V4 frames as diagnostic JSON. A full chat
  projection and composer are not yet implemented.
- The browser mirror does not yet expose the complete command UI, permission UI, or tool controls.
- Changing `PORT` requires restarting the HTTP server. There is no live port editor.
- The desktop application does not automatically start the mirror HTTP listener. Start the HTTP
  server explicitly for browser use.

## Product rules

1. The primary desktop remains the only Agent/runtime/history owner.
2. A mirror is a projection and remote controller, not a second executor.
3. Direct IP and Tailscale provide reachability only. Pairing and revocation provide authorization.
4. Mirror state is not keyed by a workspace path alone. Remote identity uses
   `workspaceIdentity` and `remoteSessionId` where applicable.
5. Desktop continuous delivery and browser replayable delivery remain distinct:
   - desktop: `desktop-continuous`;
   - browser mirror: `web-remote-replayable`.
6. The mirror must reuse V4 snapshot, delta, resync, and command contracts instead of creating a
   second conversation store or command queue.

## User flows

### Desktop pairing flow

1. Open **Settings → Network** on the primary desktop.
2. Confirm the displayed local IPv4 addresses, port, and Tailscale state.
3. Create a pairing offer.
4. Copy the expiring pairing code.
5. Open the browser mirror from another device.
6. Enter the pairing code on the first browser connection.
7. Select or enter a session and start mirroring.

### Browser reconnect flow

The browser stores its Ed25519 identity in browser-local storage. On later connections it sends a
signed `mirrorHello` instead of consuming another pairing code. Clearing browser storage or
revoking the peer requires pairing again.

### Direct-IP URL

```text
http://<primary-ip>:<PORT>/
```

Examples:

```text
http://192.168.1.20:3030/
http://100.x.y.z:3030/
```

The second example uses a Tailscale IPv4 address.

## Runtime configuration

The HTTP server reads these environment variables:

| Variable | Required | Meaning |
| --- | --- | --- |
| `MESACODE_SERVER_HOST` | No | Bind address. Use `0.0.0.0` for LAN access. |
| `PORT` | No | HTTP, WebSocket, and browser-mirror port. Defaults to `3030`. |
| `MESACODE_MIRROR_MODE` | No | Set to `true` to serve the browser mirror at `/`. |
| `MESACODE_WEB_STATIC_ROOT` | No | Override the built web static directory. |
| `MESACODE_MIRROR_ENDPOINT` | Desktop pairing | Explicit WebSocket endpoint shown in pairing offers. |

Example:

```text
MESACODE_SERVER_HOST=0.0.0.0
PORT=3030
MESACODE_MIRROR_MODE=true
```

Build the web application before serving static files:

```text
pnpm --filter @mesacode/web build
```

## Network diagnostics

The Node host owns the diagnostic snapshot. The renderer does not inspect operating-system
interfaces or run commands.

### Local addresses

- Non-internal IPv4 addresses are listed as connection hints.
- Addresses are not authorization decisions.
- No interface metadata is persisted.

### Port

- The advertised port comes from the explicit mirror endpoint when one is configured.
- Otherwise it comes from `PORT`.
- If neither is set, the default is `3030`.
- Changing the port requires restarting the server so the listener can bind the new value.

### Tailscale

The host probes `tailscale status --json` with a short timeout and reports one of:

- `not-installed`: the executable is not available;
- `installed-inactive`: the executable exists, but the backend is not running;
- `active`: the backend reports `Running`;
- `error`: the probe failed for another reason.

The Tailscale IPv4 address is displayed only when the command returns one. Credentials and full CLI
output are never persisted or sent to the browser.

## Ownership and event order

```text
primary Agent/runtime/history
        │
        ├─ V4 snapshot/delta publisher
        │       └─ authenticated mirror WebSocket
        │                       └─ browser projection
        │
browser command
        └─ authenticated mirror boundary
                └─ primary CommandInbox
                        └─ authoritative command ACK/frame
```

The browser may retain only local identity, connection state, the last durable frame base, and
uncommitted drafts. Accepted history, command ordering, and sequence numbers remain owned by the
primary.

## Protocol boundary

```text
mirrorChallenge
  → mirrorPairRequest (new device + public key + signature + code)
  → mirrorPairResponse
  → mirrorHello (trusted device + signature on reconnect)
  → mirrorSubscribe (workspace identity + session + optional resume base)
  → mirrorFrame (V4 snapshot/delta)
```

Security invariants:

- The pairing code expires and is single-use.
- The primary stores only the mirror public key.
- The private key never crosses the WebSocket and is not persisted by the primary.
- Reconnect matches `deviceId` and the exact stored public key before signature verification.
- A challenge is scoped to one socket and cannot be reused across connections.
- Revoked peers cannot reconnect.

## Acceptance scenarios

1. Network appears in the desktop Basics settings group.
2. Desktop Network displays local IPv4 addresses, the mirror port, and Tailscale state.
3. A server started with `MESACODE_SERVER_HOST=0.0.0.0` is reachable from another LAN device.
4. `http://<primary-ip>:<PORT>/` opens the browser mirror without Electron APIs.
5. The first browser connection requires a valid pairing code.
6. A paired browser reconnects without a new code.
7. A revoked browser cannot reconnect.
8. The browser receives authoritative snapshot/delta frames.
9. A mirror command reaches the primary command admission path and returns an authoritative ACK.
10. A stale or invalid resume base triggers the existing V4 resync behavior.

## Current implementation map

| Concern | Implementation |
| --- | --- |
| Shared protocol | `packages/shared/src/mesacode-protocol-v4/device-mirror.ts` |
| Trust persistence | `packages/services/src/remote-sync/deviceMirrorTrustStore.ts` |
| Mirror service contract | `packages/services/src/remote-sync/deviceMirrorService.ts` |
| Network diagnostics | `packages/services/src/remote-sync/deviceMirrorNetworkDiagnostics.ts` |
| Browser client | `packages/client/src/deviceMirror.ts` |
| Server WebSocket | `packages/server/src/http.ts` (`/ws/mirror`) |
| Browser entrypoint | `packages/web/src/mirror/BrowserMirrorPage.tsx` |
| Browser routing | `packages/web/src/main.tsx` |
| Desktop settings | `packages/ui/src/settings/NetworkSettingsSection.tsx` |
| Protocol tests | `packages/services/test/deviceMirrorProtocol.test.ts` |

## Latest implementation and verification

The latest work added the browser mirror entrypoint, server mirror mode, port discovery, and
session discovery. The latest validation passed:

- `node scripts/check-workspace-freshness.mjs`
- `pnpm typecheck`
- `pnpm architecture:check --changed`
- `pnpm lint` with existing repository warnings and no new errors in the mirror changes

The browser mirror still needs an interaction test covering first pairing, reconnect, revoke, and
frame rendering before it can be considered feature-complete.
