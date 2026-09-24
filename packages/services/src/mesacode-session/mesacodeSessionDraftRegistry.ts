import type { MesacodeSessionStateSnapshot } from "@mesacode/shared";
import type {
  MesacodeSessionWorkspaceTarget,
  MesacodeTaskTarget,
} from "#src/mesacode-session/mesacodeSession.js";

function getWorkspaceKey(target: MesacodeSessionWorkspaceTarget): string {
  return target.workspaceIdentity?.trim() || target.workspacePath;
}

function getSessionScopedKey(target: MesacodeTaskTarget): string {
  return `${getWorkspaceKey(target)}\0${target.sessionId}`;
}

export function createMesacodeDeferredDraftRegistry() {
  const sessionKeys = new Set<string>();

  return {
    remember(params: MesacodeSessionWorkspaceTarget, snapshot: MesacodeSessionStateSnapshot): void {
      sessionKeys.add(
        getSessionScopedKey({
          workspacePath: snapshot.session.workspace.workspacePath,
          workspaceIdentity:
            snapshot.session.workspace.workspaceIdentity ?? params.workspaceIdentity,
          sessionId: snapshot.session.sessionId,
        }),
      );
    },

    has(target: MesacodeTaskTarget): boolean {
      return sessionKeys.has(getSessionScopedKey(target));
    },

    forget(target: MesacodeTaskTarget): void {
      sessionKeys.delete(getSessionScopedKey(target));
    },
  };
}
