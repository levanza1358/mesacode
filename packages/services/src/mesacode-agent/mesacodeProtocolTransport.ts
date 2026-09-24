import type { Event, IDisposable } from "@mesacode/rpc";
import type { MesacodeProtocolMessage } from "@mesacode/shared";

export type MesacodeProtocolTransportKind = "stdio" | "websocket" | "memory";

export interface MesacodeProtocolTransportClosedEvent {
  code?: number | null;
  signal?: NodeJS.Signals | null;
  reason?: string;
}

export interface MesacodeProtocolTransport extends IDisposable {
  readonly kind: MesacodeProtocolTransportKind;
  readonly onMessage: Event<MesacodeProtocolMessage>;
  readonly onClose: Event<MesacodeProtocolTransportClosedEvent>;
  send(message: MesacodeProtocolMessage): Promise<void>;
  disposeAndWait?(): Promise<void>;
}
